import React, { useState } from "react";
import "../Tasks.css";
import { TaskFilters } from "../../../Widgets/TaskFilters";
import mainArrow from "./main_arrow.png";
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
  TimePicker,
  Button,
  List,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MoreOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------ Utility ------------------ */
function priorityColor(p) {
  return p === "High" ? "red" : p === "Low" ? "default" : "#60a5fa";
}

/* ------------------ SortableTask ------------------ */
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

/* ------------------ TaskActions ------------------ */
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
      x: -(i + 1) * 51,
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
    setMenuOpenId(open ? null : task.id);
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

/* ------------------ Tasks Component ------------------ */
export function Tasks({
  filteredTasks,
  allTasks,
  setTasks,
  selectedCategory,
  categories,
  searchText,
  setSelectedCategory,
}) {
  /* ---------- State ---------- */
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
  const [expandedParentId, setExpandedParentId] = useState(null);

  /* ---------- Functions ---------- */
  function toggleComplete(id) {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === id);
      if (!task) return prev;

      if (!task.completed) {
        const children = allTasks.filter((t) => t.parentIds.includes(task.id));
        if (children.length > 0) {
          const hasUnfinishedChildren = children.some((c) => !c.completed);
          if (hasUnfinishedChildren) {
            Modal.warning({
              title: "Cannot complete task",
              content: "This parent task still has unfinished child tasks.",
            });
            return prev;
          }
        }
      }

      return prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              categoryId: !t.completed ? "done" : t.categoryId,
            }
          : t
      );
    });
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
      deadlineTime: null,
      categoryId: selectedCategory === "today" ? "inbox" : selectedCategory,
      completed: false,
      parentIds: [],
      budgetItems: [],
    };
    if (selectedCategory === "today") {
      newTask.deadline = dayjs().format("YYYY-MM-DD");
    }
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
    if (!taskId) return allTasks.filter((t) => !t.completed);
    const descendants = new Set();
    function collectDescendants(id) {
      allTasks.forEach((t) => {
        if (t.parentIds.includes(id)) {
          descendants.add(t.id);
          collectDescendants(t.id);
        }
      });
    }
    collectDescendants(taskId);
    return allTasks.filter(
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

  function handleIndicatorClick(parentId) {
    const parentTask = allTasks.find((t) => t.id === parentId);
    if (parentTask && typeof setSelectedCategory === "function") {
      setSelectedCategory(parentTask.categoryId);
    } else {
      console.warn(
        `Cannot navigate to parent task category. Parent task with ID ${parentId} not found or setSelectedCategory is not a function.`
      );
    }
  }

  /* ---------- Filters ---------- */
  const [filters, setFilters] = useState({
    priority: "All",
    status: "All",
    deadline: "",
    deadlineTime: "",
  });

  const filteredAndSortedTasks = (filteredTasks || []).filter((task) => {
    if (selectedCategory === "today") {
      if (task.deadline !== dayjs().format("YYYY-MM-DD")) return false;
    } else if (task.categoryId !== selectedCategory) {
      return false;
    }
    if (searchText && !task.title.toLowerCase().includes(searchText.toLowerCase())) return false;
    if (filters.priority !== "All" && task.priority !== filters.priority) return false;
    if (filters.status === "Done" && !task.completed) return false;
    if (filters.status === "Undone" && task.completed) return false;
    if (filters.deadline && task.deadline !== filters.deadline) return false;
    if (filters.deadlineTime) {
      if (!task.deadlineTime || task.deadlineTime !== filters.deadlineTime) return false;
    }
    return true;
  });

  /* ---------- Parent/Child Coloring ---------- */
  const DEP_COLORS = [
    "#FFD93D", "#FF6B6B", "#6BCB77", "#4D96FF", "#845EC2",
    "#FF9671", "#FFC75F", "#0081CF", "#B39CD0", "#3705dcff"
  ];

  function hashStringToIndex(str, mod) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % mod;
  }

  const getParentColor = (parentId) => {
    const idx = hashStringToIndex(parentId, DEP_COLORS.length);
    return DEP_COLORS[idx];
  };

  function getChildren(taskId) {
    return allTasks.filter((t) => t.parentIds.includes(taskId) && !t.completed);
  }

  /* ---------- Render ---------- */
  return (
    <div className="tasks-container">
      <div className="composer" style={{ display: "flex", alignItems: "center" }}>
        {selectedCategory !== "done" && (
          <Button type="primary" onClick={handleAddNew}>
            Add
          </Button>
        )}
        <TaskFilters filters={filters} setFilters={setFilters} />
      </div>

      <SortableContext items={filteredAndSortedTasks.map((t) => t.id)}>
        <Row gutter={[16, 16]}>
          {filteredAndSortedTasks.map((task) => {
            const bg = task.completed ? "#ececec" : "white";
            const hasChildren = allTasks.some((t) => t.parentIds.includes(task.id) && !t.completed);
            const parentBorderColor = hasChildren ? getParentColor(task.id) : "#fff";
            const childIndicatorColors = task.parentIds.map(getParentColor);
            const isChild = task.parentIds.length > 0;
            const isParent = hasChildren;

            return (
              <Col key={task.id} span={8}>
                <SortableTask task={task} onCardClick={handleCardClick}>
                  {(dragListeners) => (
                    <motion.div style={{ position: "relative" }}>
                      <Card
                        className={`task-card ${task.completed ? "task-card-done" : ""}`}
                        style={{
                          background: bg,
                          borderLeft: `10px solid ${parentBorderColor}`,
                          minHeight: 180,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          zIndex: expandedParentId === task.id ? 1002 : 1,
                        }}
                        title={
                          <motion.div
                            className="card-title"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              width: "100%",
                              alignItems: "center",
                              overflow: "hidden",
                            }}
                          >
                            {/* Done Indicator */}
                            <Button
                              type="text"
                              style={{
                                position: "absolute",
                                top: 17,
                                left: 8,
                                padding: 0,
                                background: task.completed ? "#6BCB77" : "#fff",
                                border: "2px solid #ccc",
                                borderRadius: "50%",
                                width: 24,
                                height: 24,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                zIndex: 10,
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleComplete(task.id);
                              }}
                              onMouseEnter={(e) => {
                                if (!task.completed) {
                                  e.currentTarget.style.backgroundColor = "#d4d4d4ff";
                                  e.currentTarget.querySelector("span")?.style.setProperty("display", "flex", "important");
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!task.completed) {
                                  e.currentTarget.style.backgroundColor = "#fff";
                                  e.currentTarget.querySelector("span")?.style.setProperty("display", "none", "important");
                                }
                              }}
                            >
                              <span style={{ color: "#000000ff", display: task.completed ? "flex" : "none" }}>✓</span>
                            </Button>

                            {/* Drag Handle + Title + Priority */}
                            <motion.div
                              animate={{ x: menuOpenId === task.id ? -60 : 0 }}
                              transition={{ type: "spring", stiffness: 200, damping: 20 }}
                              style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: 40 }}
                            >
                              <span
                                {...dragListeners}
                                style={{
                                  cursor: "grab",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                <span className={`title ${task.completed ? "done" : ""}`}>
                                  {task.title.length > 20 ? `${task.title.substring(0, 20)}...` : task.title}
                                </span>
                                <Tag color={priorityColor(task.priority)}>{task.priority}</Tag>
                              </span>
                            </motion.div>

                            {/* Deadline */}
                            {task.deadline && (
                              <motion.div
                                animate={{ x: menuOpenId === task.id ? -60 : 0 }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                style={{
                                  fontSize: "0.85rem",
                                  color: "#60a5fa",
                                  marginTop: "2px",
                                  textAlign: "center",
                                  width: "100%",
                                  position: "relative",
                                }}
                              >
                                {task.deadline}
                                {task.deadlineTime ? ` ${task.deadlineTime}` : ""}
                              </motion.div>
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
                            minHeight: "50px",
                            width: "100%",
                          }}
                        >
                          {task.description || "No description"}
                        </div>

                        {/* Dependency Indicators (Bottom-Left) */}
                        {isChild && (
                          <div
                            className="dependency-indicators"
                            style={{
                              position: "absolute",
                              bottom: 8,
                              left: 8,
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              zIndex: 10,
                            }}
                          >
                            {task.parentIds.map((pid, idx) => {
                              const parentTask = allTasks.find((t) => t.id === pid);
                              return (
                                <Tooltip
                                  key={idx}
                                  title={parentTask ? parentTask.title : "Unknown Parent"}
                                >
                                  <span
                                    style={{
                                      display: "inline-block",
                                      width: 16,
                                      height: 16,
                                      borderRadius: "50%",
                                      background: childIndicatorColors[idx],
                                      border: "2px solid #fff",
                                      boxShadow: "0 0 0 1px #ccc",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleIndicatorClick(pid)}
                                  />
                                </Tooltip>
                              );
                            })}
                          </div>
                        )}

                        {/* Expand arrow */}
                        {isParent && (
                          <div
                            style={{
                              position: "absolute",
                              bottom: 12,
                              right: 16,
                              zIndex: 1003,
                            }}
                          >
                            <Button
                              type="text"
                              style={{
                                padding: 0,
                                background: "#fff",
                                border: "1px solid #e0e0e0",
                                borderRadius: "50%",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                                minWidth: 24,
                                minHeight: 24,
                                width: 24,
                                height: 24,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedParentId(expandedParentId === task.id ? null : task.id);
                              }}
                            >
                              <img
                                src={mainArrow}
                                alt="Show children"
                                style={{
                                  width: 16,
                                  height: 16,
                                  filter: expandedParentId === task.id ? "brightness(1.2)" : "brightness(0.8)",
                                  transition: "filter 0.2s",
                                  pointerEvents: "none",
                                }}
                              />
                            </Button>
                          </div>
                        )}
                      </Card>

                      {/* Dropdown for parent task children */}
                      <AnimatePresence>
                        {expandedParentId === task.id && (
                          <>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 0.6 }}
                              exit={{ opacity: 0 }}
                              style={{
                                position: "fixed",
                                top: 0,
                                left: 0,
                                width: "100vw",
                                height: "100vh",
                                background: "#1a2233",
                                zIndex: 1000,
                                pointerEvents: "auto",
                              }}
                              onClick={() => setExpandedParentId(null)}
                            />
                            <motion.div
                              initial={{ opacity: 0, y: -20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              style={{
                                position: "absolute",
                                left: 0,
                                top: "100%",
                                width: "100%",
                                background: "rgba(255,255,255,0.0)",
                                zIndex: 1002,
                                padding: "24px 0",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                                borderRadius: "0 0 12px 12px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  gap: 24,
                                  width: "100%",
                                  maxWidth: 340,
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {getChildren(task.id).map((child) => {
                                  const childIndicatorColors = child.parentIds.map(getParentColor);
                                  return (
                                    <Card
                                      key={child.id}
                                      className={`task-card ${child.completed ? "task-card-done" : ""}`}
                                      style={{
                                        width: 320,
                                        background: "#fff",
                                        color: "#222e3a",
                                        borderLeft:
                                          child.parentIds.length > 0
                                            ? `5px solid ${getParentColor(
                                                child.parentIds[child.parentIds.length - 1]
                                              )}`
                                            : "5px solid #fff",
                                        boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
                                        position: "relative",
                                        margin: "0 auto",
                                      }}
                                      title={
                                        <div style={{ textAlign: "center", color: "#222e3a" }}>
                                          <span className={`title ${child.completed ? "done" : ""}`}>
                                            {child.title.length > 20 ? `${child.title.substring(0, 20)}...` : child.title}
                                          </span>
                                          <Tag color={priorityColor(child.priority)}>{child.priority}</Tag>
                                          {child.deadline && (
                                            <div style={{ fontSize: "0.85rem", color: "#60a5fa", marginTop: 2 }}>
                                              {child.deadline}
                                              {child.deadlineTime ? ` ${child.deadlineTime}` : ""}
                                            </div>
                                          )}
                                        </div>
                                      }
                                    >
                                      <div
                                        className="desc"
                                        style={{
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          textAlign: "center",
                                          minHeight: "50px",
                                          width: "100%",
                                        }}
                                      >
                                        {child.description || "No description"}
                                      </div>
                                      {child.parentIds.length > 0 && (
                                        <div
                                          className="dependency-indicators"
                                          style={{
                                            position: "absolute",
                                            bottom: 8,
                                            left: 8,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                            zIndex: 10,
                                          }}
                                        >
                                          {child.parentIds.map((pid, idx) => {
                                            const parentTask = allTasks.find((t) => t.id === pid);
                                            return (
                                              <Tooltip
                                                key={idx}
                                                title={parentTask ? parentTask.title : "Unknown Parent"}
                                              >
                                                <span
                                                  style={{
                                                    display: "inline-block",
                                                    width: 16,
                                                    height: 16,
                                                    borderRadius: "50%",
                                                    background: getParentColor(pid),
                                                    border: "2px solid #fff",
                                                    boxShadow: "0 0 0 1px #ccc",
                                                    cursor: "pointer",
                                                  }}
                                                  onClick={() => handleIndicatorClick(pid)}
                                                />
                                              </Tooltip>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </Card>
                                  );
                                })}
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </SortableTask>
              </Col>
            );
          })}
        </Row>
      </SortableContext>

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
            <h2>{selectedTask.title.length > 20 ? `${selectedTask.title.substring(0, 20)}...` : selectedTask.title}</h2>
            {selectedTask.deadline && (
              <p>
                <strong>Deadline:</strong> {selectedTask.deadline}
                {selectedTask.deadlineTime ? ` ${selectedTask.deadlineTime}` : ""}
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
                {allTasks
                  .filter((t) => selectedTask.parentIds.includes(t.id))
                  .map((t) => (t.title.length > 20 ? `${t.title.substring(0, 20)}...` : t.title))
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
                  ${selectedTask.budgetItems.reduce((acc, item) => acc + item.sum, 0).toFixed(2)}
                </p>
              </>
            )}
          </div>
        )}
      </Modal>

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
            ${tempBudgetItems.reduce((acc, item) => acc + item.sum, 0).toFixed(2)}
          </p>
        )}
      </Modal>

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
                onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
              />
            </Form.Item>

            <Form.Item label="Description">
              <Input.TextArea
                value={editTask.description}
                onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
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

            <Form.Item label="Deadline (date)">
              <DatePicker
                style={{ width: "100%" }}
                value={editTask.deadline ? dayjs(editTask.deadline) : null}
                onChange={(_, dateStr) => setEditTask({ ...editTask, deadline: dateStr || null })}
              />
            </Form.Item>

            <Form.Item label="Deadline (time, optional)">
              <TimePicker
                style={{ width: "100%" }}
                value={editTask.deadlineTime ? dayjs(editTask.deadlineTime, "HH:mm") : null}
                format="HH:mm"
                onChange={(_, timeStr) => setEditTask({ ...editTask, deadlineTime: timeStr || null })}
              />
            </Form.Item>

            <Form.Item label="Parent Tasks">
              <Select
                mode="multiple"
                value={editTask.parentIds}
                onChange={(val) => setEditTask({ ...editTask, parentIds: val })}
              >
                {getValidParents(editTask.id).map((t) => (
                  <Select.Option key={t.id} value={t.id}>
                    {t.title.length > 20 ? `${t.title.substring(0, 20)}...` : t.title}
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
                onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
              />
            </Form.Item>

            <Form.Item label="Description">
              <Input.TextArea
                value={editTask.description}
                onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
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

            <Form.Item label="Deadline (date)">
              <DatePicker
                style={{ width: "100%" }}
                value={editTask.deadline ? dayjs(editTask.deadline) : null}
                onChange={(_, dateStr) => setEditTask({ ...editTask, deadline: dateStr || null })}
              />
            </Form.Item>

            <Form.Item label="Deadline (time, optional)">
              <TimePicker
                style={{ width: "100%" }}
                value={editTask.deadlineTime ? dayjs(editTask.deadlineTime, "HH:mm") : null}
                format="HH:mm"
                onChange={(_, timeStr) => setEditTask({ ...editTask, deadlineTime: timeStr || null })}
              />
            </Form.Item>

            <Form.Item label="Parent Tasks">
              <Select
                mode="multiple"
                value={editTask.parentIds}
                onChange={(val) => setEditTask({ ...editTask, parentIds: val })}
              >
                {getValidParents(null).map((t) => (
                  <Select.Option key={t.id} value={t.id}>
                    {t.title.length > 20 ? `${t.title.substring(0, 20)}...` : t.title}
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