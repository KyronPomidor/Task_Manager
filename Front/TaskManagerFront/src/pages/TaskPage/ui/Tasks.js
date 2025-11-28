import React, { useState, useEffect } from "react";
import "../Tasks.css";
import { TaskFilters } from "../../../Widgets/TaskFilters";
import { Row, Col, Button, Modal } from "antd";
import dayjs from "dayjs";
import { SortableContext } from "@dnd-kit/sortable";

// Components
import { SortableTask } from "../../components/SortableTask";
import { TaskCard } from "../../components/taskCard";
import { TaskDetailsModal } from "../../modals/taskDetailsModal";
import { BudgetModal } from "../../modals/BudgetModal";
import { TaskEditModal } from "../../modals/taskEditModal";

// Utilities
import {
  getValidParents,
  getParents,
  getChildren,
  filterTasks,
  calculateTotalExpenses,
} from "../../utils/taskHelpers";
import { useTaskOperations } from "../../hooks/useTaskOperations";

export function Tasks({
  filteredTasks,
  allTasks,
  setTasks,
  selectedCategory,
  categories,
  searchText,
  setSelectedCategory,
  addTask,
  updateTask,
}) {
  // Modal states
  const [editOpen, setEditOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Budget modal states
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [budgetTask, setBudgetTask] = useState(null);
  const [budgetName, setBudgetName] = useState("");
  const [budgetSum, setBudgetSum] = useState("");
  const [tempBudgetItems, setTempBudgetItems] = useState([]);

  // UI states
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [expandedParentId, setExpandedParentId] = useState(null);
  const [filters, setFilters] = useState({
    priority: "All",
    status: "All",
    deadline: "",
    deadlineTime: "",
  });

  // mobile detection
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const onResize = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 768);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isInboxMainMobile = isMobile && selectedCategory === "inbox";

  // Custom hook for task operations
  const {
    toggleComplete,
    addBudgetItem,
    saveBudgetItems,
    handleChildIndicatorClick,
  } = useTaskOperations(allTasks, setTasks, updateTask);

  // Task editing handlers
  const startEdit = (task) => {
    setEditTask({ ...task });
    setEditOpen(true);
  };

  const handleSaveEdit = () => {
    updateTask(editTask);
    setEditOpen(false);
    setEditTask(null);
  };

  const handleAddNew = () => {
    const newTask = {
      id: `${Date.now()}`,
      title: "New Task",
      description: "",
      priority: "Medium",
      deadline: null,
      deadlineTime: null,
      categoryId: selectedCategory === "today" ? "inbox" : selectedCategory,
      completed: false,
      childrenIds: [],
      budgetItems: [],
    };
    if (selectedCategory === "today") {
      newTask.deadline = dayjs().format("YYYY-MM-DD");
    }
    setEditTask(newTask);
    setAddOpen(true);
  };

  const handleSaveNew = () => {
    if (!editTask.title) {
      Modal.error({ title: "Title is required" });
      return;
    }
    addTask(editTask);
    setAddOpen(false);
    setEditTask(null);
  };

  const handleCardClick = (task) => {
    setSelectedTask(task);
    setDetailsOpen(true);
  };

  // Budget handlers
  const handleAddBudgetItem = () => {
    const success = addBudgetItem(
      budgetName,
      budgetSum,
      tempBudgetItems,
      setTempBudgetItems
    );
    if (success) {
      setBudgetName("");
      setBudgetSum("");
    }
  };

  const handleSaveBudget = () => {
    saveBudgetItems(
      budgetTask,
      tempBudgetItems,
      setTasks,
      updateTask,
      setBudgetOpen,
      setBudgetTask,
      setTempBudgetItems
    );
  };

  const handleChildClick = (childId) => {
    handleChildIndicatorClick(
      childId,
      allTasks,
      setSelectedCategory,
      setSelectedTask,
      setDetailsOpen
    );
  };

  // Filter and sort tasks
  const filteredAndSortedTasks = filterTasks(
    filteredTasks || [],
    selectedCategory,
    searchText,
    filters
  );

  const wrappedGetParents = (taskId) => getParents(taskId, allTasks);
  const wrappedGetChildren = (taskId) => getChildren(taskId, allTasks);

  return (
    <div className="tasks-container">
      <div
        className="composer"
        style={{
          display: "flex",
          gap: "16px",
          alignItems: isInboxMainMobile ? "center" : "center",
          justifyContent: isInboxMainMobile ? "center" : "flex-start",
          flexDirection: isInboxMainMobile ? "column" : "row",
        }}
      >
        {selectedCategory !== "done" && (
          <Button
            type="primary"
            onClick={handleAddNew}
            style={isInboxMainMobile ? { alignSelf: "center" } : undefined}
          >
            Add
          </Button>
        )}

        <div
          style={
            isInboxMainMobile
              ? { width: "100%", display: "flex", justifyContent: "center" }
              : {}
          }
        >
          <TaskFilters filters={filters} setFilters={setFilters} />
        </div>

        {selectedCategory === "done" && (
          <span
            style={{
              fontSize: "0.9rem",
              color: "#4d5156",
              fontWeight: 600,
              marginTop: isInboxMainMobile ? 8 : 0,
            }}
          >
            Total Expenses: ${calculateTotalExpenses(filteredAndSortedTasks)}
          </span>
        )}
      </div>

      <SortableContext items={filteredAndSortedTasks.map((t) => t.id)}>
        <Row gutter={[16, 16]}>
          {filteredAndSortedTasks.map((task) => (
            <Col key={task.id} xs={24} sm={12} md={8}>
              <SortableTask task={task} onCardClick={handleCardClick}>
                {(dragListeners) => (
                  <TaskCard
                    task={task}
                    allTasks={allTasks}
                    dragListeners={dragListeners}
                    menuOpenId={menuOpenId}
                    setMenuOpenId={setMenuOpenId}
                    expandedParentId={expandedParentId}
                    setExpandedParentId={setExpandedParentId}
                    toggleComplete={toggleComplete}
                    startEdit={startEdit}
                    setBudgetTask={setBudgetTask}
                    setTempBudgetItems={setTempBudgetItems}
                    setBudgetOpen={setBudgetOpen}
                    handleCardClick={handleCardClick}
                    handleChildIndicatorClick={handleChildClick}
                    getParents={wrappedGetParents}
                    getChildren={wrappedGetChildren}
                  />
                )}
              </SortableTask>
            </Col>
          ))}
        </Row>
      </SortableContext>

      <TaskDetailsModal
        visible={detailsOpen}
        task={selectedTask}
        categories={categories}
        allTasks={allTasks}
        getParents={wrappedGetParents}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedTask(null);
        }}
        onEdit={() => {
          setDetailsOpen(false);
          startEdit(selectedTask);
        }}
      />

      <BudgetModal
        visible={budgetOpen}
        task={budgetTask}
        budgetName={budgetName}
        setBudgetName={setBudgetName}
        budgetSum={budgetSum}
        setBudgetSum={setBudgetSum}
        tempBudgetItems={tempBudgetItems}
        setTempBudgetItems={setTempBudgetItems}
        onAdd={handleAddBudgetItem}
        onSave={handleSaveBudget}
        onClose={() => {
          setBudgetOpen(false);
          setBudgetTask(null);
          setTempBudgetItems([]);
        }}
      />

      <TaskEditModal
        visible={editOpen}
        task={editTask}
        categories={categories}
        validParents={editTask ? getValidParents(editTask.id, allTasks) : []}
        onChange={setEditTask}
        onSave={handleSaveEdit}
        onClose={() => {
          setEditOpen(false);
          setEditTask(null);
        }}
        title="Edit Task"
      />

      <TaskEditModal
        visible={addOpen}
        task={editTask}
        categories={categories}
        validParents={getValidParents(null, allTasks)}
        onChange={setEditTask}
        onSave={handleSaveNew}
        onClose={() => {
          setAddOpen(false);
          setEditTask(null);
        }}
        title="Add New Task"
      />
    </div>
  );
}
