import React, { useMemo, useState } from "react";
import "../Tasks.css";

/* ================================
 * Ant Design (UI library) imports
 * ================================ */
import { Row, Col, Card, Modal, Form, Input, Select, DatePicker, Tag, Button } from "antd";
/* Row/Col = grid layout, Card = card UI,
   Modal = dialogs, Form/Input/Select/DatePicker = form controls,
   Tag = small labels, Button = buttons. */

/* Drag & Drop (pangea/dnd = maintained fork of react-beautiful-dnd) */
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const { TextArea } = Input;
const { Option } = Select;

/** Simple color helpers */
const priorityColor = (p) => (p === "High" ? "red" : p === "Low" ? "default" : "blue");

/** Props:
 *  - categories: [{id, name}]
 *  - selectedCategory: "inbox" | <categoryId>
 */
export function Tasks({ categories, selectedCategory }) {
  /* ========= Sample data & state ========= */
  const [tasks, setTasks] = useState([
    { id: "1", title: "First task",  completed: false, highlighted: false, dependsOn: [],       deadline: null,          priority: "Medium", description: "Short description for the first task.", categoryId: "work" },
    { id: "2", title: "Second task", completed: false, highlighted: false, dependsOn: ["1"],    deadline: "2025-09-15",  priority: "High",   description: "Depends on First task, has a deadline.", categoryId: "work" },
    { id: "3", title: "Review PR",   completed: false, highlighted: false, dependsOn: ["1"],    deadline: "2025-09-12",  priority: "High",   description: "Review code after First task is done.", categoryId: "personal" },
    { id: "4", title: "Refactor UI", completed: false, highlighted: false, dependsOn: ["3"],    deadline: null,          priority: "Low",    description: "Longer description to demonstrate trimming.", categoryId: "personal" },
  ]);

  const [composer, setComposer] = useState("");

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  // Info modal
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoTaskId, setInfoTaskId] = useState(null);

  /* ========= Derived (filter by category) =========
   * Inbox -> show all; otherwise only tasks from selected category.
   */
  const filtered = useMemo(() => {
    return selectedCategory === "inbox"
      ? tasks
      : tasks.filter((t) => t.categoryId === selectedCategory);
  }, [tasks, selectedCategory]);

  /* ========= Helpers ========= */
  const byId = (id) => tasks.find((t) => t.id === id);
  const trim = (s, max = 100) => (!s ? "" : s.length > max ? s.slice(0, max) + "..." : s);

  /* ========= Add task (quick composer -> then edit modal) ========= */
  const handleAdd = () => {
    const text = composer.trim();
    if (!text) return;
    const newTask = {
      id: Date.now().toString(),
      title: text,
      completed: false,
      highlighted: false,
      dependsOn: [],
      deadline: null,
      priority: "Medium",
      description: "",
      categoryId: selectedCategory !== "inbox" ? selectedCategory : "",
    };
    setEditTask(newTask);
    setEditOpen(true);
    setComposer("");
  };

  /* ========= Save new or edited task ========= */
  const handleSaveEdit = () => {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === editTask.id);
      return exists
        ? prev.map((t) => (t.id === editTask.id ? { ...editTask } : t)) // update
        : [...prev, editTask];                                         // create
    });
    setEditTask(null);
    setEditOpen(false);
  };

  /* ========= Info modal ========= */
  const openInfo = (id) => {
    setInfoTaskId(id);
    setInfoOpen(true);
  };

  /* ========= Drag & Drop =========
   * Reorders cards in the *current* filtered view.
   * Internally we reorder the full tasks array by mapping filtered order
   * back to absolute indices.
   */
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    // Reorder only within filtered list
    const newFiltered = Array.from(filtered);
    const [moved] = newFiltered.splice(source.index, 1);
    newFiltered.splice(destination.index, 0, moved);

    // Merge back into full list order by replacing filtered positions
    setTasks((prev) => {
      const filteredIds = new Set(filtered.map((t) => t.id));
      const others = prev.filter((t) => !filteredIds.has(t.id));
      return [...others, ...newFiltered]; // "others" keep original order, filtered section reordered
    });
  };

  /* ========= Card actions ========= */
  const toggleComplete = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const startEdit = (task) => {
    setEditTask(task);
    setEditOpen(true);
  };
  
  /* ========= Render ========= */
  return (
    <div className="tasks-container">
      {/* Quick composer (add new card) */}
      <div className="composer">
        <Input
          placeholder="Enter new task..."
          value={composer}
          onChange={(e) => setComposer(e.target.value)}
          onPressEnter={handleAdd}
        />
        <Button type="primary" onClick={handleAdd}>
          Add
        </Button>
      </div>

      {/* DragDropContext wraps the droppable grid */}
      <DragDropContext onDragEnd={onDragEnd}>
        {/* AntD grid: Row (with gutter) + Col.
            We make the whole grid a single Droppable */}
        <Droppable droppableId="grid" direction="horizontal">
          {(dropProvided) => (
            <Row
              gutter={[16, 16]}
              ref={dropProvided.innerRef}
              {...dropProvided.droppableProps}
            >
              {filtered.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(dragProvided, snapshot) => {
                    // decide the background for THIS task
                    const bg = task.completed ? "#ececec" : "white";

                    return (
                      <Col
                        xs={24}
                        sm={24}
                        md={12}
                        lg={8}   // 3 per row at ≥992px
                        xl={8}   // also 3 per row at ≥1200px
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                      >
                        <Card
                          className={`task-card ${snapshot.isDragging ? "dragging" : ""}`}
                          // inject CSS variable for this card
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
                          onClick={() => openInfo(task.id)}
                          extra={
                            <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                              <Button size="small" onClick={() => toggleComplete(task.id)}>
                                {task.completed ? "Undo" : "Done"}
                              </Button>
                              <Button size="small" onClick={() => startEdit(task)} style={{ marginLeft: 8 }}>
                                Edit
                              </Button>
                            </div>
                          }
                        >
                          <div className="desc">{trim(task.description, 120) || "No description"}</div>
                        </Card>
                      </Col>
                    );
                  }}
                </Draggable>
              ))}
              {dropProvided.placeholder /* space holder while dragging */}
            </Row>
      
          )}
        </Droppable>
      </DragDropContext>

      {/* ===== AntD Modal (Edit) — centered ===== */}
      <Modal
        title={editTask?.id && tasks.some(t => t.id === editTask.id) ? "Edit task" : "Add task"}
        open={editOpen}
        centered
        destroyOnClose
        onCancel={() => { setEditOpen(false); setEditTask(null); }}
        onOk={handleSaveEdit}
        okText="Save"
        >
        {editTask && (
          <Form layout="vertical">
            {/* AntD Input */}
            <Form.Item label="Title" required>
              <Input
                value={editTask.title}
                onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                placeholder="Task title"
              />
            </Form.Item>

            {/* AntD TextArea */}
            <Form.Item label="Description">
              <TextArea
                value={editTask.description}
                onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                placeholder="Describe the task…"
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
            </Form.Item>

            {/* AntD Select */}
            <Form.Item label="Category" required>
              <Select
                value={editTask.categoryId || undefined}
                onChange={(val) => setEditTask({ ...editTask, categoryId: val })}
                placeholder="Select category"
                allowClear={false}
              >
                {categories.map((c) => (
                  <Option key={c.id} value={c.id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* AntD DatePicker (we store YYYY-MM-DD) */}
            <Form.Item label="Deadline">
              <DatePicker
                style={{ width: "100%" }}
                value={editTask.deadline ? (window.dayjs ? window.dayjs(editTask.deadline) : null) : null}
                onChange={(_, dateStr) => setEditTask({ ...editTask, deadline: dateStr || null })}
                placeholder="Select date"
              />
            </Form.Item>

            {/* AntD Select for priority */}
            <Form.Item label="Priority">
              <Select
                value={editTask.priority}
                onChange={(val) => setEditTask({ ...editTask, priority: val })}
              >
                <Option value="Low">Low</Option>
                <Option value="Medium">Medium</Option>
                <Option value="High">High</Option>
              </Select>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* ===== AntD Modal (Info) — centered ===== */}
      <Modal
        title="Task info"
        open={infoOpen}
        centered
        footer={<Button onClick={() => setInfoOpen(false)}>Close</Button>}
        onCancel={() => setInfoOpen(false)}
      >
        {infoTaskId && (
          <>
            <p><b>Title:</b> {byId(infoTaskId)?.title}</p>
            <p><b>Description:</b> {byId(infoTaskId)?.description || "—"}</p>
            <p><b>Deadline:</b> {byId(infoTaskId)?.deadline || "—"}</p>
            <p><b>Priority:</b> {byId(infoTaskId)?.priority || "—"}</p>
          </>
        )}
      </Modal>
    </div>
  );
}
