import { useState, useEffect } from "react";
import {
    fetchCategories,
    createCategory as apiCreateCategory,
    renameCategory,
    updateCategoryParent,
    deleteCategory as apiDeleteCategory,
} from "../api/taskService";
import { normalizeCategories } from "../utils/taskUtils";

export function useCategories() {
    const [categories, setCategories] = useState([
        { id: "inbox", name: "Inbox", parentId: null },
    ]);

    // Fetch categories on mount
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                const normalized = normalizeCategories(data);

                setCategories((prev) => {
                    const inbox =
                        prev.find((c) => c.id === "inbox") || {
                            id: "inbox",
                            name: "Inbox",
                            parentId: null,
                        };

                    const tempCats = prev.filter((c) => String(c.id).startsWith("temp-"));
                    const byId = new Map();
                    [...normalized, ...tempCats].forEach((c) => byId.set(c.id, c));

                    return [inbox, ...byId.values()];
                });
            } catch (error) {
                // Error already logged in service
            }
        };

        loadCategories();
    }, []);

    // Add category
    const addCategory = async (title, parentId = null) => {
        const tempId = "temp-" + Date.now();
        const optimistic = {
            id: tempId,
            name: title,
            parentId: parentId || null,
            order: 0,
        };

        setCategories((prev) => [...prev, optimistic]);

        try {
            const data = await apiCreateCategory(title, parentId);
            setCategories((prev) =>
                prev.map((c) => (c.id === tempId ? { ...c, id: data.id } : c))
            );
        } catch (error) {
            // Rollback on error
            setCategories((prev) => prev.filter((c) => c.id !== tempId));
        }
    };

    // Edit category
    const editCategory = async (id, newTitle, newParentId = null) => {
        const prevCats = categories;
        const old = categories.find((c) => c.id === id);
        if (!old) return;

        const normalizedParentId = newParentId === "" ? null : newParentId;

        const titleChanged = (old.name || "") !== (newTitle || "");
        const parentChanged = (old.parentId || null) !== (normalizedParentId || null);

        // Optimistic update
        setCategories((prev) =>
            prev.map((c) =>
                c.id === id ? { ...c, name: newTitle, parentId: normalizedParentId } : c
            )
        );

        try {
            if (titleChanged) {
                await renameCategory(id, newTitle);
            }
            if (parentChanged) {
                await updateCategoryParent(id, normalizedParentId);
            }
        } catch (error) {
            // Rollback on error
            setCategories(prevCats);
        }
    };

    // Delete category
    const deleteCategory = async (id) => {
        const prevCats = categories;

        // Optimistic update
        setCategories((prev) =>
            prev.filter((c) => c.id !== id && c.parentId !== id)
        );

        try {
            await apiDeleteCategory(id);
        } catch (error) {
            // Rollback on error
            setCategories(prevCats);
        }
    };

    return {
        categories,
        setCategories,
        addCategory,
        editCategory,
        deleteCategory,
    };
}