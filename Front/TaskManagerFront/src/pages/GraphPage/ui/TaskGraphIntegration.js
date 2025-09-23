import { useMemo } from "react";
import { GraphsPage } from "./GraphsPage";
import { getParentColor } from "../../../utils/colorUtils";

// Helper function to generate consistent colors based on task ID
const generateColorFromId = (id) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 60%)`;
};

export function TaskGraphIntegration({ tasks, setTasks, categories }) {
    // Convert tasks to graph nodes with colors
    const graphNodes = useMemo(
        () =>
        tasks.map((task) => ({
            id: task.title || `task-${task.id}`,
            taskId: task.id,
            x: task.graphNode?.x || Math.random() * 400,
            y: task.graphNode?.y || Math.random() * 400,
            color:
            task.parentIds && task.parentIds.length > 0
                ? getParentColor(task.parentIds[0]) // Use the first parent's color
                : getParentColor(task.id), // Use the task's own ID for color if no parent
            parentIds: task.parentIds || [],
        })),
        [tasks]
    );

    // Extract links from task relationships
    const graphLinks = useMemo(() => {
        const links = [];
        tasks.forEach((task) => {
        task.parentIds?.forEach((parentId) => {
            const parentTask = tasks.find((t) => t.id === parentId);
            if (parentTask) {
            links.push({
                source: parentTask.title || `task-${parentTask.id}`,
                target: task.title || `task-${task.id}`,
            });
            }
        });
        });
        return links;
    }, [tasks]);

    const graphData = {
        nodes: graphNodes,
        links: graphLinks
    };

    // Handle graph node updates
    const handleGraphUpdate = (updatedGraphData) => {
        // Update task positions based on graph changes
        const updatedTasks = tasks.map(task => {
            const node = updatedGraphData.nodes.find(
                n => n.taskId === task.id || n.id === (task.title || `task-${task.id}`)
            );
            if (node) {
                return {
                    ...task,
                    graphNode: { ...task.graphNode, x: node.x, y: node.y }
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
            title: nodeId,
            description: `Task created from node ${nodeId}`,
            priority: "Medium",
            categoryId: "inbox",
            completed: false,
            parentIds: [],
            budgetItems: [],
            graphNode: { id: nodeId, x: 300, y: 300 }
        };
        setTasks(prev => [...prev, newTask]);
    };

    return (
        <div style={{ height: "calc(100vh - 60px)" }}>
            <GraphsPage
                graphData={graphData}
                onGraphUpdate={handleGraphUpdate}
                onCreateTask={handleCreateTaskFromNode}
                tasks={tasks}
            />
        </div>
    );
}