import { Button } from "antd";
import calendarIcon from "./calendar_view.png";

export default function CalendarButton({ onClick, isDarkMode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <img
        src={calendarIcon}
        alt="Calendar Icon"
        style={{
          width: "24px",
          height: "24px",
          filter: isDarkMode ? "invert(1) brightness(2)" : "none",
          transition: "filter 0.2s",
        }}
      />
      <Button type="primary" onClick={onClick}>
        Calendar
      </Button>
    </div>
  );
}
