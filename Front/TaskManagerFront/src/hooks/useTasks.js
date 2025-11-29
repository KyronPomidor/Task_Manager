import { useState, useEffect, useRef } from "react";
import {
  fetchTasks,
  createTask,
  updateTask as apiUpdateTask,
  updateTaskOrder as apiUpdateTaskOrder,
} from "../api/taskService";
import {
  mapTaskFromBackend,
  createTempTask,
  migrateParentIdsToChildren,
} from "../utils/taskUtils";

export function useTasks(categories, selectedCategory) {
  const [tasks, setTasks] = useState([]);

  // Buffer for updates made while a task still has a temporary id.
  // tempId -> merged patch to send when real id arrives
  const pendingAfterCreateRef = useRef(new Map());
  
  // Track tasks that are being created to prevent race conditions
  const creatingTasksRef = useRef(new Set());

  // Fetch tasks when categories are loaded
  useEffect(() => {
    if (categories.length <= 1) return;

    const loadTasks = async () => {
      try {
        const data = await fetchTasks();
        const validCategoryIds = categories.map((c) => c.id);
        const mapped = data.map((t) => mapTaskFromBackend(t, validCategoryIds));
        const sorted = mapped.sort((a, b) => a.positionOrder - b.positionOrder);
        setTasks(sorted);
      } catch {
        setTasks([]);
      }
    };

    loadTasks();
  }, [categories]);

  // Re-map children after tasks change (if needed)
  useEffect(() => {
    setTasks((prev) => migrateParentIdsToChildren(prev));
  }, [tasks.length]);

  // ---- helpers for staging + flushing updates made during temp-id phase ----
  const stagePendingUpdate = (tempId, patch) => {
    if (!tempId) return;
    const prev = pendingAfterCreateRef.current.get(tempId) || {};
    const merged = { ...prev, ...patch };
    pendingAfterCreateRef.current.set(tempId, merged);
    console.log(`📝 Staged update for ${tempId}:`, merged);
  };

  const flushPendingFor = async (tempId, newId) => {
    const staged = pendingAfterCreateRef.current.get(tempId);
    if (!staged || Object.keys(staged).length === 0) {
      console.log(`✅ No pending updates for ${tempId}`);
      return;
    }
    
    console.log(`🔄 Flushing pending updates for ${tempId} -> ${newId}:`, staged);
    
    try {
      await apiUpdateTask({ id: newId, ...staged });
      console.log(`✅ Successfully flushed updates for ${newId}`);
      pendingAfterCreateRef.current.delete(tempId);
    } catch (error) {
      console.error(`❌ Failed to flush updates for ${newId}:`, error);
      // Keep the staged updates in case we want to retry
    }
  };

  // ------------------------------- actions ---------------------------------

  // Add task (optimistic)
  const addTask = async (newTask) => {
    const tempTask = createTempTask(newTask, selectedCategory);
    const tempId = tempTask.id;

    // Mark this task as being created
    creatingTasksRef.current.add(tempId);

    // Optimistic: add at top and shift others down
    setTasks((prev) => [
      tempTask,
      ...prev.map((t) => ({ ...t, positionOrder: t.positionOrder + 1 })),
    ]);

    try {
      console.log(`🆕 Creating task with tempId: ${tempId}`);
      
      const createdTask = await createTask({
        ...newTask,
        categoryId: selectedCategory,
        positionOrder: 0,
      });

      console.log(`📦 Backend response:`, createdTask);

      // Backend might return just the ID string, or an object with id/taskId property
      let newId = null;
      if (typeof createdTask === 'string') {
        // Backend returned just the ID as a string
        newId = createdTask;
      } else if (createdTask?.id || createdTask?.taskId) {
        // Backend returned an object with id or taskId property
        const newIdRaw = createdTask.id ?? createdTask.taskId;
        newId = newIdRaw != null ? String(newIdRaw) : null;
      }

      console.log(`🔑 Extracted ID: ${newId} from response`);

      if (newId) {
        console.log(`✅ Task created with real ID: ${newId} (was ${tempId})`);
        
        // Swap temp id → real id locally
        setTasks((prev) =>
          prev.map((t) =>
            t.id === tempId
              ? {
                  ...t,
                  id: newId,
                  positionOrder: createdTask.positionOrder ?? 0,
                }
              : t
          )
        );

        // IMPORTANT: Wait for the state to update before flushing
        // Use a small delay to ensure React has processed the state update
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Flush any edits/moves/reorders that happened while the task was temp
        await flushPendingFor(tempId, newId);
        
        // Mark creation as complete
        creatingTasksRef.current.delete(tempId);
      } else {
        console.error(`❌ No valid ID in backend response:`, createdTask);
        throw new Error('Backend did not return a valid task ID');
      }
    } catch (error) {
      console.error(`❌ Failed to create task ${tempId}:`, error);
      // Roll back: remove temp task
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
      pendingAfterCreateRef.current.delete(tempId);
      creatingTasksRef.current.delete(tempId);
    }
  };

  // Update task (optimistic; if temp, stage & skip backend for now)
  const updateTask = async (updatedTask) => {
    const previousTask = tasks.find((t) => t.id === updatedTask.id);

    // Optimistic UI
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? { ...t, ...updatedTask } : t))
    );

    // Still temp? Stage patch and return; it will be flushed once real id arrives
    if (typeof updatedTask.id === "string" && updatedTask.id.startsWith("temp-")) {
      console.log(`⏳ Task ${updatedTask.id} is still temporary, staging update`);
      const { id, ...patch } = updatedTask;
      stagePendingUpdate(id, patch);
      
      // Check if the task is still being created
      if (creatingTasksRef.current.has(id)) {
        console.log(`⏳ Waiting for task creation to complete for ${id}`);
      }
      
      return;
    }

    try {
      console.log(`💾 Updating task ${updatedTask.id} on backend`);
      await apiUpdateTask(updatedTask);
      console.log(`✅ Task ${updatedTask.id} updated successfully`);
    } catch (error) {
      console.error(`❌ Failed to update task ${updatedTask.id}:`, error);
      // Rollback on server failure
      if (previousTask) {
        setTasks((prev) =>
          prev.map((t) => (t.id === updatedTask.id ? previousTask : t))
        );
      }
    }
  };

  // Update task order only (if temp, stage it; else patch immediately)
  const updateTaskOrder = async (id, positionOrder) => {
    if (typeof id === "string" && id.startsWith("temp-")) {
      console.log(`⏳ Task ${id} is still temporary, staging order update`);
      stagePendingUpdate(id, { positionOrder });
      return;
    }
    try {
      console.log(`📊 Updating order for task ${id} to ${positionOrder}`);
      await apiUpdateTaskOrder(id, positionOrder);
    } catch (error) {
      console.error(`❌ Failed to update order for task ${id}:`, error);
    }
  };

  return {
    tasks,
    setTasks,
    addTask,
    updateTask,
    updateTaskOrder,
  };
}