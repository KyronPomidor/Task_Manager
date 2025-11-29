import { useMemo, useState, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import subArrow from "./subcategory_arrow.png";
import mainArrow from "./main_arrow.png";
import categoryIcon from "./category.png";
import inboxIcon from "./inbox.png";
import graphsIcon from "./graphs.png";
import checkIcon from "./checked.png";
import binIcon from "./bin.png";
import todayIcon from "./calendar.png";
import searchIcon from "./search.png";
import editIcon from "./edit.png";
import logo from "./logo.png";

/* ========= Dark-mode aware icon style ========= */
const iconStyle = (isDarkMode, size = 20) => ({
  width: size,
  height: size,
  filter: isDarkMode ? "invert(100%) brightness(200%)" : "none",
  transition: "filter 0.2s ease",
});

/* ========= Styles ========= */
const STYLES = {
  sidebar: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "15vw",
    minWidth: "220px",
    borderRight: "1px solid",
    boxSizing: "border-box",
    fontFamily: "'Roboto', sans-serif",
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 0",
    borderBottom: "1px solid",
  },
  list: { flex: 1, overflowY: "auto", padding: "8px 0" },
  inputInline: {
    flex: 1,
    border: "none",
    outline: "none",
    fontFamily: "'Roboto', sans-serif",
    background: "transparent",
    font: "inherit",
  },
  actionWrap: { display: "flex", alignItems: "center", gap: 6 },
  actionBtn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    border: "1px solid",
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
    fontFamily: "'Roboto', sans-serif",
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
  input: { padding: 10, borderRadius: 8, border: "1px solid", font: "inherit", fontFamily: "'Roboto', sans-serif" },
  select: { padding: 10, borderRadius: 8, border: "1px solid", font: "inherit", background: "#fff", fontFamily: "'Roboto', sans-serif" },
  actions: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 },
  btnCancel: { padding: "8px 12px", borderRadius: 8, border: "1px solid", background: "#fafafa", cursor: "pointer" },
  btnSave: { padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600 },
  iconWrapper: {
    width: 20,
    height: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  categoryHeader: {
    paddingTop: 10,
    paddingBottom: 0,
    paddingLeft: 12,
    color: "#4d5156ff",
    fontWeight: 600,
    margin: "50px 8px 0 8px",
    fontFamily: "'Roboto', sans-serif",
  },
  labelText: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "calc(100% - 60px)",
    fontFamily: "'Roboto', sans-serif",
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
    margin: "0 8px",
    cursor: "pointer",
    background: "transparent",
    color: colors.text,
    fontWeight: 500,
    borderBottom: `1px solid ${colors.rowBorder}`,
    userSelect: "none",
    transition: "background 0.15s",
    borderRadius: isActive || isHovered ? 6 : 0,
  };
  if (isActive) {
    s.background = colors.blue;
    s.color = colors.blueText;
    s.fontWeight = 600;
  } else if (isShaded) {
    s.background = colors.groupBg;
  } else if (isHovered) {
    s.background = colors.rowHover;
  }
  return s;
}

/* ========= Small action buttons ========= */
function Actions({ onEdit, onDelete, colors, isDarkMode }) {
  return (
    <div style={STYLES.actionWrap} onClick={(e) => e.stopPropagation()}>
      <button
        style={{
          ...STYLES.actionBtn,
          borderColor: colors.rowBorder,
          background: colors.actionBg,
        }}
        title="Edit"
        onMouseEnter={(e) => (e.currentTarget.style.background = colors.actionHover)}
        onMouseLeave={(e) => (e.currentTarget.style.background = colors.actionBg)}
        onClick={onEdit}
      >
        <img
          src={editIcon} // ← Add this import at the top!
          alt="edit"
          style={iconStyle(isDarkMode, 14)}
        />
      </button>
      <button
        style={{ ...STYLES.actionBtn, borderColor: colors.rowBorder, background: colors.actionBg }}
        title="Delete"
        onMouseEnter={(e) => (e.currentTarget.style.background = colors.actionHover)}
        onMouseLeave={(e) => (e.currentTarget.style.background = colors.actionBg)}
        onClick={onDelete}
      >
        <img src={binIcon} alt="delete" style={iconStyle(isDarkMode, 14)} />
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
  isDarkMode,
}) {
  const arrowIcon = !icon ? (isParent ? mainArrow : subArrow) : null;
  const isSystemCategory =
    id === "inbox" || id === "today" || id === "graphs" || id === "search" || id === "done";
  const [arrowHovered, setArrowHovered] = useState(false);

  return (
    <div
      style={getRowStyle({
        isActive,
        level,
        isShaded,
        isHovered: !isActive && showActions,
        colors,
      })}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
        {icon && (
          <div style={STYLES.iconWrapper}>
            <img src={icon} alt="icon" style={iconStyle(isDarkMode)} />
          </div>
        )}
        {arrowIcon && (
          <div
            style={STYLES.iconWrapper}
            onMouseEnter={() => setArrowHovered(true)}
            onMouseLeave={() => setArrowHovered(false)}
          >
            <img
              src={arrowIcon}
              alt="arrow"
              onClick={(e) => {
                if (isParent) {
                  e.stopPropagation();
                  onToggle?.();
                }
              }}
              style={{
                ...iconStyle(isDarkMode, 14),
                cursor: isParent ? "pointer" : "default",
                transform: isParent && collapsed
                  ? "rotate(-90deg) scale(1)"
                  : `rotate(0deg) ${arrowHovered ? "scale(1.2)" : "scale(1)"}`,
                transition: "transform 0.2s ease, filter 0.2s ease",
                filter: isDarkMode
                  ? `invert(100%) brightness(200%) ${arrowHovered ? "brightness(1.4)" : ""}`
                  : arrowHovered
                  ? "brightness(1.2)"
                  : "none",
              }}
            />
          </div>
        )}
        <span style={STYLES.labelText}>{customContent || label}</span>
      </span>

      {!isSystemCategory && showActions && (
        <Actions onEdit={onEdit} onDelete={onDelete} colors={colors} isDarkMode={isDarkMode} />
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
    if (isOver && onExpand) onExpand();
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
  addCategory,
  editCategory,
  deleteCategory,
  isDarkMode,
}) {
  const [hoverId, setHoverId] = useState(null);
  const [collapsedIds, setCollapsedIds] = useState(new Set());
  const [searchOpen, setSearchOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      if (typeof window !== "undefined") setIsMobile(window.innerWidth <= 768);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  const childrenByParent = useMemo(() => {
    const map = new Map();
    categories.forEach((cat) => {
      const parent = cat.parentId ?? null;
      if (!map.has(parent)) map.set(parent, []);
      map.get(parent).push(cat);
    });
    return map;
  }, [categories]);

  const colors = isDarkMode
    ? {
        sidebarBg: "#1f2123",
        border: "#3a3c3e",
        text: "#e5e5e5",
        blue: "#3f63d2",
        blueText: "#ffffff",
        groupBg: "#2b2d2f",
        rowHover: "#2f3236",
        rowBorder: "#3a3c3e",
        actionBg: "#1f2123",
        actionHover: "#3a3c3e",
        dialogBg: "#2b2d2f",
        dialogBorder: "#3a3c3e",
        inputBg: "#1d1f21",
        inputBorder: "#555",
      }
    : {
        sidebarBg: "#ffffff",
        border: "#ddd",
        text: "#111827",
        blue: "#e0e7ff",
        blueText: "#111827",
        groupBg: "#f5f5f7",
        rowHover: "#f3f4f6",
        rowBorder: "#eee",
        actionBg: "#fff",
        actionHover: "#f1f1f1",
        dialogBg: "#fff",
        dialogBorder: "#ccc",
        inputBg: "#fff",
        inputBorder: "#ccc",
      };

  // ... (all helper functions unchanged: getTaskCount, toggleCollapse, openAdd, etc.)

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
      next.has(id) ? next.delete(id) : next.add(id);
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
    if (!trimmed) return alert("Category name is required.");
    const parentValue = parentId === "" ? null : parentId;
    if (mode === "edit") editCategory(editingId, trimmed, parentValue);
    else addCategory(trimmed, parentValue);
    closeModal();
  }

  function removeCategory(id) {
    deleteCategory(id);
  }

  const parentChoices = useMemo(() => {
    const descendants = new Set();
    if (mode === "edit" && editingId) {
      const collectDescendants = (id) => {
        const children = childrenByParent.get(id) || [];
        children.forEach((child) => {
          descendants.add(child.id);
          collectDescendants(child.id);
        });
      };
      collectDescendants(editingId);
    }
    return categories.filter(
      (c) =>
        c.id !== "inbox" &&
        (mode !== "edit" || c.id !== editingId) &&
        !descendants.has(c.id)
    );
  }, [categories, mode, editingId, childrenByParent]);

  function renderTree(parent, level = 0) {
    const items = (childrenByParent.get(parent ?? null) || []).filter(
      (cat) => !["inbox", "graphs", "today", "done"].includes(cat.id)
    );

    return items.map((cat) => {
      const isActive = hoveredCategory === cat.id || selectedCategory === cat.id;
      const showActions = hoverId === cat.id;
      const isParent = (childrenByParent.get(cat.id) || []).length > 0;
      const collapsed = collapsedIds.has(cat.id);
      const categoryIconToUse = !cat.parentId && !isParent ? categoryIcon : null;

      return (
        <div key={cat.id}>
          <DroppableRow
            categoryId={cat.id}
            isEnabled={true}
            onExpand={() => collapsed && toggleCollapse(cat.id)}
          >
            <Row
              id={cat.id}
              label={cat.name}
              level={level}
              isActive={isActive}
              showActions={showActions}
              isParent={isParent}
              collapsed={collapsed}
              icon={categoryIconToUse}
              onClick={() => onCategorySelect(cat.id)}
              onToggle={() => toggleCollapse(cat.id)}
              onEdit={() => openEdit(cat)}
              onDelete={() => removeCategory(cat.id)}
              onMouseEnter={() => setHoverId(cat.id)}
              onMouseLeave={() => setHoverId(null)}
              count={getTaskCount(cat.id)}
              colors={colors}
              isDarkMode={isDarkMode}
            />
          </DroppableRow>
          {!collapsed && renderTree(cat.id, level + 1)}
        </div>
      );
    });
  }

  return (
    <div style={{ ...STYLES.sidebar, background: colors.sidebarBg, borderRightColor: colors.border }}>
      {/* Logo with dark-mode filter */}
      <div style={{ ...STYLES.logoWrap, borderBottomColor: colors.border }}>
        <img
          src={logo}
          alt="logo"
          width={128}
          height={85}
        />
      </div>

      <div style={STYLES.list}>
        {/* Search */}
        <Row
          id="search"
          icon={searchIcon}
          level={0}
          isActive={hoverId === "search" || selectedCategory === "search"}
          showActions={hoverId === "search"}
          onMouseEnter={() => setHoverId("search")}
          onMouseLeave={() => setHoverId(null)}
          onClick={() => !searchOpen && setSearchOpen(true)}
          customContent={
            searchOpen ? (
              <input
                autoFocus
                type="text"
                placeholder="Search tasks..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ ...STYLES.inputInline, background: colors.inputBg, color: colors.text }}
                onBlur={() => !searchText && setSearchOpen(false)}
              />
            ) : "Search"
          }
          colors={colors}
          isDarkMode={isDarkMode}
        />

        {/* System rows */}
        <DroppableRow categoryId="inbox" isEnabled={true}>
          <Row id="inbox" label="Inbox" icon={inboxIcon} level={0} isActive={hoverId === "inbox" || selectedCategory === "inbox"} showActions={hoverId === "inbox"} onMouseEnter={() => setHoverId("inbox")} onMouseLeave={() => setHoverId(null)} onClick={() => onCategorySelect("inbox")} count={getTaskCount("inbox")} colors={colors} isDarkMode={isDarkMode} />
        </DroppableRow>

        <DroppableRow categoryId="today" isEnabled={true}>
          <Row id="today" label="Today" icon={todayIcon} level={0} isActive={hoverId === "today" || selectedCategory === "today"} showActions={hoverId === "today"} onMouseEnter={() => setHoverId("today")} onMouseLeave={() => setHoverId(null)} onClick={() => onCategorySelect("today")} count={getTaskCount("today")} colors={colors} isDarkMode={isDarkMode} />
        </DroppableRow>

        <DroppableRow categoryId="graphs" isEnabled={true}>
          <Row id="graphs" label="Graphs" icon={graphsIcon} level={0} isActive={hoverId === "graphs" || selectedCategory === "graphs"} showActions={hoverId === "graphs"} onMouseEnter={() => setHoverId("graphs")} onMouseLeave={() => setHoverId(null)} onClick={() => onCategorySelect("graphs")} colors={colors} isDarkMode={isDarkMode} />
        </DroppableRow>

        <Row id="done" label="Done" icon={checkIcon} level={0} isActive={hoverId === "done" || selectedCategory === "done"} showActions={hoverId === "done"} onMouseEnter={() => setHoverId("done")} onMouseLeave={() => setHoverId(null)} onClick={() => onCategorySelect("done")} count={getTaskCount("done")} colors={colors} isDarkMode={isDarkMode} />

        <div style={STYLES.categoryHeader}>My Categories</div>
        {renderTree(null, 0)}

        <button
          onClick={openAdd}
          style={{ ...STYLES.addBtn, background: "transparent", color: colors.text }}
          onMouseEnter={(e) => (e.currentTarget.style.background = colors.rowHover)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          + Add Category
        </button>
      </div>

      {/* Modal unchanged except passing colors */}
      {isModalOpen && (
        <>
          <div onClick={closeModal} style={{ ...STYLES.backdrop, background: "rgba(0,0,0,0.45)" }} />
          <div role="dialog" aria-modal="true" style={{ ...STYLES.dialog, background: colors.dialogBg, borderColor: colors.dialogBorder }}>
            <h3 style={{ color: colors.text }}>{mode === "edit" ? "Edit Category" : "Add Category"}</h3>
            <label style={STYLES.field}>
              <span style={{ color: colors.text }}>Category name *</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ ...STYLES.input, background: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }}
              />
            </label>
            <label style={STYLES.field}>
              <span style={{ color: colors.text }}>Parent category</span>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                style={{ ...STYLES.select, background: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }}
              >
                <option value="">None</option>
                {parentChoices.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>
            <div style={STYLES.actions}>
              <button onClick={closeModal} style={{ ...STYLES.btnCancel, borderColor: colors.border, background: colors.actionBg, color: colors.text }}>Cancel</button>
              <button onClick={saveCategory} style={{ ...STYLES.btnSave, background: colors.blue, color: colors.blueText }}>Save</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}