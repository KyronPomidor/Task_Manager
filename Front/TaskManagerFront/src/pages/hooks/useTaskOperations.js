import { Modal } from "antd";
import { getChildren, getParents } from "../utils/taskHelpers";

export function useTaskOperations(
    allTasks,
    setTasks,
    updateTask
) {
    /**
     * Toggle task completion status
     */
    const toggleComplete = (id) => {
        let updated;

        setTasks((prev) => {
            const task = prev.find((t) => t.id === id);
            if (!task) return prev;

            if (!task.completed) {
                // Check if task has children in its childrenIds array
                const children = allTasks.filter((t) =>
                    task.childrenIds.includes(t.id)
                );
                if (children.some((c) => !c.completed)) {
                    Modal.warning({
                        title: "Cannot complete task",
                        content: "This parent task still has unfinished child tasks.",
                    });
                    return prev;
                }
            }

            updated = {
                ...task,
                completed: !task.completed,
                categoryId: !task.completed ? "done" : "inbox",
            };

            return prev.map((t) => (t.id === id ? updated : t));
        });

        if (updated) {
            updateTask(updated);
        }
    };

    /**
     * Handle budget item addition
     */
    const addBudgetItem = (budgetName, budgetSum, tempBudgetItems, setTempBudgetItems) => {
        if (!budgetName.trim() || !budgetSum) {
            Modal.error({ title: "Both name and sum are required" });
            return false;
        }

        const sumVal = parseFloat(budgetSum);
        if (isNaN(sumVal) || sumVal <= 0) {
            Modal.error({ title: "Enter a valid sum" });
            return false;
        }

        const updatedItems = [
            ...tempBudgetItems,
            { id: Date.now().toString(), name: budgetName, sum: sumVal },
        ];
        setTempBudgetItems(updatedItems);
        return true;
    };

    /**
     * Save budget items to task
     */
    const saveBudgetItems = (
        budgetTask,
        tempBudgetItems,
        setTasks,
        updateTask,
        setBudgetOpen,
        setBudgetTask,
        setTempBudgetItems
    ) => {
        if (!budgetTask) return;

        const newSum = tempBudgetItems.reduce((acc, item) => acc + item.sum, 0);
        const total = (budgetTask.price || 0) + newSum;
        const updatedItems = [
            ...(budgetTask.budgetItems || []),
            ...tempBudgetItems,
        ];

        const updated = {
            ...budgetTask,
            budgetItems: updatedItems,
            price: total,
        };

        setTasks((prev) =>
            prev.map((t) => (t.id === budgetTask.id ? updated : t))
        );
        updateTask(updated);

        setBudgetOpen(false);
        setBudgetTask(null);
        setTempBudgetItems([]);
    };

    /**
     * Handle child indicator click (navigate to child task)
     */
    const handleChildIndicatorClick = (
        childId,
        allTasks,
        setSelectedCategory,
        setSelectedTask,
        setDetailsOpen
    ) => {
        const childTask = allTasks.find((t) => t.id === childId);
        if (childTask && typeof setSelectedCategory === "function") {
            setSelectedCategory(childTask.categoryId);
            setSelectedTask(childTask);
            setDetailsOpen(true);
        } else {
            console.warn(
                `Cannot navigate to child task category. Child task with ID ${childId} not found or setSelectedCategory is not a function.`
            );
        }
    };

    return {
        toggleComplete,
        addBudgetItem,
        saveBudgetItems,
        handleChildIndicatorClick,
    };
}