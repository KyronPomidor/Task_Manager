// src/pages/Authorization.js
import { useState } from "react";
import {
  Card,
  Tabs,
  Form,
  Input,
  Button,
  message,
  Typography,
} from "antd";
import {
  MailOutlined,
  LockOutlined,
  UserAddOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

const { Title, Text } = Typography;

export default function Authorization() {
  const [loading, setLoading] = useState(false);

  async function handleSignup(values) {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      message.success("Account created successfully!");
    } catch (err) {
      message.error(err.message);
    }
    setLoading(false);
  }

  async function handleLogin(values) {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      message.success("Logged in successfully!");
    } catch (err) {
      message.error(err.message);
    }
    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e0f2fe 0%, #e0e7ff 100%)",
        padding: "20px",
      }}
    >
      <Card
        className="shadow-xl"
        style={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={2} style={{ marginBottom: 8 }}>
            Task Manager
          </Title>
          <Text type="secondary">Stay productive. Stay organized.</Text>
        </div>

        <Tabs defaultActiveKey="1" centered>
          {/* Login */}
          <Tabs.TabPane
            tab={
              <span>
                <LoginOutlined /> Login
              </span>
            }
            key="1"
          >
            <Form layout="vertical" onFinish={handleLogin}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: "Please enter your email" }]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="your@email.com"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Please enter your password" }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="******"
                  size="large"
                />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
              >
                Log In
              </Button>
            </Form>
          </Tabs.TabPane>

          {/* Signup */}
          <Tabs.TabPane
            tab={
              <span>
                <UserAddOutlined /> Sign Up
              </span>
            }
            key="2"
          >
            <Form layout="vertical" onFinish={handleSignup}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: "Please enter your email" }]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="your@email.com"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Please enter your password" }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="******"
                  size="large"
                />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
              >
                Create Account
              </Button>
            </Form>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
}
