import "../Tasks.css";
import { useEffect, useMemo, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export function Tasks({ categories, selectedCategory }) {
  /* ========== Styles ========== */
  const CONTAINER = { padding: 20 };

  const COMPOSER_ROW = { display: "flex", gap: 10, marginBottom: 20 };
  const COMPOSER_INPUT = { flex: 1, padding: 8, borderRadius: 5, border: "1px solid #ccc" };
  const COMPOSER_BTN = { padding: "8px 12px", borderRadius: 5, border: "none", background: "#2563eb", cursor: "pointer", color: "white", transition: "filter 0.15s" };

  const LIST = { listStyle: "none", padding: 0, margin: 0 };

  const ITEM = (completed, blocked, hovered, level = 0) => ({
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginBottom: 10,
    background: hovered ? (completed ? "#e9e9e9" : "#f7f7f7") : completed ? "#f0f0f0" : "#fff",
    padding: 10,
    borderRadius: 8,
    boxShadow: hovered ? "0 6px 16px rgba(0,0,0,0.18)" : "0 2px 4px rgba(0,0,0,0.1)",
    transition: "box-shadow 0.15s, transform 0.15s, background 0.15s",
    transform: hovered ? "translateY(-1px)" : "none",
    borderLeft: blocked ? "4px solid #2563eb" : "4px solid transparent",
    marginLeft: level > 0 ? level * 16 : 0,
    cursor: "pointer",
  });

  const ROW = { display: "flex", alignItems: "center" };
  const CHECKBOX = { marginRight: 10, width: 18, height: 18, accentColor: "#2563eb", cursor: "pointer" };

  const TITLE = {
    fontWeight: 600,
    userSelect: "none",
    maxWidth: 180,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    display: "inline-block",
    verticalAlign: "bottom",
  };
  const TEXT = (completed) => ({
    flex: 1,
    textDecoration: completed ? "line-through" : "none",
    color: completed ? "#888" : "#000",
    display: "flex",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  });

  const DESC_SNIPPET_WRAP = { display: "flex", justifyContent: "center" };
  const DESC_SNIPPET = { maxWidth: "95%", marginTop: 6, fontSize: 12, color: "#555", textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };

  const DRAG_HANDLE = { cursor: "grab", padding: "0 8px", fontSize: 18, color: "#665" };
  const DRAG_HANDLE_DISABLED = { ...DRAG_HANDLE, opacity: 0.35, cursor: "not-allowed" };

  const BTN_HIGHLIGHT = (on) => ({
    marginLeft: 10,
    padding: "4px 8px",
    borderRadius: 5,
    border: "1px solid #FFD93D",
    backgroundColor: on ? "#f2d03bff" : "#fff",
    color: on ? "#fff" : "#FFD93D",
    cursor: "pointer",
    boxShadow: on ? "0 0 10px 2px #FFD93D" : "none",
    transition: "filter 0.15s, box-shadow 0.15s, background 0.15s, color 0.15s",
  });
  const BTN_SMALL = { marginLeft: 8, padding: "4px 8px", borderRadius: 5, border: "1px solid #ccc", backgroundColor: "#fafafa", cursor: "pointer", transition: "filter 0.15s, background 0.15s, border-color 0.15s" };

  const CHIP = { marginLeft: 8, padding: "2px 8px", borderRadius: 12, border: "1px solid #e0e0e0", fontSize: 12, whiteSpace: "nowrap" };
  const CHIP_DEADLINE = { color: "white", background: "#2563eb" };
  const CHIP_PRIORITY = (color) => ({ background: "#fff", color, fontWeight: 600 });

  const DEPS_WRAP = { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 };
  const DEP_CHIP = (missing) => ({ padding: "2px 8px", borderRadius: 12, border: "1px solid #e0e0e0", color: "white", background: missing ? "#2563eb" : "#2563eb", fontSize: 12, whiteSpace: "nowrap" });

  const BACKDROP = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)" };
  const MODAL = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "min(92vw, 520px)", background: "#fff", borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.2)", padding: 20, zIndex: 1000 };
  const MODAL_TITLE = { margin: "0 0 12px 0" };
  const MODAL_FIELD = { display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 };
  const MODAL_LABEL = { fontSize: 13, color: "#444" };
  const MODAL_INPUT = { padding: 8, borderRadius: 8, border: "1px solid #ccc", background: "#fff" };
  const MODAL_TEXTAREA = { padding: 8, borderRadius: 8, border: "1px solid #ccc", background: "#fff", minHeight: 100, resize: "vertical" };
  const MODAL_ACTIONS = { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 };
  const MODAL_BTN_CANCEL = { padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", background: "#fafafa", cursor: "pointer", transition: "filter 0.15s" };
  const MODAL_BTN_SAVE = { padding: "8px 12px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", cursor: "pointer", transition: "filter 0.15s" };

  /* ========== State ========== */
  const [tasks, setTasks] = useState([
    { id: "1", text: "First task",  completed: false, highlighted: false, dependsOn: [],       deadline: null,          priority: "Medium", description: "Short description for the first task.", categoryId: "work" },
    { id: "2", text: "Second task", completed: false, highlighted: false, dependsOn: ["1"],    deadline: "2025-09-15",  priority: "High",   description: "Depends on First task, has a deadline.", categoryId: "work" },
    { id: "3", text: "Review PR",   completed: false, highlighted: false, dependsOn: ["1"],    deadline: "2025-09-12",  priority: "High",   description: "Review code after First task is done.", categoryId: "personal" },
    { id: "4", text: "Refactor UI", completed: false, highlighted: false, dependsOn: ["3"],    deadline: null,          priority: "Low",    description: "Nested child of Review PR with a longer description to demonstrate trimming in the card preview.", categoryId: "personal" },
  ]);
  const [newTask, setNewTask] = useState("");
  const [hoveredId, setHoveredId] = useState(null);

  // Edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit'
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [pendingText, setPendingText] = useState("");
  const [pendingDeadline, setPendingDeadline] = useState("");
  const [pendingPriority, setPendingPriority] = useState("Medium");
  const [pendingDescription, setPendingDescription] = useState("");
  const [pendingCategoryId, setPendingCategoryId] = useState("");

  // Info modal
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [infoTaskId, setInfoTaskId] = useState(null);

  // Dependencies picker modal (choose single parent)
  const [isDepsOpen, setIsDepsOpen] = useState(false);
  const [depsTargetId, setDepsTargetId] = useState(null);
  const [depsSelection, setDepsSelection] = useState("");

  // Drag guard
  const [dragging, setDragging] = useState(false);

  /* ========== Helpers (nesting via first dependency) ========== */
  const byId = (id) => tasks.find((t) => t.id === id);
  const parentIdOf = (task) => (task.dependsOn && task.dependsOn.length > 0 ? task.dependsOn[0] : null);

  // FULL children map across all tasks (for cycles & subtree moves)
  const fullChildrenMap = useMemo(() => {
    const map = new Map();
    tasks.forEach((t) => {
      const pid = parentIdOf(t);
      const key = pid ?? null;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(t);
    });
    return map;
  }, [tasks]);

  const fullSubtreeIds = (rootId) => {
    const out = [rootId];
    const visit = (id) => {
      const kids = fullChildrenMap.get(id) || [];
      kids.forEach((k) => {
        out.push(k.id);
        visit(k.id);
      });
    };
    visit(rootId);
    return out;
  };

  /* ========== Visibility & per-view tree building ========== */

  // 1) Start with the set of tasks that should be present in the view
  const visibleTasks = useMemo(() => {
    return selectedCategory === "inbox"
      ? tasks
      : tasks.filter((t) => t.categoryId === selectedCategory);
  }, [tasks, selectedCategory]);

  const visibleIds = useMemo(() => new Set(visibleTasks.map((t) => t.id)), [visibleTasks]);

  // 2) Build a children map for the *view*:
  //    - Inbox: normal nesting (parent can be any task since all are visible)
  //    - Category view: only nest under a parent if that parent is also visible.
  const visibleChildrenMap = useMemo(() => {
    const map = new Map();
    visibleTasks.forEach((t) => {
      const pid = parentIdOf(t);
      // If parent is not visible in this view, treat as root (key = null)
      const key = pid && visibleIds.has(pid) ? pid : null;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(t);
    });
    return map;
  }, [visibleTasks, visibleIds]);

  // 3) Visible roots: either true roots (no parent) or tasks whose parent isn't visible in this view
  const visibleRoots = useMemo(() => visibleChildrenMap.get(null) || [], [visibleChildrenMap]);

  // 4) Render a visible branch (root + all visible descendants)
  const renderVisibleBranch = (node, level = 0) => {
    const nodes = [{ task: node, level }];
    const kids = visibleChildrenMap.get(node.id) || [];
    kids.forEach((child) => nodes.push(...renderVisibleBranch(child, level + 1)));
    return nodes;
  };

  // 5) Helpers using full map (for cycles / completion)
  const descendantIds = (rootId) => {
    const result = new Set();
    const visit = (id) => {
      const kids = fullChildrenMap.get(id) || [];
      kids.forEach((k) => {
        result.add(k.id);
        visit(k.id);
      });
    };
    visit(rootId);
    return result;
  };

  const unmetDeps = (task) => (task.dependsOn || []).filter((did) => !byId(did)?.completed);
  const canComplete = (task) => unmetDeps(task).length === 0;
  const priorityColor = (p) => (p === "High" ? "#e74c3c" : p === "Low" ? "#6c757d" : "#0d6efd");
  const CHIP_PRI = (p) => ({ ...CHIP, ...CHIP_PRIORITY(priorityColor(p)) });
  const trim = (s, max = 100) => (!s ? "" : s.length > max ? s.slice(0, max) + "..." : s);

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
    setPendingCategoryId(selectedCategory !== "inbox" ? selectedCategory : "");
    setIsModalOpen(true);
  };

  const saveNewTask = () => {
    if (!pendingCategoryId) {
      alert("Please select a category for the task.");
      return;
    }
    const item = {
      id: Date.now().toString(),
      text: pendingText,
      completed: false,
      highlighted: false,
      dependsOn: [],
      deadline: pendingDeadline || null,
      priority: pendingPriority || "Medium",
      description: pendingDescription || "",
      categoryId: pendingCategoryId,
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
    setPendingCategoryId(t.categoryId || "");
    setIsModalOpen(true);
  };

  const openInfo = (taskId) => {
    if (dragging) return;
    setInfoTaskId(taskId);
    setIsInfoOpen(true);
  };

  const saveEditTask = () => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === editingTaskId
          ? {
              ...t,
              text: pendingText,
              deadline: pendingDeadline || null,
              priority: pendingPriority || "Medium",
              description: pendingDescription || "",
              categoryId: pendingCategoryId,
            }
          : t
      )
    );
    setIsModalOpen(false);
    setEditingTaskId(null);
  };

  const closeModals = () => {
    setIsModalOpen(false);
    setIsInfoOpen(false);
    setIsDepsOpen(false);
    setEditingTaskId(null);
    setInfoTaskId(null);
    setDepsTargetId(null);
    setDepsSelection("");
  };

  useEffect(() => {
    const anyOpen = isModalOpen || isInfoOpen || isDepsOpen;
    if (!anyOpen) return;
    const onKeyDown = (e) => e.key === "Escape" && closeModals();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isModalOpen, isInfoOpen, isDepsOpen]);

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
        if (dependents.length > 0 && !window.confirm(
          `This task is a dependency for ${dependents.length} completed task(s).\n` +
          `Marking it incomplete may make those tasks inconsistent.\nProceed anyway?`
        )) return prev;
      }
      return prev.map((x) => (x.id === id ? { ...x, completed: !x.completed } : x));
    });
  };

  const toggleHighlight = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, highlighted: !t.highlighted } : t)));
  };

  /* ===== Dependencies modal (single visual parent) ===== */
  const openDepsModal = (taskId) => {
    const t = byId(taskId);
    if (!t) return;
    setDepsTargetId(taskId);
    setDepsSelection(parentIdOf(t) || "");
    setIsDepsOpen(true);
  };

  const applyDepsSelection = () => {
    const targetId = depsTargetId;
    if (!targetId) return;

    const forbidden = new Set(descendantIds(targetId));
    forbidden.add(targetId); // disallow self and descendants

    if (depsSelection && forbidden.has(depsSelection)) {
      window.alert("Invalid parent: cannot select the task itself or any of its descendants.");
      return;
    }
    setTasks((prev) =>
      prev.map((t) => (t.id === targetId ? { ...t, dependsOn: depsSelection ? [depsSelection] : [] } : t))
    );
    closeModals();
  };

  /* ========== Drag & drop (visible roots only; combine to parent) ========== */
  const handleDragStart = () => setDragging(true);

  const handleDragEnd = (result) => {
    setDragging(false);
    const { destination, draggableId, combine } = result;

    // Drag onto another card to set parent (only for roots)
    if (combine) {
      const dragged = byId(draggableId);
      if (!dragged || parentIdOf(dragged) !== null) return;
      const targetId = combine.draggableId;
      if (!targetId || targetId === draggableId) return;

      const forbidden = new Set(fullSubtreeIds(dragged.id));
      if (forbidden.has(targetId)) return; // cycle protection

      setTasks((prev) => prev.map((t) => (t.id === dragged.id ? { ...t, dependsOn: [targetId] } : t)));
      return;
    }

    if (!destination) return;

    // Reorder among *visible* roots; move FULL subtrees together
    const draggedRoot = byId(draggableId);
    if (!draggedRoot || parentIdOf(draggedRoot) !== null) return;

    const visRootIds = visibleRoots.map((r) => r.id);
    const fromIndex = visRootIds.indexOf(draggableId);
    const toIndex = destination.index;
    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

    setTasks((prev) => {
      // Build block for each visible root using FULL subtree ids
      const blockByRoot = new Map();
      visRootIds.forEach((rid) => {
        const ids = new Set(fullSubtreeIds(rid));
        const block = prev.filter((t) => ids.has(t.id));
        blockByRoot.set(rid, block);
      });

      // New visible roots order
      const newVisOrder = [...visRootIds];
      newVisOrder.splice(toIndex, 0, newVisOrder.splice(fromIndex, 1)[0]);

      // Rebuild entire list: reordered visible blocks first, then everything else unchanged
      const allVisibleIds = new Set(newVisOrder.flatMap((rid) => fullSubtreeIds(rid)));
      const invisible = prev.filter((t) => !allVisibleIds.has(t.id));
      const reorderedVisible = newVisOrder.flatMap((rid) => blockByRoot.get(rid) || []);
      return [...reorderedVisible, ...invisible];
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
        <Droppable droppableId="roots" isCombineEnabled>
          {(provided) => (
            <ul ref={provided.innerRef} {...provided.droppableProps} style={LIST}>
              {visibleRoots.map((rootTask, rootIndex) => {
                const branch = renderVisibleBranch(rootTask, 0);
                const hovered = hoveredId === rootTask.id;

                return (
                  <Draggable key={rootTask.id} draggableId={rootTask.id} index={rootIndex}>
                    {(dragProvided) => (
                      <li ref={dragProvided.innerRef} {...dragProvided.draggableProps} style={{ ...dragProvided.draggableProps.style }}>
                        {/* Root card */}
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

                            <span style={TITLE} className="truncate" title={rootTask.text}>
                              {rootTask.text}
                            </span>

                            <span style={TEXT(rootTask.completed)} title={!canComplete(rootTask) ? "Has unmet dependencies" : ""}>
                              <span style={CHIP_PRI(rootTask.priority)}>⬤ {rootTask.priority}</span>
                              {rootTask.deadline && <span style={{ ...CHIP, ...CHIP_DEADLINE }}>📅 {rootTask.deadline}</span>}
                            </span>

                            <span
                              {...dragProvided.dragHandleProps}
                              style={DRAG_HANDLE}
                              title="Drag to reorder subtree or drag onto another task to nest"
                              onClick={(e) => e.stopPropagation()}
                            >
                              ⋮⋮
                            </span>

                            <button
                              onClick={(e) => { e.stopPropagation(); toggleHighlight(rootTask.id); }}
                              style={BTN_HIGHLIGHT(rootTask.highlighted)}
                              title="Highlight"
                              onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.97)")}
                              onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
                            >
                              $
                            </button>

                            <button
                              onClick={(e) => { e.stopPropagation(); openEditTask(rootTask.id); }}
                              style={BTN_SMALL}
                              title="Edit"
                              onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(0.97)"; e.currentTarget.style.borderColor = "#bbb"; e.currentTarget.style.background = "#f2f2f2"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; e.currentTarget.style.borderColor = "#ccc"; e.currentTarget.style.background = "#fafafa"; }}
                            >
                              ✎
                            </button>

                            <button
                              onClick={(e) => { e.stopPropagation(); openDepsModal(rootTask.id); }}
                              style={BTN_SMALL}
                              title="Set parent"
                              onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(0.97)"; e.currentTarget.style.borderColor = "#bbb"; e.currentTarget.style.background = "#f2f2f2"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; e.currentTarget.style.borderColor = "#ccc"; e.currentTarget.style.background = "#fafafa"; }}
                            >
                              ⛓
                            </button>
                          </div>

                          {rootTask.description && (
                            <div style={DESC_SNIPPET_WRAP}>
                              <div style={DESC_SNIPPET} title={rootTask.description}>
                                {trim(rootTask.description, 100)}
                              </div>
                            </div>
                          )}

                          <DepChips task={rootTask} />
                        </div>

                        {/* Children (visible-only nesting) */}
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
                                <span style={DRAG_HANDLE_DISABLED} title="Child task (drag disabled)" onClick={(e) => e.stopPropagation()}>
                                  ⋮⋮
                                </span>

                                <input
                                  type="checkbox"
                                  checked={task.completed}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={() => toggleComplete(task.id)}
                                  style={CHECKBOX}
                                />

                                <span style={TITLE} className="truncate" title={task.text}>
                                  {task.text}
                                </span>

                                <span style={TEXT(task.completed)} title={blocked ? "Has unmet dependencies" : ""}>
                                  <span style={CHIP_PRI(task.priority)}>⬤ {task.priority}</span>
                                  {task.deadline && <span style={{ ...CHIP, ...CHIP_DEADLINE }}>📅 {task.deadline}</span>}
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
                                  title="Edit"
                                  onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(0.97)"; e.currentTarget.style.borderColor = 
                                    "#bbb"; e.currentTarget.style.background = "#f2f2f2"; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; e.currentTarget.style.borderColor = "#ccc"; e.currentTarget.style.background = "#fafafa"; }}
                                >
                                  ✎
                                </button>

                                <button
                                  onClick={(e) => { e.stopPropagation(); openDepsModal(task.id); }}
                                  style={BTN_SMALL}
                                  title="Set parent"
                                  onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(0.97)"; e.currentTarget.style.borderColor = "#bbb"; e.currentTarget.style.background = "#f2f2f2"; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; e.currentTarget.style.borderColor = "#ccc"; e.currentTarget.style.background = "#fafafa"; }}
                                >
                                  ⛓
                                </button>
                              </div>

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

      {/* EDIT Modal */}
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
              <textarea value={pendingDescription} onChange={(e) => setPendingDescription(e.target.value)} style={MODAL_TEXTAREA} placeholder="Describe the task..." />
            </div>

            <div style={MODAL_FIELD}>
              <label style={MODAL_LABEL}>Category <span style={{ color: "#b91c1c" }}>*</span></label>
              <select value={pendingCategoryId} onChange={(e) => setPendingCategoryId(e.target.value)} style={MODAL_INPUT}>
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div style={MODAL_FIELD}>
              <label style={MODAL_LABEL}>Deadline</label>
              <input type="date" value={pendingDeadline} onChange={(e) => setPendingDeadline(e.target.value)} style={MODAL_INPUT} />
            </div>

            <div style={MODAL_FIELD}>
              <label style={MODAL_LABEL}>Priority</label>
              <select value={pendingPriority} onChange={(e) => setPendingPriority(e.target.value)} style={MODAL_INPUT}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div style={MODAL_ACTIONS}>
              <button onClick={closeModals} style={MODAL_BTN_CANCEL} onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.97)")} onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}>
                Cancel
              </button>

              {modalMode === "create" ? (
                <button onClick={saveNewTask} style={MODAL_BTN_SAVE} onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.95)")} onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}>
                  Save
                </button>
              ) : (
                <button onClick={saveEditTask} style={MODAL_BTN_SAVE} onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.95)")} onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}>
                  Update
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* INFO Modal */}
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
              <button onClick={closeModals} style={MODAL_BTN_CANCEL} onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.97)")} onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}>
                Close
              </button>
            </div>
          </div>
        </>
      )}

      {/* DEPS Modal (choose a single parent) */}
      {isDepsOpen && depsTargetId && (
        <>
          <div onClick={closeModals} style={BACKDROP} />
          <div role="dialog" aria-modal="true" style={MODAL}>
            <h3 style={MODAL_TITLE}>Select parent for “{byId(depsTargetId)?.text}”</h3>

            <div style={MODAL_FIELD}>
              <label style={MODAL_LABEL}>Parent</label>
              <div style={{ display: "grid", gap: 8, maxHeight: 300, overflow: "auto", paddingRight: 4 }}>
                {/* None option */}
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="radio" name="parent" checked={depsSelection === ""} onChange={() => setDepsSelection("")} />
                  <span>None (make it a root task)</span>
                </label>

                {/* Task options; disable self + descendants */}
                {tasks.map((t) => {
                  const forbidden = descendantIds(depsTargetId);
                  forbidden.add(depsTargetId);
                  const disabled = forbidden.has(t.id);
                  return (
                    <label key={t.id} style={{ display: "flex", alignItems: "center", gap: 8, opacity: disabled ? 0.4 : 1 }}>
                      <input
                        type="radio"
                        name="parent"
                        disabled={disabled}
                        checked={depsSelection === t.id}
                        onChange={() => setDepsSelection(t.id)}
                      />
                      <span>{t.text}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div style={MODAL_ACTIONS}>
              <button onClick={closeModals} style={MODAL_BTN_CANCEL}>Cancel</button>
              <button onClick={applyDepsSelection} style={MODAL_BTN_SAVE}>Apply</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
