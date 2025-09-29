import React, { useState } from "react";
import { Modal, Input, Button, Card, Typography, Form, Checkbox, message } from "antd";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

const { Title, Text } = Typography;

export default function UserProfile({ user }) {
  const [open, setOpen] = useState(false);
  const initialName = user?.displayName || user?.email?.split("@")[0] || "User";
  const initialEmail = user?.email || "unknown@example.com";
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [tempName, setTempName] = useState(initialName);
  const [tempEmail, setTempEmail] = useState(initialEmail);
  const [userHover, setUserHover] = useState(false);
  const [userActive, setUserActive] = useState(false);
  const [areNotificationsEnabled, setAreNotificationsEnabled] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleToggleNotifications = () => {
    setAreNotificationsEnabled((prev) => !prev);
    // Placeholder for backend integration, e.g.:
    // axios.patch(`/api/users/${user.id}/settings`, { emailNotifications: !areNotificationsEnabled });
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await signOut(auth);
      message.success("Logged out successfully");
      setOpen(false);
      // User will be redirected automatically by your auth state listener
    } catch (error) {
      console.error("Logout error:", error);
      message.error("Failed to logout. Please try again.");
      setLoggingOut(false);
    }
  };

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
    message.success("Profile updated successfully");
    // Placeholder for backend integration, e.g.:
    // axios.patch(`/api/users/${user.id}`, { displayName: tempName, email: tempEmail });
  };

  return (
    <div>
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

      <Modal
        title={<Title level={4} style={{ margin: 0, color: "#1a2233" }}>Profile Settings</Title>}
        open={open}
        onCancel={() => setOpen(false)}
        centered
        maskClosable={true}
        keyboard={true}
        footer={[
          <Button
            key="logout"
            danger
            onClick={handleLogout}
            loading={loggingOut}
            style={{ marginRight: "auto" }}
          >
            Logout
          </Button>,
          
          <Button
            key="save"
            type="primary"
            onClick={saveChanges}
          >
            Save
          </Button>,
        ]}
        width={400}
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
            display: "flex",
            justifyContent: "space-between",
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
          <Form layout="vertical">
            <Form.Item label={<Text strong style={{ color: "#4d5156" }}>Name</Text>} required>
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Enter your name"
              />
            </Form.Item>
            <Form.Item label={<Text strong style={{ color: "#4d5156" }}>Email</Text>} required>
              <Input
                type="email"
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </Form.Item>
            <Form.Item>
              <Checkbox
                checked={areNotificationsEnabled}
                onChange={handleToggleNotifications}
              >
                Enable Email Notifications
              </Checkbox>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </div>
  );
}