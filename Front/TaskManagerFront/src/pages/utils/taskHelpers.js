import dayjs from "dayjs";

/**
 * Get valid parent tasks (tasks that won't create circular dependencies)
 */
export function getValidParents(taskId, allTasks) {
    if (!taskId) return allTasks.filter((t) => !t.completed);

    // Find all tasks that would create a circular dependency
    // if taskId became their parent (i.e., tasks that have taskId in their dependency chain)
    const descendants = new Set();
    function collectDescendants(id) {
        allTasks.forEach((t) => {
            if (t.childrenIds.includes(id)) {
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

/**
 * Get parent tasks (tasks that have this taskId in their childrenIds)
 */
export function getParents(taskId, tasks = []) {
    if (!Array.isArray(tasks)) return [];
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.parentId) return [];
    return tasks.filter(t => task.parentId.includes(t.id));
}


/**
 * Get children using childrenIds array
 */
export function getChildren(taskId, allTasks) {
    const parentTask = allTasks.find((t) => t.id === taskId);
    if (!parentTask) return [];
    return allTasks.filter(
        (t) => parentTask.childrenIds.includes(t.id) && !t.completed
    );
}

/**
 * Filter tasks based on current filters
 */
export function filterTasks(
    tasks,
    selectedCategory,
    searchText,
    filters
) {
    return tasks.filter((task) => {
        // Category filter
        if (selectedCategory === "today") {
            if (task.deadline !== dayjs().format("YYYY-MM-DD")) return false;
        } else if (task.categoryId !== selectedCategory) {
            return false;
        }

        // Search filter
        if (
            searchText &&
            !task.title.toLowerCase().includes(searchText.toLowerCase())
        )
            return false;

        // Priority filter
        if (filters.priority !== "All" && task.priority !== filters.priority)
            return false;

        // Status filter
        if (filters.status === "Done" && !task.completed) return false;
        if (filters.status === "Undone" && task.completed) return false;

        // Deadline filter
        if (filters.deadline && task.deadline !== filters.deadline) return false;

        // Deadline time filter
        if (filters.deadlineTime) {
            if (!task.deadlineTime || task.deadlineTime !== filters.deadlineTime)
                return false;
        }

        return true;
    });
}

/**
 * Calculate total expenses for completed tasks
 */
export function calculateTotalExpenses(tasks) {
    return tasks
        .filter((t) => t.completed)
        .reduce((acc, t) => {
            const priceNum = Number(t.price);
            return acc + (Number.isFinite(priceNum) ? priceNum : 0);
        }, 0)
        .toFixed(2);
}

/**
 * Priority color helper
 */
export function priorityColor(p) {
    if (p === "Medium")
        return { backgroundColor: "#e6f4ff", borderColor: "#2563eb" };
    return p === "Low" ? "default" : "red";
}