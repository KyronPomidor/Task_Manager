import "./styles/App.css";
import { useState } from "react";
import { Header } from "../Widgets/Header";
import { SideBar } from "../Widgets/SideBar";
import { Tasks } from "../pages/TaskPage";
import { Welcome } from "../Widgets/Welcome";
import { GraphsPage } from "../pages/GraphPage";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

// Main App component
export default function App() {
  const [categories, setCategories] = useState([
    { id: "work", name: "Work", parentId: null },
    { id: "personal", name: "Personal", parentId: null },
    { id: "projA", name: "Project A", parentId: "work" },
    { id: "projB", name: "Project B", parentId: "work" },
    { id: "fun", name: "Fun", parentId: "personal" },
  ]);

  const [hoveredCategory, setHoveredCategory] = useState(null);

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

  const droppableCategoryIds = new Set([
    "inbox",
    ...categories.map((c) => c.id),
  ]);

  // Handle drag end to reorder tasks or move to a category
  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    if (over.id.startsWith("category:")) {
      // Move to another category
      const categoryId = over.id.replace("category:", "");
      setTasks((prev) =>
        prev.map((t) => (t.id === active.id ? { ...t, categoryId } : t))
      );
      setHoveredCategory(null); // Remove blue color after drop
      return;
    }

    // Reorder inside the same category
    if (active.id !== over.id) {
      setTasks((prev) => {
        // Find the category of the dragged task
        const activeTask = prev.find((t) => t.id === active.id);
        if (!activeTask) return prev;

        // Get all tasks in the same category
        const categoryTasks = prev.filter(
          (t) => t.categoryId === activeTask.categoryId
        );
        const oldIndex = categoryTasks.findIndex((t) => t.id === active.id);
        const newIndex = categoryTasks.findIndex((t) => t.id === over.id);

        // If not in the same category, do nothing
        if (oldIndex === -1 || newIndex === -1) return prev;

        // Reorder only tasks in the same category
        const reordered = arrayMove(categoryTasks, oldIndex, newIndex);

        // Merge back into the full tasks array
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
      setHoveredCategory(null); // Remove blue color after drop
    }
  }

  return (
    <div className="App">
      <Header />
      <div className="AppBody">
        <DndContext
          collisionDetection={closestCenter}
          onDragOver={({ over }) => {
            if (over && over.id.startsWith("category:")) {
              setHoveredCategory(over.id.replace("category:", ""));
            } else {
              setHoveredCategory(null);
            }
          }}
          onDragEnd={handleDragEnd}
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
                    tasks={tasks}
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
        </DndContext>
      </div>
    </div>
  );
}
