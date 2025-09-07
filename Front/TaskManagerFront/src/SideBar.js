import './App.css';
import { useState } from "react";

export default function SideBar() {
  const [categories, setCategories] = useState([]);

  // Add new category
  const handleAddCategory = () => {
    const name = prompt("Enter category name:");
    if (name && name.trim() !== "") {
      setCategories([...categories, name]);
    }
  };

  // Change category name
  const handleChangeName = (index) => {
    const newName = prompt("Enter new name:", categories[index]);
    if (newName && newName.trim() !== "") {
      const updated = [...categories];
      updated[index] = newName;
      setCategories(updated);
    }
  };

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
  };

  return (
    <div
      className="SideBar"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        gap: "10px",
        height: "100vh",
        width: "17vw",      // fixed width for sidebar
        minWidth: "200px",   // prevents shrinking on small screens
        background: "#f4f4f4",
        overflowY: "auto",
        boxSizing: "border-box",
        flexShrink: 0        // prevents flex from shrinking
    }}
    >
      {/* Inbox button */}
      <button style={{ ...buttonStyle, marginBottom: "2vh" }}>Inbox</button>

      {/* Categories stacked under Inbox */}
      {categories.map((cat, index) => (
        <div
          key={index}
          style={{
            position: "relative",
            width: buttonWidth,
          }}
        >
          <button style={buttonStyle}>{cat}</button>
          <button
            onClick={() => handleChangeName(index)}
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
          >
            ✎
          </button>
        </div>
      ))}

      {/* Add Category button always last */}
      <button
        onClick={handleAddCategory}
        style={{ ...buttonStyle, background: "#ddd" }}
      >
        + Add Category
      </button>
    </div>
  );
}