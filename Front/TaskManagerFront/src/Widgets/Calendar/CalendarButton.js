import { Button } from "antd";
import calendarIcon from "./calendar_view.png";

export default function CalendarButton({ onClick }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <img src={calendarIcon} alt="Calendar Icon" style={{ width: "24px", height: "24px" }} />
      <Button type="primary" onClick={onClick}>
        Calendar
      </Button>
    </div>
  );
}
