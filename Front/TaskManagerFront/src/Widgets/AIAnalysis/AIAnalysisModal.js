import React, { useState } from "react";
import { Modal, Input, Button, Card, Typography } from "antd";

const { Title, Text } = Typography;

export function AIAnalysisModal({ visible, onClose, onSend }) {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  const handleSend = () => {
    setOutputText(`Analysis result for: "${inputText}" - Processed at ${new Date().toLocaleString()}`);
    if (onSend) onSend(inputText);
  };

  return (
    <Modal
      title={<Title level={4} style={{ margin: 0, color: "#1a2233" }}>AI Analysis</Title>}
      open={visible}
      onCancel={onClose}
      centered
      maskClosable={true}
      keyboard={true}
      width={572}
      footer={[
        <Button
          key="close"
          onClick={onClose}
          style={{ marginRight: 8 }}
        >
          Close
        </Button>,
        <Button
          key="send"
          type="primary"
          onClick={handleSend}
        >
          Send
        </Button>,
      ]}
      styles={{
        header: {
          background: "#e6f4ff",
          padding: "16px 24px",
          borderRadius: "8px 8px 0 0",
        },
        body: {
          padding: "24px",
          background: "#f9fafb",
          borderRadius: "0 0 8px 8px",
        },
        content: {
          padding: 0,
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        },
        footer: {
          padding: "16px",
          borderRadius: "0 0 8px 8px",
        },
      }}
    >
      <Card
        bordered={false}
        style={{
          background: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ marginBottom: "16px" }}>
          <Title level={5} style={{ margin: "0 0 8px 0", color: "#1a2233" }}>
            Input Text
          </Title>
          <Input.TextArea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text for AI analysis..."
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
        </div>
        <div style={{ marginBottom: "16px", border: "1px solid #d9d9d9", padding: "8px", borderRadius: "4px" }}>
          <Text strong style={{ color: "#4d5156" }}>Output:</Text>
          <Text style={{ marginLeft: "8px", color: "#4d5156" }}>
            {outputText || "No analysis yet..."}
          </Text>
        </div>
      </Card>
    </Modal>
  );
}