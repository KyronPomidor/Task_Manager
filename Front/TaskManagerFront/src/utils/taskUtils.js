import { FIXED_INBOX_ID } from "../api/taskService";
import { getDeterministicColor } from "./colorUtils";

/**
 * Normalizes categories from nested or flat structure to flat array
 */
export function normalizeCategories(raw) {
  const isFlat =
    Array.isArray(raw) &&
    raw.every((c) => !Array.isArray(c.categories) || c.categories.length === 0);

  if (isFlat) {
    return raw.map((c) => ({
      id: c.id,
      name: c.title,
      parentId: c.parentCategoryId || null,
      order: c.order || 0,
    }));
  }

  const out = [];
  const walk = (list, parentId = null) => {
    for (const c of list) {
      const pid = (c.parentCategoryId ?? parentId) || null;
      out.push({
        id: c.id,
        name: c.title,
        parentId: pid,
        order: c.order || 0,
      });
      if (Array.isArray(c.categories) && c.categories.length) {
        walk(c.categories, c.id);
      }
    }
  };
  walk(raw, null);
  return out;
}

/**
 * Maps backend task data to frontend task structure
 */
export function mapTaskFromBackend(task, validCategoryIds) {
  let categoryId =
    task.categoryId === FIXED_INBOX_ID
      ? "inbox"
      : validCategoryIds.includes(task.categoryId)
        ? task.categoryId
        : "inbox";

  if (task.isCompleted) {
    categoryId = "done";
  }

  // Use color from backend, or generate deterministic color as fallback
  const taskColor = task.color || getDeterministicColor(String(task.id));

  return {
    id: String(task.id),
    title: task.title,
    description: task.description || "",
    color: taskColor, // Store the color
    priority:
      task.priority === 0 || task.priority === null
        ? "Low"
        : task.priority >= 2
          ? "High"
          : "Medium",
    deadline: task.deadline ? task.deadline.split("T")[0] : null,
    deadlineTime:
      task.deadline && task.deadline.includes("T")
        ? task.deadline.split("T")[1].slice(0, 5)
        : null,
    categoryId,
    completed: task.isCompleted || false,
    childrenIds: task.dependsOnTasksIds || [],
    parentIds: task.parentIds || [],
    graphNode: {
      id: task.title,
      x: task.graphNode?.x || 100,
      y: task.graphNode?.y || 100,
    },
    positionOrder: task.positionOrder ?? 0,
    price: Number(task.price) || 0,
    budgetItems: Array.isArray(task.budgetItems) ? task.budgetItems : [],
  };
}

/**
 * Creates a temporary task object for optimistic updates
 */
export function createTempTask(newTask, selectedCategory) {
  // Generate deterministic color based on title
  const taskColor = newTask.color || getDeterministicColor(newTask.title || `temp-${Date.now()}`);
  
  return {
    id: `temp-${Date.now()}`,
    title: newTask.title,
    description: newTask.description || "",
    color: taskColor, // Include color in temp task
    priority: newTask.priority || "Medium",
    deadline: newTask.deadline || null,
    deadlineTime: newTask.deadlineTime || null,
    categoryId: selectedCategory,
    completed: false,
    childrenIds: newTask.childrenIds || [],
    parentIds: [],
    graphNode: { id: newTask.title, x: 200, y: 200 },
    positionOrder: 0,
    price: newTask.price || 0,
    budgetItems: newTask.budgetItems || [],
  };
}

/**
 * Migrates parentIds to childrenIds (legacy support)
 */
export function migrateParentIdsToChildren(tasks) {
  const needsMigration = tasks.some(
    (t) =>
      Array.isArray(t.parentIds) &&
      t.parentIds.length > 0 &&
      (!Array.isArray(t.childrenIds) || t.childrenIds.length === 0)
  );

  if (!needsMigration) return tasks;

  console.log("Migrating parentIds to childrenIds...");
  const updatedTasks = tasks.map((task) => ({ ...task }));

  tasks.forEach((task) => {
    if (Array.isArray(task.parentIds) && task.parentIds.length > 0) {
      task.parentIds.forEach((parentId) => {
        const parentTask = updatedTasks.find(
          (t) => String(t.id) === String(parentId)
        );
        if (!parentTask) return;
        if (!Array.isArray(parentTask.childrenIds)) {
          parentTask.childrenIds = [];
        }
        if (!parentTask.childrenIds.includes(String(task.id))) {
          parentTask.childrenIds.push(String(task.id));
        }
      });
    }
  });

  console.log("Migration completed");
  return updatedTasks;
}

/**
 * Filters tasks based on selected category
 */
export function filterTasksByCategory(tasks, selectedCategory, todayStr) {
  return tasks
    .filter((t) => {
      if (selectedCategory === "today") return t.deadline === todayStr;
      if (selectedCategory === "done") return t.completed;
      if (
        selectedCategory !== "graphs" &&
        selectedCategory !== "calendar" &&
        t.categoryId !== selectedCategory
      )
        return false;
      return true;
    })
    .sort((a, b) => a.positionOrder - b.positionOrder);
}