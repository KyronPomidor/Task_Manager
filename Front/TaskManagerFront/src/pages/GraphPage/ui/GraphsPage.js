import { ForceGraph2D } from "react-force-graph";
import React, { useState } from "react";


export function GraphsPage() {
  const [graphData, setGraphData] = useState({
    nodes: [
      { id: "Note 1" },
      { id: "Note 2" },
      { id: "Note 3" },
      { id: "Note 4" },
      { id: "Note 5" },
    ],
    links: [
      { source: "Note 1", target: "Note 2" },
      { source: "Note 2", target: "Note 3" },
      { source: "Note 2", target: "Note 5" },
      { source: "Note 3", target: "Note 4" },
      { source: "Note 4", target: "Note 1" },
    ]
  });

  const [selectedNode, setSelectedNode] = useState(null);
  const [addingRelationFrom, setAddingRelationFrom] = useState(null);

  // Delete node and its relations
  const handleDelete = () => {
    if (!selectedNode) return;
    setGraphData(prev => ({
      nodes: prev.nodes.filter(n => n.id !== selectedNode.id),
      links: prev.links.filter(
        l => l.source.id !== selectedNode.id && l.target.id !== selectedNode.id
      )
    }));
    setSelectedNode(null);
  };

  const handleAddRelation = () => {
    if (!selectedNode) return;
    setAddingRelationFrom(selectedNode);
    setSelectedNode(null); // hide buttons until second click
  };

  const handleNodeClick = node => {
    if (addingRelationFrom) {
      // create link from first node -> clicked node
      setGraphData(prev => ({
        ...prev,
        links: [...prev.links, { source: addingRelationFrom.id, target: node.id }]
      }));
      setAddingRelationFrom(null);
    } else {
      // normal selection
      setSelectedNode(node);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#fff", position: "relative" }}>
      <ForceGraph2D
        graphData={graphData}
        nodeLabel="id"
        nodeAutoColorBy="id"
        nodeCanvasObjectMode={() => "after"} // run after circles
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.fillStyle = "#111";
          ctx.textAlign = "center";
          ctx.fillText(label, node.x, node.y - 8); // draw above circle
        }}
        linkDirectionalArrowLength={6}       // arrow size
        linkDirectionalArrowRelPos={1}       // position (1 = at end of link)
        linkColor={() => "gray"}             // color of links
      />

      {/* Action buttons when a node is selected */}
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
      {/* Info when waiting for relation */}
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
