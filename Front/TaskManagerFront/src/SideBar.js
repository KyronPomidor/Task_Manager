import "./App.css";
import { useMemo, useState } from "react";

/* ========= colors & basic styles ========= */
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

  // action buttons shown on hover/active
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

  // modal
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

/* ========= one place to compute a row's style ========= */
function getRowStyle({ isActive, level, isShaded, isHovered }) {
  const s = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    padding: "10px 12px",
    paddingLeft: 12 + level * 16, // indent children
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

/* ========= tiny presentational bits ========= */
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
        🗑
      </button>
    </div>
  );
}

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
  extraStyle = {}, // <— lets us add the Inbox margin easily
}) {
  return (
    <div
      style={{ ...getRowStyle({ isActive, level, isShaded, isHovered: showActions && !isActive }), ...extraStyle }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
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
      <span className="truncate" title={label} style={{ position: "relative", zIndex: 1 }}>
        {label}
      </span>
      {!isInbox && (showActions || isActive) && <Actions onEdit={onEdit} onDelete={onDelete} />}
    </div>
  );
}

/* ========= main component ========= */
export default function SideBar({ categories, selectedCategory, onCategorySelect, setCategories }) {
  const [hoverId, setHoverId] = useState(null);

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("add"); // "add" | "edit"
  const [editingId, setEditingId] = useState(null);

  // form state
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");

  /* ----- build a parent->children map for rendering a tree ----- */
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

  /* ----- true if nodeId is inside ancestorId's subtree ----- */
  function isDescendant(nodeId, ancestorId) {
    if (!ancestorId || ancestorId === "inbox") return false;
    let current = categories.find((c) => c.id === nodeId)?.parentId ?? null;
    while (current) {
      if (current === ancestorId) return true;
      current = categories.find((c) => c.id === current)?.parentId ?? null;
    }
    return false;
  }

  /* ----- recursive renderer for the tree ----- */
  function renderTree(parent, level = 0) {
    const items = childrenByParent.get(parent ?? null) || [];
    return items.map((cat) => {
      const isActive = selectedCategory === cat.id;
      const isShaded = isDescendant(cat.id, selectedCategory);
      const showActions = hoverId === cat.id;

      return (
        <div key={cat.id}>
          <Row
            label={cat.name}
            level={level}
            isActive={isActive}
            isShaded={isShaded}
            showActions={showActions}
            onClick={() => onCategorySelect(cat.id)}
            onEdit={() => openEdit(cat)}
            onDelete={() => removeCategory(cat.id)}
            showGroupBar={isShaded}
            onMouseEnter={() => setHoverId(cat.id)}
            onMouseLeave={() => setHoverId(null)}
          />
          {renderTree(cat.id, level + 1)}
        </div>
      );
    });
  }

  /* ----- modal helpers ----- */
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
        prev.map((c) => (c.id === editingId ? { ...c, name: trimmed, parentId: parentId || null } : c))
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

    // simple delete: category + its direct children
    setCategories((prev) => prev.filter((c) => c.id !== id && c.parentId !== id));
    if (selectedCategory === id) onCategorySelect("inbox");
  }

  const parentChoices = useMemo(
    () => categories.filter((c) => (mode === "edit" ? c.id !== editingId : true)),
    [categories, mode, editingId]
  );

  /* ----- render ----- */
  return (
    <div className="SideBar" style={STYLES.sidebar}>
      <div style={STYLES.list}>
        <Row
          label="Inbox"
          level={0}
          active={selectedCategory === "inbox"}
          shaded={false}
          showActions={false}
          onClick={() => onCategorySelect("inbox")}
          onEdit={null}
          onDelete={null}
          showGroupBar={false}
          isInbox
        />

        <Row
          label="Graphs"
          level={0}
          active={selectedCategory === "graphs"}
          shaded={false}
          showActions={false}
          onClick={() => onCategorySelect("graphs")}
          onEdit={null}
          onDelete={null}
          showGroupBar={false}
          isInbox
        />
        {renderTree(null, 0)}
        <button onClick={openAdd} style={STYLES.addBtn}>+ Add Category</button>

      </div>

      {/* Add/Edit modal */}
      {isModalOpen && (
        <>
          <div className="backdrop-dim" onClick={closeModal} style={STYLES.backdrop} />
          <div role="dialog" aria-modal="true" style={STYLES.dialog}>
            <h3 style={{ margin: "0 0 12px 0" }}>{mode === "edit" ? "Edit Category" : "Add Category"}</h3>

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
              <select value={parentId} onChange={(e) => setParentId(e.target.value)} style={STYLES.select}>
                <option value="">None</option>
                {parentChoices.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

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
