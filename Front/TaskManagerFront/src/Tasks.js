import './App.css';
import Filters from './Filters.js'
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function Tasks() {
  const [tasks, setTasks] = useState([
    { id: "1", text: "First task", completed: false, highlighted: false, dependsOn: [] },
    { id: "2", text: "Second task", completed: false, highlighted: false, dependsOn: [] },
  ]);
  const [newTask, setNewTask] = useState("");

  // helpers
  const byId = (id) => tasks.find(t => t.id === id);
  const unmetDeps = (task) => (task.dependsOn || []).filter(did => !byId(did)?.completed);
  const canComplete = (task) => unmetDeps(task).length === 0;

  const handleAddTask = () => {
    if (newTask.trim() === "") return;
    const newItem = {
      id: Date.now().toString(),
      text: newTask.trim(),
      completed: false,
      highlighted: false,
      dependsOn: [], // no deps at creation; set via ⛓ button
    };
    setTasks(prev => [...prev, newItem]);
    setNewTask("");
  };

  const toggleComplete = (id) => {
    setTasks(prev => {
      const t = prev.find(x => x.id === id);
      if (!t) return prev;

      // If trying to mark complete, ensure all deps are completed
      if (!t.completed && !canComplete(t)) {
        const missing = unmetDeps(t).map(did => byId(did)?.text || did);
        window.alert(
          `You can't complete this yet.\nUnmet dependencies:\n- ${missing.join("\n- ")}`
        );
        return prev;
      }

      // If trying to mark incomplete and others depend on this, warn
      if (t.completed) {
        const dependents = prev.filter(x => (x.dependsOn || []).includes(id) && x.completed);
        if (
          dependents.length > 0 &&
          !window.confirm(
            `This task is a dependency for ${dependents.length} completed task(s).\n` +
            `Marking it incomplete may make those tasks inconsistent.\n` +
            `Proceed anyway?`
          )
        ) {
          return prev;
        }
      }

      return prev.map(x => x.id === id ? { ...x, completed: !x.completed } : x);
    });
  };

  const toggleHighlight = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, highlighted: !t.highlighted } : t));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(tasks);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setTasks(reordered);
  };

  // Edit dependencies (only via button)
  const editDeps = (taskId) => {
    const others = tasks.filter(t => t.id !== taskId);
    if (others.length === 0) {
      window.alert("No other tasks available to depend on.");
      return;
    }

    const lines = others.map((t, i) => `${i + 1}. ${t.text}${t.completed ? " (✓)" : ""}`).join("\n");
    const input = window.prompt(
      `Enter comma-separated numbers to set dependencies:\n\n${lines}\n\nLeave empty for none.`,
      ""
    );
    if (input === null) return; // cancelled

    const indices = input
      .split(",")
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n));

    const ids = indices.map(n => others[n - 1]?.id).filter(Boolean);

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, dependsOn: ids } : t));
  };

  // UI helpers
  const DepChips = ({ task }) => {
    if (!task.dependsOn || task.dependsOn.length === 0) return null;
    const missing = new Set(unmetDeps(task));
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
        {task.dependsOn.map(did => {
          const dep = byId(did);
          const label = dep?.text ?? did;
          const isMissing = missing.has(did);
          return (
            <span
              key={did}
              title={isMissing ? "Dependency incomplete" : "Dependency complete"}
              style={{
                padding: "2px 8px",
                borderRadius: 12,
                border: "1px solid #e0e0e0",
                background: isMissing ? "#fff5cc" : "#f5f5f5",
                fontSize: 12,
                whiteSpace: "nowrap",
              }}
            >
              {label}{isMissing ? " (⏳)" : " (✓)"}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ padding: "20px", marginTop: "10vh" }}>
      <Filters />

      {/* Composer (no dependency menu here) */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter new task..."
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleAddTask}
          style={{
            padding: "8px 12px",
            borderRadius: "5px",
            border: "none",
            background: "#f2d03bff",
            color: "white",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Add
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ listStyle: "none", padding: 0 }}
            >
              {tasks.map((task, index) => {
                const blocked = !task.completed && !canComplete(task);
                return (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                          marginBottom: "10px",
                          background: task.completed ? "#f0f0f0" : "#fff",
                          padding: "10px",
                          borderRadius: "8px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          borderLeft: blocked ? "4px solid #f2d03bff" : "4px solid transparent",
                          ...provided.draggableProps.style,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {/* Custom checkbox */}
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleComplete(task.id)}
                            style={{
                              marginRight: "10px",
                              width: "18px",
                              height: "18px",
                              accentColor: "#f2d03bff",
                              cursor: "pointer",
                            }}
                          />

                          {/* Task text */}
                          <span
                            style={{
                              flex: 1,
                              textDecoration: task.completed ? "line-through" : "none",
                              color: task.completed ? "#888" : "#000"
                            }}
                            title={blocked ? "Has unmet dependencies" : ""}
                          >
                            {task.text}
                            {blocked && (
                              <span style={{ marginLeft: 8, fontSize: 12, color: "#b58900" }}>
                                • blocked by {unmetDeps(task).length}
                              </span>
                            )}
                          </span>

                          {/* Drag handle */}
                          <span
                            {...provided.dragHandleProps}
                            style={{
                              cursor: "grab",
                              padding: "0 8px",
                              fontSize: "18px",
                              color: "#666",
                            }}
                            title="Drag to reorder"
                          >
                            ⋮⋮
                          </span>

                          {/* Highlight */}
                          <button
                            onClick={() => toggleHighlight(task.id)}
                            style={{
                              marginLeft: "10px",
                              padding: "4px 8px",
                              borderRadius: "5px",
                              border: "1px solid #d0b71b",
                              backgroundColor: task.highlighted ? "#f2d03bff" : "#fff",
                              color: task.highlighted ? "#fff" : "#d0b71b",
                              cursor: "pointer",
                              boxShadow: task.highlighted ? "0 0 10px 2px #f2d03bff" : "none",
                              transition: "all 0.2s ease",
                            }}
                            title="Highlight"
                          >
                            $
                          </button>

                          {/* Set dependencies (only entry point) */}
                          <button
                            onClick={() => editDeps(task.id)}
                            style={{
                              marginLeft: "8px",
                              padding: "4px 8px",
                              borderRadius: "5px",
                              border: "1px solid #ccc",
                              backgroundColor: "#fafafa",
                              cursor: "pointer",
                            }}
                            title="Set dependencies"
                          >
                            ⛓
                          </button>
                        </div>

                        {/* Dependency chips */}
                        <DepChips task={task} />
                      </li>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}