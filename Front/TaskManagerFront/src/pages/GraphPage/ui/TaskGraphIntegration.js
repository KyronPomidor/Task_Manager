import { useMemo } from "react";
import { GraphsPage } from "./GraphsPage";
import { getDeterministicColor } from "../../../utils/colorUtils";

export function TaskGraphIntegration({ tasks, setTasks, categories }) {
  // Dedup helper
  const uniqueById = (arr) => {
    const seen = new Set();
    return arr.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  };

  const uniqueEdges = (arr) => {
    const seen = new Set();
    return arr.filter((edge) => {
      if (!edge.from || !edge.to || edge.from === edge.to) return false; // Skip invalid edges or self-loops
      const key = `${edge.from}->${edge.to}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  // Build graph data with guaranteed unique string IDs, excluding completed tasks
  const graphData = useMemo(() => {
    // Validate tasks and filter out completed tasks
    const validTasks = tasks.filter(
      (task) =>
        task.id &&
        (typeof task.id === "string" || typeof task.id === "number") &&
        !task.completed
    );
    if (validTasks.length !== tasks.length) {
      console.warn("Invalid or completed tasks detected and filtered out");
    }

    let nodes = validTasks.map((task) => ({
      id: String(task.id), // Always string
      label: task.title || `Task ${task.id}`,
      color: getDeterministicColor(String(task.id)),
      x: task.graphNode?.x,
      y: task.graphNode?.y,
      fixed: task.graphNode?.fixed || false,
    }));

    // ✅ FIX: Build edges from childrenIds instead of parentIds
    let edges = validTasks.flatMap((task) =>
      (task.childrenIds || []).map((childId) => {
        // Check if child task exists and is not completed
        const childTask = tasks.find((t) => String(t.id) === String(childId) && !t.completed);
        if (!childTask) return null;
        return {
          id: `${String(task.id)}-${String(childId)}`, // Unique edge ID
          from: String(task.id), // parent
          to: String(childId), // child
        };
      }).filter((edge) => edge !== null) // Remove null entries
    );

    // Remove duplicates
    nodes = uniqueById(nodes);
    edges = uniqueEdges(edges);

    return { nodes, edges };
  }, [tasks]);

  // Handle graph node updates
  const handleGraphUpdate = (updatedGraphData) => {
    const updatedTasks = tasks.map((task) => {
      const node = updatedGraphData.nodes.find((n) => n.id === String(task.id));
      if (node) {
        return {
          ...task,
          graphNode: {
            ...task.graphNode,
            x: node.x,
            y: node.y,
            fixed: node.fixed || false,
          },
        };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  // Handle task creation from graph
  const handleCreateTaskFromNode = (nodeId) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: `New Task ${Date.now()}`,
      description: `Task created from node ${nodeId}`,
      priority: "Medium",
      categoryId: "inbox",
      completed: false,
      childrenIds: [], // default children array
      parentIds: [], // keep for migration compatibility
      budgetItems: [],
      graphNode: { id: nodeId, x: 300, y: 300, fixed: false },
    };
    setTasks((prev) => [...prev, newTask]);
  };

  return (
    <div style={{ height: "calc(100vh - 60px)" }}>
      <GraphsPage
        graphData={graphData}
        onGraphUpdate={handleGraphUpdate}
        onCreateTask={handleCreateTaskFromNode}
        tasks={tasks}
        setTasks={setTasks}
      />
    </div>
  );
}
