import React, { useState } from "react";
import VisGraph from "react-vis-graph-wrapper";
import { Button } from "antd";

export function GraphsPage({ graphData, onGraphUpdate, onCreateTask, tasks, setTasks, updateTask }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [addingRelationFrom, setAddingRelationFrom] = useState(null);

  const options = {
    autoResize: true,
    height: "100%",
    width: "100%",
    layout: {
      hierarchical: false,
    },
    physics: {
      enabled: true,
      stabilization: {
        enabled: true,
        iterations: 1500,
        updateInterval: 50,
      },
      barnesHut: {
        gravitationalConstant: -3000,
        springLength: 150,
        springConstant: 0.06,
        damping: 0.3,
        avoidOverlap: 0.5,
      },
      solver: "barnesHut",
      maxVelocity: 60,
      minVelocity: 0.1,
      timestep: 0.4,
    },
    nodes: {
      shape: "dot",
      size: 25,
      font: { size: 14, color: "#111" },
    },
    edges: {
      color: "gray",
      arrows: { to: { enabled: true, scaleFactor: 0.7 } },
      smooth: false,
    },
    interaction: {
      hover: true,
      dragNodes: true,
      dragView: true,
      zoomView: true,
    },
  };

  const events = {
    select: ({ nodes }) => {
      if (nodes.length > 0) {
        const nodeId = nodes[0];
        if (addingRelationFrom && nodeId !== addingRelationFrom) {
          // ARRAYS: Add new parent-child relationship using childrenIds
          console.log(`Adding relationship: ${addingRelationFrom} -> ${nodeId}`);

          // Find the parent task
          const parentTask = tasks.find((task) => String(task.id) === String(addingRelationFrom));

          if (parentTask) {
            const childrenIds = parentTask.childrenIds || [];
            if (!childrenIds.includes(String(nodeId))) {
              console.log(`Adding ${nodeId} to children of ${parentTask.id}`);

              // Create updated task with new child
              const updatedTask = {
                ...parentTask,
                childrenIds: [...childrenIds, String(nodeId)],
              };

              // Update local state
              const updatedTasks = tasks.map((task) =>
                String(task.id) === String(addingRelationFrom) ? updatedTask : task
              );
              setTasks(updatedTasks);

              // Sync with backend
              if (updateTask) {
                console.log("Syncing relationship to backend:", updatedTask);
                updateTask(updatedTask);
              }
            } else {
              console.log(`${nodeId} already a child of ${parentTask.id}`);
            }
          }

          setAddingRelationFrom(null); // Reset relation mode
        } else {
          setSelectedNode(nodeId);
        }
      } else {
        setSelectedNode(null);
      }
    },
    doubleClick: ({ nodes }) => {
      if (nodes.length > 0) {
        const nodeId = nodes[0];
        const correspondingTask = tasks.find(
          (t) => String(t.id) === String(nodeId) || t.title === nodeId
        );
        if (!correspondingTask && onCreateTask) {
          onCreateTask(nodeId);
        }
      }
    },
    dragEnd: ({ nodes, pointer }) => {
      if (nodes.length > 0) {
        const nodeId = nodes[0];
        const pos = pointer.canvas;

        const updatedNodes = graphData.nodes.map((n) =>
          n.id === nodeId ? { ...n, x: pos.x, y: pos.y } : n
        );
        onGraphUpdate({ ...graphData, nodes: updatedNodes });
      }
    },
  };

  // 🔄 Flip edge direction: from child → parent
  const flippedGraph = {
    ...graphData,
    edges: graphData.edges.map((edge) => ({
      from: edge.to,
      to: edge.from,
    })),
  };

  return (
    <div
      style={{ width: "100%", height: "100vh", background: "#fff", position: "relative" }}
    >
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 1000,
          display: "flex",
          gap: "10px",
        }}
      >
        <Button
          type={addingRelationFrom ? "default" : "primary"}
          onClick={() => setAddingRelationFrom(addingRelationFrom ? null : selectedNode)}
          disabled={!selectedNode}
        >
          {addingRelationFrom ? "Cancel Linking" : "Link Tasks"}
        </Button>

        {selectedNode && (
          <div
            style={{
              background: "#f0f0f0",
              padding: "8px 12px",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            Selected:{" "}
            {tasks.find((t) => String(t.id) === String(selectedNode))?.title ||
              selectedNode}
          </div>
        )}
      </div>

      <VisGraph graph={flippedGraph} options={options} events={events} />

      {addingRelationFrom && (
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 20,
            background: "#333",
            padding: "10px",
            borderRadius: "8px",
            color: "white",
            maxWidth: "300px",
          }}
        >
          <p>
            Click another node to make it a child of{" "}
            <b>
              {tasks.find((t) => String(t.id) === String(addingRelationFrom))?.title ||
                addingRelationFrom}
            </b>
          </p>
          <Button onClick={() => setAddingRelationFrom(null)} style={{ marginTop: "5px" }}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
