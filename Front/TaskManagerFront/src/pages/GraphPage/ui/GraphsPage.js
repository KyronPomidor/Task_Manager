import React, { useState, useRef, useEffect } from "react";
import { ForceGraph2D } from "react-force-graph";

export function GraphsPage() {
  const [graphData, setGraphData] = useState({
    nodes: [
      { id: "Note 1" },
      { id: "Note 2" },
      { id: "Note 3" },
      { id: "Note 4" },
      { id: "Note 5" },
      { id: "Note 6" },
      { id: "Note 7" },
    ],
    links: [
      { source: "Note 1", target: "Note 2" },
      { source: "Note 2", target: "Note 3" },
      { source: "Note 2", target: "Note 5" },
      { source: "Note 3", target: "Note 4" },
      { source: "Note 4", target: "Note 1" },
      { source: "Note 6", target: "Note 7" },
      { source: "Note 5", target: "Note 6" },
      { source: "Note 7", target: "Note 2" }
    ]
  });

  const [selectedNode, setSelectedNode] = useState(null);
  const [addingRelationFrom, setAddingRelationFrom] = useState(null);
  const dragging = useRef(false);
  const fgRef = useRef();

  // Load saved positions from localStorage on component mount
  useEffect(() => {
    const savedPositions = localStorage.getItem('graphNodePositions');
    if (savedPositions) {
      const positions = JSON.parse(savedPositions);
      
      setGraphData(prev => ({
        ...prev,
        nodes: prev.nodes.map(node => {
          if (positions[node.id]) {
            return { 
              ...node, 
              x: positions[node.id].x, 
              y: positions[node.id].y,
              vx: 0, // Reset velocity to prevent movement
              vy: 0
            };
          }
          return node;
        })
      }));
    }
  }, []);

  // Save positions to localStorage when they change
  const savePositions = () => {
    const positions = {};
    graphData.nodes.forEach(node => {
      if (node.x !== undefined && node.y !== undefined) {
        positions[node.id] = { x: node.x, y: node.y };
      }
    });
    localStorage.setItem('graphNodePositions', JSON.stringify(positions));
  };

  const handleDelete = () => {
    if (!selectedNode) return;
    setGraphData(prev => ({
      nodes: prev.nodes.filter(n => n.id !== selectedNode.id),
      links: prev.links.filter(
        l => l.source.id !== selectedNode.id && l.target.id !== selectedNode.id
      )
    }));
    
    // Also remove from saved positions
    const savedPositions = localStorage.getItem('graphNodePositions');
    if (savedPositions) {
      const positions = JSON.parse(savedPositions);
      delete positions[selectedNode.id];
      localStorage.setItem('graphNodePositions', JSON.stringify(positions));
    }
    
    setSelectedNode(null);
  };

  const handleAddRelation = () => {
    if (!selectedNode) return;
    setAddingRelationFrom(selectedNode);
    setSelectedNode(null);
  };

  const handleNodeClick = node => {
    if (dragging.current) return;

    if (addingRelationFrom) {
      setGraphData(prev => ({
        ...prev,
        links: [...prev.links, { source: addingRelationFrom.id, target: node.id }]
      }));
      setAddingRelationFrom(null);
    } else {
      setSelectedNode(node);
    }
  };

  // Handle node drag end and save positions
  const handleNodeDragEnd = node => {
    setTimeout(() => {
      dragging.current = false;
      savePositions(); // Save positions after dragging
    }, 0);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#fff", position: "relative" }}>
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        onNodeClick={handleNodeClick}
        onNodeDrag={() => (dragging.current = true)}
        onNodeDragEnd={handleNodeDragEnd}
        nodeLabel="id"
        nodeAutoColorBy="id"
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
          <button onClick={handleDelete} style={{ marginRight: "10px" }}>
            Delete
          </button>
          <button onClick={handleAddRelation}>Add Relation</button>
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