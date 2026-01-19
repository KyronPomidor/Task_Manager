import axios from "axios";
import { getDeterministicColor } from "../utils/colorUtils";
import { auth } from "../firebase/firebase";

const API_BASE_URL = "http://localhost:5053/api";
const FIXED_INBOX_ID = "00000000-0000-0000-0000-000000000001";

// Convert Firebase UID to deterministic GUID format
const firebaseUidToGuid = (uid) => {
    const uid1 = uid.substring(0, 8).padEnd(8, '0');
    const uid2 = uid.substring(8, 12).padEnd(4, '0');
    const uid3 = uid.substring(12, 16).padEnd(4, '0');
    const uid4 = uid.substring(16, 20).padEnd(4, '0');
    const uid5 = uid.substring(20).padEnd(12, '0');
    
    // Convert to hex and ensure proper length
    const toHex = (str) => {
        let result = '';
        for (let i = 0; i < str.length; i++) {
            result += str.charCodeAt(i).toString(16).padStart(2, '0');
        }
        return result;
    };
    
    const part1 = toHex(uid1).substring(0, 8);
    const part2 = toHex(uid2).substring(0, 4);
    const part3 = toHex(uid3).substring(0, 4);
    const part4 = toHex(uid4).substring(0, 4);
    const part5 = toHex(uid5).substring(0, 12);
    
    return `${part1}-${part2}-${part3}-${part4}-${part5}`;
};

// Helper function to get current user ID
const getCurrentUserId = async () => {
    return new Promise((resolve, reject) => {
        const user = auth.currentUser;
        
        if (user) {
            const guid = firebaseUidToGuid(user.uid);
            console.log("Current Firebase User:", user);
            console.log("Firebase UID:", user.uid);
            console.log("Converted to GUID:", guid);
            resolve(guid);
        } else {
            // Wait for auth state to be ready
            const unsubscribe = auth.onAuthStateChanged((user) => {
                unsubscribe();
                if (user) {
                    const guid = firebaseUidToGuid(user.uid);
                    console.log("Current Firebase User:", user);
                    console.log("Firebase UID:", user.uid);
                    console.log("Converted to GUID:", guid);
                    resolve(guid);
                } else {
                    reject(new Error("User not authenticated"));
                }
            });
        }
    });
};

// ==================== TASKS ====================

export const fetchTasks = async (userId) => {
    try {
        // If userId is provided, use it directly (for explicit loading)
        const uid = userId || await getCurrentUserId();
        const response = await axios.get(`${API_BASE_URL}/tasks/user/${uid}`);
        console.log("Fetched tasks from backend:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error loading tasks:", error.response?.data || error.message);
        throw error;
    }
};

export const createTask = async (taskData) => {
    const userId = await getCurrentUserId();
    const taskColor = getDeterministicColor(taskData.title || `task-${Date.now()}`);

    const backendTask = {
        userId,
        title: taskData.title,
        description: taskData.description || null,
        color: taskData.color || taskColor,
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

    // Only add location if it has valid data
    if (taskData.location && taskData.latitude != null && taskData.longitude != null) {
        backendTask.location = {
            locationName: taskData.location,
            locationCoords: `${taskData.latitude},${taskData.longitude}`
        };
    }

    try {
        console.log("Sending new task to backend:", backendTask);
        const response = await axios.post(`${API_BASE_URL}/tasks/`, backendTask, {
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
        !["inbox", "done", "today", "graphs", "calendar", "map"].includes(
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
        color: updatedTask.color || null,
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

    // Only add location if it has valid data
    if (updatedTask.location && updatedTask.latitude != null && updatedTask.longitude != null) {
        backendTask.location = {
            locationName: updatedTask.location,
            locationCoords: `${updatedTask.latitude},${updatedTask.longitude}`
        };
    }

    try {
        console.log("Sending update (PATCH) to backend:", backendTask);
        const response = await axios.patch(
            `${API_BASE_URL}/tasks/${updatedTask.id}`,
            backendTask,
            { headers: { "Content-Type": "application/json" } }
        );
        console.log("Backend update response:", response.data);
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

// ==================== CONSTANTS ====================

export { FIXED_INBOX_ID };