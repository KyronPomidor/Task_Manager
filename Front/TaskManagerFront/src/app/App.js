import "./styles/App.css";
import { useState } from "react";
import { Header } from "../Widgets/Header";
import { SideBar } from "../Widgets/SideBar";
import { Tasks } from "../pages/TaskPage";
import { Welcome } from "../Widgets/Welcome";
import { GraphsPage } from "../pages/GraphPage";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

// Main App component to integrate Header, SideBar, and Tasks or GraphsPage
export default function App() {
  // State for categories, initialized with default hierarchy
  const [categories, setCategories] = useState([
    { id: "work", name: "Work", parentId: null },
    { id: "personal", name: "Personal", parentId: null },
    { id: "projA", name: "Project A", parentId: "work" },
    { id: "projB", name: "Project B", parentId: "work" },
    { id: "fun", name: "Fun", parentId: "personal" },
  ]);

  // State for tasks, initialized with default tasks
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

  // State for the currently selected category
  const [selectedCategory, setSelectedCategory] = useState("inbox");

  // Set of category IDs that can accept dropped tasks
  const droppableCategoryIds = new Set(["inbox", ...categories.map((c) => c.id)]);

  // Handle drag end to reorder tasks or move to a category
  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return; // No valid drop target

    if (over.id.startsWith("category:")) {
      // Dropped on a category
      const categoryId = over.id.replace("category:", "");
      setTasks((prev) =>
        prev.map((t) =>
          t.id === active.id ? { ...t, categoryId } : t
        )
      );
    } else if (active.id !== over.id) {
      // Reorder within the task list
      setTasks((prev) => {
        const oldIndex = prev.findIndex((t) => t.id === active.id);
        const newIndex = prev.findIndex((t) => t.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }

  return (
    // Main app container
    <div className="App">
      {/* Header component */}
      <Header />
      {/* Body with sidebar and main content */}
      <div className="AppBody">
        {/* Drag-and-drop context wrapping sidebar and main panel */}
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          {/* Sidebar for category navigation */}
          <SideBar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            setCategories={setCategories}
            droppableCategoryIds={droppableCategoryIds}
          />

          {/* Main content panel */}
          <div className="MainPanel">
            {/* Show Welcome and Tasks for non-graphs categories */}
            {selectedCategory !== "graphs" && (
              <>
                {/* Welcome message component */}
                <Welcome />
                {/* Scrollable container for tasks */}
                <div className="MainScroll">
                  <Tasks
                    tasks={tasks}
                    setTasks={setTasks}
                    categories={categories}
                    selectedCategory={selectedCategory}
                  />
                </div>
              </>
            )}

            {/* Show GraphsPage when "graphs" is selected */}
            {selectedCategory === "graphs" && <GraphsPage />}
          </div>
        </DndContext>
      </div>
    </div>
  );
}