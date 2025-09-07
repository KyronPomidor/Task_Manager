import './App.css';
import Filters from './Filters.js';
import { useState, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function Tasks() {
  const [tasks, setTasks] = useState([
    { id: "1", text: "First task", completed: false, highlighted: false, dependsOn: [], deadline: null, priority: "Medium" },
    { id: "2", text: "Second task", completed: false, highlighted: false, dependsOn: [], deadline: null, priority: "Medium" },
  ]);
  const [newTask, setNewTask] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit'
  const [editingTaskId, setEditingTaskId] = useState(null);

  // Pending fields (used by both create and edit)
  const [pendingText, setPendingText] = useState("");
  const [pendingDeadline, setPendingDeadline] = useState("");
  const [pendingPriority, setPendingPriority] = useState("Medium");

  // ---------- helpers ----------
  const byId = (id) => tasks.find(t => t.id === id);
  const unmetDeps = (task) => (task.dependsOn || []).filter(did => !byId(did)?.completed);
  const canComplete = (task) => unmetDeps(task).length === 0;

  // Due today/tomorrow (and overdue)
  const isDueSoon = (deadlineStr) => {
    if (!deadlineStr) return false;
    const dl = new Date(`${deadlineStr}T23:59:59`);
    const now = new Date();
    const endTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59);
    return dl <= endTomorrow;
  };

  // ---------- filtering (UNION behavior) ----------
  const matchCompleted = (t) => t.completed;
  const matchCanStart = (t) => !t.completed; // all not-completed
  const matchDeadline  = (t) => !t.completed && isDueSoon(t.deadline);

  // If nothing selected → show nothing
  const matchesFilters = (task) => {
    if (!activeFilters || activeFilters.length === 0) return false;

    let match = false; // UNION of selected filters
    if (activeFilters.includes("Completed")) match ||= matchCompleted(task);
    if (activeFilters.includes("Can Start")) match ||= matchCanStart(task);
    if (activeFilters.includes("Deadline"))  match ||= matchDeadline(task);
    return match;
  };

  const visibleTasks = useMemo(() => tasks.filter(matchesFilters), [tasks, activeFilters]);

  // ---------- create (open modal) ----------
  const handleAddTask = () => {
    const text = newTask.trim();
    if (!text) return;
    setModalMode("create");
    setPendingText(text);
    setPendingDeadline("");
    setPendingPriority("Medium");
    setIsModalOpen(true);
  };

  const saveNewTask = () => {
    const newItem = {
      id: Date.now().toString(),
      text: pendingText,
      completed: false,
      highlighted: false,
      dependsOn: [],
      deadline: pendingDeadline || null,
      priority: pendingPriority || "Medium",
    };
    setTasks(prev => [...prev, newItem]);
    setNewTask("");
    setIsModalOpen(false);
  };

  // ---------- edit (open modal for existing task) ----------
  const openEditTask = (taskId) => {
    const t = byId(taskId);
    if (!t) return;
    setModalMode("edit");
    setEditingTaskId(taskId);
    setPendingText(t.text);            // keep text visible (read-only here), easy to enable editing later
    setPendingDeadline(t.deadline || "");
    setPendingPriority(t.priority || "Medium");
    setIsModalOpen(true);
  };

  const saveEditTask = () => {
    setTasks(prev =>
      prev.map(t =>
        t.id === editingTaskId
          ? { ...t, deadline: pendingDeadline || null, priority: pendingPriority || "Medium" }
          : t
      )
    );
    setIsModalOpen(false);
    setEditingTaskId(null);
  };

  const cancelModal = () => {
    setIsModalOpen(false);
    setEditingTaskId(null);
  };

  // ---------- complete / highlight ----------
  const toggleComplete = (id) => {
    setTasks(prev => {
      const t = prev.find(x => x.id === id);
      if (!t) return prev;

      // Guard: cannot complete if deps unmet
      if (!t.completed && !canComplete(t)) {
        const missing = unmetDeps(t).map(did => byId(did)?.text || did);
        window.alert(`You can't complete this yet.\nUnmet dependencies:\n- ${missing.join("\n- ")}`);
        return prev;
      }

      // Warn when un-completing a dependency of completed tasks
      if (t.completed) {
        const dependents = prev.filter(x => (x.dependsOn || []).includes(id) && x.completed);
        if (dependents.length > 0 && !window.confirm(
          `This task is a dependency for ${dependents.length} completed task(s).\n` +
          `Marking it incomplete may make those tasks inconsistent.\nProceed anyway?`
        )) {
          return prev;
        }
      }

      return prev.map(x => x.id === id ? { ...x, completed: !x.completed } : x);
    });
  };

  const toggleHighlight = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? ({ ...t, highlighted: !t.highlighted }) : t));
  };

  // ---------- drag & drop (safe with filtering) ----------
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const fromIdx = result.source.index;
    const toIdx = result.destination.index;

    const movedId = visibleTasks[fromIdx]?.id;
    const targetId = visibleTasks[toIdx]?.id;
    if (!movedId || !targetId) return;

    setTasks(prev => {
      const arr = [...prev];
      const oldIndex = arr.findIndex(t => t.id === movedId);
      const [moved] = arr.splice(oldIndex, 1);
      const newIndex = arr.findIndex(t => t.id === targetId);
      arr.splice(newIndex, 0, moved);
      return arr;
    });
  };

  // ---------- dependencies editor (prompt-based) ----------
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
    const ids = input
      .split(",")
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n))
      .map(n => others[n - 1]?.id)
      .filter(Boolean);

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, dependsOn: ids } : t));
  };

  // ---------- UI helpers ----------
  const priorityColor = (p) => {
    if (p === "High") return "#e74c3c";   // red
    if (p === "Low")  return "#6c757d";   // gray
    return "#0d6efd";                      // blue 
  };

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
      {/* Composer */}
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
            background: "#FFD93D",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Add
        </button>
      </div>

      {/* Filters (checkboxes) */}
      <Filters onFilterSelect={setActiveFilters} />

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ listStyle: "none", padding: 0 }}
            >
              {visibleTasks.map((task, index) => {
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
                          borderLeft: blocked ? "4px solid #FFD93D" : "4px solid transparent",
                          ...provided.draggableProps.style,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {/* Checkbox */}
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

                          {/* Text + chips */}
                          <span
                            style={{
                              flex: 1,
                              textDecoration: task.completed ? "line-through" : "none",
                              color: task.completed ? "#888" : "#000"
                            }}
                            title={blocked ? "Has unmet dependencies" : ""}
                          >
                            {task.text}

                            {/* Priority badge */}
                            <span
                              style={{
                                marginLeft: 8,
                                padding: "2px 8px",
                                borderRadius: 12,
                                border: "1px solid #e0e0e0",
                                background: "#fff",
                                fontSize: 12,
                                whiteSpace: "nowrap",
                                color: priorityColor(task.priority),
                                fontWeight: 600
                              }}
                              title="Priority"
                            >
                              ⬤ {task.priority}
                            </span>

                            {/* Deadline chip */}
                            {task.deadline && (
                              <span
                                style={{
                                  marginLeft: 8,
                                  padding: "2px 8px",
                                  borderRadius: 12,
                                  border: "1px solid #e0e0e0",
                                  background: "#f2d03bff",
                                  fontSize: 12,
                                  whiteSpace: "nowrap",
                                }}
                                title="Deadline"
                              >
                                📅 {task.deadline}
                              </span>
                            )}

                            {blocked && (
                              <span style={{ marginLeft: 8, fontSize: 12, color: "#FFD93D" }}>
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
                              color: "#665",
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
                              border: "1px solid #FFD93D",
                              backgroundColor: task.highlighted ? "#f2d03bff" : "#fff",
                              color: task.highlighted ? "#fff" : "#FFD93D",
                              cursor: "pointer",
                              boxShadow: task.highlighted ? "0 0 10px 2px #FFD93D" : "none",
                              transition: "all 0.2s ease",
                            }}
                            title="Highlight"
                          >
                            $
                          </button>

                          {/* Set dependencies */}
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

                          {/* Edit deadline/priority */}
                          <button
                            onClick={() => openEditTask(task.id)}
                            style={{
                              marginLeft: "8px",
                              padding: "4px 8px",
                              borderRadius: "5px",
                              border: "1px solid #ccc",
                              backgroundColor: "#fafafa",
                              cursor: "pointer",
                            }}
                            title="Edit deadline & priority"
                          >
                            ✎
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

      {/* Modal (Create + Edit share the same UI) */}
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={cancelModal}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 999,
            }}
          />
          {/* Dialog */}
          <div
            role="dialog"
            aria-modal="true"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "min(92vw, 460px)",
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              padding: "20px",
              zIndex: 1000,
            }}
          >
            <h3 style={{ margin: "0 0 12px 0" }}>
              {modalMode === "create" ? "Add task details" : "Edit task"}
            </h3>

            {/* Task label (read-only for now, easy to enable editing later) */}
            <p style={{ margin: "0 0 16px 0", color: "#555" }}>
              Task: <b>{pendingText}</b>
            </p>

            {/* Deadline */}
            <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ minWidth: 80 }}>Deadline</span>
              <input
                type="date"
                value={pendingDeadline}
                onChange={(e) => setPendingDeadline(e.target.value)}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: 8,
                  border: "1px solid #ccc",
                }}
              />
            </label>

            {/* Priority */}
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ minWidth: 80 }}>Priority</span>
              <select
                value={pendingPriority}
                onChange={(e) => setPendingPriority(e.target.value)}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  background: "#fff"
                }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
              <button
                onClick={cancelModal}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  background: "#fafafa",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              {modalMode === "create" ? (
                <button
                  onClick={saveNewTask}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "none",
                    background: "#f2d03bff",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={saveEditTask}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "none",
                    background: "#f2d03bff",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Update
                </button>
              )}
            </div>

            <p style={{ marginTop: 12, fontSize: 12, color: "#665" }}>
              • <b>Can Start</b> shows all tasks that are not completed (includes those with near deadlines).<br/>
              • <b>Deadline</b> shows tasks due today, tomorrow, or overdue.<br/>
              • If no filters are selected, no tasks are shown.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
