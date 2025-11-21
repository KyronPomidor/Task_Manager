import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";

export function useDragDrop(tasks, setTasks, updateTask, updateTaskOrder) {
    const [activeTaskId, setActiveTaskId] = useState(null);
    const [hoveredCategory, setHoveredCategory] = useState(null);

    const handleDragStart = ({ active }) => {
        setActiveTaskId(active.id);
    };

    const handleDragOver = ({ over }) => {
        setHoveredCategory(
            over?.id.startsWith("category:")
                ? over.id.replace("category:", "")
                : null
        );
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveTaskId(null);

        if (!over) {
            setHoveredCategory(null);
            return;
        }

        // Handle dropping on a category
        if (over.id.startsWith("category:")) {
            const categoryId = over.id.replace("category:", "");

            // Handle "today" category
            if (categoryId === "today") {
                const todayStr = new Date().toISOString().split("T")[0];
                const activeTask = tasks.find((t) => t.id === active.id);
                if (activeTask) {
                    const updated = { ...activeTask, deadline: todayStr, positionOrder: 0 };
                    setTasks((prev) =>
                        prev.map((t) =>
                            t.id === active.id
                                ? updated
                                : { ...t, positionOrder: t.positionOrder + 1 }
                        )
                    );
                    updateTask(updated);
                }
                setHoveredCategory(null);
                return;
            }

            // Handle regular category drop
            const activeTask = tasks.find((t) => t.id === active.id);
            if (activeTask) {
                const updated = { ...activeTask, categoryId, positionOrder: 0 };
                setTasks((prev) =>
                    prev.map((t) =>
                        t.id === active.id
                            ? updated
                            : { ...t, positionOrder: t.positionOrder + 1 }
                    )
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

                const categoryTasks = prev
                    .filter((t) => t.categoryId === activeTask.categoryId)
                    .sort((a, b) => a.positionOrder - b.positionOrder);

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
    };

    return {
        activeTaskId,
        hoveredCategory,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
    };
}