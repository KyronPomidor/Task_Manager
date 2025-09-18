import { useState, useMemo } from "react";
import { Tabs } from "antd";
import { GraphsPage } from "./GraphsPage";
import { Tasks } from "../../TaskPage";

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
    const [activeTab, setActiveTab] = useState("tasks");

    // Convert tasks to graph nodes with colors
    const graphNodes = useMemo(() =>
        tasks.map(task => ({
            id: task.title || `task-${task.id}`,
            taskId: task.id,
            x: task.graphNode?.x || Math.random() * 400,
            y: task.graphNode?.y || Math.random() * 400,
            color: generateColorFromId(task.id),
            // Store parent information for color inheritance
            parentIds: task.parentIds || []
        })),
        [tasks]
    );

    // Extract links from task relationships
    const graphLinks = useMemo(() => {
        const links = [];
        tasks.forEach(task => {
            task.parentIds?.forEach(parentId => {
                const parentTask = tasks.find(t => t.id === parentId);
                if (parentTask) {
                    links.push({
                        source: parentTask.title || `task-${parentTask.id}`,
                        target: task.title || `task-${task.id}`
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

    const handleShowGraph = () => setActiveTab("graph");
    const handleShowTasks = () => setActiveTab("tasks");

    return (
        <div style={{ height: "calc(100vh - 60px)" }}>
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                    {
                        key: "tasks",
                        label: "Tasks",
                        children: (
                            <Tasks
                                tasks={tasks}
                                setTasks={setTasks}
                                categories={categories}
                                onShowGraph={handleShowGraph}
                            />
                        )
                    },
                    {
                        key: "graph",
                        label: "Graph View",
                        children: (
                            <GraphsPage
                                graphData={graphData}
                                onGraphUpdate={handleGraphUpdate}
                                onCreateTask={handleCreateTaskFromNode}
                                tasks={tasks}
                                onShowTasks={handleShowTasks}
                            />
                        )
                    }
                ]}
            />
        </div>
    );
}