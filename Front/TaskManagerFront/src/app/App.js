import "./styles/App.css";
import { useState, useEffect } from "react";
import { Button, Modal } from "antd";
import { SideBar } from "../Widgets/SideBar";
import { Tasks } from "../pages/TaskPage";
import { Welcome } from "../Widgets/Welcome";
import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import Authorization from "../pages/authorization";
import useAuth from "../hooks/useAuth"; // kept, but you can remove if not needed
import UserProfileMenu from "../Widgets/UserProfile";
import { TaskGraphIntegration } from "../pages/GraphPage/ui/TaskGraphIntegration";
import { AIAnalysisModal } from "../Widgets/AIAnalysis/AIAnalysisModal";
import aiIcon from "./ai.png";
import axios from "axios";

export default function App() {
  // 🔹 if you don’t use auth at all, you can remove next line and the check below
  const { user, loading } = useAuth();

  const [categories, setCategories] = useState([
    { id: "inbox", name: "Inbox", parentId: null },
    { id: "work", name: "Work", parentId: null },
    { id: "personal", name: "Personal", parentId: null },
    { id: "Project A", name: "Project A", parentId: "work" },
    { id: "Project B", name: "Project B", parentId: "work" },
    { id: "fun", name: "Fun", parentId: "personal" },
  ]);

  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [isAIAnalysisOpen, setIsAIAnalysisOpen] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("inbox");
  const [searchText, setSearchText] = useState("");

  // Fixed values for backend
  const fixedUserId = "283118eb-f3c5-4447-afa2-f5a93762a5e3";
  const fixedCategoryId = "3f34e2d1-aaaa-bbbb-cccc-1234567890ab";

  // --- Load from backend once
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5053/api/tasks");
        console.log("Fetched tasks from backend:", response.data);

        const mapped = response.data.map((t) => ({
          id: t.id, // keep backend id
          title: t.title,
          description: t.description || "",

          priority:
            t.priority === 0 || t.priority === null
              ? "Low"
              : t.priority >= 2
                ? "High"
                : "Medium",
          deadline: t.deadline ? t.deadline.split("T")[0] : null,
          deadlineTime:
            t.deadline && t.deadline.includes("T")
              ? t.deadline.split("T")[1].slice(0, 5)
              : null,
          categoryId: "inbox", // frontend category only
          completed: t.isCompleted || false,
          parentIds: [],
          graphNode: { id: t.title, x: 100, y: 100 },
          positionOrder: t.positionOrder || 0,
        }));
        setTasks(mapped);
      } catch (err) {
        console.error("Error loading tasks:", err);
      }
    };

    fetchTasks();
  }, []);

  // --- Add task locally first, then backend
  const addTask = async (newTask) => {
    const tempId = Date.now().toString();
    const tempTask = {
      id: tempId,
      title: newTask.title,
      description: newTask.description || "",
      priority: newTask.priority || "Medium",
      deadline: newTask.deadline || null,
      deadlineTime: newTask.deadlineTime || null,
      categoryId: selectedCategory,
      completed: false,
      parentIds: [],
      graphNode: { id: newTask.title, x: 200, y: 200 },
    };

    setTasks((prev) => [...prev, tempTask]);

    const backendTask = {
      userId: fixedUserId,
      title: newTask.title,
      description: newTask.description || null,
      color: "#FFFFFF",
      statusId: null,
      // 🔹 priority mapping (string → number)
      priority:
        newTask.priority === "Low"
          ? 0
          : newTask.priority === "High"
            ? 2
            : 1,
      categoryId: fixedCategoryId,
      deadline: newTask.deadline
        ? `${newTask.deadline}T${newTask.deadlineTime || "00:00"}:00`
        : null,
      positionOrder: tasks.length + 1,
    };

    try {
      console.log("Sending new task to backend:", backendTask);
      const response = await axios.post(
        "http://localhost:5053/api/tasks",
        backendTask,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Backend created task:", response.data);

      const newId = response.data?.id;
      if (newId) {
        setTasks((prev) =>
          prev.map((t) => (t.id === tempId ? { ...t, id: newId } : t))
        );
      }
    } catch (err) {
      console.error("Backend save failed:", err.response?.data || err.message);
      Modal.error({
        title: "Save Failed",
        content: `Could not save to DB: ${err.response?.data || err.message}`,
      });
    }
  };


  // --- Update local then backend
  const updateTask = async (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? { ...t, ...updatedTask } : t))
    );

    const backendTask = {
      taskId: updatedTask.id,
      userId: fixedUserId,
      newTitle: updatedTask.title,
      newDescription: updatedTask.description || null,
      newStatusId: null,
      newCategoryId: fixedCategoryId,
      newDeadline: updatedTask.deadline
        ? `${updatedTask.deadline}T${updatedTask.deadlineTime || "00:00"}:00`
        : null,
      // 🔹 priority mapping (string → number)
      Newpriority:
        updatedTask.priority === "Low"
          ? 0
          : updatedTask.priority === "High"
            ? 2
            : 1,
      isCompleted: updatedTask.completed || null,
      isFailed: null,
    };

    try {
      console.log("Sending update to backend:", backendTask);
      const response = await axios.put(
        `http://localhost:5053/api/tasks/${updatedTask.id}`,
        backendTask,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Backend updated task:", response.data);
    } catch (err) {
      console.error("Backend update failed:", err.response?.data || err.message);
      Modal.error({
        title: "Update Failed",
        content: `Could not sync with DB: ${err.response?.data || err.message}`,
      });
    }
  };



  // --- Drag handler
  const droppableCategoryIds = new Set(categories.map((c) => c.id));
  droppableCategoryIds.add("today");

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    if (over.id.startsWith("category:")) {
      const categoryId = over.id.replace("category:", "");

      if (categoryId === "today") {
        const todayStr = new Date().toISOString().split("T")[0];
        const activeTask = tasks.find((t) => t.id === active.id);
        if (activeTask) {
          const updated = { ...activeTask, deadline: todayStr };
          setTasks((prev) =>
            prev.map((t) => (t.id === active.id ? updated : t))
          );
          updateTask(updated);
        }
        setHoveredCategory(null);
        return;
      }

      const activeTask = tasks.find((t) => t.id === active.id);
      if (activeTask) {
        const updated = { ...activeTask, categoryId };
        setTasks((prev) =>
          prev.map((t) => (t.id === active.id ? updated : t))
        );
        updateTask(updated);
      }
      setHoveredCategory(null);
      return;
    }

    if (active.id !== over.id) {
      setTasks((prev) => {
        const activeTask = prev.find((t) => t.id === active.id);
        if (!activeTask) return prev;

        const categoryTasks = prev.filter(
          (t) => t.categoryId === activeTask.categoryId
        );
        const oldIndex = categoryTasks.findIndex((t) => t.id === active.id);
        const newIndex = categoryTasks.findIndex((t) => t.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return prev;

        const reordered = arrayMove(categoryTasks, oldIndex, newIndex);
        let result = [];
        let i = 0;
        for (const t of prev) {
          if (t.categoryId === activeTask.categoryId) {
            result.push({ ...reordered[i], positionOrder: i });
            i++;
          } else {
            result.push(t);
          }
        }
        return result;
      });
    }
    setHoveredCategory(null);
  }

  if (loading) return <div className="App">Loading...</div>;
  if (!user) return <Authorization />;

  const todayStr = new Date().toISOString().split("T")[0];
  const filteredTasks = tasks.filter((t) => {
    if (selectedCategory === "today") return t.deadline === todayStr;
    if (selectedCategory !== "graphs" && t.categoryId !== selectedCategory)
      return false;
    return true;
  });

  return (
    <div className="App">
      <div className="AppBody">
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 30,
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img
              src={aiIcon}
              alt="AI Icon"
              style={{ width: "24px", height: "24px" }}
            />
            <Button type="primary" onClick={() => setIsAIAnalysisOpen(true)}>
              AI Analysis
            </Button>
          </div>
          <UserProfileMenu user={user} />
        </div>

        <DndContext
          collisionDetection={closestCenter}
          onDragStart={({ active }) => setActiveTaskId(active.id)}
          onDragOver={({ over }) =>
            setHoveredCategory(
              over?.id.startsWith("category:") ? over.id.replace("category:", "") : null
            )
          }
          onDragEnd={(event) => {
            setActiveTaskId(null);
            handleDragEnd(event);
          }}
        >
          <SideBar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            setCategories={setCategories}
            droppableCategoryIds={droppableCategoryIds}
            hoveredCategory={hoveredCategory}
            setTasks={setTasks}
            tasks={tasks}
            searchText={searchText}
            setSearchText={setSearchText}
          />
          <div className="MainPanel">
            {selectedCategory !== "graphs" ? (
              <div className="MainScroll" style={{ paddingTop: "11vh" }}>
                <Welcome
                  user={user}
                  selectedCategory={selectedCategory}
                  categories={categories}
                />
                <Tasks
                  filteredTasks={filteredTasks}
                  allTasks={tasks}
                  setTasks={setTasks}
                  categories={categories}
                  selectedCategory={selectedCategory}
                  searchText={searchText}
                  setSelectedCategory={setSelectedCategory}
                  addTask={addTask}
                  updateTask={updateTask}
                />
              </div>
            ) : (
              <TaskGraphIntegration
                tasks={tasks}
                setTasks={setTasks}
                categories={categories}
              />
            )}
          </div>
          <DragOverlay>
            {activeTaskId &&
              (() => {
                const task = tasks.find((t) => t.id === activeTaskId);
                if (!task) return null;
                return (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "6px 12px",
                      background: "#fff",
                      border: "1px solid #2563eb",
                      borderRadius: 8,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                      fontWeight: 500,
                      maxWidth: "250px",
                      color: "#2563eb",
                      gap: 8,
                      pointerEvents: "none",
                    }}
                  >
                    <span role="img" aria-label="task" style={{ fontSize: 18 }}>
                      📝
                    </span>
                    {task.title}
                  </div>
                );
              })()}
          </DragOverlay>
        </DndContext>

        <AIAnalysisModal
          visible={isAIAnalysisOpen}
          onClose={() => setIsAIAnalysisOpen(false)}
          onSend={(input) => console.log("AI analysis input:", input)}
        />
      </div>
    </div>
  );
}
