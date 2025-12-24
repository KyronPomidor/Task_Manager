import { useMemo } from "react";
import { GraphsPage } from "./GraphsPage";
import { getDeterministicColor } from "../../../utils/colorUtils";

export function TaskGraphIntegration({
  tasks,
  setTasks,
  categories,
  updateTask,
  isMobile,
  onOpenMenu,
}) {
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
      if (!edge.from || !edge.to || edge.from === edge.to) return false;
      const key = `${edge.from}->${edge.to}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const graphData = useMemo(() => {
    const validTasks = tasks.filter(
      (task) =>
        task.id &&
        (typeof task.id === "string" || typeof task.id === "number") &&
        !task.completed
    );

    let nodes = validTasks.map((task) => ({
      id: String(task.id),
      label: task.title || `Task ${task.id}`,
      color: task.color || getDeterministicColor(String(task.id)),
      x: task.graphNode?.x,
      y: task.graphNode?.y,
      fixed: task.graphNode?.fixed || false,
    }));

    let edges = validTasks
      .flatMap((task) =>
        (task.childrenIds || []).map((childId) => {
          const childTask = tasks.find(
            (t) => String(t.id) === String(childId) && !t.completed
          );
          if (!childTask) return null;
          return {
            id: `${String(task.id)}-${String(childId)}`,
            from: String(task.id),
            to: String(childId),
          };
        })
      )
      .filter((edge) => edge !== null);

    nodes = uniqueById(nodes);
    edges = uniqueEdges(edges);

    return { nodes, edges };
  }, [tasks]);

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

  const handleCreateTaskFromNode = (nodeId) => {
    const taskTitle = `New Task ${Date.now()}`;
    const newTask = {
      id: `task-${Date.now()}`,
      title: taskTitle,
      description: `Task created from node ${nodeId}`,
      color: getDeterministicColor(taskTitle),
      priority: "Medium",
      categoryId: "inbox",
      completed: false,
      childrenIds: [],
      parentIds: [],
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
        updateTask={updateTask}
        isMobile={isMobile}
        onOpenMenu={onOpenMenu}
      />
    </div>
  );
}
