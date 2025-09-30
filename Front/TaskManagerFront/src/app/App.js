import "./styles/App.css";
import { useState, useEffect } from "react";
import { Button } from "antd";
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
import aiIcon from "./ai.png";
import axios from "axios";
import CalendarButton from "../Widgets/Calendar/CalendarButton";
import Calendar from "../Widgets/Calendar/ui/Calendar";


// Disable all runtime error logs
window.onerror = function () {
  return true; // prevents default logging
};
window.onunhandledrejection = function () {
  return true;
};



export default function App() {
  const { user, loading } = useAuth();

  // --- Categories
  const [categories, setCategories] = useState([
    { id: "inbox", name: "Inbox", parentId: null }, // fixed inbox
  ]);

  // --- Other UI state
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [isAIAnalysisOpen, setIsAIAnalysisOpen] = useState(false);

  // --- Tasks
  const [tasks, setTasks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("inbox");
  const [searchText, setSearchText] = useState("");

  // Fixed values
  const fixedUserId = "283118eb-f3c5-4447-afa2-f5a93762a5e3";
  const fixedInboxId = "00000000-0000-0000-0000-000000000001";

  function normalizeCategories(raw) {
    const isFlat =
      Array.isArray(raw) &&
      raw.every((c) => !Array.isArray(c.categories) || c.categories.length === 0);

    if (isFlat) {
      return raw.map((c) => ({
        id: c.id,
        name: c.title,
        parentId: c.parentCategoryId || null,
        order: c.order || 0,
      }));
    }

    const out = [];
    const walk = (list, parentId = null) => {
      for (const c of list) {
        const pid = (c.parentCategoryId ?? parentId) || null;
        out.push({
          id: c.id,
          name: c.title,
          parentId: pid,
          order: c.order || 0,
        });
        if (Array.isArray(c.categories) && c.categories.length) {
          walk(c.categories, c.id);
        }
      }
    };
    walk(raw, null);
    return out;
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("http://localhost:5053/api/categories");
        const normalized = normalizeCategories(data);

        setCategories((prev) => {
          const inbox =
            prev.find((c) => c.id === "inbox") ||
            { id: "inbox", name: "Inbox", parentId: null };

          const tempCats = prev.filter((c) => String(c.id).startsWith("temp-"));
          const byId = new Map();
          [...normalized, ...tempCats].forEach((c) => byId.set(c.id, c));

          return [inbox, ...byId.values()];
        });
      } catch (err) {
        console.error("Error loading categories:", err.response?.data || err.message);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length <= 1) return;

    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5053/api/tasks");
        console.log("Fetched tasks from backend:", response.data);

        const validCategoryIds = categories.map((c) => c.id);

        const mapped = response.data.map((t) => {
          let categoryId =
            t.categoryId === fixedInboxId
              ? "inbox"
              : validCategoryIds.includes(t.categoryId)
                ? t.categoryId
                : "inbox";

          if (t.isCompleted) {
            categoryId = "done";
          }

          return {
            id: t.id,
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
            categoryId,
            completed: t.isCompleted || false,
            // ARRAYS: Copy dependsOnTasksIds from backend into local childrenIds array
            childrenIds: t.dependsOnTasksIds || [],
            // Keep parentIds for migration purposes (if needed)
            parentIds: t.parentIds || [],
            graphNode: { id: t.title, x: t.graphNode?.x || 100, y: t.graphNode?.y || 100 },
            positionOrder: t.positionOrder ?? 0,
            price: Number(t.price) || 0,
            budgetItems: Array.isArray(t.budgetItems) ? t.budgetItems : [],
          };
        });

        // Sort by positionOrder to maintain backend order
        const sorted = mapped.sort((a, b) => a.positionOrder - b.positionOrder);
        setTasks(sorted);
      } catch (err) {
        console.error("Error loading tasks:", err.response?.data || err.message);
      }
    };

    fetchTasks();
  }, [categories]);

  // ARRAYS: Migration from parentIds to childrenIds (run once after tasks are loaded)
  useEffect(() => {
    if (tasks.length === 0) return;

    const needsMigration = tasks.some(
      (t) =>
        Array.isArray(t.parentIds) && t.parentIds.length > 0 &&
        (!Array.isArray(t.childrenIds) || t.childrenIds.length === 0)
    );
    if (!needsMigration) return;

    console.log("Migrating parentIds to childrenIds...");
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) => ({ ...task }));

      prevTasks.forEach((task) => {
        if (Array.isArray(task.parentIds) && task.parentIds.length > 0) {
          task.parentIds.forEach((parentId) => {
            const parentTask = updatedTasks.find(
              (t) => String(t.id) === String(parentId)
            );
            if (!parentTask) return;
            if (!Array.isArray(parentTask.childrenIds)) {
              parentTask.childrenIds = [];
            }
            if (!parentTask.childrenIds.includes(String(task.id))) {
              parentTask.childrenIds.push(String(task.id));
            }
          });
        }
      });

      console.log("Migration completed");
    });
  }, [tasks]);

  // --- Add task (insert at top, shift others)
  const addTask = async (newTask) => {
    const tempId = `temp-${Date.now()}`;
    const tempTask = {
      id: tempId,
      title: newTask.title,
      description: newTask.description || "",
      priority: newTask.priority || "Medium",
      deadline: newTask.deadline || null,
      deadlineTime: newTask.deadlineTime || null,
      categoryId: selectedCategory,
      completed: false,
      // ARRAYS: Initialize childrenIds array for new tasks
      childrenIds: newTask.childrenIds || [],
      parentIds: [],
      graphNode: { id: newTask.title, x: 200, y: 200 },
      positionOrder: 0,
      price: newTask.price || 0,
      budgetItems: newTask.budgetItems || [],
    };

    // Shift existing tasks' positionOrder
    setTasks((prev) => [
      tempTask,
      ...prev.map((t) => ({ ...t, positionOrder: t.positionOrder + 1 })),
    ]);

    const backendTask = {
      userId: fixedUserId,
      title: newTask.title,
      description: newTask.description || null,
      color: "#FFFFFF",
      statusId: null,
      priority:
        newTask.priority === "Low"
          ? 0
          : newTask.priority === "High"
            ? 2
            : 1,
      categoryId:
        selectedCategory === "inbox"
          ? fixedInboxId
          : selectedCategory !== "done"
            ? selectedCategory
            : null,
      deadline: newTask.deadline
        ? `${newTask.deadline}T${newTask.deadlineTime || "00:00"}:00`
        : null,
      positionOrder: 0,
      price: newTask.price || 0,
      budgetItems: newTask.budgetItems || [],
      // ARRAYS: Send childrenIds to backend as dependsOnTasksIds
      dependsOnTasksIds: newTask.childrenIds || [],
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
          prev.map((t) =>
            t.id === tempId
              ? { ...t, id: newId, positionOrder: response.data.positionOrder ?? 0 }
              : t
          )
        );
      }
    } catch (err) {
      console.error("Backend save failed:", err.response?.data || err.message);
      // Roll back optimistic update
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
    }
  };

  // --- Update task
  const updateTask = async (updatedTask) => {
    // Optimistic update: update local state immediately
    setTasks((prev) =>
      prev.map((t) =>
        t.id === updatedTask.id ? { ...t, ...updatedTask } : t
      )
    );

    let backendCategoryId = null;
    if (
      updatedTask.categoryId &&
      !["inbox", "done", "today", "graphs", "calendar"].includes(updatedTask.categoryId)
    ) {
      backendCategoryId = updatedTask.categoryId;
    }
    if (updatedTask.categoryId === "inbox") {
      backendCategoryId = fixedInboxId;
    }

    const backendTask = {
      taskId: updatedTask.id,
      title: updatedTask.title || null,
      description: updatedTask.description || null,
      statusId: null,
      categoryId: backendCategoryId,
      deadline: updatedTask.deadline && updatedTask.deadlineTime
        ? `${updatedTask.deadline}T${updatedTask.deadlineTime}:00`
        : updatedTask.deadline
          ? `${updatedTask.deadline}T00:00:00`
          : null,
      priority:
        updatedTask.priority === "Low"
          ? 0
          : updatedTask.priority === "High"
            ? 2
            : 1,
      markCompleted: Boolean(updatedTask.completed),
      isFailed: null,
      positionOrder: updatedTask.positionOrder ?? 0,
      price: updatedTask.price || 0,
      budgetItems:
        updatedTask.budgetItems?.map((item) => ({
          id: item.id,
          name: item.name,
          sum: item.sum,
        })) || [],
      // ARRAYS: Send childrenIds to backend as dependsOnTasksIds
      dependsOnTasksIds: updatedTask.childrenIds || [],
    };

    try {
      console.log("Sending update (PATCH) to backend:", backendTask);
      await axios.patch(
        `http://localhost:5053/api/tasks/${updatedTask.id}`,
        backendTask,
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      console.error("Backend update failed:", err.response?.data || err.message);
      // Optionally roll back optimistic update
      setTasks((prev) =>
        prev.map((t) =>
          t.id === updatedTask.id ? { ...t, ...updatedTask } : t
        )
      );
    }
  };

  // --- Update task order only
  const updateTaskOrder = async (id, positionOrder) => {
    console.log(`updateTaskOrder called for task ${id} -> order ${positionOrder}`);
    try {
      const response = await axios.patch(
        `http://localhost:5053/api/tasks/${id}`,
        {
          taskId: id,
          positionOrder,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("✅ Order updated on backend:", response.data);
    } catch (err) {
      console.error(
        `⚠ Order update failed for ${id}:`,
        err.response?.data || err.message
      );
    }
  };

  // --- Categories add/edit/delete
  const addCategory = async (title, parentId = null) => {
    const tempId = "temp-" + Date.now();
    const optimistic = {
      id: tempId,
      name: title,
      parentId: parentId || null,
      order: 0,
    };
    setCategories((prev) => [...prev, optimistic]);

    try {
      const payload = {
        userId: fixedUserId,
        title,
        description: null,
        parentCategoryId: parentId || null,
        color: "#FFFFFF",
      };
      const { data } = await axios.post(
        "http://localhost:5053/api/categories/user",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      setCategories((prev) =>
        prev.map((c) => (c.id === tempId ? { ...c, id: data.id } : c))
      );
    } catch (err) {
      console.error("Add category failed:", err.response?.data || err.message);
      setCategories((prev) => prev.filter((c) => c.id !== tempId));
    }
  };

  const editCategory = async (id, newTitle, newParentId = null) => {
    const prevCats = categories;
    const old = categories.find((c) => c.id === id);
    if (!old) return;

    const normalizedParentId = newParentId === "" ? null : newParentId;

    const titleChanged = (old.name || "") !== (newTitle || "");
    const parentChanged =
      (old.parentId || null) !== (normalizedParentId || null);

    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, name: newTitle, parentId: normalizedParentId } : c
      )
    );

    try {
      if (titleChanged) {
        await axios.put(
          `http://localhost:5053/api/categories/${id}/rename`,
          { categoryId: id, newTitle },
          { headers: { "Content-Type": "application/json" } }
        );
      }
      if (parentChanged) {
        await axios.patch(
          `http://localhost:5053/api/categories/${id}`,
          { parentCategoryId: normalizedParentId },
          { headers: { "Content-Type": "application/json" } }
        );
      }
    } catch (err) {
      console.error("Edit category failed:", err.response?.data || err.message);
      setCategories(prevCats);
    }
  };

  const deleteCategory = async (id) => {
    const prevCats = categories;
    const prevTasks = tasks;
    const prevSelected = selectedCategory;

    setCategories((prev) =>
      prev.filter((c) => c.id !== id && c.parentId !== id)
    );
    setTasks((prev) =>
      prev.map((t) =>
        t.categoryId === id ? { ...t, categoryId: "inbox" } : t
      )
    );
    if (selectedCategory === id) setSelectedCategory("inbox");

    try {
      await axios.delete(`http://localhost:5053/api/categories/${id}`);
    } catch (err) {
      console.error("Delete category failed:", err.response?.data || err.message);
      setCategories(prevCats);
      setTasks(prevTasks);
      setSelectedCategory(prevSelected);
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
          const updated = { ...activeTask, deadline: todayStr, positionOrder: 0 };
          setTasks((prev) =>
            prev.map((t) => (t.id === active.id ? updated : { ...t, positionOrder: t.positionOrder + 1 }))
          );
          updateTask(updated);
        }
        setHoveredCategory(null);
        return;
      }

      const activeTask = tasks.find((t) => t.id === active.id);
      if (activeTask) {
        const updated = { ...activeTask, categoryId, positionOrder: 0 };
        setTasks((prev) =>
          prev.map((t) => (t.id === active.id ? updated : { ...t, positionOrder: t.positionOrder + 1 }))
        );
        updateTask(updated);
      }
      setHoveredCategory(null);
      return;
    }

    // Handle reordering within same category
    if (active.id !== over.id) {
      setTasks((prev) => {
        const activeTask = prev.find((t) => t.id === active.id);
        if (!activeTask) return prev;

        const categoryTasks = prev.filter(
          (t) => t.categoryId === activeTask.categoryId
        ).sort((a, b) => a.positionOrder - b.positionOrder);
        const oldIndex = categoryTasks.findIndex((t) => t.id === active.id);
        const newIndex = categoryTasks.findIndex((t) => t.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return prev;

        const reordered = arrayMove(categoryTasks, oldIndex, newIndex);

        let result = [];
        let i = 0;
        for (const t of prev) {
          if (t.categoryId === activeTask.categoryId) {
            const updatedTask = { ...reordered[i], positionOrder: i };
            result.push(updatedTask);
            updateTaskOrder(updatedTask.id, updatedTask.positionOrder);
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
  const filteredTasks = tasks
    .filter((t) => {
      if (selectedCategory === "today") return t.deadline === todayStr;
      if (selectedCategory === "done") return t.completed;
      if (
        selectedCategory !== "graphs" &&
        selectedCategory !== "calendar" &&
        t.categoryId !== selectedCategory
      )
        return false;
      return true;
    })
    .sort((a, b) => a.positionOrder - b.positionOrder);

  return (
    <div className="App">
      <div className="AppBody">
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
            addCategory={addCategory}
            editCategory={editCategory}
            deleteCategory={deleteCategory}
          />
          <div className="MainPanel">
            {selectedCategory === "graphs" ? (
              <TaskGraphIntegration
                tasks={tasks}
                setTasks={setTasks}
                categories={categories}
                updateTask={updateTask}
              />
            ) : selectedCategory === "calendar" ? (
              <Calendar
                tasks={tasks}
                categories={categories}
                onCardClick={(task) => setSelectedCategory(task.categoryId)}
              />
            ) : (
              <div className="MainScroll">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "16px",
                    marginTop: "1vh",
                    marginRight: "1vw",
                    marginBottom: "10vh",
                  }}
                >
                  <CalendarButton onClick={() => setSelectedCategory("calendar")} />
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <img
                      src={aiIcon}
                      alt="AI"
                      style={{ width: "24px", height: "24px" }}
                    />
                    <Button type="primary" onClick={() => setIsAIAnalysisOpen(true)}>
                      AI Analysis
                    </Button>
                  </div>
                  <UserProfileMenu user={user} />
                </div>

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
        />
      </div>
    </div>
  );
}