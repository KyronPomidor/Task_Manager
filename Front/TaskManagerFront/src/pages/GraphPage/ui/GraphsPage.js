import React, { useState } from "react";
import VisGraph from "react-vis-graph-wrapper";
import { Button } from "antd";

export function GraphsPage({
  graphData,
  onGraphUpdate,
  onCreateTask,
  tasks,
  setTasks,
  updateTask,
  isDarkMode = false,   // ← new
  colors,               // ← new
}) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [addingRelationFrom, setAddingRelationFrom] = useState(null);

  // Dark mode colors — only visual change
  const bg = colors?.bg || (isDarkMode ? "#1f2123" : "#ffffff");
  const text = colors?.text || (isDarkMode ? "#e5e5e5" : "#111111");
  const cardBg = isDarkMode ? "#2b2d2f" : "#f0f0f0";
  const hintBg = isDarkMode ? "#333" : "#333"; // keep dark for readability

  const options = {
    autoResize: true,
    height: "100%",
    width: "100%",
    layout: { hierarchical: false },
    physics: {
      enabled: true,
      stabilization: { enabled: true, iterations: 1500, updateInterval: 50 },
      barnesHut: {
        gravitationalConstant: -3000,
        springLength: 150,
        springConstant: 0.06,
        damping: 1,
        avoidOverlap: 0,
      },
      solver: "barnesHut",
      maxVelocity: 50,
      minVelocity: 0.01,
      timestep: 0.4,
    },
    nodes: {
      shape: "dot",
      size: 25,
      font: { size: 14, color: text }, // ← only change: dynamic text color
    },
    edges: {
      color: isDarkMode ? "#999" : "gray", // ← slightly brighter in dark mode
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

  // ORIGINAL events — 100% untouched
  const events = {
    select: ({ nodes }) => {
      if (nodes.length > 0) {
        const nodeId = nodes[0];
        if (addingRelationFrom && nodeId !== addingRelationFrom) {
          console.log(`Adding relationship: ${addingRelationFrom} -> ${nodeId}`);

          const parentTask = tasks.find((task) => String(task.id) === String(addingRelationFrom));

          if (parentTask) {
            const childrenIds = parentTask.childrenIds || [];
            if (!childrenIds.includes(String(nodeId))) {
              console.log(`Adding ${nodeId} to children of ${parentTask.id}`);

              const updatedTask = {
                ...parentTask,
                childrenIds: [...childrenIds, String(nodeId)],
              };

              const updatedTasks = tasks.map((task) =>
                String(task.id) === String(addingRelationFrom) ? updatedTask : task
              );
              setTasks(updatedTasks);

              if (updateTask) {
                console.log("Syncing relationship to backend:", updatedTask);
                updateTask(updatedTask);
              }
            } else {
              console.log(`${nodeId} already a child of ${parentTask.id}`);
            }
          }

          setAddingRelationFrom(null);
        } else {
          setSelectedNode(nodeId);
        }
      } else {
        setSelectedNode(null);
      }
    },
    doubleClick: ({ nodes, pointer }) => {
      if (nodes.length > 0) {
        const nodeId = nodes[0];
        const correspondingTask = tasks.find(
          (t) => String(t.id) === String(nodeId) || t.title === nodeId
        );
        if (!correspondingTask && onCreateTask) {
          onCreateTask(nodeId, pointer?.canvas);
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

  const flippedGraph = {
    ...graphData,
    edges: graphData.edges.map((edge) => ({
      from: edge.to,
      to: edge.from,
    })),
  };

  return (
    <div
    style={{
      width: "100%",
      height: "100vh",
      background: bg,
      position: "relative",
    }}
  >
    {/* Top controls */}
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        zIndex: 1000,
        display: "flex",
        gap: "10px",
        alignItems: "center",
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
            background: cardBg,
            color: text,
            padding: "8px 12px",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          Selected:{" "}
          {tasks.find((t) => String(t.id) === String(selectedNode))?.title || selectedNode}
        </div>
      )}
    </div>

    {/* Linking hint */}
    {addingRelationFrom && (
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 20,
          background: hintBg,
          padding: "10px",
          borderRadius: "8px",
          color: "white",
          maxWidth: "300px",
          zIndex: 1000,
        }}
      >
        <p style={{ margin: "0 0 8px 0" }}>
          Click another node to make it a child of{" "}
          <b>
            {tasks.find((t) => String(t.id) === String(addingRelationFrom))?.title ||
              addingRelationFrom}
          </b>
        </p>
        <Button size="small" onClick={() => setAddingRelationFrom(null)}>
          Cancel
        </Button>
      </div>
    )}

    <VisGraph graph={flippedGraph} options={options} events={events} />
  </div>);
}