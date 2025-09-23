import "./styles/App.css";
import { useState, useEffect } from "react";
import { Button, Modal } from "antd";
import { SideBar } from "../Widgets/SideBar";
import { Tasks } from "../pages/TaskPage";
import { Welcome } from "../Widgets/Welcome";
import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import Authorization from "../pages/authorization";
import useAuth from "../hooks/useAuth";
import UserProfileMenu from "../Widgets/UserProfile";
import { TaskGraphIntegration } from "../pages/GraphPage/ui/TaskGraphIntegration";
import { AIAnalysisModal } from "../Widgets/AIAnalysis/AIAnalysisModal";
import CalendarButton from "../Widgets/Calendar/CalendarButton";
import aiIcon from "./ai.png";
import axios from "axios";

const priorityMap = {
  Low: 0,
  Medium: 1,
  High: 2,
  Urgent: 3,
};

export default function App() {
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

  useEffect(() => {
    if (!user || loading) return;

    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:5053/api/tasks", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        const mappedTasks = data.map((backendTask) => ({
          id: backendTask.id,
          title: backendTask.title,
          description: backendTask.description || "",
          priority:
            backendTask.priority === 0
              ? "Low"
              : backendTask.priority === 2
                ? "High"
                : backendTask.priority === 3
                  ? "Urgent"
                  : "Medium",
          deadline: backendTask.deadline
            ? backendTask.deadline.split("T")[0]
            : null,
          deadlineTime:
            backendTask.deadline && backendTask.deadline.includes("T")
              ? backendTask.deadline.split("T")[1].slice(0, 5)
              : null,
          categoryId: "inbox", // map to inbox for now
          completed: backendTask.isCompleted || false,
          parentIds: [],
          graphNode: { id: backendTask.title, x: 100, y: 100 },
          positionOrder: backendTask.positionOrder || 0,
        }));

        const sortedTasks = mappedTasks.sort(
          (a, b) => a.positionOrder - b.positionOrder
        );
        setTasks(sortedTasks);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        setTasks([]);
        Modal.error({
          title: "Error",
          content: "Failed to fetch tasks. Please try again.",
        });
      }
    };

    fetchTasks();
  }, [user, loading]);

  // define addTask
  const addTask = async (newTask) => {
    const backendTask = {
      userId: "283118eb-f3c5-4447-afa2-f5a93762a5e3",
      title: newTask.title,
      description: newTask.description || null,
      color: "#FFFFFF",
      statusId: null,
      priority: priorityMap[newTask.priority] || 1,
      categoryId: null,
      deadline: newTask.deadline
        ? `${newTask.deadline}T${newTask.deadlineTime || "00:00"}:00`
        : null,
      positionOrder: tasks.length + 1,
    };

    try {
      console.log("Sending POST payload:", backendTask); // Debug payload
      await axios.post("http://localhost:5053/api/tasks", backendTask, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      // Fetch updated tasks
      const response = await fetch("http://localhost:5053/api/tasks", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      const sorted = data
        .map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description || "",
          priority:
            t.priority === 0
              ? "Low"
              : t.priority === 2
                ? "High"
                : t.priority === 3
                  ? "Urgent"
                  : "Medium",
          deadline: t.deadline ? t.deadline.split("T")[0] : null,
          deadlineTime:
            t.deadline && t.deadline.includes("T")
              ? t.deadline.split("T")[1].slice(0, 5)
              : null,
          categoryId: "inbox",
          completed: t.isCompleted || false,
          parentIds: [],
          graphNode: { id: t.title, x: 100, y: 100 },
          positionOrder: t.positionOrder || 0,
        }))
        .sort((a, b) => a.positionOrder - b.positionOrder);

      setTasks(sorted);
    } catch (error) {
      console.error(
        "Failed to add task:",
        error.response?.data || error.message
      );
      Modal.error({
        title: "Error",
        content: "Failed to add task. Please try again.",
      });
    }
  };

  // define updateTask
  const updateTask = async (updatedTask) => {
    const backendTask = {
      taskId: updatedTask.id,
      userId: "283118eb-f3c5-4447-afa2-f5a93762a5e3",
      newTitle: updatedTask.title,
      newDescription: updatedTask.description || "",
      newStatusId: null,
      newCategoryId: null,
      newDeadline: updatedTask.deadline
        ? `${updatedTask.deadline}T${updatedTask.deadlineTime || "00:00"}:00`
        : null,
      isCompleted: updatedTask.completed || null,
      isFailed: null,
    };

    try {
      console.log("Sending PUT payload:", backendTask); // Debug payload
      await axios.put(
        `http://localhost:5053/api/tasks/${updatedTask.id}`,
        backendTask,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // Fetch updated tasks
      const response = await fetch("http://localhost:5053/api/tasks", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      const sorted = data
        .map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description || "",
          priority:
            t.priority === 0
              ? "Low"
              : t.priority === 2
                ? "High"
                : t.priority === 3
                  ? "Urgent"
                  : "Medium",
          deadline: t.deadline ? t.deadline.split("T")[0] : null,
          deadlineTime:
            t.deadline && t.deadline.includes("T")
              ? t.deadline.split("T")[1].slice(0, 5)
              : null,
          categoryId: "inbox",
          completed: t.isCompleted || false,
          parentIds: [],
          graphNode: { id: t.title, x: 100, y: 100 },
          positionOrder: t.positionOrder || 0,
        }))
        .sort((a, b) => a.positionOrder - b.positionOrder);

      setTasks(sorted);
    } catch (error) {
      console.error(
        "Failed to update task:",
        error.response?.data || error.message
      );
      Modal.error({
        title: "Update Failed",
        content: `There was an error updating the task: ${error.response?.data || error.message
          }`,
      });
    }
  };

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
          updateTask({ ...activeTask, deadline: todayStr });
        }
        setHoveredCategory(null);
        return;
      }

      const activeTask = tasks.find((t) => t.id === active.id);
      if (activeTask) {
        updateTask({ ...activeTask, categoryId });
      }
      setHoveredCategory(null);
      return;
    }

    if (active.id !== over.id) {
      setTasks((prev) => {
        const activeTask = (prev || []).find((t) => t.id === active.id);
        if (!activeTask) return prev || [];

        const categoryTasks = (prev || []).filter(
          (t) => t.categoryId === activeTask.categoryId
        );
        const oldIndex = categoryTasks.findIndex((t) => t.id === active.id);
        const newIndex = categoryTasks.findIndex((t) => t.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return prev || [];

        const reordered = arrayMove(categoryTasks, oldIndex, newIndex);

        let result = [];
        let i = 0;
        for (const t of prev || []) {
          if (t.categoryId === activeTask.categoryId) {
            result.push({ ...reordered[i], positionOrder: i });
            i++;
          } else {
            result.push(t);
          }
        }
        return result;
      });
      setHoveredCategory(null);
    }
  }

  if (loading) return <div className="App">Loading...</div>;
  if (!user) return <Authorization />;

  const todayStr = new Date().toISOString().split("T")[0];
  const filteredTasks = (tasks || []).filter((t) => {
    if (selectedCategory === "today") {
      return t.deadline === todayStr;
    }
    if (selectedCategory === "graphs") {
      return true;
    }
    return true; // show all for now
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
            <CalendarButton />
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
          onDragStart={({ active }) => {
            setActiveTaskId(active.id);
          }}
          onDragOver={({ over }) => {
            if (over && over.id.startsWith("category:")) {
              setHoveredCategory(over.id.replace("category:", ""));
            } else {
              setHoveredCategory(null);
            }
          }}
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
                      border: "1px solid #60a5fa",
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
          onSend={(input) => {
            console.log("AI analysis input:", input);
          }}
        />
      </div>
    </div>
  );
}