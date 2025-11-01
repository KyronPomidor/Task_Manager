import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortableTask({ task, children, onCardClick }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 9999 : 1,
        width: "100%",
        height: "100%",
        opacity: isDragging ? 0 : 1,
        pointerEvents: isDragging ? "none" : "auto",
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={isDragging ? "dragging" : ""}
            onClick={() => onCardClick(task)}
        >
            {typeof children === "function" ? children(listeners) : children}
        </div>
    );
}