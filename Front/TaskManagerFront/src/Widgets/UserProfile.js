// src/Widgets/UserProfile.js
import { useState, useEffect } from "react";

export default function UserProfile({ user }) {
  const [open, setOpen] = useState(false);

  // Fallbacks for name/email if missing
  const initialName = user?.displayName || user?.email?.split("@")[0] || "User";
  const initialEmail = user?.email || "unknown@example.com";

  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);

  const [tempName, setTempName] = useState(initialName);
  const [tempEmail, setTempEmail] = useState(initialEmail);

  const [userHover, setUserHover] = useState(false);
  const [userActive, setUserActive] = useState(false);

  const styles = {
    userBtn: (hover, active) => ({
      display: "flex",
      alignItems: "center",
      gap: "8px",
      background: active ? "#d1d5db" : hover ? "#e5e7eb" : "transparent",
      border: "none",
      cursor: "pointer",
      borderRadius: "8px",
      padding: "4px 8px",
      transition: "background 0.2s",
    }),
    avatar: {
      width: 32,
      height: 32,
      borderRadius: "50%",
      background: "#2563eb",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 600,
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.3)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    },
    card: {
      background: "white",
      borderRadius: "12px",
      padding: "20px",
      width: "400px",
      boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
    },
    input: {
      width: "100%",
      padding: "8px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      marginTop: "4px",
    },
    actionBtn: {
      padding: "8px 14px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      background: "white",
      cursor: "pointer",
    },
    actionPrimary: {
      padding: "8px 14px",
      borderRadius: "6px",
      border: "none",
      background: "#111111",
      color: "white",
      cursor: "pointer",
    },
  };

  const openModal = () => {
    setTempName(name);
    setTempEmail(email);
    setOpen(true);
  };

  const saveChanges = () => {
    setName(tempName);
    setEmail(tempEmail);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div>
      {/* Profile button */}
      <button
        onClick={openModal}
        onMouseEnter={() => setUserHover(true)}
        onMouseLeave={() => {
          setUserHover(false);
          setUserActive(false);
        }}
        onMouseDown={() => setUserActive(true)}
        onMouseUp={() => setUserActive(false)}
        style={styles.userBtn(userHover, userActive)}
      >
        <div style={styles.avatar}>
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </div>
        <span>{name}</span>
      </button>

      {/* Modal */}
      {open && (
        <div style={styles.overlay}>
          <div style={styles.card}>
            <h2 style={{ marginBottom: "16px" }}>Profile Settings</h2>

            <div style={{ marginBottom: "12px" }}>
              <label>Name</label>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label>Email</label>
              <input
                type="email"
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button onClick={() => setOpen(false)} style={styles.actionBtn}>
                Cancel
              </button>
              <button onClick={saveChanges} style={styles.actionPrimary}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
