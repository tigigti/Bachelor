import cytoscape from "cytoscape";

console.log("ai gude");

const cy = cytoscape({
  container: document.getElementById("cy"),

  elements: {
    nodes: [
      {
        data: { id: "a" }
      },

      {
        data: { id: "b" }
      },
      { data: { id: "c" } }
    ],
    edges: [
      {
        data: { id: "ab", source: "a", target: "b" }
      },
      { data: { id: "bc", source: "b", target: "c" } }
    ]
  },
  layout: {
    name: "grid",
    rows: 1
  },

  // so we can see the ids
  style: [
    {
      selector: "node",
      style: {
        label: "data(id)"
      }
    }
  ]
});
