import { useMemo, useState, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import subArrow from "./subcategory_arrow.png";
import mainArrow from "./main_arrow.png";
import inboxIcon from "./inbox.png";
import graphsIcon from "./graphs.png";
import checkIcon from "./checked.png";
import binIcon from "./bin.png";
import todayIcon from "./calendar.png";
import searchIcon from "./search.png";
import logo from "./logo.png";

/* ========= Styles ========= */
const STYLES = {
  sidebar: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "15vw",
    minWidth: "220px",
    borderRight: "1px solid", // Color will be set dynamically
    boxSizing: "border-box",
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 0",
    borderBottom: "1px solid", // Color will be set dynamically
  },
  list: { flex: 1, overflowY: "auto", padding: "8px 0" },
  inputInline: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    font: "inherit",
  },
  actionWrap: { display: "flex", alignItems: "center", gap: 6 },
  actionBtn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    border: "1px solid", // Color will be set dynamically
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
    cursor: "pointer",
    fontWeight: 600,
  },
  backdrop: { position: "fixed", inset: 0, zIndex: 999 },
  dialog: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "min(92vw, 420px)",
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
  btnSave: { padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600 },
  iconWrapper: { // Consistent icon/arrow alignment
    width: 20,
    height: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  categoryHeader: { // Updated for left alignment and 10px top margin
    paddingTop: 10,
    paddingBottom: 0,
    paddingLeft: 12, // Matches top-level category padding
    color: "#4d5156ff", // Darker gray
    fontWeight: 600,
    margin: "50px 8px 0 8px", // 10px margin top, matching category margin on sides
  },
};

/* ========= Row styling ========= */
function getRowStyle({ isActive, level, isShaded, isHovered, colors }) {
  const s = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    padding: "10px 12px",
    paddingLeft: 12 + level * 16,
    margin: "0 8px", // Prevent touching sidebar borders
    cursor: "pointer",
    background: "transparent",
    color: "#111827",
    fontWeight: 500,
    borderBottom: `1px solid ${colors.rowBorder}`,
    userSelect: "none",
    transition: "background 0.15s",
    borderRadius: isActive || isHovered ? 6 : 0, // Rounded corners for hover/active
  };
  if (isActive) {
    s.background = colors.blue;
    s.color = "#111827"; // Keep text black for active state
    s.fontWeight = 600;
  } else if (isShaded) {
    s.background = colors.groupBg;
  } else if (isHovered) {
    s.background = colors.rowHover;
  }
  return s;
}

/* ========= Small action buttons ========= */
function Actions({ onEdit, onDelete, colors }) {
  return (
    <div style={STYLES.actionWrap} onClick={(e) => e.stopPropagation()}>
      <button
        style={{ ...STYLES.actionBtn, borderColor: colors.rowBorder, background: colors.actionBg }}
        title="Edit"
        onMouseEnter={(e) => (e.currentTarget.style.background = colors.actionHover)}
        onMouseLeave={(e) => (e.currentTarget.style.background = colors.actionBg)}
        onClick={onEdit}
      >
        ✎
      </button>
      <button
        style={{ ...STYLES.actionBtn, borderColor: colors.rowBorder, background: colors.actionBg }}
        title="Delete"
        onMouseEnter={(e) => (e.currentTarget.style.background = colors.actionHover)}
        onMouseLeave={(e) => (e.currentTarget.style.background = colors.actionBg)}
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
  icon = null,
  count = 0,
  customContent = null,
  colors,
}) {
  const arrowIcon = !icon ? (isParent ? mainArrow : subArrow) : null;
  const isSystemCategory =
    id === "inbox" || id === "today" || id === "graphs" || id === "search" || id === "done";

  return (
    <div
      style={getRowStyle({ isActive, level, isShaded, isHovered: !isActive && showActions, colors })}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
        {icon && (
          <div style={STYLES.iconWrapper}>
            <img src={icon} alt="icon" style={{ width: 20, height: 20 }} />
          </div>
        )}
        {arrowIcon && (
          <div style={STYLES.iconWrapper}>
            <img
              src={arrowIcon}
              alt="arrow"
              onClick={(e) => {
                if (isParent && level === 0) {
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
                filter: "none", // No invert filter since text is black
              }}
            />
          </div>
        )}
        {customContent || label}
      </span>

      {!isSystemCategory && (showActions || isActive) && (
        <Actions onEdit={onEdit} onDelete={onDelete} colors={colors} />
      )}

      {count > 0 && (
        <span style={{ fontSize: "0.85rem", fontWeight: 600, opacity: 0.7, flexShrink: 0 }}>
          {count}
        </span>
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

  useEffect(() => {
    if (isOver && onExpand) {
      onExpand();
    }
  }, [isOver, onExpand]);

  const style = isOver ? { background: "#e0e7ff", borderRadius: 6, margin: "0 8px" } : { margin: "0 8px" };

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
  tasks = [],
  setTasks,
  searchText,
  setSearchText,
}) {
  const [hoverId, setHoverId] = useState(null);
  const [collapsedIds, setCollapsedIds] = useState(new Set());
  const [searchOpen, setSearchOpen] = useState(false);

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");

  const childrenByParent = useMemo(() => {
    const map = new Map();
    categories.forEach((cat) => {
      const parent = cat.parentId ?? null;
      if (!map.has(parent)) map.set(parent, []);
      map.get(parent).push(cat);
    });
    return map;
  }, [categories]);

  function getTaskCount(categoryId) {
    if (categoryId === "today") {
      const todayStr = new Date().toISOString().split("T")[0];
      return tasks.filter((t) => t.deadline === todayStr && !t.completed).length;
    }
    if (categoryId === "done") {
      return tasks.filter((t) => t.completed).length;
    }
    return tasks.filter((t) => t.categoryId === categoryId && !t.completed).length;
  }

  function toggleCollapse(id) {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function openAdd() {
    setMode("add");
    setEditingId(null);
    setName("");
    setParentId("");
    setIsModalOpen(true);
  }

  function openEdit(cat) {
    setMode("edit");
    setEditingId(cat.id);
    setName(cat.name);
    setParentId(cat.parentId || "");
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function saveCategory() {
    const trimmed = name.trim();
    if (!trimmed) {
      alert("Category name is required.");
      return;
    }
    if (mode === "edit") {
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
    setTasks((prev) => prev.map((t) => (t.categoryId === id ? { ...t, categoryId: "inbox" } : t)));
    setCategories((prev) => prev.filter((c) => c.id !== id && c.parentId !== id));
    if (selectedCategory === id) onCategorySelect("inbox");
  }

  const parentChoices = useMemo(
    () => categories.filter((c) => (mode === "edit" ? c.id !== editingId : true)),
    [categories, mode, editingId]
  );

  function renderTree(parent, level = 0) {
    const items = (childrenByParent.get(parent ?? null) || []).filter(
      (cat) => cat.id !== "inbox" && cat.id !== "graphs" && cat.id !== "today" && cat.id !== "done"
    );
    return items.map((cat) => {
      const isActive = hoveredCategory === cat.id || selectedCategory === cat.id;
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
              showActions={showActions}
              isParent={isParent}
              collapsed={collapsed}
              onClick={() => onCategorySelect(cat.id)}
              onToggle={() => toggleCollapse(cat.id)}
              onEdit={() => openEdit(cat)}
              onDelete={() => removeCategory(cat.id)}
              onMouseEnter={() => setHoverId(cat.id)}
              onMouseLeave={() => setHoverId(null)}
              count={getTaskCount(cat.id)}
              colors={COLORS}
            />
          </DroppableRow>
          {!collapsed && renderTree(cat.id, level + 1)}
        </div>
      );
    });
  }

  // Define colors before return
  const COLORS = {
    blue: "#60a5fa", // Softer, lighter blue
    blueText: "#ffffff", // Kept for modal Save button
    rowHover: "#d1d5db", // Darker than bg (#e8ecef)
    rowBorder: "#e5e7eb",
    bg: "#e8ecef", // Lighter background, not white
    sidebarBorder: "#e5e7eb",
    actionBg: "#f3f4f6",
    actionHover: "#e5e7eb",
    gray: "#ececec",
    groupBg: "#f6f7f9",
  };

  return (
    <div style={{ ...STYLES.sidebar, background: COLORS.bg, borderRightColor: COLORS.sidebarBorder }}>
      {/* Logo */}
      <div style={{ ...STYLES.logoWrap, borderBottomColor: COLORS.sidebarBorder }}>
        <img src={logo} alt="logo" width={128} height={85} />
      </div>

      <div style={STYLES.list}>
        {/* Search row */}
        <Row
          id="search"
          icon={searchIcon}
          level={0}
          isActive={hoveredCategory === "search" || selectedCategory === "search"}
          showActions={hoverId === "search"}
          onMouseEnter={() => setHoverId("search")}
          onMouseLeave={() => setHoverId(null)}
          onClick={() => {
            if (!searchOpen) setSearchOpen(true);
          }}
          customContent={
            searchOpen ? (
              <input
                autoFocus
                type="text"
                placeholder="Search tasks..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={STYLES.inputInline}
                onBlur={() => {
                  if (!searchText) setSearchOpen(false);
                }}
              />
            ) : (
              "Search"
            )
          }
          colors={COLORS}
        />

        {/* Inbox */}
        <DroppableRow categoryId="inbox" isEnabled={droppableCategoryIds.has("inbox")}>
          <Row
            id="inbox"
            label="Inbox"
            icon={inboxIcon}
            level={0}
            isActive={hoveredCategory === "inbox" || selectedCategory === "inbox"}
            showActions={hoverId === "inbox"}
            onMouseEnter={() => setHoverId("inbox")}
            onMouseLeave={() => setHoverId(null)}
            onClick={() => onCategorySelect("inbox")}
            count={getTaskCount("inbox")}
            colors={COLORS}
          />
        </DroppableRow>

        {/* Today */}
        <DroppableRow categoryId="today" isEnabled={droppableCategoryIds.has("today")}>
          <Row
            id="today"
            label="Today"
            icon={todayIcon}
            level={0}
            isActive={hoveredCategory === "today" || selectedCategory === "today"}
            showActions={hoverId === "today"}
            onMouseEnter={() => setHoverId("today")}
            onMouseLeave={() => setHoverId(null)}
            onClick={() => onCategorySelect("today")}
            count={getTaskCount("today")}
            colors={COLORS}
          />
        </DroppableRow>

        {/* Graphs */}
        <DroppableRow categoryId="graphs" isEnabled={droppableCategoryIds.has("graphs")}>
          <Row
            id="graphs"
            label="Graphs"
            icon={graphsIcon}
            level={0}
            isActive={hoveredCategory === "graphs" || selectedCategory === "graphs"}
            showActions={hoverId === "graphs"}
            onMouseEnter={() => setHoverId("graphs")}
            onMouseLeave={() => setHoverId(null)}
            onClick={() => onCategorySelect("graphs")}
            colors={COLORS}
          />
        </DroppableRow>

        {/* Done */}
        <Row
          id="done"
          label="Done"
          icon={checkIcon}
          level={0}
          isActive={hoveredCategory === "done" || selectedCategory === "done"}
          showActions={hoverId === "done"}
          onMouseEnter={() => setHoverId("done")}
          onMouseLeave={() => setHoverId(null)}
          onClick={() => onCategorySelect("done")}
          count={getTaskCount("done")}
          colors={COLORS}
        />

        {/* My Categories header */}
        <div style={STYLES.categoryHeader}>My Categories</div>

        {/* Other categories */}
        {renderTree(null, 0)}

        <button
          onClick={openAdd}
          style={{ ...STYLES.addBtn, background: "transparent", color: "#111827" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.rowHover)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          + Add Category
        </button>
      </div>

      {isModalOpen && (
        <>
          <div onClick={closeModal} style={{ ...STYLES.backdrop, background: "rgba(0,0,0,0.45)" }} />
          <div role="dialog" aria-modal="true" style={{ ...STYLES.dialog, background: "#fff" }}>
            <h3>{mode === "edit" ? "Edit Category" : "Add Category"}</h3>
            <label style={STYLES.field}>
              <span>Category name *</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              <button
                onClick={saveCategory}
                style={{ ...STYLES.btnSave, background: COLORS.blue, color: COLORS.blueText }}
              >
                Save
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}