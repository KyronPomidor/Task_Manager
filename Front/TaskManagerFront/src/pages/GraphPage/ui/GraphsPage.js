import React, { useState, useRef, useEffect } from "react";
import { ForceGraph2D } from "react-force-graph";
import { Button } from "antd";

export function GraphsPage({ graphData, onGraphUpdate, onCreateTask, tasks, onShowTasks }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [addingRelationFrom, setAddingRelationFrom] = useState(null);
  const dragging = useRef(false);
  const fgRef = useRef();

  // Update graph data when props change
  useEffect(() => {
    // This will update the internal state when parent passes new data
  }, [graphData]);

  // Save positions and notify parent
  const savePositions = () => {
    const positions = {};
    graphData.nodes.forEach(node => {
      if (node.x !== undefined && node.y !== undefined) {
        positions[node.id] = { x: node.x, y: node.y };
      }
    });
    localStorage.setItem('graphNodePositions', JSON.stringify(positions));
    
    // Notify parent component about graph updates
    if (onGraphUpdate) {
      onGraphUpdate(graphData);
    }
  };

  const handleDelete = () => {
    if (!selectedNode) return;
    // You might want to handle task deletion here too
    setSelectedNode(null);
  };

  const handleAddRelation = () => {
    if (!selectedNode) return;
    setAddingRelationFrom(selectedNode);
    setSelectedNode(null);
  };

  const handleNodeClick = (node) => {
    if (dragging.current) return;

    if (addingRelationFrom) {
      // Create a link between nodes
      const newGraphData = {
        ...graphData,
        links: [...graphData.links, { source: addingRelationFrom.id, target: node.id }]
      };
      onGraphUpdate(newGraphData);
      setAddingRelationFrom(null);
    } else {
      setSelectedNode(node);
    }
  };

  const handleNodeDragEnd = (node) => {
    setTimeout(() => {
      dragging.current = false;
      savePositions();
    }, 0);
  };

  const handleNodeDoubleClick = (node) => {
    // Find if this node corresponds to a task
    const correspondingTask = tasks.find(
      t => t.id === node.taskId || t.title === node.id
    );
    
    if (!correspondingTask && onCreateTask) {
      // Create a new task from this node
      onCreateTask(node.id);
    }
  };

  const handleBackgroundClick = () => {
    if (addingRelationFrom) {
      setAddingRelationFrom(null);
    } else if (selectedNode) {
      setSelectedNode(null);
    }
  };

  return (
    <div style={{ width: "100%", height: "100%", background: "#fff", position: "relative" }}>
    <ForceGraph2D
      ref={fgRef}
      graphData={graphData}
      onNodeClick={handleNodeClick}
      onNodeDrag={() => (dragging.current = true)}
      onNodeDragEnd={handleNodeDragEnd}
      onNodeDoubleClick={handleNodeDoubleClick}
      onBackgroundClick={handleBackgroundClick}
      nodeLabel="id"
      nodeColor={(node) => {
        // If node has parents, use the color of the first parent
        if (node.parentIds && node.parentIds.length > 0) {
          // Find the parent node in the graph data
          const parentNode = graphData.nodes.find(n => 
            n.taskId === node.parentIds[0] || n.id === node.parentIds[0]
          );
          return parentNode ? parentNode.color : node.color;
        }
        return node.color;
      }}
      nodeCanvasObjectMode={() => "after"}
      nodeCanvasObject={(node, ctx, globalScale) => {
        const label = node.id;
        const fontSize = 12 / globalScale;
        ctx.font = `${fontSize}px Sans-Serif`;
        ctx.fillStyle = "#111";
        ctx.textAlign = "center";
        ctx.fillText(label, node.x, node.y - 8);
      }}
      linkDirectionalArrowLength={6}
      linkDirectionalArrowRelPos={1}
      linkColor={() => "gray"}
      d3VelocityDecay={0.4}
      d3AlphaTarget={0.3}
      d3Force="link"
      d3ForceConfig={{
        distance: 50,
        strength: 0.7
      }}
    />

      {selectedNode && (
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            background: "#222",
            padding: "10px",
            borderRadius: "8px",
            color: "white"
          }}
        >
          <p>Selected: {selectedNode.id}</p>
          <Button onClick={handleDelete} style={{ marginRight: "10px" }}>
            Delete
          </Button>
          <Button onClick={handleAddRelation}>Add Relation</Button>
          <Button onClick={onShowTasks} style={{ marginLeft: "10px" }}>
            View Task
          </Button>
        </div>
      )}

      {addingRelationFrom && (
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            background: "#333",
            padding: "10px",
            borderRadius: "8px",
            color: "white"
          }}
        >
          <p>Click another node to link from <b>{addingRelationFrom.id}</b></p>
        </div>
      )}
    </div>
  );
}
