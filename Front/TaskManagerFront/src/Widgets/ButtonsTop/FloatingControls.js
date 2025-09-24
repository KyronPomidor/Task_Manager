import { Button } from "antd";
import UserProfileMenu from "../UserProfile";
import aiIcon from "./ai.png";

export default function FloatingControls({ user, onOpenAI }) {
  return (
    <div className="floating-controls">
      <Button
        type="primary"
        onClick={onOpenAI}
        style={{ display: "flex", alignItems: "center", gap: "8px" }}
      >
        <img src={aiIcon} alt="AI" className="ai-icon" />
        AI Analysis
      </Button>
      <UserProfileMenu user={user} />
    </div>
  );
}