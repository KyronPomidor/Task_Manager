import "./App.css";
import { useEffect, useMemo, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function Tasks() {
  /* ========== Styles ========== */
  const CONTAINER = { padding: "20px", marginTop: "10vh" };

  const COMPOSER_ROW = { display: "flex", gap: "10px", marginBottom: "20px" };
  const COMPOSER_INPUT = { flex: 1, padding: "8px", borderRadius: "5px", border: "1px solid #ccc" };
  const COMPOSER_BTN = { padding: "8px 12px", borderRadius: "5px", border: "none", background: "#2563eb", cursor: "pointer", whiteSpace: "nowrap", transition: "filter 0.15s", color: "white" };

  const LIST = { listStyle: "none", padding: 0, margin: 0 };

  const ITEM = (completed, blocked, hovered, level = 0) => ({
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginBottom: "10px",
    background: hovered ? (completed ? "#e9e9e9" : "#f7f7f7") : completed ? "#f0f0f0" : "#fff",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: hovered ? "0 6px 16px rgba(0,0,0,0.18)" : "0 2px 4px rgba(0,0,0,0.1)",
    transition: "box-shadow 0.15s, transform 0.15s, background 0.15s",
    transform: hovered ? "translateY(-1px)" : "none",
    borderLeft: blocked ? "4px solid #2563eb" : "4px solid transparent",
    marginLeft: level > 0 ? level * 16 : 0, // visual indent for children
    cursor: "pointer",
  });

  const ROW = { display: "flex", alignItems: "center" };
  const CHECKBOX = { marginRight: "10px", width: "18px", height: "18px", accentColor: "#f2d03bff", cursor: "pointer" };

  const TITLE = { fontWeight: 600, userSelect: "none" };
  const TEXT = (completed) => ({ flex: 1, textDecoration: completed ? "line-through" : "none", color: completed ? "#888" : "#000", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" });

  // Centered description preview at bottom; we still hard-trim with "..."
  const DESC_SNIPPET_WRAP = {
    display: "flex",
    justifyContent: "center",
  };
  const DESC_SNIPPET = {
    maxWidth: "95%",
    marginTop: 6,
    fontSize: 12,
    color: "#555",
    textAlign: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const DRAG_HANDLE = { cursor: "grab", padding: "0 8px", fontSize: "18px", color: "#665" };
  const DRAG_HANDLE_DISABLED = { ...DRAG_HANDLE, opacity: 0.35, cursor: "not-allowed" };

  const BTN_HIGHLIGHT = (on) => ({
    marginLeft: "10px",
    padding: "4px 8px",
    borderRadius: "5px",
    border: "1px solid #FFD93D",
    backgroundColor: on ? "#f2d03bff" : "#fff",
    color: on ? "#fff" : "#FFD93D",
    cursor: "pointer",
    boxShadow: on ? "0 0 10px 2px #FFD93D" : "none",
    transition: "filter 0.15s, box-shadow 0.15s, background 0.15s, color 0.15s",
  });

  const BTN_SMALL = { marginLeft: "8px", padding: "4px 8px", borderRadius: "5px", border: "1px solid #ccc", backgroundColor: "#fafafa", cursor: "pointer", transition: "filter 0.15s, background 0.15s, border-color 0.15s" };

  const CHIP = { marginLeft: 8, padding: "2px 8px", borderRadius: 12, border: "1px solid #e0e0e0", fontSize: 12, whiteSpace: "nowrap" };
  const CHIP_DEADLINE = { color: "white", background: "#2563eb" };
  const CHIP_PRIORITY = (color) => ({ background: "#fff", color, fontWeight: 600 });
  const BLOCKED_NOTE = { marginLeft: 8, fontSize: 12, color: "#ff3d3dff" };

  const DEPS_WRAP = { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 };
  const DEP_CHIP = (missing) => ({ padding: "2px 8px", borderRadius: 12, border: "1px solid #e0e0e0", color: "white", background: missing ? "#2563eb" : "#f5f5f5", fontSize: 12, whiteSpace: "nowrap" });

  // Modals
  const BACKDROP = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 999 };
  const MODAL = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "min(92vw, 520px)", background: "#fff", borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.2)", padding: "20px", zIndex: 1000 };
  const MODAL_TITLE = { margin: "0 0 12px 0" };
  const MODAL_FIELD = { display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 };
  const MODAL_LABEL = { fontSize: 13, color: "#444" };
  const MODAL_INPUT = { padding: "8px", borderRadius: 8, border: "1px solid #ccc", background: "#fff" };
  const MODAL_TEXTAREA = { padding: "8px", borderRadius: 8, border: "1px solid #ccc", background: "#fff", minHeight: 100, resize: "vertical" };
  const MODAL_ACTIONS = { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 };
  const MODAL_BTN_CANCEL = { padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", background: "#fafafa", cursor: "pointer", transition: "filter 0.15s" };
  const MODAL_BTN_SAVE = { padding: "8px 12px", borderRadius: 8, border: "none", background: "#f2d03bff", color: "#fff", cursor: "pointer", transition: "filter 0.15s" };

  /* ========== State ========== */
  const [tasks, setTasks] = useState([
    { id: "1", text: "First task",  completed: false, highlighted: false, dependsOn: [],       deadline: null,          priority: "Medium", description: "Short description for the first task." },
    { id: "2", text: "Second task", completed: false, highlighted: false, dependsOn: ["1"],    deadline: "2025-09-15",  priority: "High",   description: "Depends on First task, has a deadline." },
    { id: "3", text: "Review PR",   completed: false, highlighted: false, dependsOn: ["1"],    deadline: "2025-09-12",  priority: "High",   description: "Review code after First task is done." },
    { id: "4", text: "Refactor UI", completed: false, highlighted: false, dependsOn: ["3"],    deadline: null,          priority: "Low",    description: "Nested child of Review PR with a longer description to demonstrate trimming in the card preview." },
  ]);
  const [newTask, setNewTask] = useState("");
  const [hoveredId, setHoveredId] = useState(null);

  // Create/Edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit'
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [pendingText, setPendingText] = useState("");
  const [pendingDeadline, setPendingDeadline] = useState("");
  const [pendingPriority, setPendingPriority] = useState("Medium");
  const [pendingDescription, setPendingDescription] = useState("");

  // Separate INFO modal
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [infoTaskId, setInfoTaskId] = useState(null);

  // dragging guard (to avoid click after drag)
  const [dragging, setDragging] = useState(false);

  /* ========== Helpers (nesting via first dependency) ========== */
  const byId = (id) => tasks.find((t) => t.id === id);
  const parentIdOf = (task) => (task.dependsOn && task.dependsOn.length > 0 ? task.dependsOn[0] : null);

  // Build children map using first dependency as visual parent
  const childrenMap = useMemo(() => {
    const map = new Map();
    tasks.forEach((t) => {
      const pid = parentIdOf(t);
      const key = pid ?? null;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(t);
    });
    return map; // keeps current order for stability
  }, [tasks]);

  const roots = useMemo(() => tasks.filter((t) => parentIdOf(t) === null), [tasks]);

  // Get descendant ids for cycle checks and for rendering
  const descendantIds = (rootId) => {
    const result = new Set();
    const visit = (id) => {
      const kids = childrenMap.get(id) || [];
      kids.forEach((k) => {
        result.add(k.id);
        visit(k.id);
      });
    };
    visit(rootId);
    return result;
  };

  const subtreeIds = (rootId) => {
    const ids = [rootId];
    const visit = (id) => {
      const kids = childrenMap.get(id) || [];
      kids.forEach((k) => {
        ids.push(k.id);
        visit(k.id);
      });
    };
    visit(rootId);
    return ids;
  };

  const renderBranch = (rootTask, level = 0) => {
    const nodes = [{ task: rootTask, level }];
    const kids = childrenMap.get(rootTask.id) || [];
    kids.forEach((child) => nodes.push(...renderBranch(child, level + 1)));
    return nodes;
  };

  const unmetDeps = (task) => (task.dependsOn || []).filter((did) => !byId(did)?.completed);
  const canComplete = (task) => unmetDeps(task).length === 0;
  const priorityColor = (p) => (p === "High" ? "#e74c3c" : p === "Low" ? "#6c757d" : "#0d6efd");

  const trim = (s, max = 100) => {
    if (!s) return "";
    return s.length > max ? s.slice(0, max) + "..." : s;
  };

  /* ========== CRUD & UI actions ========== */
  const handleAddTask = () => {
    const text = newTask.trim();
    if (!text) return;
    setModalMode("create");
    setEditingTaskId(null);
    setPendingText(text);
    setPendingDeadline("");
    setPendingPriority("Medium");
    setPendingDescription("");
    setIsModalOpen(true);
  };

  const saveNewTask = () => {
    const item = {
      id: Date.now().toString(),
      text: pendingText,
      completed: false,
      highlighted: false,
      dependsOn: [],
      deadline: pendingDeadline || null,
      priority: pendingPriority || "Medium",
      description: pendingDescription || "",
    };
    setTasks((prev) => [...prev, item]);
    setNewTask("");
    setIsModalOpen(false);
  };

  const openEditTask = (taskId) => {
    const t = byId(taskId);
    if (!t) return;
    setModalMode("edit");
    setEditingTaskId(taskId);
    setPendingText(t.text);
    setPendingDeadline(t.deadline || "");
    setPendingPriority(t.priority || "Medium");
    setPendingDescription(t.description || "");
    setIsModalOpen(true);
  };

  // OPEN INFO (separate read-focused window)
  const openInfo = (taskId) => {
    if (dragging) return; // ignore card clicks during drag
    setInfoTaskId(taskId);
    setIsInfoOpen(true);
  };

  const saveEditTask = () => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === editingTaskId
          ? { ...t, deadline: pendingDeadline || null, priority: pendingPriority || "Medium", description: pendingDescription || "" }
          : t
      )
    );
    setIsModalOpen(false);
    setEditingTaskId(null);
  };

  const closeModals = () => {
    setIsModalOpen(false);
    setIsInfoOpen(false);
    setEditingTaskId(null);
    setInfoTaskId(null);
  };

  // ESC closes either modal
  useEffect(() => {
    if (!isModalOpen && !isInfoOpen) return;
    const onKeyDown = (e) => e.key === "Escape" && closeModals();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isModalOpen, isInfoOpen]);

  const toggleComplete = (id) => {
    setTasks((prev) => {
      const t = prev.find((x) => x.id === id);
      if (!t) return prev;

      if (!t.completed && !canComplete(t)) {
        const missing = unmetDeps(t).map((did) => byId(did)?.text || did);
        window.alert(`You can't complete this yet.\nUnmet dependencies:\n- ${missing.join("\n- ")}`);
        return prev;
      }

      if (t.completed) {
        const dependents = prev.filter((x) => (x.dependsOn || []).includes(id) && x.completed);
        if (
          dependents.length > 0 &&
          !window.confirm(
            `This task is a dependency for ${dependents.length} completed task(s).\n` +
              `Marking it incomplete may make those tasks inconsistent.\nProceed anyway?`
          )
        ) {
          return prev;
        }
      }

      return prev.map((x) => (x.id === id ? { ...x, completed: !x.completed } : x));
    });
  };

  const toggleHighlight = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, highlighted: !t.highlighted } : t)));
  };

  // Dependency editor (prompt-based) with cycle protection
  const editDeps = (taskId) => {
    const current = byId(taskId);
    if (!current) return;

    const others = tasks.filter((t) => t.id !== taskId);
    if (others.length === 0) {
      window.alert("No other tasks available to depend on.");
      return;
    }

    // Disallow: self and descendants (prevents assigning a child as a parent)
    const forbidden = descendantIds(taskId);
    forbidden.add(taskId);

    const lines = others
      .map((t, i) => {
        const isForbidden = forbidden.has(t.id);
        return `${i + 1}. ${t.text}${t.completed ? " (✓)" : ""}${isForbidden ? " [forbidden]" : ""}`;
      })
      .join("\n");

    const input = window.prompt(
      "Enter comma-separated numbers to set dependencies.\n" +
        "(Items marked [forbidden] cannot be selected.)\n\n" +
        lines +
        "\n\nLeave empty for none.",
      ""
    );
    if (input === null) return;

    const chosenIds = input
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n))
      .map((n) => others[n - 1]?.id)
      .filter(Boolean);

    // Filter out forbidden picks
    const valid = chosenIds.filter((id) => !forbidden.has(id));
    if (valid.length !== chosenIds.length) {
      window.alert("Some selections were ignored because they would create a cycle.");
    }

    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, dependsOn: valid } : t)));
  };

  /* ========== Drag & drop (roots only; reorder subtrees as blocks) ========== */
  const handleDragStart = () => setDragging(true);
  const handleDragEnd = (result) => {
    setDragging(false);
    const { destination, draggableId } = result;
    if (!destination) return;

    const draggedRoot = tasks.find((t) => t.id === draggableId);
    if (!draggedRoot || parentIdOf(draggedRoot) !== null) return; // only roots draggable

    const rootsList = roots.map((r) => r.id);
    const fromIndex = rootsList.indexOf(draggableId);
    const toIndex = destination.index;
    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

    setTasks((prev) => {
      // Build subtree block for each root from current order
      const blockByRoot = new Map();
      rootsList.forEach((rid) => {
        const ids = new Set(subtreeIds(rid));
        const block = prev.filter((t) => ids.has(t.id)); // preserve inner order
        blockByRoot.set(rid, block);
      });

      // New root order
      const newRoots = [...rootsList];
      newRoots.splice(toIndex, 0, newRoots.splice(fromIndex, 1)[0]);

      // Concatenate blocks in the new order
      const next = [];
      newRoots.forEach((rid) => next.push(...(blockByRoot.get(rid) || [])));
      return next;
    });
  };

  /* ========== Small UI helpers ========== */
  const DepChips = ({ task }) => {
    if (!task.dependsOn || task.dependsOn.length === 0) return null;
    const missing = new Set(unmetDeps(task));
    return (
      <div style={DEPS_WRAP}>
        {task.dependsOn.map((did) => {
          const dep = byId(did);
          const label = dep?.text ?? did;
          const isMissing = missing.has(did);
          return (
            <span key={did} title={isMissing ? "Dependency incomplete" : "Dependency complete"} style={DEP_CHIP(isMissing)}>
              {label}{isMissing ? " (⏳)" : " (✓)"}
            </span>
          );
        })}
      </div>
    );
  };

  const priorityChip = (p) => (
    <span style={{ ...CHIP, ...CHIP_PRIORITY(priorityColor(p)) }} title="Priority">
      ⬤ {p}
    </span>
  );

  /* ========== Render ========== */
  return (
    <div style={CONTAINER}>
      {/* Composer */}
      <div style={COMPOSER_ROW}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter new task..."
          style={COMPOSER_INPUT}
        />
        <button
          onClick={handleAddTask}
          style={COMPOSER_BTN}
          onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.95)")}
          onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
        >
          Add
        </button>
      </div>

      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Droppable droppableId="roots">
          {(provided) => (
            <ul ref={provided.innerRef} {...provided.droppableProps} style={LIST}>
              {roots.map((rootTask, rootIndex) => {
                const branch = renderBranch(rootTask, 0);
                const hovered = hoveredId === rootTask.id;

                return (
                  <Draggable key={rootTask.id} draggableId={rootTask.id} index={rootIndex}>
                    {(dragProvided) => (
                      <li ref={dragProvided.innerRef} {...dragProvided.draggableProps} style={{ ...dragProvided.draggableProps.style }}>
                        {/* Root card (click anywhere to open INFO) */}
                        <div
                          style={ITEM(rootTask.completed, !canComplete(rootTask), hovered, 0)}
                          onMouseEnter={() => setHoveredId(rootTask.id)}
                          onMouseLeave={() => setHoveredId(null)}
                          onClick={() => openInfo(rootTask.id)}
                        >
                          <div style={ROW}>
                            <input
                              type="checkbox"
                              checked={rootTask.completed}
                              onClick={(e) => e.stopPropagation()}
                              onChange={() => toggleComplete(rootTask.id)}
                              style={CHECKBOX}
                            />

                            <span style={{ ...TITLE, marginRight: 8 }}>{rootTask.text}</span>

                            <span style={TEXT(rootTask.completed)} title={!canComplete(rootTask) ? "Has unmet dependencies" : ""}>
                              {priorityChip(rootTask.priority)}
                              {rootTask.deadline && <span style={{ ...CHIP, ...CHIP_DEADLINE }} title="Deadline">📅 {rootTask.deadline}</span>}
                            </span>

                            {/* Root drag handle */}
                            <span
                              {...dragProvided.dragHandleProps}
                              style={DRAG_HANDLE}
                              title="Drag to reorder subtree"
                              onClick={(e) => e.stopPropagation()}
                            >
                              ⋮⋮
                            </span>

                            {/* Highlight */}
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleHighlight(rootTask.id); }}
                              style={BTN_HIGHLIGHT(rootTask.highlighted)}
                              title="Highlight"
                              onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.97)")}
                              onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
                            >
                              $
                            </button>

                            {/* Edit (opens edit modal, not info) */}
                            <button
                              onClick={(e) => { e.stopPropagation(); openEditTask(rootTask.id); }}
                              style={BTN_SMALL}
                              title="Edit deadline/priority/description"
                              onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(0.97)"; e.currentTarget.style.borderColor = "#bbb"; e.currentTarget.style.background = "#f2f2f2"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; e.currentTarget.style.borderColor = "#ccc"; e.currentTarget.style.background = "#fafafa"; }}
                            >
                              ✎
                            </button>

                            {/* Dependencies editor */}
                            <button
                              onClick={(e) => { e.stopPropagation(); editDeps(rootTask.id); }}
                              style={BTN_SMALL}
                              title="Set dependencies"
                              onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(0.97)"; e.currentTarget.style.borderColor = "#bbb"; e.currentTarget.style.background = "#f2f2f2"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; e.currentTarget.style.borderColor = "#ccc"; e.currentTarget.style.background = "#fafafa"; }}
                            >
                              ⛓
                            </button>
                          </div>

                          {/* Centered description snippet */}
                          {rootTask.description && (
                            <div style={DESC_SNIPPET_WRAP}>
                              <div style={DESC_SNIPPET} title={rootTask.description}>
                                {trim(rootTask.description, 100)}
                              </div>
                            </div>
                          )}

                          <DepChips task={rootTask} />
                        </div>

                        {/* Children (not draggable) */}
                        {branch.slice(1).map(({ task, level }) => {
                          const hoveredChild = hoveredId === task.id;
                          const blocked = !task.completed && !canComplete(task);

                          return (
                            <div
                              key={task.id}
                              style={ITEM(task.completed, blocked, hoveredChild, level)}
                              onMouseEnter={() => setHoveredId(task.id)}
                              onMouseLeave={() => setHoveredId(null)}
                              onClick={() => openInfo(task.id)}
                            >
                              <div style={ROW}>
                                <span style={DRAG_HANDLE_DISABLED} title="Child task (drag disabled)" onClick={(e) => e.stopPropagation()}>⋮⋮</span>

                                <input
                                  type="checkbox"
                                  checked={task.completed}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={() => toggleComplete(task.id)}
                                  style={CHECKBOX}
                                />

                                <span style={{ ...TITLE, marginRight: 8 }}>{task.text}</span>

                                <span style={TEXT(task.completed)} title={blocked ? "Has unmet dependencies" : ""}>
                                  {priorityChip(task.priority)}
                                  {task.deadline && <span style={{ ...CHIP, ...CHIP_DEADLINE }} title="Deadline">📅 {task.deadline}</span>}
                                </span>

                                <button
                                  onClick={(e) => { e.stopPropagation(); toggleHighlight(task.id); }}
                                  style={BTN_HIGHLIGHT(task.highlighted)}
                                  title="Highlight"
                                  onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.97)")}
                                  onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
                                >
                                  $
                                </button>

                                <button
                                  onClick={(e) => { e.stopPropagation(); openEditTask(task.id); }}
                                  style={BTN_SMALL}
                                  title="Edit deadline/priority/description"
                                  onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(0.97)"; e.currentTarget.style.borderColor = "#bbb"; e.currentTarget.style.background = "#f2f2f2"; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; e.currentTarget.style.borderColor = "#ccc"; e.currentTarget.style.background = "#fafafa"; }}
                                >
                                  ✎
                                </button>

                                <button
                                  onClick={(e) => { e.stopPropagation(); editDeps(task.id); }}
                                  style={BTN_SMALL}
                                  title="Set dependencies"
                                  onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(0.97)"; e.currentTarget.style.borderColor = "#bbb"; e.currentTarget.style.background = "#f2f2f2"; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; e.currentTarget.style.borderColor = "#ccc"; e.currentTarget.style.background = "#fafafa"; }}
                                >
                                  ⛓
                                </button>
                              </div>

                              {/* Centered description snippet */}
                              {task.description && (
                                <div style={DESC_SNIPPET_WRAP}>
                                  <div style={DESC_SNIPPET} title={task.description}>
                                    {trim(task.description, 100)}
                                  </div>
                                </div>
                              )}

                              <DepChips task={task} />
                            </div>
                          );
                        })}
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

      {/* EDIT Modal (create/edit) */}
      {isModalOpen && (
        <>
          <div onClick={closeModals} style={BACKDROP} />
          <div role="dialog" aria-modal="true" style={MODAL}>
            <h3 style={MODAL_TITLE}>{modalMode === "create" ? "Add task details" : "Edit task"}</h3>

            <div style={MODAL_FIELD}>
              <label style={MODAL_LABEL}>Task</label>
              <input value={pendingText} onChange={(e) => setPendingText(e.target.value)} style={MODAL_INPUT} />
            </div>

            <div style={MODAL_FIELD}>
              <label style={MODAL_LABEL}>Description</label>
              <textarea
                value={pendingDescription}
                onChange={(e) => setPendingDescription(e.target.value)}
                style={MODAL_TEXTAREA}
                placeholder="Describe the task..."
              />
            </div>

            <div style={MODAL_FIELD}>
              <label style={MODAL_LABEL}>Deadline</label>
              <input
                type="date"
                value={pendingDeadline}
                onChange={(e) => setPendingDeadline(e.target.value)}
                style={MODAL_INPUT}
              />
            </div>

            <div style={MODAL_FIELD}>
              <label style={MODAL_LABEL}>Priority</label>
              <select
                value={pendingPriority}
                onChange={(e) => setPendingPriority(e.target.value)}
                style={MODAL_INPUT}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div style={MODAL_ACTIONS}>
              <button
                onClick={closeModals}
                style={MODAL_BTN_CANCEL}
                onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.97)")}
                onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
              >
                Cancel
              </button>

              {modalMode === "create" ? (
                <button
                  onClick={saveNewTask}
                  style={MODAL_BTN_SAVE}
                  onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.95)")}
                  onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={saveEditTask}
                  style={MODAL_BTN_SAVE}
                  onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.95)")}
                  onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
                >
                  Update
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* INFO Modal (read-focused, separate from edit) */}
      {isInfoOpen && infoTaskId && (
        <>
          <div onClick={closeModals} style={BACKDROP} />
          <div role="dialog" aria-modal="true" style={MODAL}>
            <h3 style={MODAL_TITLE}>Task info</h3>

            <div style={{ ...MODAL_FIELD, marginTop: -6 }}>
              <label style={MODAL_LABEL}>Task</label>
              <div>{byId(infoTaskId)?.text}</div>
            </div>

            <div style={MODAL_FIELD}>
              <label style={MODAL_LABEL}>Description</label>
              <div style={{ whiteSpace: "pre-wrap" }}>{byId(infoTaskId)?.description || "—"}</div>
            </div>

            <div style={MODAL_FIELD}>
              <label style={MODAL_LABEL}>Deadline</label>
              <div>{byId(infoTaskId)?.deadline || "—"}</div>
            </div>

            <div style={MODAL_FIELD}>
              <label style={MODAL_LABEL}>Priority</label>
              <div>{byId(infoTaskId)?.priority || "—"}</div>
            </div>

            {byId(infoTaskId)?.dependsOn?.length > 0 && (
              <div style={MODAL_FIELD}>
                <label style={MODAL_LABEL}>Depends on</label>
                <div>
                  {byId(infoTaskId).dependsOn.map((did) => (
                    <span key={did} style={{ ...CHIP, marginRight: 6 }}>
                      {byId(did)?.text ?? did}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={MODAL_ACTIONS}>
              <button
                onClick={closeModals}
                style={MODAL_BTN_CANCEL}
                onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.97)")}
                onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
