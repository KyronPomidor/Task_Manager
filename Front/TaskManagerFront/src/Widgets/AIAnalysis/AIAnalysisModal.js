import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Card, Typography, Spin } from "antd";
import axios from "axios";

const { Title } = Typography;

export function AIAnalysisModal({ visible, onClose }) {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://anytask.mihcraft.com:5053/api/ai-chat/ask",
        { prompt: inputText },
        { headers: { "Content-Type": "application/json" } }
      );

      if (data.reply) {
        setOutputText(data.reply);
      } else {
        setOutputText(typeof data === "string" ? data : JSON.stringify(data));
      }
    } catch (err) {
      setOutputText("❌ Error: " + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Reset input & output whenever modal closes
  useEffect(() => {
    if (!visible) {
      setInputText("");
      setOutputText("");
    }
  }, [visible]);

  return (
    <Modal
      title={
        <Title level={4} style={{ margin: 0, color: "#1a2233" }}>
          AI Analysis
        </Title>
      }
      open={visible}
      onCancel={onClose}
      centered
      maskClosable
      keyboard
      width={572}
      footer={[
        <Button key="close" onClick={onClose} style={{ marginRight: 8 }}>
          Close
        </Button>,
        <Button
          key="send"
          type="primary"
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
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
      <Card bordered={false} style={{ background: "#ffffff", borderRadius: "8px" }}>
        <div style={{ marginBottom: "16px" }}>
          <Title level={5} style={{ margin: "0 0 8px 0", color: "#1a2233" }}>
            Input Text
          </Title>
          <Input.TextArea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text for AI analysis..."
            autoSize={{ minRows: 3, maxRows: 6 }}
            disabled={loading}
          />
        </div>
        <div
          style={{
            marginBottom: "16px",
            border: "1px solid #d9d9d9",
            padding: "8px",
            borderRadius: "4px",
            minHeight: "60px",
            background: "#fafafa",
          }}
        >
          <strong style={{ color: "#4d5156" }}>Output:</strong>
          {loading ? (
            <Spin style={{ marginLeft: 8 }} />
          ) : (
            <pre
              style={{
                marginTop: 8,
                whiteSpace: "pre-wrap", // preserve newlines and wrap long text
                wordBreak: "break-word",
                color: "#4d5156",
              }}
            >
              {outputText || "No analysis yet..."}
            </pre>
          )}
        </div>
      </Card>
    </Modal>
  );
}
