import { Button } from "antd";
import UserProfileMenu from "../UserProfile";
import aiIcon from "./ai.png";
import aiWhiteIcon from "./ai_white.png";

export default function FloatingControls({ user, onOpenAI, isDark = false }) {
  const icon = isDark ? aiWhiteIcon : aiIcon;
  return (
    <div className="floating-controls">
      <Button
        type="primary"
        onClick={onOpenAI}
        style={{ display: "flex", alignItems: "center", gap: "8px" }}
      >
        <img src={icon} alt="AI" className="ai-icon" />
        AI Analysis
      </Button>
      <UserProfileMenu user={user} />
    </div>
  );
}