import React from "react";
import { Modal, Button, Card, Tag, Divider, Typography, List } from "antd";

const { Title, Text } = Typography;

function priorityColor(p) {
  if (p === "Medium")
    return { backgroundColor: "#e6f4ff", borderColor: "#2563eb" };
  return p === "Low" ? "default" : "red";
}

export function TaskDetailsModal({
  visible,
  task,
  categories,
  allTasks,
  getParents,
  onClose,
  onEdit,
}) {
  if (!task) return null;

  const parentTasks = getParents(task.id);

  return (
    <Modal
      title={
        <Title level={4} style={{ margin: 0, color: "#1a2233" }}>
          Task Details
        </Title>
      }
      open={visible}
      centered
      destroyOnClose
      maskClosable={true}
      keyboard={true}
      onCancel={onClose}
      footer={[
        <Button
          key="edit"
          type="primary"
          onClick={onEdit}
          style={{ marginRight: 8 }}
        >
          Edit
        </Button>,
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={600}
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
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Card
          bordered={false}
          style={{
            background: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Title level={5} style={{ margin: "0 0 16px 0", color: "#1a2233" }}>
            {task.title}
          </Title>
          <Divider style={{ margin: "12px 0" }} />
          {task.deadline && (
            <div style={{ marginBottom: "12px" }}>
              <Text strong style={{ color: "#4d5156" }}>
                Deadline:
              </Text>
              <Text style={{ marginLeft: "8px", color: "#60a5fa" }}>
                {task.deadline}
                {task.deadlineTime ? ` ${task.deadlineTime}` : ""}
              </Text>
            </div>
          )}
          <div style={{ marginBottom: "12px" }}>
            <Text strong style={{ color: "#4d5156" }}>
              Description:
            </Text>
            <Text style={{ marginLeft: "8px", color: "#4d5156" }}>
              {task.description || "No description"}
            </Text>
          </div>
          <div style={{ marginBottom: "12px" }}>
            <Text strong style={{ color: "#4d5156" }}>
              Priority:
            </Text>
            <Tag
              style={{
                marginLeft: "8px",
                ...(typeof priorityColor(task.priority) === "object"
                  ? priorityColor(task.priority)
                  : {}),
              }}
              color={
                typeof priorityColor(task.priority) === "string"
                  ? priorityColor(task.priority)
                  : undefined
              }
            >
              {task.priority}
            </Tag>
          </div>
          <div style={{ marginBottom: "12px" }}>
            <Text strong style={{ color: "#4d5156" }}>
              Category:
            </Text>
            <Text style={{ marginLeft: "8px", color: "#4d5156" }}>
              {categories.find((c) => c.id === task.categoryId)?.name ||
                task.categoryId}
            </Text>
          </div>

          {parentTasks.length > 0 && (
            <div style={{ marginBottom: "12px" }}>
              <Text strong style={{ color: "#4d5156" }}>
                Parent Tasks:
              </Text>
              <Text style={{ marginLeft: "8px", color: "#4d5156" }}>
                {parentTasks
                  .map((t) =>
                    t.title.length > 20
                      ? `${t.title.substring(0, 20)}...`
                      : t.title
                  )
                  .join(", ")}
              </Text>
            </div>
          )}

          {task.childrenIds && task.childrenIds.length > 0 && (
            <div style={{ marginBottom: "12px" }}>
              <Text strong style={{ color: "#4d5156" }}>
                Child Tasks:
              </Text>
              <Text style={{ marginLeft: "8px", color: "#4d5156" }}>
                {allTasks
                  .filter((t) => task.childrenIds.includes(t.id))
                  .map((t) =>
                    t.title.length > 20
                      ? `${t.title.substring(0, 20)}...`
                      : t.title
                  )
                  .join(", ")}
              </Text>
            </div>
          )}

          {(task.budgetItems?.length > 0 || task.price > 0) && (
            <div style={{ marginTop: "12px" }}>
              <Text strong>Total Expenses: </Text>
              <Text>${task.price.toFixed(2)}</Text>
              {task.budgetItems?.length > 0 && (
                <>
                  <Divider style={{ margin: "12px 0" }} />
                  <Text strong>Budget Items (All Added):</Text>
                  <List
                    bordered
                    dataSource={task.budgetItems}
                    renderItem={(item) => (
                      <List.Item style={{ padding: "8px 12px" }}>
                        {item.name}: <strong>${item.sum.toFixed(2)}</strong>
                      </List.Item>
                    )}
                    style={{ marginTop: "8px", marginBottom: "8px" }}
                  />
                  <Text strong>
                    Sum of All Added Items: $
                    {task.budgetItems
                      .reduce((acc, item) => acc + item.sum, 0)
                      .toFixed(2)}
                  </Text>
                </>
              )}
            </div>
          )}
        </Card>
      </div>
    </Modal>
  );
}