import React, { useMemo, useState } from "react";
import "../Tasks.css";
import {
  Row,
  Col,
  Card,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  List,
} from "antd";
import dayjs from "dayjs";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MoreOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";

function priorityColor(p) {
  return p === "High" ? "red" : p === "Low" ? "default" : "blue";
}

function SortableTask({ task, children, onCardClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 9999 : 1,
    width: "100%",
    height: "100%",
    opacity: isDragging ? 0 : 1,
    pointerEvents: isDragging ? "none" : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={isDragging ? "dragging" : ""}
      onClick={() => onCardClick(task)}
    >
      {typeof children === "function" ? children(listeners) : children}
    </div>
  );
}

function TaskActions({
  task,
  toggleComplete,
  startEdit,
  setBudgetTask,
  setTempBudgetItems,
  setBudgetOpen,
  menuOpenId,
  setMenuOpenId,
}) {
  const open = menuOpenId === task.id;

  const buttonVariants = {
    hidden: { opacity: 0, x: 0, scale: 0.7 },
    visible: (i) => ({
      opacity: 1,
      x: -(i + 1) * 51, // 48px button + 3px gap
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        delay: i * 0.05,
      },
    }),
    exit: { opacity: 0, x: 0, scale: 0.7, transition: { duration: 0.15 } },
  };

  const actions = [
    {
      label: task.completed ? "Undo" : "Done",
      onClick: (e) => {
        e.stopPropagation();
        toggleComplete(task.id);
        setMenuOpenId(null);
      },
    },
    {
      label: "Edit",
      onClick: (e) => {
        e.stopPropagation();
        startEdit(task);
        setMenuOpenId(null);
      },
    },
    {
      label: "$",
      onClick: (e) => {
        e.stopPropagation();
        setBudgetTask(task);
        setTempBudgetItems(task.budgetItems || []);
        setBudgetOpen(true);
        setMenuOpenId(null);
      },
    },
  ];

  const toggleMenu = (e) => {
    e.stopPropagation();
    if (open) {
      setMenuOpenId(null);
    } else {
      setMenuOpenId(task.id); // close any other and open only this one
    }
  };

  return (
    <div
      style={{ position: "relative", display: "flex", alignItems: "center", minWidth: 32 }}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <Button
        icon={<MoreOutlined />}
        size="small"
        shape="circle"
        onClick={toggleMenu}
        style={{ zIndex: 2 }}
      />
      <AnimatePresence>
        {open &&
          actions.map((action, i) => (
            <motion.div
              key={action.label}
              custom={i}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={buttonVariants}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                zIndex: 1,
              }}
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <Button size="small" onClick={action.onClick}>
                {action.label}
              </Button>
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}

export function Tasks({ tasks, setTasks, selectedCategory, categories }) {
  const [editOpen, setEditOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [budgetOpen, setBudgetOpen] = useState(false);
  const [budgetTask, setBudgetTask] = useState(null);
  const [budgetName, setBudgetName] = useState("");
  const [budgetSum, setBudgetSum] = useState("");
  const [tempBudgetItems, setTempBudgetItems] = useState([]);

  const [menuOpenId, setMenuOpenId] = useState(null);

  const filtered = useMemo(
    () => tasks.filter((t) => t.categoryId === selectedCategory),
    [tasks, selectedCategory]
  );

  function toggleComplete(id) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  }

  function startEdit(task) {
    setEditTask({ ...task });
    setEditOpen(true);
  }

  function handleSaveEdit() {
    setTasks((prev) => prev.map((t) => (t.id === editTask.id ? editTask : t)));
    setEditOpen(false);
    setEditTask(null);
  }

  function handleAddNew() {
    const newTask = {
      id: `${Date.now()}`,
      title: "New Task",
      description: "",
      priority: "Medium",
      deadline: null,
      categoryId: selectedCategory,
      completed: false,
      parentIds: [],
      budgetItems: [],
    };
    setEditTask(newTask);
    setAddOpen(true);
  }

  function handleSaveNew() {
    if (!editTask.title) {
      Modal.error({ title: "Title is required" });
      return;
    }
    setTasks((prev) => [...prev, editTask]);
    setAddOpen(false);
    setEditTask(null);
  }

  function handleCardClick(task) {
    setSelectedTask(task);
    setDetailsOpen(true);
  }

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
    return tasks.filter(
      (t) => t.id !== taskId && !descendants.has(t.id) && !t.completed
    );
  }

  function addTempBudgetItem() {
    if (!budgetName.trim() || !budgetSum) {
      Modal.error({ title: "Both name and sum are required" });
      return;
    }
    const sumVal = parseFloat(budgetSum);
    if (isNaN(sumVal) || sumVal <= 0) {
      Modal.error({ title: "Enter a valid sum" });
      return;
    }
    setTempBudgetItems((prev) => [
      ...prev,
      { id: Date.now().toString(), name: budgetName, sum: sumVal },
    ]);
    setBudgetName("");
    setBudgetSum("");
  }

  function saveBudgetItems() {
    if (!budgetTask) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === budgetTask.id
          ? { ...t, budgetItems: [...tempBudgetItems] }
          : t
      )
    );
    setBudgetOpen(false);
    setBudgetTask(null);
    setTempBudgetItems([]);
  }

  return (
    <div className="tasks-container">
      <div className="composer">
        <Button type="primary" onClick={handleAddNew}>
          Add
        </Button>
      </div>

      <SortableContext items={filtered.map((t) => t.id)}>
        <Row gutter={[16, 16]}>
          {filtered.map((task) => {
            const bg = task.completed ? "#ececec" : "white";
            return (
              <Col key={task.id} span={8}>
                <SortableTask task={task} onCardClick={handleCardClick}>
                  {(dragListeners) => (
                    <Card
                      className={`task-card ${task.completed ? "task-card-done" : ""}`}
                      style={{ "--card-bg": bg }}
                      title={
                        <motion.div
                          className="card-title"
                          animate={{
                            marginRight: menuOpenId === task.id ? 120 : 0, // pushes left when menu is open
                            alignItems: menuOpenId === task.id ? "flex-start" : "center",
                            textAlign: menuOpenId === task.id ? "left" : "center",
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          onClick={(e) => e.stopPropagation()}
                          {...dragListeners}
                          style={{
                            cursor: "grab",
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                          }}
                        >
                          {/* Title + priority row */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              justifyContent: menuOpenId === task.id ? "flex-start" : "center",
                              width: "100%",
                            }}
                          >
                            <span className={`title ${task.completed ? "done" : ""}`}>
                              {task.title}
                            </span>
                            <Tag color={priorityColor(task.priority)}>{task.priority}</Tag>
                          </div>

                          {/* Deadline below */}
                          {task.deadline && (
                            <div
                              style={{
                                fontSize: "0.85rem",
                                color: "blue",
                                marginTop: "2px",
                                width: "100%",
                                textAlign: menuOpenId === task.id ? "left" : "center",
                              }}
                            >
                              {task.deadline}
                            </div>
                          )}
                        </motion.div>
                      }

                      hoverable
                      extra={
                        <TaskActions
                          task={task}
                          toggleComplete={toggleComplete}
                          startEdit={startEdit}
                          setBudgetTask={setBudgetTask}
                          setTempBudgetItems={setTempBudgetItems}
                          setBudgetOpen={setBudgetOpen}
                          menuOpenId={menuOpenId}
                          setMenuOpenId={setMenuOpenId}
                        />
                      }
                    >
                      <div
                        className="desc"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                          minHeight: "40px",
                        }}
                      >
                        {task.description || "No description"}
                      </div>
                    </Card>
                  )}
                </SortableTask>
              </Col>
            );
          })}
        </Row>
      </SortableContext>

      {/* Details modal */}
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
          <div className="task-details">
            <h2>{selectedTask.title}</h2>
            {selectedTask.deadline && (
              <p>
                <strong>Deadline:</strong> {selectedTask.deadline}
              </p>
            )}
            <p>
              <strong>Description:</strong>{" "}
              {selectedTask.description || "No description"}
            </p>
            <p>
              <strong>Priority:</strong> {selectedTask.priority}
            </p>
            <p>
              <strong>Category:</strong> {selectedTask.categoryId}
            </p>
            {selectedTask.parentIds.length > 0 && (
              <p>
                <strong>Parent Tasks:</strong>{" "}
                {tasks
                  .filter((t) => selectedTask.parentIds.includes(t.id))
                  .map((t) => t.title)
                  .join(", ")}
              </p>
            )}
            {selectedTask.budgetItems && selectedTask.budgetItems.length > 0 && (
              <>
                <h3>Expenses</h3>
                <List
                  dataSource={selectedTask.budgetItems}
                  renderItem={(item) => (
                    <List.Item>
                      {item.name}: ${item.sum.toFixed(2)}
                    </List.Item>
                  )}
                />
                <p>
                  <strong>Total:</strong>{" "}
                  $
                  {selectedTask.budgetItems
                    .reduce((acc, item) => acc + item.sum, 0)
                    .toFixed(2)}
                </p>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Budget modal */}
      <Modal
        title="Budget Tracker"
        open={budgetOpen}
        centered
        destroyOnClose
        onCancel={() => {
          setBudgetOpen(false);
          setBudgetTask(null);
          setTempBudgetItems([]);
        }}
        onOk={saveBudgetItems}
        okText="Save"
      >
        <Form layout="inline" style={{ marginBottom: 12 }}>
          <Form.Item label="Name">
            <Input
              value={budgetName}
              onChange={(e) => setBudgetName(e.target.value)}
              placeholder="e.g. Hosting"
            />
          </Form.Item>
          <Form.Item label="Sum">
            <Input
              type="number"
              value={budgetSum}
              onChange={(e) => setBudgetSum(e.target.value)}
              placeholder="100"
            />
          </Form.Item>
          <Form.Item>
            <Button type="dashed" onClick={addTempBudgetItem}>
              Add Item
            </Button>
          </Form.Item>
        </Form>

        <List
          bordered
          dataSource={tempBudgetItems}
          renderItem={(item) => (
            <List.Item>
              {item.name}: ${item.sum.toFixed(2)}
            </List.Item>
          )}
        />

        {tempBudgetItems.length > 0 && (
          <p style={{ marginTop: 10 }}>
            <strong>Total:</strong>{" "}
            $
            {tempBudgetItems
              .reduce((acc, item) => acc + item.sum, 0)
              .toFixed(2)}
          </p>
        )}
      </Modal>

      {/* Edit and Add modals (unchanged) */}
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
          <Form layout="vertical">
            <Form.Item label="Title" required>
              <Input
                value={editTask.title}
                onChange={(e) =>
                  setEditTask({ ...editTask, title: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="Description">
              <Input.TextArea
                value={editTask.description}
                onChange={(e) =>
                  setEditTask({ ...editTask, description: e.target.value })
                }
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
                onChange={(_, dateStr) =>
                  setEditTask({ ...editTask, deadline: dateStr || null })
                }
              />
            </Form.Item>
            <Form.Item label="Parent Tasks">
              <Select
                mode="multiple"
                value={editTask.parentIds}
                onChange={(val) =>
                  setEditTask({ ...editTask, parentIds: val })
                }
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
                onChange={(val) =>
                  setEditTask({ ...editTask, categoryId: val })
                }
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
          <Form layout="vertical">
            <Form.Item label="Title" required>
              <Input
                value={editTask.title}
                onChange={(e) =>
                  setEditTask({ ...editTask, title: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="Description">
              <Input.TextArea
                value={editTask.description}
                onChange={(e) =>
                  setEditTask({ ...editTask, description: e.target.value })
                }
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
                onChange={(_, dateStr) =>
                  setEditTask({ ...editTask, deadline: dateStr || null })
                }
              />
            </Form.Item>
            <Form.Item label="Parent Tasks">
              <Select
                mode="multiple"
                value={editTask.parentIds}
                onChange={(val) =>
                  setEditTask({ ...editTask, parentIds: val })
                }
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
                onChange={(val) =>
                  setEditTask({ ...editTask, categoryId: val })
                }
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