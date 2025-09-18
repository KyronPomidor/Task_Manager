import "./styles/App.css";
import { useState } from "react";
import { SideBar } from "../Widgets/SideBar";
import { Tasks } from "../pages/TaskPage";
import { Welcome } from "../Widgets/Welcome";
import { GraphsPage } from "../pages/GraphPage";
import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import Authorization from "../pages/authorization";
import useAuth from "../hooks/useAuth";
import { TaskFilters } from "../Widgets/TaskFilters";
import UserProfileMenu from "../Widgets/UserProfile";

export default function App() {
  const { user, loading } = useAuth();

  const [categories, setCategories] = useState([
    { id: "inbox", name: "Inbox", parentId: null },
    { id: "work", name: "Work", parentId: null },
    { id: "personal", name: "Personal", parentId: null },
    { id: "projA", name: "Project A", parentId: "work" },
    { id: "projB", name: "Project B", parentId: "work" },
    { id: "fun", name: "Fun", parentId: "personal" },
  ]);

  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [activeTaskId, setActiveTaskId] = useState(null);

  const [tasks, setTasks] = useState([
    {
      id: "1",
      title: "First task",
      description: "Short description for the first task.",
      priority: "Medium",
      deadline: null,
      categoryId: "inbox",
      completed: false,
      parentIds: [],
    },
    {
      id: "2",
      title: "Second task",
      description: "Depends on First task, has a deadline.",
      priority: "High",
      deadline: "2025-09-15",
      categoryId: "inbox",
      completed: false,
      parentIds: ["1"],
    },
    {
      id: "3",
      title: "Review PR",
      description: "Review code after First task is done.",
      priority: "High",
      deadline: "2025-09-12",
      categoryId: "personal",
      completed: false,
      parentIds: ["1"],
    },
    {
      id: "4",
      title: "Refactor UI",
      description: "Longer description to demonstrate trimming.",
      priority: "Low",
      deadline: null,
      categoryId: "personal",
      completed: false,
      parentIds: [],
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("inbox");

  // Task filters state
  const [filters, setFilters] = useState({
    priority: "All",
    status: "All",
    deadline: "",
  });

  const droppableCategoryIds = new Set(categories.map((c) => c.id));

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    if (over.id.startsWith("category:")) {
      const categoryId = over.id.replace("category:", "");
      setTasks((prev) =>
        prev.map((t) => (t.id === active.id ? { ...t, categoryId } : t))
      );
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
            result.push(reordered[i]);
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

  // Apply filters
  const filteredTasks = tasks.filter((t) => {
    if (t.categoryId !== selectedCategory) return false;
    if (filters.priority !== "All" && t.priority !== filters.priority) return false;
    if (filters.status === "Done" && !t.completed) return false;
    if (filters.status === "Undone" && t.completed) return false;
    if (filters.deadline && t.deadline !== filters.deadline) return false;
    return true;
  });

  return (
    <div className="App">
      <div className="AppBody">
        {/* Top-right user profile */}
        <div style={{ position: "absolute", top: 10, right: 20 }}>
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
          />
          <div className="MainPanel">
            {selectedCategory !== "graphs" ? (
              <>
                <Welcome />
                <div className="MainScroll">
                  <Tasks
                    tasks={filteredTasks}
                    setTasks={setTasks}
                    categories={categories}
                    selectedCategory={selectedCategory}
                  />
                </div>
              </>
            ) : (
              <GraphsPage />
            )}
          </div>
          <DragOverlay>
            {activeTaskId && (() => {
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
      </div>
    </div>
  );
}
