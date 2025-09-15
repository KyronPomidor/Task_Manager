import React, { useMemo, useState } from "react";
import "../Tasks.css";
import { Row, Col, Card, Tag, Modal, Form, Input, Select, DatePicker, Button } from "antd";
import dayjs from "dayjs";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Returns color for priority tag based on priority level
function priorityColor(p) {
  return p === "High" ? "red" : p === "Low" ? "default" : "blue";
}

// Component for a single draggable task card
function SortableTask({ task, children, onCardClick }) {
  // Get drag-and-drop properties from useSortable hook
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  // Style for the task card, ensuring it stays above others and maintains size when dragging
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 9999 : 1, // High z-index during drag
    width: "100%", // Preserve original width
    height: "auto", // Preserve original height
  };

  return (
    // Div wrapper for drag-and-drop functionality
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onCardClick(task)}
      className={isDragging ? "dragging" : ""}
    >
      {children}
    </div>
  );
}

// Main Tasks component for managing and displaying tasks
export function Tasks({
  tasks, // List of tasks
  setTasks, // Function to update tasks
  selectedCategory, // Currently selected category
  categories, // List of categories for dropdowns
}) {
  // State for modal visibility and task editing
  const [editOpen, setEditOpen] = useState(false); // Edit modal visibility
  const [editTask, setEditTask] = useState(null); // Task being edited
  const [addOpen, setAddOpen] = useState(false); // Add task modal visibility
  const [detailsOpen, setDetailsOpen] = useState(false); // Details modal visibility
  const [selectedTask, setSelectedTask] = useState(null); // Task for details modal

  // Filter tasks by selected category
  const filtered = useMemo(
    () => tasks.filter((t) => t.categoryId === selectedCategory),
    [tasks, selectedCategory]
  );

  // Toggle task completion, prevent if incomplete children exist
  function toggleComplete(id) {
    const task = tasks.find((t) => t.id === id);
    const hasIncompleteChildren = tasks.some(
      (t) => t.parentIds.includes(id) && !t.completed
    );
    if (hasIncompleteChildren && !task.completed) {
      Modal.error({
        title: "Cannot complete task",
        content: "This task has incomplete child tasks.",
      });
      return;
    }
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  // Open edit modal with task data
  function startEdit(task) {
    setEditTask({ ...task }); // Clone task to avoid mutating state
    setEditOpen(true);
  }

  // Save edited task to state
  function handleSaveEdit() {
    setTasks((prev) =>
      prev.map((t) => (t.id === editTask.id ? editTask : t))
    );
    setEditOpen(false);
    setEditTask(null);
  }

  // Open add task modal with default values
  function handleAddNew() {
    const newTask = {
      id: `${Date.now()}`, // Generate unique ID
      title: "New Task",
      description: "",
      priority: "Medium",
      deadline: null,
      categoryId: selectedCategory, // Default to current category
      completed: false,
      parentIds: [],
    };
    setEditTask(newTask);
    setAddOpen(true);
  }

  // Save new task to state
  function handleSaveNew() {
    if (!editTask.title) {
      Modal.error({ title: "Title is required" });
      return;
    }
    setTasks((prev) => [...prev, editTask]);
    setAddOpen(false);
    setEditTask(null);
  }

  // Open details modal for a task
  function handleCardClick(task) {
    setSelectedTask(task);
    setDetailsOpen(true);
  }

  // Get valid parent tasks, excluding self and descendants
  function getValidParents(taskId) {
    if (!taskId) return tasks.filter((t) => !t.completed); // For new tasks
    const descendants = new Set();
    function collectDescendants(id) {
      tasks.forEach((t) => {
        if (t.parentIds.includes(id)) {
          descendants.add(t.id);
          collectDescendants(t.id); // Recursively collect descendants
        }
      });
    }
    collectDescendants(taskId);
    return tasks.filter((t) => t.id !== taskId && !descendants.has(t.id) && !t.completed);
  }

  return (
    // Main container for tasks
    <div className="tasks-container">
      {/* Button to open add task modal */}
      <div className="composer">
        <Button type="primary" onClick={handleAddNew}>
          Add
        </Button>
      </div>
      {/* Sortable context for task reordering */}
      <SortableContext items={filtered.map((t) => t.id)}>
        {/* Grid layout for task cards */}
        <Row gutter={[16, 16]}>
          {filtered.map((task) => {
            const bg = task.completed ? "#ececec" : "white"; // Background for completed tasks
            const children = tasks.filter((t) => t.parentIds.includes(task.id));
            const parents = tasks.filter((t) => task.parentIds.includes(t.id));
            return (
              <Col key={task.id} span={8}>
                <SortableTask task={task} onCardClick={handleCardClick}>
                  {/* Task card with title, priority, and actions */}
                  <Card
                    className={`task-card ${task.completed ? "task-card-done" : ""}`}
                    style={{ "--card-bg": bg }}
                    title={
                      <div className="card-title">
                        <span className={`title ${task.completed ? "done" : ""}`}>
                          {task.title}
                        </span>
                        <Tag color={priorityColor(task.priority)} className="ml-8">
                          {task.priority}
                        </Tag>
                        {task.deadline && (
                          <Tag color="blue" className="ml-8">📅 {task.deadline}</Tag>
                        )}
                      </div>
                    }
                    hoverable
                    extra={
                      // Action buttons (Done/Undo, Edit)
                      <div
                        className="card-actions"
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        <Button size="small" onClick={() => toggleComplete(task.id)}>
                          {task.completed ? "Undo" : "Done"}
                        </Button>
                        <Button
                          size="small"
                          style={{ marginLeft: 8 }}
                          onClick={() => startEdit(task)}
                        >
                          Edit
                        </Button>
                      </div>
                    }
                  >
                    <div className="desc">{task.description || "No description"}</div>
                    {/* Display parent tasks if any */}
                    {parents.length > 0 && (
                      <div className="parent-tasks">
                        <h4>Parent Tasks:</h4>
                        <ul>
                          {parents.map((parent) => (
                            <li key={parent.id}>{parent.title}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Display child tasks if any */}
                    {children.length > 0 && (
                      <div className="children-tasks">
                        <h4>Subtasks:</h4>
                        <ul>
                          {children.map((child) => (
                            <li key={child.id}>{child.title}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Card>
                </SortableTask>
              </Col>
            );
          })}
        </Row>
      </SortableContext>

      {/* Modal for viewing task details */}
      <Modal
        title="Task Details"
        open={detailsOpen}
        centered
        destroyOnClose
        onCancel={() => {
          setDetailsOpen(false);
          setSelectedTask(null);
        }}
        footer={[
          <Button
            key="edit"
            onClick={() => {
              setDetailsOpen(false);
              startEdit(selectedTask);
            }}
          >
            Edit
          </Button>,
          <Button
            key="close"
            onClick={() => {
              setDetailsOpen(false);
              setSelectedTask(null);
            }}
          >
            Close
          </Button>,
        ]}
      >
        {selectedTask && (
          // Task details display
          <div className="task-details">
            <h2>{selectedTask.title}</h2>
            {selectedTask.deadline && (
              <p><strong>Deadline:</strong> {selectedTask.deadline}</p>
            )}
            <p><strong>Description:</strong> {selectedTask.description || "No description"}</p>
            <p><strong>Priority:</strong> {selectedTask.priority}</p>
            <p><strong>Category:</strong> {selectedTask.categoryId}</p>
            {selectedTask.parentIds.length > 0 && (
              <p>
                <strong>Parent Tasks:</strong>{" "}
                {tasks
                  .filter((t) => selectedTask.parentIds.includes(t.id))
                  .map((t) => t.title)
                  .join(", ")}
              </p>
            )}
          </div>
        )}
      </Modal>

      {/* Modal for editing a task */}
      <Modal
        title="Edit task"
        open={editOpen}
        centered
        destroyOnClose
        onCancel={() => {
          setEditOpen(false);
          setEditTask(null);
        }}
        onOk={handleSaveEdit}
        okText="Save"
      >
        {editTask && (
          // Form for editing task details
          <Form layout="vertical">
            <Form.Item label="Title" required>
              <Input
                value={editTask.title}
                onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                placeholder="Task title"
              />
            </Form.Item>
            <Form.Item label="Description">
              <Input.TextArea
                value={editTask.description}
                onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                placeholder="Describe the task…"
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
            </Form.Item>
            <Form.Item label="Priority">
              <Select
                value={editTask.priority}
                onChange={(val) => setEditTask({ ...editTask, priority: val })}
              >
                <Select.Option value="Low">Low</Select.Option>
                <Select.Option value="Medium">Medium</Select.Option>
                <Select.Option value="High">High</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Deadline">
              <DatePicker
                style={{ width: "100%" }}
                value={editTask.deadline ? dayjs(editTask.deadline) : null}
                onChange={(_, dateStr) => setEditTask({ ...editTask, deadline: dateStr || null })}
                placeholder="Select date"
              />
            </Form.Item>
            <Form.Item label="Parent Tasks">
              <Select
                mode="multiple"
                value={editTask.parentIds}
                onChange={(val) => setEditTask({ ...editTask, parentIds: val })}
                placeholder="Select parent tasks"
              >
                {getValidParents(editTask.id).map((t) => (
                  <Select.Option key={t.id} value={t.id}>
                    {t.title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Category">
              <Select
                value={editTask.categoryId}
                onChange={(val) => setEditTask({ ...editTask, categoryId: val })}
              >
                <Select.Option value="inbox">Inbox</Select.Option>
                {categories.map((cat) => (
                  <Select.Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* Modal for adding a new task */}
      <Modal
        title="Add new task"
        open={addOpen}
        centered
        destroyOnClose
        onCancel={() => {
          setAddOpen(false);
          setEditTask(null);
        }}
        onOk={handleSaveNew}
        okText="Save"
      >
        {editTask && (
          // Form for adding new task
          <Form layout="vertical">
            <Form.Item label="Title" required>
              <Input
                value={editTask.title}
                onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                placeholder="Task title"
              />
            </Form.Item>
            <Form.Item label="Description">
              <Input.TextArea
                value={editTask.description}
                onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                placeholder="Describe the task…"
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
            </Form.Item>
            <Form.Item label="Priority">
              <Select
                value={editTask.priority}
                onChange={(val) => setEditTask({ ...editTask, priority: val })}
              >
                <Select.Option value="Low">Low</Select.Option>
                <Select.Option value="Medium">Medium</Select.Option>
                <Select.Option value="High">High</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Deadline">
              <DatePicker
                style={{ width: "100%" }}
                value={editTask.deadline ? dayjs(editTask.deadline) : null}
                onChange={(_, dateStr) => setEditTask({ ...editTask, deadline: dateStr || null })}
                placeholder="Select date"
              />
            </Form.Item>
            <Form.Item label="Parent Tasks">
              <Select
                mode="multiple"
                value={editTask.parentIds}
                onChange={(val) => setEditTask({ ...editTask, parentIds: val })}
                placeholder="Select parent tasks"
              >
                {getValidParents(null).map((t) => (
                  <Select.Option key={t.id} value={t.id}>
                    {t.title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Category">
              <Select
                value={editTask.categoryId}
                onChange={(val) => setEditTask({ ...editTask, categoryId: val })}
              >
                <Select.Option value="inbox">Inbox</Select.Option>
                {categories.map((cat) => (
                  <Select.Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
}