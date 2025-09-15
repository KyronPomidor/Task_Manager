import { useMemo, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useDndContext } from "@dnd-kit/core";

/* ========= Colors and basic styles for sidebar ========= */
const COLORS = {
  blue: "#2563eb",
  blueText: "#ffffff",
  rowHover: "#f3f4f6",
  rowBorder: "#e5e7eb",
  bg: "#ffffff",
  sidebarBorder: "#e5e7eb",
  actionBg: "#f3f4f6",
  actionHover: "#e5e7eb",
  gray: "#ececec",
  groupBg: "#f6f7f9",
};

const STYLES = {
  sidebar: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "15vw",
    minWidth: 240,
    background: COLORS.bg,
    borderRight: `1px solid ${COLORS.sidebarBorder}`,
    boxSizing: "border-box",
  },
  list: { flex: 1, overflowY: "auto", padding: "8px 0" },
  // Action buttons shown on hover/active
  actionWrap: { display: "flex", alignItems: "center", gap: 6 },
  actionBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    border: `1px solid ${COLORS.rowBorder}`,
    background: COLORS.actionBg,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  addBtn: {
    margin: "10px 12px",
    padding: "10px 12px",
    borderRadius: 8,
    border: "none",
    background: COLORS.gray,
    color: "#111",
    cursor: "pointer",
    fontWeight: 600,
  },
  // Modal styles
  backdrop: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 999 },
  dialog: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "min(92vw, 420px)",
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    padding: 20,
    zIndex: 1000,
  },
  field: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 },
  input: { padding: 10, borderRadius: 8, border: "1px solid #ccc", font: "inherit" },
  select: { padding: 10, borderRadius: 8, border: "1px solid #ccc", font: "inherit", background: "#fff" },
  actions: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 },
  btnCancel: { padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", background: "#fafafa", cursor: "pointer" },
  btnSave: { padding: "8px 12px", borderRadius: 8, border: "none", background: COLORS.blue, color: "#fff", cursor: "pointer", fontWeight: 600 },
};

/* ========= Computes a row's style based on its state ========= */
function getRowStyle({ isActive, level, isShaded, isHovered }) {
  const s = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    padding: "10px 12px",
    paddingLeft: 12 + level * 16, // Indent children
    cursor: "pointer",
    background: "transparent",
    color: "#111827",
    fontWeight: 500,
    borderBottom: `1px solid ${COLORS.rowBorder}`,
  };
  if (isActive) {
    s.background = COLORS.blue;
    s.color = COLORS.blueText;
    s.fontWeight = 600;
  } else if (isShaded) {
    s.background = COLORS.groupBg;
  } else if (isHovered) {
    s.background = COLORS.rowHover;
  }
  return s;
}

/* ========= Renders action buttons (Edit/Delete) for a category row ========= */
function Actions({ onEdit, onDelete }) {
  return (
    // Container for action buttons
    <div style={STYLES.actionWrap} onClick={(e) => e.stopPropagation()}>
      <button
        style={STYLES.actionBtn}
        title="Edit"
        onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.actionHover)}
        onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.actionBg)}
        onClick={onEdit}
      >
        ✎
      </button>
      <button
        style={STYLES.actionBtn}
        title="Delete"
        onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.actionHover)}
        onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.actionBg)}
        onClick={onDelete}
      >
        🗑
      </button>
    </div>
  );
}

/* ========= Renders a single category row ========= */
function Row({
  label,
  level,
  isActive,
  isShaded,
  showActions,
  onClick,
  onEdit,
  onDelete,
  showGroupBar,
  onMouseEnter,
  onMouseLeave,
  isInbox = false,
  extraStyle = {},
}) {
  return (
    // Category row with hover and active styles
    <div
      style={{ ...getRowStyle({ isActive, level, isShaded, isHovered: showActions && !isActive }), ...extraStyle }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Visual indicator for shaded (descendant) categories */}
      {showGroupBar && (
        <div
          style={{
            position: "absolute",
            left: 12 + Math.max(0, (level - 1) * 16),
            top: 0,
            bottom: 0,
            width: 3,
            background: "#e2e8f0",
            borderRadius: 2,
          }}
        />
      )}
      <span title={label} style={{ position: "relative", zIndex: 1 }}>
        {label}
      </span>
      {!isInbox && (showActions || isActive) && <Actions onEdit={onEdit} onDelete={onDelete} />}
    </div>
  );
}

/* ========= Droppable wrapper for a category row to accept dragged tasks ========= */
function DroppableRow({ categoryId, children, isEnabled }) {
  // Set up droppable properties
  const { setNodeRef, isOver } = useDroppable({
    id: `category:${categoryId}`,
    disabled: !isEnabled,
  });

  // Apply visual feedback when a task is dragged over
  const style = isOver
    ? { outline: "2px dashed #2563eb", outlineOffset: -2, borderRadius: 6 }
    : undefined;

  return (
    // Div wrapper for droppable functionality
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}

/* ========= Main SideBar component for managing categories ========= */
export function SideBar({
  categories = [], // List of categories
  selectedCategory = "inbox", // Currently selected category
  onCategorySelect, // Callback to handle category selection
  setCategories, // Function to update categories
  droppableCategoryIds = new Set(["inbox"]), // IDs of droppable categories
  hoveredCategory = null
}) {
  // State for hover and modal interactions
  const [hoverId, setHoverId] = useState(null); // ID of category being hovered
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [mode, setMode] = useState("add"); // Modal mode: "add" or "edit"
  const [editingId, setEditingId] = useState(null); // ID of category being edited
  const [name, setName] = useState(""); // Category name in modal
  const [parentId, setParentId] = useState(""); // Parent category ID in modal
  const { active } = useDndContext();
  const isDragging = !!active;

  // Build a map of parent-to-children categories for tree rendering
  const childrenByParent = useMemo(() => {
    const map = new Map();
    categories.forEach((c) => {
      const key = c.parentId ?? null;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(c);
    });
    for (const list of map.values()) list.sort((a, b) => a.name.localeCompare(b.name));
    return map;
  }, [categories]);

  // Check if nodeId is a descendant of ancestorId
  function isDescendant(nodeId, ancestorId) {
    if (!ancestorId || ancestorId === "inbox") return false;
    let current = categories.find((c) => c.id === nodeId)?.parentId ?? null;
    while (current) {
      if (current === ancestorId) return true;
      current = categories.find((c) => c.id === current)?.parentId ?? null;
    }
    return false;
  }

  // Recursively render category tree
  function renderTree(parent, level = 0) {
    const items = childrenByParent.get(parent ?? null) || [];
    return items.map((cat) => {
      const isActive = selectedCategory === cat.id;
      const isShaded = isDescendant(cat.id, selectedCategory);
      const showActions = hoverId === cat.id;

      return (
        // Category and its children
        <div key={cat.id}>
          <DroppableRow
            categoryId={cat.id}
            isEnabled={droppableCategoryIds.has(cat.id)}
          >
            <Row
              label={cat.name}
              level={level}
              isActive={hoveredCategory === cat.id || selectedCategory === cat.id}
              isShaded={isShaded}
              showActions={showActions}
              onClick={() => onCategorySelect(cat.id)}
              onEdit={() => openEdit(cat)}
              onDelete={() => removeCategory(cat.id)}
              showGroupBar={isShaded}
              onMouseEnter={() => {
                if (!isDragging) setHoverId(cat.id);   // only when not dragging
              }}
              onMouseLeave={() => {
                if (!isDragging) setHoverId(null);    // only when not dragging
              }}
            />
          </DroppableRow>
          {renderTree(cat.id, level + 1)}
        </div>
      );
    });
  }

  // Open modal for adding a new category
  function openAdd() {
    setMode("add");
    setEditingId(null);
    setName("");
    setParentId("");
    setIsModalOpen(true);
    document.body.classList.add("no-scroll");
  }

  // Open modal for editing an existing category
  function openEdit(cat) {
    setMode("edit");
    setEditingId(cat.id);
    setName(cat.name);
    setParentId(cat.parentId || "");
    setIsModalOpen(true);
    document.body.classList.add("no-scroll");
  }

  // Close the add/edit modal
  function closeModal() {
    setIsModalOpen(false);
    document.body.classList.remove("no-scroll");
  }

  // Save a new or edited category
  function saveCategory() {
    const trimmed = name.trim();
    if (!trimmed) {
      alert("Category name is required.");
      return;
    }
    if (mode === "edit") {
      if (parentId && parentId === editingId) {
        alert("A category cannot be its own parent.");
        return;
      }
      setCategories((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, name: trimmed, parentId: parentId || null } : c))
      );
    } else {
      const newCat = { id: Date.now().toString(), name: trimmed, parentId: parentId || null };
      setCategories((prev) => [...prev, newCat]);
    }
    closeModal();
  }

  // Remove a category and its direct children
  function removeCategory(id) {
    const target = categories.find((c) => c.id === id);
    if (!target) return;
    if (!window.confirm(`Delete category "${target.name}"?`)) return;

    setCategories((prev) => prev.filter((c) => c.id !== id && c.parentId !== id));
    if (selectedCategory === id) onCategorySelect("inbox");
  }

  // Filter parent choices for modal, excluding the category being edited
  const parentChoices = useMemo(
    () => categories.filter((c) => (mode === "edit" ? c.id !== editingId : true)),
    [categories, mode, editingId]
  );

  return (
    // Sidebar container
    <div style={STYLES.sidebar}>
      {/* List of categories */}
      <div style={STYLES.list}>
        {/* Inbox row (droppable) */}
        <DroppableRow
          categoryId="inbox"
          isEnabled={droppableCategoryIds.has("inbox")}
        >
          <Row
            label="Inbox"
            level={0}
            isActive={selectedCategory === "inbox"}
            isShaded={false}
            showActions={false}
            onClick={() => onCategorySelect("inbox")}
            onEdit={null}
            onDelete={null}
            showGroupBar={false}
            isInbox
            onMouseEnter={() => setHoverId("inbox")}
            onMouseLeave={() => setHoverId(null)}
          />
        </DroppableRow>

        {/* Graphs row (not droppable) */}
        <Row
          label="Graphs"
          level={0}
          isActive={selectedCategory === "graphs"}
          isShaded={false}
          showActions={false}
          onClick={() => onCategorySelect("graphs")}
          onEdit={null}
          onDelete={null}
          showGroupBar={false}
          isInbox
        />

        {/* Render category tree */}
        {renderTree(null, 0)}

        {/* Button to add a new category */}
        <button onClick={openAdd} style={STYLES.addBtn}>+ Add Category</button>
      </div>

      {/* Modal for adding/editing categories */}
      {isModalOpen && (
        <>
          {/* Backdrop for modal */}
          <div onClick={closeModal} style={STYLES.backdrop} />
          {/* Modal dialog */}
          <div role="dialog" aria-modal="true" style={STYLES.dialog}>
            <h3 style={{ margin: "0 0 12px 0" }}>{mode === "edit" ? "Edit Category" : "Add Category"}</h3>

            {/* Category name input */}
            <label style={STYLES.field}>
              <span>
                Category name <span style={{ color: "#b91c1c" }}>*</span>
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name"
                style={STYLES.input}
              />
            </label>

            {/* Parent category selector */}
            <label style={STYLES.field}>
              <span>Parent category</span>
              <select value={parentId} onChange={(e) => setParentId(e.target.value)} style={STYLES.select}>
                <option value="">None</option>
                {parentChoices.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            {/* Modal action buttons */}
            <div style={STYLES.actions}>
              <button onClick={closeModal} style={STYLES.btnCancel}>Cancel</button>
              <button onClick={saveCategory} style={STYLES.btnSave}>Save</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}