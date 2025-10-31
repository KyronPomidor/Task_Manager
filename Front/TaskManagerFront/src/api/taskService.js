import axios from "axios";
import { getDeterministicColor } from "../utils/colorUtils";

const API_BASE_URL = "http://localhost:5053/api";
const FIXED_USER_ID = "283118eb-f3c5-4447-afa2-f5a93762a5e3";
const FIXED_INBOX_ID = "00000000-0000-0000-0000-000000000001";

// ==================== TASKS ====================

export const fetchTasks = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tasks`);
        console.log("Fetched tasks from backend:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error loading tasks:", error.response?.data || error.message);
        throw error;
    }
};

export const createTask = async (taskData) => {
    // Generate deterministic color for this task
    const taskColor = getDeterministicColor(taskData.title || `task-${Date.now()}`);
    
    const backendTask = {
        userId: FIXED_USER_ID,
        title: taskData.title,
        description: taskData.description || null,
        color: taskData.color || taskColor, // Use provided color or generate one
        statusId: null,
        priority:
            taskData.priority === "Low"
                ? 0
                : taskData.priority === "High"
                    ? 2
                    : 1,
        categoryId:
            taskData.categoryId === "inbox"
                ? FIXED_INBOX_ID
                : taskData.categoryId !== "done"
                    ? taskData.categoryId
                    : null,
        deadline: taskData.deadline
            ? `${taskData.deadline}T${taskData.deadlineTime || "00:00"}:00`
            : null,
        positionOrder: taskData.positionOrder || 0,
        price: taskData.price || 0,
        budgetItems: taskData.budgetItems || [],
        dependsOnTasksIds: taskData.childrenIds || [],
    };

    try {
        console.log("Sending new task to backend:", backendTask);
        const response = await axios.post(`${API_BASE_URL}/tasks`, backendTask, {
            headers: { "Content-Type": "application/json" },
        });
        console.log("Backend created task:", response.data);
        return response.data;
    } catch (error) {
        console.error("Backend save failed:", error.response?.data || error.message);
        throw error;
    }
};

export const updateTask = async (updatedTask) => {
    let backendCategoryId = null;
    if (
        updatedTask.categoryId &&
        !["inbox", "done", "today", "graphs", "calendar"].includes(
            updatedTask.categoryId
        )
    ) {
        backendCategoryId = updatedTask.categoryId;
    }
    if (updatedTask.categoryId === "inbox") {
        backendCategoryId = FIXED_INBOX_ID;
    }

    const backendTask = {
        taskId: updatedTask.id,
        title: updatedTask.title || null,
        description: updatedTask.description || null,
        color: updatedTask.color || null, // Include color in updates
        statusId: null,
        categoryId: backendCategoryId,
        deadline:
            updatedTask.deadline && updatedTask.deadlineTime
                ? `${updatedTask.deadline}T${updatedTask.deadlineTime}:00`
                : updatedTask.deadline
                    ? `${updatedTask.deadline}T00:00:00`
                    : null,
        priority:
            updatedTask.priority === "Low"
                ? 0
                : updatedTask.priority === "High"
                    ? 2
                    : 1,
        markCompleted: Boolean(updatedTask.completed),
        isFailed: null,
        positionOrder: updatedTask.positionOrder ?? 0,
        price: updatedTask.price || 0,
        budgetItems:
            updatedTask.budgetItems?.map((item) => ({
                id: item.id,
                name: item.name,
                sum: item.sum,
            })) || [],
        dependsOnTasksIds: updatedTask.childrenIds || [],
    };

    try {
        console.log("Sending update (PATCH) to backend:", backendTask);
        const response = await axios.patch(
            `${API_BASE_URL}/tasks/${updatedTask.id}`,
            backendTask,
            { headers: { "Content-Type": "application/json" } }
        );
        return response.data;
    } catch (error) {
        console.error("Backend update failed:", error.response?.data || error.message);
        throw error;
    }
};

export const updateTaskOrder = async (id, positionOrder) => {
    console.log(`updateTaskOrder called for task ${id} -> order ${positionOrder}`);
    try {
        const response = await axios.patch(
            `${API_BASE_URL}/tasks/${id}`,
            {
                taskId: id,
                positionOrder,
            },
            { headers: { "Content-Type": "application/json" } }
        );
        console.log("✅ Order updated on backend:", response.data);
        return response.data;
    } catch (error) {
        console.error(
            `⚠ Order update failed for ${id}:`,
            error.response?.data || error.message
        );
        throw error;
    }
};

// ==================== CATEGORIES ====================

export const fetchCategories = async () => {
    try {
        const { data } = await axios.get(`${API_BASE_URL}/categories`);
        return data;
    } catch (error) {
        console.error("Error loading categories:", error.response?.data || error.message);
        throw error;
    }
};

export const createCategory = async (title, parentId = null) => {
    const payload = {
        userId: FIXED_USER_ID,
        title,
        description: null,
        parentCategoryId: parentId || null,
        color: "#FFFFFF",
    };

    try {
        const { data } = await axios.post(
            `${API_BASE_URL}/categories/user`,
            payload,
            { headers: { "Content-Type": "application/json" } }
        );
        return data;
    } catch (error) {
        console.error("Add category failed:", error.response?.data || error.message);
        throw error;
    }
};

export const renameCategory = async (id, newTitle) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/categories/${id}/rename`,
            { categoryId: id, newTitle },
            { headers: { "Content-Type": "application/json" } }
        );
        return response.data;
    } catch (error) {
        console.error("Rename category failed:", error.response?.data || error.message);
        throw error;
    }
};

export const updateCategoryParent = async (id, parentCategoryId) => {
    try {
        const response = await axios.patch(
            `${API_BASE_URL}/categories/${id}`,
            { parentCategoryId },
            { headers: { "Content-Type": "application/json" } }
        );
        return response.data;
    } catch (error) {
        console.error(
            "Update category parent failed:",
            error.response?.data || error.message
        );
        throw error;
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/categories/${id}`);
        return response.data;
    } catch (error) {
        console.error("Delete category failed:", error.response?.data || error.message);
        throw error;
    }
};

// ==================== CONSTANTS ====================

export { FIXED_USER_ID, FIXED_INBOX_ID };