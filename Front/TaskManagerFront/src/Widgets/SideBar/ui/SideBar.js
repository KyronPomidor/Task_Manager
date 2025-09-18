// src/Widgets/SideBar.js
import { useMemo, useState, useEffect } from "react";
import { useDroppable, useDndContext } from "@dnd-kit/core";
import subArrow from "./subcategory_arrow.png";
import mainArrow from "./main_arrow.png";
import inboxIcon from "./inbox.png";
import graphsIcon from "./graphs.png";
import binIcon from "./bin.png";

/* ========= Colors ========= */
const COLORS = {
  blue: "#1d4ed8",
  blueText: "#ffffff",
  rowHover: "#f3f4f6",
  rowBorder: "#e5e7eb",
  bg: "#d5d9e4ff",
  sidebarBorder: "#e5e7eb",
  actionBg: "#f3f4f6",
  actionHover: "#e5e7eb",
  gray: "#ececec",
  groupBg: "#f6f7f9",
};

/* ========= Styles ========= */
const STYLES = {
  sidebar: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "15vw",
    minWidth: "220px",
    background: COLORS.bg,
    borderRight: `1px solid ${COLORS.sidebarBorder}`,
    boxSizing: "border-box",
  },
  list: { flex: 1, overflowY: "auto", padding: "8px 0" },
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

/* ========= Row styling ========= */
function getRowStyle({ isActive, level, isShaded, isHovered }) {
  const s = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    padding: "10px 12px",
    paddingLeft: 12 + level * 16,
    cursor: "pointer",
    background: "transparent",
    color: "#111827",
    fontWeight: 500,
    borderBottom: `1px solid ${COLORS.rowBorder}`,
    userSelect: "none",
    transition: "background 0.15s",
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

/* ========= Small action buttons ========= */
function Actions({ onEdit, onDelete }) {
  return (
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
        <img src={binIcon} alt="delete" style={{ width: 14, height: 14 }} />
      </button>
    </div>
  );
}

/* ========= Row ========= */
function Row({
  id,
  label,
  level,
  isActive,
  isShaded,
  showActions,
  onClick,
  onEdit,
  onDelete,
  onToggle,
  collapsed,
  isParent,
  onMouseEnter,
  onMouseLeave,
  isInbox = false,
  isGraphs = false,
}) {
  const arrowIcon = isInbox || isGraphs ? null : isParent ? mainArrow : subArrow;
  const specialIcon = isInbox ? inboxIcon : isGraphs ? graphsIcon : null;

  return (
    <div
      style={getRowStyle({ isActive, level, isShaded, isHovered: !isActive && showActions })}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {specialIcon && <img src={specialIcon} alt="icon" style={{ width: 20, height: 20 }} />}
        {arrowIcon && (
          <img
            src={arrowIcon}
            alt="arrow"
            onClick={(e) => {
              if (isParent && level === 0) {   // only rotate/toggle for parent (mainArrow)
                e.stopPropagation();
                onToggle?.();
              }
            }}
            style={{
              width: 14,
              height: 14,
              cursor: isParent && level === 0 ? "pointer" : "default",
              transform: isParent && level === 0 && collapsed ? "rotate(-90deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
              filter: isActive ? "invert(1)" : "none",
            }}
          />
        )}
        {label}
      </span>
      {!isInbox && !isGraphs && (showActions || isActive) && (
        <Actions onEdit={onEdit} onDelete={onDelete} />
      )}
    </div>
  );
}

/* ========= Droppable wrapper ========= */
function DroppableRow({ categoryId, children, isEnabled, onExpand }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `category:${categoryId}`,
    disabled: !isEnabled,
  });

  // Run expansion safely after render
  useEffect(() => {
    if (isOver && onExpand) {
      onExpand();
    }
  }, [isOver, onExpand]);

  const style = isOver
    ? { outline: "2px dashed #2563eb", outlineOffset: -2, borderRadius: 6 }
    : undefined;

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}


/* ========= Sidebar ========= */
export function SideBar({
  categories = [],
  selectedCategory = "inbox",
  onCategorySelect,
  setCategories,
  droppableCategoryIds = new Set(),
  hoveredCategory = null,
}) {
  const [hoverId, setHoverId] = useState(null);
  const [collapsedIds, setCollapsedIds] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const { active } = useDndContext();
  const isDragging = !!active;

  const childrenByParent = useMemo(() => {
    const map = new Map();
    categories.forEach((cat) => {
      const parent = cat.parentId ?? null;
      if (!map.has(parent)) map.set(parent, []);
      map.get(parent).push(cat);
    });
    return map;
  }, [categories]);

  function isDescendant(nodeId, ancestorId) {
    if (nodeId === ancestorId) return false;
    let current = categories.find((c) => c.id === nodeId)?.parentId ?? null;
    while (current) {
      if (current === ancestorId) return true;
      current = categories.find((c) => c.id === current)?.parentId ?? null;
    }
    return false;
  }

  function toggleCollapse(id) {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function renderTree(parent, level = 0) {
    const items = (childrenByParent.get(parent ?? null) || []).filter(
      (cat) => cat.id !== "inbox" && cat.id !== "graphs"
    );
    return items.map((cat) => {
      const isActive = hoveredCategory === cat.id || selectedCategory === cat.id;
      const isShaded = selectedCategory && isDescendant(cat.id, selectedCategory);
      const showActions = hoverId === cat.id;
      const isParent = (childrenByParent.get(cat.id) || []).length > 0;
      const collapsed = collapsedIds.has(cat.id);

      return (
        <div key={cat.id}>
          <DroppableRow
            categoryId={cat.id}
            isEnabled={droppableCategoryIds.has(cat.id)}
            onExpand={() => {
              if (collapsed) toggleCollapse(cat.id);
            }}
          >
            <Row
              id={cat.id}
              label={cat.name}
              level={level}
              isActive={isActive}
              isShaded={isShaded}
              showActions={showActions}
              isParent={isParent}
              collapsed={collapsed}
              onClick={() => onCategorySelect(cat.id)}
              onToggle={() => toggleCollapse(cat.id)}
              onEdit={() => openEdit(cat)}
              onDelete={() => removeCategory(cat.id)}
              onMouseEnter={() => !isDragging && setHoverId(cat.id)}
              onMouseLeave={() => !isDragging && setHoverId(null)}
            />
          </DroppableRow>
          {!collapsed && renderTree(cat.id, level + 1)}
        </div>
      );
    });
  }

  /* ====== Modal handling ====== */
  function openAdd() {
    setMode("add");
    setEditingId(null);
    setName("");
    setParentId("");
    setIsModalOpen(true);
    document.body.classList.add("no-scroll");
  }

  function openEdit(cat) {
    setMode("edit");
    setEditingId(cat.id);
    setName(cat.name);
    setParentId(cat.parentId || "");
    setIsModalOpen(true);
    document.body.classList.add("no-scroll");
  }

  function closeModal() {
    setIsModalOpen(false);
    document.body.classList.remove("no-scroll");
  }

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
        prev.map((c) =>
          c.id === editingId ? { ...c, name: trimmed, parentId: parentId || null } : c
        )
      );
    } else {
      const newCat = { id: Date.now().toString(), name: trimmed, parentId: parentId || null };
      setCategories((prev) => [...prev, newCat]);
    }
    closeModal();
  }

  function removeCategory(id) {
    const target = categories.find((c) => c.id === id);
    if (!target) return;
    if (!window.confirm(`Delete category "${target.name}"?`)) return;
    setCategories((prev) => prev.filter((c) => c.id !== id && c.parentId !== id));
    if (selectedCategory === id) onCategorySelect("inbox");
  }

  const parentChoices = useMemo(
    () => categories.filter((c) => (mode === "edit" ? c.id !== editingId : true)),
    [categories, mode, editingId]
  );

  return (
    <div style={STYLES.sidebar}>
      <div style={STYLES.list}>
        {/* Inbox */}
        <DroppableRow categoryId="inbox" isEnabled={droppableCategoryIds.has("inbox")}>
          <Row
            id="inbox"
            label="Inbox"
            level={0}
            isActive={hoveredCategory === "inbox" || selectedCategory === "inbox"}
            isInbox
            onClick={() => onCategorySelect("inbox")}
            onMouseEnter={() => !isDragging && setHoverId("inbox")}
            onMouseLeave={() => !isDragging && setHoverId(null)}
          />
        </DroppableRow>

        {/* Graphs */}
        <DroppableRow categoryId="graphs" isEnabled={droppableCategoryIds.has("graphs")}>
          <Row
            id="graphs"
            label="Graphs"
            level={0}
            isActive={hoveredCategory === "graphs" || selectedCategory === "graphs"}
            isGraphs
            onClick={() => onCategorySelect("graphs")}
            onMouseEnter={() => !isDragging && setHoverId("graphs")}
            onMouseLeave={() => !isDragging && setHoverId(null)}
          />
        </DroppableRow>

        {/* Other categories */}
        <div style={{ marginTop: 40 }}>{renderTree(null, 0)}</div>

        <button onClick={openAdd} style={STYLES.addBtn}>
          + Add Category
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <>
          <div onClick={closeModal} style={STYLES.backdrop} />
          <div role="dialog" aria-modal="true" style={STYLES.dialog}>
            <h3 style={{ margin: "0 0 12px 0" }}>
              {mode === "edit" ? "Edit Category" : "Add Category"}
            </h3>
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
            <label style={STYLES.field}>
              <span>Parent category</span>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                style={STYLES.select}
              >
                <option value="">None</option>
                {parentChoices.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <div style={STYLES.actions}>
              <button onClick={closeModal} style={STYLES.btnCancel}>
                Cancel
              </button>
              <button onClick={saveCategory} style={STYLES.btnSave}>
                Save
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
