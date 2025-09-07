import './App.css';
import { useState, useMemo } from "react";

export default function SideBar() {
  // categories: { id, name, parentId }
  const [categories, setCategories] = useState([]);

  // Modal state (shared for Add & Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [editingId, setEditingId] = useState(null);

  // Form state
  const [catName, setCatName] = useState("");
  const [parentId, setParentId] = useState("");

  const buttonWidth = "150px";

  const buttonStyle = {
    width: buttonWidth,
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    cursor: "pointer",
    textAlign: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    background: "#f2d03bff",
  };

  // Open Add modal
  const openAddModal = () => {
    setModalMode("add");
    setEditingId(null);
    setCatName("");
    setParentId("");
    setIsModalOpen(true);
    document.body.classList.add("no-scroll");
  };

  // Open Edit modal (prefill)
  const openEditModal = (cat) => {
    setModalMode("edit");
    setEditingId(cat.id);
    setCatName(cat.name);
    setParentId(cat.parentId || "");
    setIsModalOpen(true);
    document.body.classList.add("no-scroll");
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.classList.remove("no-scroll");
  };

  // Save (add or edit)
  const onSave = () => {
    const name = catName.trim();
    if (!name) {
      alert("Category name is required.");
      return;
    }

    if (modalMode === "edit") {
      // prevent self as parent
      if (parentId && parentId === editingId) {
        alert("A category cannot be its own parent.");
        return;
      }
      setCategories(prev =>
        prev.map(c =>
          c.id === editingId ? { ...c, name, parentId: parentId || null } : c
        )
      );
    } else {
      const newCat = {
        id: Date.now().toString(),
        name,
        parentId: parentId || null,
      };
      setCategories(prev => [...prev, newCat]);
    }

    closeModal();
  };

  // Options for parent select (exclude self when editing)
  const parentOptions = useMemo(() => {
    return categories.filter(c => (modalMode === "edit" ? c.id !== editingId : true));
  }, [categories, modalMode, editingId]);

  return (
    <div
      className="SideBar"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        width: "17vw",
        minWidth: "200px",
        background: "#f4f4f4",
        boxSizing: "border-box",
        padding: "20px",
        gap: "10px",
        flexShrink: 0,
      }}
    >
      {/* Fixed top area */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          flexShrink: 0,
        }}
      >
        {/* Budget button */}
        <button
          onClick={() => alert("Budget Tracker coming soon!")}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "#ebc729ff",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "24px",
            marginBottom: "20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="Budget Tracker"
        >
          B
        </button>

        {/* Inbox button */}
        <button style={{ ...buttonStyle, marginBottom: "2vh" }}>Inbox</button>
      </div>

      {/* Scrollable categories area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          width: "17vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {categories.map((cat) => (
          <div
            key={cat.id}
            style={{
              position: "relative",
              width: buttonWidth,
            }}
          >
            <button style={buttonStyle}>{cat.name}</button>

            <button
              onClick={() => openEditModal(cat)}
              style={{
                position: "absolute",
                right: "-40px",
                top: "50%",
                transform: "translateY(-50%)",
                padding: "5px 8px",
                fontSize: "12px",
                cursor: "pointer",
                borderRadius: "5px",
              }}
              title="Edit category"
            >
              ✎
            </button>
          </div>
        ))}

        {/* Add Category (inside scroll) */}
        <button
          onClick={openAddModal}
          style={{ ...buttonStyle, background: "#f2d03bff" }}
        >
          + Add Category
        </button>
      </div>

      {/* Modal (shared Add/Edit) */}
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <div
            className="backdrop-dim"
            onClick={closeModal}
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
            aria-labelledby="cat-modal-title"
            style={{
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
            }}
          >
            <h3 id="cat-modal-title" style={{ margin: "0 0 12px 0" }}>
              {modalMode === "edit" ? "Edit Category" : "Add Category"}
            </h3>

            {/* Category name (required) */}
            <label style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
              <span>
                Category name <span style={{ color: "#b91c1c" }}>*</span>
              </span>
              <input
                type="text"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="Enter category name"
                style={{
                  padding: "10px",
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  font: "inherit",
                }}
              />
            </label>

            {/* Parent category */}
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span>Parent category</span>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                style={{
                  padding: "10px",
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  font: "inherit",
                  background: "#fff",
                }}
              >
                <option value="">None</option>
                {parentOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
              <button
                onClick={closeModal}
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
              <button
                onClick={onSave}
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
            </div>
          </div>
        </>
      )}
    </div>
  );
}
