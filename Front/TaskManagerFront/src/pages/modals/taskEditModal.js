import {
  Modal,
  Button,
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Row,
  Col,
  Divider,
  Typography,
} from "antd";
import dayjs from "dayjs";

const { Title } = Typography;

export function TaskEditModal({
  visible,
  task,
  categories,
  validParents,
  onChange,
  onSave,
  onClose,
  title = "Edit Task",
}) {
  if (!task) return null;

  return (
    <Modal
      title={
        <Title level={4} style={{ margin: 0, color: "#1a2233" }}>
          {title}
        </Title>
      }
      open={visible}
      centered
      destroyOnClose
      maskClosable={true}
      keyboard={true}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} style={{ marginRight: 8 }}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={onSave}>
          Save
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
          maxHeight: "70vh",
          overflowY: "auto",
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
        <Form layout="vertical">
          <Form.Item label="Task Title" required>
            <Input
              value={task.title}
              onChange={(e) => onChange({ ...task, title: e.target.value })}
              placeholder="Enter task title"
            />
          </Form.Item>
          <Form.Item label="Description">
            <Input.TextArea
              value={task.description}
              onChange={(e) =>
                onChange({ ...task, description: e.target.value })
              }
              autoSize={{ minRows: 3, maxRows: 6 }}
              placeholder="Enter task description"
            />
          </Form.Item>
          <Divider style={{ margin: "16px 0" }} />
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Priority">
                <Select
                  value={task.priority}
                  onChange={(val) => onChange({ ...task, priority: val })}
                >
                  <Select.Option value="Low">Low</Select.Option>
                  <Select.Option value="Medium">Medium</Select.Option>
                  <Select.Option value="High">High</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Category">
                <Select
                  value={task.categoryId}
                  onChange={(val) => onChange({ ...task, categoryId: val })}
                >
                  {categories.map((cat) => (
                    <Select.Option key={cat.id} value={cat.id}>
                      {cat.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Divider style={{ margin: "16px 0" }} />
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Deadline (Date)">
                <DatePicker
                  style={{ width: "100%" }}
                  value={task.deadline ? dayjs(task.deadline) : null}
                  onChange={(_, dateStr) =>
                    onChange({ ...task, deadline: dateStr || null })
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Deadline (Time, Optional)">
                <TimePicker
                  style={{ width: "100%" }}
                  value={
                    task.deadlineTime
                      ? dayjs(task.deadlineTime, "HH:mm")
                      : null
                  }
                  format="HH:mm"
                  onChange={(_, timeStr) =>
                    onChange({ ...task, deadlineTime: timeStr || null })
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Child Tasks">
            <Select
              mode="multiple"
              value={task.childrenIds || []}
              onChange={(val) => onChange({ ...task, childrenIds: val })}
              placeholder="Select child tasks"
            >
              {validParents.map((t) => (
                <Select.Option key={t.id} value={t.id}>
                  {t.title.length > 20
                    ? `${t.title.substring(0, 20)}...`
                    : t.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
}