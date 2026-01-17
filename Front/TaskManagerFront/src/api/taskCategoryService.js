import axios from "axios";
import { auth } from "../firebase/firebase";

const API_BASE_URL = "http://localhost:5053/api";
const FIXED_INBOX_ID = "00000000-0000-0000-0000-000000000001";

// Convert Firebase UID to deterministic GUID format
const firebaseUidToGuid = (uid) => {
    // Use SHA-256-like approach to create consistent GUID from Firebase UID
    let hash = 0;
    for (let i = 0; i < uid.length; i++) {
        hash = ((hash << 5) - hash) + uid.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
    }
    
    // Create a deterministic GUID based on the UID
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

// ==================== CATEGORIES ====================

export const fetchCategories = async (userId) => {
    try {
        // If userId is provided, use it directly (for explicit loading)
        const uid = userId || await getCurrentUserId();
        const { data } = await axios.get(`${API_BASE_URL}/categories/user/${uid}`);
        return data;
    } catch (error) {
        console.error("Error loading categories:", error.response?.data || error.message);
        throw error;
    }
};

export const createCategory = async (title, parentId = null) => {
    const userId = await getCurrentUserId();
    
    const payload = {
        userId,
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

export { FIXED_INBOX_ID };