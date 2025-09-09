import "./App.css";
import { useMemo, useState } from "react";

/** =========================
 *  Simple color palette + shared styles
 *  ========================= */
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
  groupBg: "#f6f7f9",  // background for children when parent is selected
  groupBar: "#e2e8f0", // subtle left bar for shading group
};

const STYLES = {
  sidebar: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "15vw",
    minWidth: "240px",
    background: COLORS.bg,
    borderRight: `1px solid ${COLORS.sidebarBorder}`,
    boxSizing: "border-box",
  },
  header: {
    padding: "10px 12px",
    borderBottom: `1px solid ${COLORS.sidebarBorder}`,
    fontWeight: 600,
  },
  list: { flex: 1, overflowY: "auto", padding: "8px 0" },
  actionsWrap: { display: "flex", alignItems: "center", gap: 6 },
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
  // Modal
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    zIndex: 999,
  },
  modalDialog: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "min(92vw, 420px)",
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    padding: "20px",
    zIndex: 1000,
  },
  fieldWrap: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 },
  input: { padding: "10px", borderRadius: 8, border: "1px solid #ccc", font: "inherit" },
  select: { padding: "10px", borderRadius: 8, border: "1px solid #ccc", font: "inherit", background: "#fff" },
  actions: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 },
  btnCancel: { padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", background: "#fafafa", cursor: "pointer" },
  btnSave: { padding: "8px 12px", borderRadius: 8, border: "none", background: COLORS.blue, color: "#fff", cursor: "pointer", fontWeight: 600 },
};

/** Build a single row style, based on state */
function rowStyle({ active, level, shaded, tight, hovered }) {
  const base = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    padding: `${tight ? 6 : 10}px 12px`,
    paddingLeft: 12 + level * 16, // indent children
    cursor: "pointer",
    background: "transparent",
    color: "#111827",
    fontWeight: 500,
    borderBottom: `1px solid ${COLORS.rowBorder}`,
  };

  if (active) {
    base.background = COLORS.blue;
    base.color = COLORS.blueText;
    base.fontWeight = 600;
  } else if (shaded) {
    base.background = COLORS.groupBg;
  } else if (hovered) {
    base.background = COLORS.rowHover;
  }

  return base;
}

/** =========================
 *  Small presentational components
 *  ========================= */

/** ActionButtons: Edit / Delete shown on hover or active */
function ActionButtons({ onEdit, onDelete }) {
  return (
    <div style={STYLES.actionsWrap} onClick={(e) => e.stopPropagation()}>
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

/** Row: single line for Inbox or Category */
function Row({
  label,
  level,
  active,
  shaded,
  showActions,
  onClick,
  onEdit,
  onDelete,
  showGroupBar,
  onMouseEnter,
  onMouseLeave,
}) {
  return (
    <div
      style={rowStyle({ active, level, shaded, tight: shaded || level > 0, hovered: showActions && !active })}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Optional subtle left bar for shaded subtree */}
      {showGroupBar && (
        <div
          style={{
            position: "absolute",
            left: 12 + Math.max(0, (level - 1) * 16),
            top: 0,
            bottom: 0,
            width: 3,
            background: COLORS.groupBar,
            borderRadius: 2,
          }}
        />
      )}

      <span style={{ position: "relative", zIndex: 1 }}>{label}</span>
      {(showActions || active) && <ActionButtons onEdit={onEdit} onDelete={onDelete} />}
    </div>
  );
}

/** =========================
 *  Main component
 *  ========================= */
export default function SideBar() {
  // Example data
  const [categories, setCategories] = useState([
    { id: "work", name: "Work", parentId: null },
    { id: "personal", name: "Personal", parentId: null },
    { id: "projA", name: "Project A", parentId: "work" },
    { id: "projB", name: "Project B", parentId: "work" },
    { id: "fun", name: "Fun", parentId: "personal" },
  ]);

  // UI state
  const [selectedId, setSelectedId] = useState("inbox"); // "inbox" or category id
  const [hoverId, setHoverId] = useState(null);          // which row is hovered

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [editingId, setEditingId] = useState(null);

  // Form state
  const [catName, setCatName] = useState("");
  const [parentId, setParentId] = useState("");

  /** ------------- Helpers (beginner-friendly) ------------- */

  // Group categories by parentId for easy tree rendering
  const childrenMap = useMemo(() => {
    const map = new Map();
    categories.forEach((c) => {
      const key = c.parentId ?? null;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(c);
    });
    // Sort children alphabetically (optional)
    for (const list of map.values()) {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return map;
  }, [categories]);

  // Check if node is a descendant of a given ancestor
  function isDescendantOf(nodeId, ancestorId) {
    if (!ancestorId || ancestorId === "inbox") return false;
    let current = categories.find((c) => c.id === nodeId)?.parentId ?? null;
    while (current) {
      if (current === ancestorId) return true;
      current = categories.find((c) => c.id === current)?.parentId ?? null;
    }
    return false;
  }

  // Render a branch (parent + its children)
  function renderBranch(parentId, level = 0) {
    const nodes = childrenMap.get(parentId ?? null) || [];
    return nodes.map((cat) => {
      const active = selectedId === cat.id;
      const shaded = isDescendantOf(cat.id, selectedId); // children of selected parent get shaded style
      const showActions = hoverId === cat.id;

      return (
        <div key={cat.id}>
          <Row
            label={cat.name}
            level={level}
            active={active}
            shaded={shaded}
            showActions={showActions}
            onClick={() => setSelectedId(cat.id)}
            onEdit={() => openEditModal(cat)}
            onDelete={() => deleteCategory(cat.id)}
            showGroupBar={shaded}
            onMouseEnter={() => setHoverId(cat.id)}
            onMouseLeave={() => setHoverId(null)}
          />
          {/* Render children under the parent */}
          {renderBranch(cat.id, level + 1)}
        </div>
      );
    });
  }

  /** ------------- Modal handlers ------------- */
  function openAddModal() {
    setModalMode("add");
    setEditingId(null);
    setCatName("");
    setParentId("");
    setIsModalOpen(true);
    document.body.classList.add("no-scroll");
  }

  function openEditModal(cat) {
    setModalMode("edit");
    setEditingId(cat.id);
    setCatName(cat.name);
    setParentId(cat.parentId || "");
    setIsModalOpen(true);
    document.body.classList.add("no-scroll");
  }

  function closeModal() {
    setIsModalOpen(false);
    document.body.classList.remove("no-scroll");
  }

  function onSave() {
    const name = catName.trim();
    if (!name) {
      alert("Category name is required.");
      return;
    }

    if (modalMode === "edit") {
      if (parentId && parentId === editingId) {
        alert("A category cannot be its own parent.");
        return;
      }
      setCategories((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, name, parentId: parentId || null } : c))
      );
    } else {
      const newCat = { id: Date.now().toString(), name, parentId: parentId || null };
      setCategories((prev) => [...prev, newCat]);
    }
    closeModal();
  }

  function deleteCategory(id) {
    const target = categories.find((c) => c.id === id);
    if (!target) return;
    if (!window.confirm(`Delete category "${target.name}"?`)) return;

    // Remove the category and any immediate children (simple delete like your original)
    setCategories((prev) => prev.filter((c) => c.id !== id && c.parentId !== id));
    if (selectedId === id) setSelectedId("inbox");
  }

  const parentOptions = useMemo(() => {
    return categories.filter((c) => (modalMode === "edit" ? c.id !== editingId : true));
  }, [categories, modalMode, editingId]);

  /** ------------- Render ------------- */
  return (
    <div className="SideBar" style={STYLES.sidebar}>

      <div style={STYLES.list}>
        {/* Inbox row */}
        <Row
          label="Inbox"
          level={0}
          active={selectedId === "inbox"}
          shaded={false}
          showActions={false}
          onClick={() => setSelectedId("inbox")}
          onEdit={null}
          onDelete={null}
          showGroupBar={false}
        />

        {/* Category tree (top-level where parentId === null) */}
        {renderBranch(null, 0)}

        {/* Add button */}
        <button onClick={openAddModal} style={STYLES.addBtn}>+ Add Category</button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <>
          <div className="backdrop-dim" onClick={closeModal} style={STYLES.modalBackdrop} />
          <div role="dialog" aria-modal="true" style={STYLES.modalDialog}>
            <h3 style={{ margin: "0 0 12px 0" }}>
              {modalMode === "edit" ? "Edit Category" : "Add Category"}
            </h3>

            <label style={STYLES.fieldWrap}>
              <span>
                Category name <span style={{ color: "#b91c1c" }}>*</span>
              </span>
              <input
                type="text"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="Enter category name"
                style={STYLES.input}
              />
            </label>

            <label style={STYLES.fieldWrap}>
              <span>Parent category</span>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                style={STYLES.select}
              >
                <option value="">None</option>
                {parentOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <div style={STYLES.actions}>
              <button onClick={closeModal} style={STYLES.btnCancel}>Cancel</button>
              <button onClick={onSave} style={STYLES.btnSave}>Save</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
