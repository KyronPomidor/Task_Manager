import "./styles/App.css";
import { useState } from "react";
import { Button } from "antd";
import { SideBar } from "../Widgets/SideBar";
import { Tasks } from "../pages/TaskPage";
import { Welcome } from "../Widgets/Welcome";
import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import Authorization from "../pages/authorization";
import useAuth from "../hooks/useAuth";
import UserProfileMenu from "../Widgets/UserProfile";
import { TaskGraphIntegration } from "../pages/GraphPage/ui/TaskGraphIntegration";
import { AIAnalysisModal } from "../Widgets/AIAnalysis/AIAnalysisModal";
import aiIcon from "./ai.png";
import CalendarButton from "../Widgets/Calendar/CalendarButton";
import Calendar from "../Widgets/Calendar/ui/Calendar";
import { Switch } from "antd";


// Custom hooks
import { useCategories } from "../hooks/useCategories";
import { useTasks } from "../hooks/useTasks";
import { useDragDrop } from "../hooks/useDragDrop";
import { filterTasksByCategory } from "../utils/taskUtils";


export default function App() {
  const { user, loading } = useAuth();

  // State management via custom hooks
  const {
    categories,
    setCategories,
    addCategory,
    editCategory,
    deleteCategory,
  } = useCategories();

  const [selectedCategory, setSelectedCategory] = useState("inbox");
  const [searchText, setSearchText] = useState("");
  const [isAIAnalysisOpen, setIsAIAnalysisOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);


  const { tasks, setTasks, addTask, updateTask, updateTaskOrder } = useTasks(
    categories,
    selectedCategory
  );

  const COLORS = (isDarkMode) => isDarkMode
  ? {
      bg: "#1f2123",
      text: "#e5e5e5",
      border: "#3a3c3e",
      card: "#2b2d2f",
      inputBg: "#1d1f21",
    }
  : {
      bg: "#ffffff",
      text: "#111827",
      border: "#ddd",
      card: "#f9f9f9",
      inputBg: "#fff",
    };


  const {
    activeTaskId,
    hoveredCategory,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useDragDrop(tasks, setTasks, updateTask, updateTaskOrder);

  // Handle category deletion with task reassignment
  const handleDeleteCategory = async (id) => {
    const prevTasks = tasks;
    const prevSelected = selectedCategory;

    // Move tasks to inbox before deleting category
    setTasks((prev) =>
      prev.map((t) => (t.categoryId === id ? { ...t, categoryId: "inbox" } : t))
    );

    if (selectedCategory === id) {
      setSelectedCategory("inbox");
    }

    try {
      await deleteCategory(id);
    } catch (error) {
      // Rollback on error
      setTasks(prevTasks);
      setSelectedCategory(prevSelected);
    }
  };

  // Loading and auth states
  if (loading) return <div className={`App ${isDarkMode ? "dark-mode" : ""}`}>Loading...</div>;
  if (!user) return <Authorization />;

  // Prepare droppable category IDs
  const droppableCategoryIds = new Set(categories.map((c) => c.id));
  droppableCategoryIds.add("today");

  // Filter tasks based on selected category
  const todayStr = new Date().toISOString().split("T")[0];
  const filteredTasks = filterTasksByCategory(
    tasks,
    selectedCategory,
    todayStr
  );

  const colors = COLORS(isDarkMode);

  return (
    <div
      style={{
        background: colors.bg,
        color: colors.text,
        height: "100vh",
        display: "flex",
        transition: "background 0.25s ease, color 0.25s ease",
      }}
    >
      <div className="AppBody">
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
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
            deleteCategory={handleDeleteCategory}
            isDarkMode={isDarkMode}
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
                  <CalendarButton
                    onClick={() => setSelectedCategory("calendar")}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}

                  >
                    <img
                      src={aiIcon}
                      alt="AI"
                      style={{ width: "24px", height: "24px" }}
                    />
                    <Button
                      type="primary"
                      onClick={() => setIsAIAnalysisOpen(true)}
                    >
                      AI Analysis
                    </Button>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Switch
                        checked={isDarkMode}
                        onChange={setIsDarkMode}
                      />
                      <span>{isDarkMode ? "Dark Mode" : "Light Mode"}</span>
                    </div>

                  </div>
                  <UserProfileMenu user={user}
                                  isDarkMode={isDarkMode}
                  />
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
                      📋
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