import React, { useState } from "react";
import { Modal, Input, Button } from "antd";
import aiIcon from "./ai.png";

export function AIAnalysisModal({ visible, onClose, onSend }) {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  const handleSend = () => {
    // Simulate AI analysis (replace with actual API call if needed)
    setOutputText(`Analysis result for: "${inputText}" - Processed at ${new Date().toLocaleString()}`);
    if (onSend) onSend(inputText);
  };

  return (
    <Modal
      title="AI Analysis"
      open={visible}
      onCancel={onClose}
      centered // Centers the modal vertically and horizontally
      width={572} // Default is 520px, increased by 10% to 572px
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
        <Button key="send" type="primary" onClick={handleSend}>
          Send
        </Button>,
      ]}
    >
      <div style={{ marginBottom: "16px" }}>
        <Input.TextArea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text for AI analysis..."
          autoSize={{ minRows: 3, maxRows: 6 }}
        />
      </div>
      <div style={{ marginBottom: "16px", border: "1px solid #d9d9d9", padding: "8px", borderRadius: "4px" }}>
        <strong>Output:</strong>
        <p>{outputText || "No analysis yet..."}</p>
      </div>
    </Modal>
  );
}