import { Button } from "antd";
import calendarIcon from "./calendar_view.png";
import calendarWhiteIcon from "./calendar_white.png";

export default function CalendarButton({ onClick, iconOnly = false, isDark = false }) {
  const icon = isDark ? calendarWhiteIcon : calendarIcon;
  if (iconOnly) {
    return (
      <button
        onClick={onClick}
        style={{
          border: "none",
          background: "transparent",
          padding: 0,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
        }}
      >
        <img
          src={icon}
          alt="Calendar"
          style={{ width: 24, height: 24 }}
        />
      </button>
    );
  }

  // Default desktop version 
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <img
        src={icon}
        alt="Calendar Icon"
        style={{ width: "24px", height: "24px" }}
      />
      <Button type="primary" onClick={onClick}>
        Calendar
      </Button>
    </div>
  );
}
