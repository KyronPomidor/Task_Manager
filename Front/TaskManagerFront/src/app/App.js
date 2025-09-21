import "./styles/App.css";
import { useState } from "react";
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
      graphNode: { id: "First task", x: 100, y: 100 },
    },
    {
      id: "2",
      title: "Second task",
      description: "Depends on First task, has a deadline.",
      priority: "High",
      deadline: "2025-09-17",
      categoryId: "inbox",
      completed: false,
      parentIds: ["1"],
      graphNode: { id: "Second task", x: 200, y: 200 },
    },
    {
      id: "3",
      title: "Review PR",
      description: "Review code after First task is done.",
      priority: "High",
      deadline: "2025-09-17",
      categoryId: "personal",
      completed: false,
      parentIds: ["1"],
      graphNode: { id: "Review PR", x: 300, y: 300 },
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
      graphNode: { id: "Refactor UI", x: 400, y: 400 },
    },
    {
      id: "5",
      title: "Refactor UI",
      description: "Longer description to demonstrate trimming.",
      priority: "Low",
      deadline: null,
      categoryId: "inbox",
      completed: false,
      parentIds: [],
      graphNode: { id: "Refactor UI", x: 400, y: 400 },
    },
    {
      id: "6",
      title: "Refactor UI",
      description: "Longer description to demonstrate trimming.",
      priority: "Low",
      deadline: null,
      categoryId: "inbox",
      completed: false,
      parentIds: [],
      graphNode: { id: "Refactor UI", x: 400, y: 400 },
    },
    {
      id: "7",
      title: "Refactor UI",
      description: "Longer description to demonstrate trimming.",
      priority: "Low",
      deadline: null,
      categoryId: "inbox",
      completed: false,
      parentIds: [],
      graphNode: { id: "Refactor UI", x: 400, y: 400 },
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("inbox");
  const [searchText, setSearchText] = useState("");

  const droppableCategoryIds = new Set(categories.map((c) => c.id));
  droppableCategoryIds.add("today");

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    if (over.id.startsWith("category:")) {
      const categoryId = over.id.replace("category:", "");

      // Special case: dropping into Today
      if (categoryId === "today") {
        const todayStr = new Date().toISOString().split("T")[0];
        setTasks((prev) => {
          const newTasks = (prev || []).map((t) =>
            t.id === active.id ? { ...t, deadline: todayStr } : t
          );
          return newTasks;
        });
        setHoveredCategory(null);
        return;
      }

      setTasks((prev) => {
        const newTasks = (prev || []).map((t) => (t.id === active.id ? { ...t, categoryId } : t));
        return newTasks;
      });
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

  // Apply filters with fallback to empty array
  const todayStr = new Date().toISOString().split("T")[0];
  const filteredTasks = (tasks || []).filter((t) => {
    if (selectedCategory === "today") {
      return t.deadline === todayStr;
    }
    if (selectedCategory !== "graphs" && t.categoryId !== selectedCategory)
      return false;
    return true;
  });

  return (
    <div className="App">
      <div className="AppBody">
        {/* Top-right AI analysis button, icon, and user profile */}
        <div style={{ position: "absolute", top: 10, right: 30, display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img src={aiIcon} alt="AI Icon" style={{ width: "24px", height: "24px" }} />
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
                <Welcome user={user} selectedCategory={selectedCategory} />
                <Tasks
                  filteredTasks={filteredTasks}
                  allTasks={tasks}
                  setTasks={setTasks}
                  categories={categories}
                  selectedCategory={selectedCategory}
                  searchText={searchText}
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

        {/* AI Analysis Modal */}
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