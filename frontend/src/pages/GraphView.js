import React, { useEffect, useRef } from "react";
import CytoscapeComponent from "react-cytoscapejs";

function GraphView({ data }) {
  const cyRef = useRef(null);

  // ✅ Hook must be called ALWAYS
  useEffect(() => {
    if (!data || !data.attack_paths) return;

    if (cyRef.current) {
      cyRef.current.fit();
      cyRef.current.center();
    }
  }, [data]);

  // Now condition AFTER hook
  if (!data || !data.attack_paths) return null;

  const elements = [];
  const addedNodes = new Set();

  const criticalNodes = data.critical_path
    ? new Set(data.critical_path.path)
    : new Set();

  data.attack_paths.forEach((pathObj) => {
    pathObj.path.forEach((node, index) => {
      if (!addedNodes.has(node)) {
        elements.push({
          data: { id: node, label: node },
          classes: criticalNodes.has(node)
            ? "critical-node"
            : "normal-node",
        });
        addedNodes.add(node);
      }

      if (index < pathObj.path.length - 1) {
        elements.push({
          data: {
            id: `${node}-${pathObj.path[index + 1]}`,
            source: node,
            target: pathObj.path[index + 1],
          },
          classes:
            criticalNodes.has(node) &&
            criticalNodes.has(pathObj.path[index + 1])
              ? "critical-edge"
              : "normal-edge",
        });
      }
    });
  });

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>Attack Path Graph</h3>

      {/* Legend */}
      <div style={{ marginBottom: "10px" }}>
        <span style={{ color: "#dc2626", fontWeight: "bold" }}>
          ● Critical Path
        </span>
        <span style={{ marginLeft: "20px", color: "#2563eb", fontWeight: "bold" }}>
          ● Normal Node
        </span>
      </div>

      <CytoscapeComponent
        cy={(cy) => (cyRef.current = cy)}
        elements={elements}
        style={{
          width: "100%",
          height: "500px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#f9fafb",
        }}
        layout={{
          name: "breadthfirst",
          directed: true,
          padding: 30,
          spacingFactor: 1.5,
        }}
        stylesheet={[
          {
            selector: "node",
            style: {
              label: "data(label)",
              "text-valign": "center",
              "text-halign": "center",
              color: "#fff",
              "font-size": "12px",
              "font-weight": "bold",
            },
          },
          {
            selector: ".normal-node",
            style: {
              "background-color": "#2563eb",
              width: 50,
              height: 50,
            },
          },
          {
            selector: ".critical-node",
            style: {
              "background-color": "#dc2626",
              width: 55,
              height: 55,
              "border-width": 4,
              "border-color": "#7f1d1d",
            },
          },
          {
            selector: "edge",
            style: {
              width: 3,
              "curve-style": "bezier",
              "target-arrow-shape": "triangle",
              "target-arrow-color": "#9ca3af",
              "line-color": "#9ca3af",
            },
          },
          {
            selector: ".critical-edge",
            style: {
              "line-color": "#dc2626",
              "target-arrow-color": "#dc2626",
              width: 4,
            },
          },
        ]}
      />
    </div>
  );
}

export default GraphView;