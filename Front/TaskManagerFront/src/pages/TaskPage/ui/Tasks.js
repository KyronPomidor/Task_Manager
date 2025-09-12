import React, { useMemo, useState } from "react";
import "../Tasks.css";
import { Row, Col, Card, Tag, Modal, Form, Input, Select, DatePicker, Button } from "antd";
import dayjs from "dayjs";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Helper to get tag color based on priority
const priorityColor = (p) => (p === "High" ? "red" : p === "Low" ? "default" : "blue");

// Component for a single draggable task
function SortableTask({ task, children, onCardClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  // Style for draggable task, ensuring dragged task is above all others
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 9999 : 1, // High z-index when dragging
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={() => onCardClick(task)}>
      {children}
    </div>
  );
}

export function Tasks({
  tasks: initialTasks = [
    { id: "1", title: "First task", description: "Short description for the first task.", priority: "Medium", deadline: null, categoryId: "inbox", completed: false, parentIds: [] },
    { id: "2", title: "Second task", description: "Depends on First task, has a deadline.", priority: "High", deadline: "2025-09-15", categoryId: "inbox", completed: false, parentIds: ["1"] },
    { id: "3", title: "Review PR", description: "Review code after First task is done.", priority: "High", deadline: "2025-09-12", categoryId: "personal", completed: false, parentIds: ["1"] },
    { id: "4", title: "Refactor UI", description: "Longer description to demonstrate trimming that will be cut off because it is too long to fit in the card properly.", priority: "Low", deadline: null, categoryId: "personal", completed: false, parentIds: [] },
  ],
  selectedCategory = "inbox",
}) {
  // State for tasks and modals
  const [tasks, setTasks] = useState(initialTasks);
  const [editOpen, setEditOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Filter tasks by selected category
  const filtered = useMemo(
    () => tasks.filter((t) => t.categoryId === selectedCategory),
    [tasks, selectedCategory]
  );

  // Handle drag end to reorder tasks
  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setTasks((prev) => {
      const oldIndex = prev.findIndex((t) => t.id === active.id);
      const newIndex = prev.findIndex((t) => t.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  }

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
    setEditTask({ ...task });
    setEditOpen(true);
  }

  // Save edited task
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
      id: `${Date.now()}`,
      title: "",
      description: "",
      priority: "Medium",
      deadline: null,
      categoryId: "inbox",
      completed: false,
      parentIds: [],
    };
    setEditTask(newTask);
    setAddOpen(true);
  }

  // Save new task
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
    if (!taskId) return tasks.filter((t) => !t.completed);
    const descendants = new Set();
    function collectDescendants(id) {
      tasks.forEach((t) => {
        if (t.parentIds.includes(id)) {
          descendants.add(t.id);
          collectDescendants(t.id);
        }
      });
    }
    collectDescendants(taskId);
    return tasks.filter((t) => t.id !== taskId && !descendants.has(t.id) && !t.completed);
  }

  return (
    <div className="tasks-container">
      {/* Add task button */}
      <div className="composer">
        <Button type="primary" onClick={handleAddNew}>
          Add
        </Button>
      </div>
      {/* Drag and drop context for task reordering */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={filtered.map((t) => t.id)}>
          <Row gutter={[16, 16]}>
            {filtered.map((task) => {
              const bg = task.completed ? "#ececec" : "white";
              const children = tasks.filter((t) => t.parentIds.includes(task.id));
              const parents = tasks.filter((t) => task.parentIds.includes(t.id));
              return (
                <Col key={task.id} span={8}>
                  <SortableTask task={task} onCardClick={handleCardClick}>
                    <Card
                      className="task-card"
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
      </DndContext>

      {/* Details modal for viewing task info */}
      <Modal
        title="Task Details"
        open={detailsOpen}
        centered
        destroyOnClose
        onCancel={() => { setDetailsOpen(false); setSelectedTask(null); }}
        footer={[
          <Button key="edit" onClick={() => { setDetailsOpen(false); startEdit(selectedTask); }}>
            Edit
          </Button>,
          <Button key="close" onClick={() => { setDetailsOpen(false); setSelectedTask(null); }}>
            Close
          </Button>,
        ]}
      >
        {selectedTask && (
          <div className="task-details">
            <h2>{selectedTask.title}</h2>
            {selectedTask.deadline && (
              <p><strong>Deadline:</strong> {selectedTask.deadline}</p>
            )}
            <p><strong>Description:</strong> {selectedTask.description || "No description"}</p>
            <p><strong>Priority:</strong> {selectedTask.priority}</p>
            <p><strong>Category:</strong> {selectedTask.categoryId}</p>
            {selectedTask.parentIds.length > 0 && (
              <p><strong>Parent Tasks:</strong> {tasks
                .filter(t => selectedTask.parentIds.includes(t.id))
                .map(t => t.title)
                .join(", ")}
              </p>
            )}
          </div>
        )}
      </Modal>

      {/* Edit modal for updating task details */}
      <Modal
        title="Edit task"
        open={editOpen}
        centered
        destroyOnClose
        onCancel={() => { setEditOpen(false); setEditTask(null); }}
        onOk={handleSaveEdit}
        okText="Save"
      >
        {editTask && (
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
                <Select.Option value="work">Work</Select.Option>
                <Select.Option value="personal">Personal</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* Add modal for creating new tasks */}
      <Modal
        title="Add new task"
        open={addOpen}
        centered
        destroyOnClose
        onCancel={() => { setAddOpen(false); setEditTask(null); }}
        onOk={handleSaveNew}
        okText="Save"
      >
        {editTask && (
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
          </Form>
        )}
      </Modal>
    </div>
  );
}