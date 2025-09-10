import React from "react";
import { ForceGraph2D } from "react-force-graph";

export default function GraphsPage() {
  const data = {
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
  };

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#fff" }}>
      <ForceGraph2D
        graphData={data}
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
    </div>
  );
}
