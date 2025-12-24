import axios from "axios";

const API_BASE_URL = "http://localhost:5053/api";
const FIXED_USER_ID = "283118eb-f3c5-4447-afa2-f5a93762a5e3";
const FIXED_INBOX_ID = "00000000-0000-0000-0000-000000000001";

// ==================== CATEGORIES ====================

export const fetchCategories = async () => {
    try {
        const { data } = await axios.get(`${API_BASE_URL}/categories/user/${FIXED_USER_ID}`);
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
