import "./styles/App.css";
import { useState, useEffect } from "react";
import { Button, Switch } from "antd";
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
import aiWhiteIcon from "../Widgets/AIAnalysis/ai_white.png";
import menuIcon from "./menu.png";
import CalendarButton from "../Widgets/Calendar/CalendarButton";
import Calendar from "../Widgets/Calendar/ui/Calendar";
import MapPage from "../pages/MapPage";
import useUserGuid from "../hooks/useUserGuid";

// Custom hooks
import { useCategories } from "../hooks/useCategories";
import { useTasks } from "../hooks/useTasks";
import { useDragDrop } from "../hooks/useDragDrop";
import { filterTasksByCategory } from "../utils/taskUtils";

export default function App() {
  const { user, loading } = useAuth();
  const userGuid = useUserGuid(user);

  // State management via custom hooks
  const {
    categories,
    setCategories,
    addCategory,
    editCategory,
    deleteCategory,
  } = useCategories(userGuid);

  const [selectedCategory, setSelectedCategory] = useState("inbox");
  const [searchText, setSearchText] = useState("");
  const [isAIAnalysisOpen, setIsAIAnalysisOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const { tasks, setTasks, addTask, updateTask, updateTaskOrder } = useTasks(
    categories,
    selectedCategory,
    userGuid
  );

  const {
    activeTaskId,
    hoveredCategory,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useDragDrop(tasks, setTasks, updateTask, updateTaskOrder);

  // ----- MOBILE DETECTION -----
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 768);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
  if (loading) return <div className="App">Loading...</div>;
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

  // Sidebar mobile header content is no longer used
  const mobileTopContent = null;

  return (
    <div className={`App ${isDark ? 'dark' : ''}`}>
      <div className="AppBody">
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {/* DESKTOP SIDEBAR – visible only when NOT mobile */}
          {!isMobile && (
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
              isMobile={false}
              mobileTopContent={null}
              isDark={isDark}
            />
          )}

          <div className="MainPanel">
            {selectedCategory === "map" ? (
              <div style={{ position: "relative", height: "100%" }}>
                {isMobile && !isSidebarOpen && (
                  <Button
                    type="text"
                    onClick={() => setIsSidebarOpen(true)}
                    style={{
                      position: "absolute",
                      top: 80,
                      left: 9,
                      zIndex: 1100,
                      padding: 0,
                      width: 36,
                      height: 36,
                      borderRadius: 6,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                  >
                    <img
                      src={menuIcon}
                      alt="Menu"
                      style={{ width: 24, height: 24 }}
                    />
                  </Button>
                )}
                <MapPage
                  tasks={tasks}
                  categories={categories}
                  isDark={isDark}
                />
              </div>
            ) : selectedCategory === "graphs" ? (
              <div style={{ position: "relative", height: "100%" }}>
                {isMobile && !isSidebarOpen && (
                  <Button
                    type="text"
                    onClick={() => setIsSidebarOpen(true)}
                    style={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      zIndex: 1100,
                      padding: 0,
                      width: 36,
                      height: 36,
                      borderRadius: 6,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                  >
                    <img
                      src={menuIcon}
                      alt="Menu"
                      style={{ width: 24, height: 24 }}
                    />
                  </Button>
                )}
                <TaskGraphIntegration
                  tasks={tasks}
                  setTasks={setTasks}
                  categories={categories}
                  updateTask={updateTask}
                  onOpenMenu={() => setIsSidebarOpen(true)}
                  isDark={isDark}
                />
              </div>

            ) : selectedCategory === "calendar" ? (
              <div style={{ position: "relative", height: "100%" }}>
                {isMobile && !isSidebarOpen && (
                  <Button
                    type="text"
                    onClick={() => setIsSidebarOpen(true)}
                    style={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      zIndex: 1100,
                      padding: 0,
                      width: 36,
                      height: 36,
                      borderRadius: 6,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={menuIcon}
                      alt="Menu"
                      style={{ width: 24, height: 24 }}
                    />
                  </Button>
                )}
                <Calendar
                  tasks={tasks}
                  categories={categories}
                  onCardClick={(task) => setSelectedCategory(task.categoryId)}
                  isDark={isDark}
                />
              </div>
            ) : (
              <div className="MainScroll">
                {/* TOP BAR */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: isMobile ? "flex-start" : "flex-end",
                    alignItems: "center",
                    gap: "16px",
                    marginTop: "1vh",
                    marginRight: "1vw",
                    marginBottom: "10vh",
                  }}
                >
                  {/* MENU BUTTON - ONLY MOBILE */}
                  {isMobile && !isSidebarOpen && (
                    <Button
                      type="text"
                      onClick={() => setIsSidebarOpen(true)}
                      style={{
                        position: "absolute",
                        top: 16,
                        left: 16,
                        zIndex: 1100,
                        padding: 0,
                        width: 36,
                        height: 36,
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={menuIcon}
                        alt="Menu"
                        style={{ width: 24, height: 24 }}
                      />
                    </Button>
                  )}

                  {/* MOBILE ICON BUTTONS: calendar, AI, profile */}
                  {isMobile && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginLeft: "auto",
                        marginRight: "2vw",
                      }}
                    >
                      <Switch
                        checked={isDark}
                        onChange={setIsDark}
                        size="small"
                        checkedChildren="🌙"
                        unCheckedChildren="☀️"
                      />
                      {/* Calendar icon-only button */}
                      <CalendarButton
                        onClick={() => setSelectedCategory("calendar")}
                        iconOnly // icon-only variant for mobile
                      />

                      {/* AI icon-only button */}
                      <Button
                        type="text"
                        onClick={() => setIsAIAnalysisOpen(true)}
                        style={{
                          padding: 0,
                          width: 32,
                          height: 32,
                          borderRadius: 6,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={isDark ? aiWhiteIcon : aiIcon}
                          alt="AI"
                          style={{ width: 24, height: 24 }}
                        />
                      </Button>

                      {/* Profile – existing component (usually avatar dropdown) */}
                      <UserProfileMenu user={user} isDark={isDark} />
                    </div>
                  )}

                  {/* DESKTOP-ONLY BUTTONS */}
                  {!isMobile && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: "16px",
                        flex: 1,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "14px", color: isDark ? "#fff" : "#000" }}>Dark Mode</span>
                        <Switch checked={isDark} onChange={setIsDark} />
                      </div>
                      <CalendarButton
                        onClick={() => setSelectedCategory("calendar")}
                        isDark={isDark}
                      />
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <img
                          src={isDark ? aiWhiteIcon : aiIcon}
                          alt="AI"
                          style={{ width: "24px", height: "24px" }}
                        />
                        <Button
                          type="primary"
                          onClick={() => setIsAIAnalysisOpen(true)}
                        >
                          AI Analysis
                        </Button>
                      </div>
                      <UserProfileMenu user={user} isDark={isDark} />
                    </div>
                  )}
                </div>

                <Welcome
                  user={user}
                  selectedCategory={selectedCategory}
                  categories={categories}
                  isDark={isDark}
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
                  isDark={isDark}
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

          {/* MOBILE SIDEBAR OVERLAY */}
          {isMobile && isSidebarOpen && (
            <div className="MobileSidebarOverlay">
              {/* CLOSE BUTTON – same spot as main menu */}
              <div
                className="MobileSidebarBackdrop"
                onClick={() => setIsSidebarOpen(false)}
              />
              <div className="MobileSidebarPanel">
                <SideBar
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategorySelect={(id) => {
                    setSelectedCategory(id);
                    setIsSidebarOpen(false);
                  }}
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
                  isMobile={true}
                  mobileTopContent={mobileTopContent}
                  isDark={isDark}
                />
              </div>
            </div>
          )}
        </DndContext>

        <AIAnalysisModal
          visible={isAIAnalysisOpen}
          onClose={() => setIsAIAnalysisOpen(false)}
        />
      </div>
    </div>
  );
}
