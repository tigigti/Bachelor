import cytoscape from "cytoscape";
import klay from "cytoscape-klay";

const metaInformationContainer = document.getElementById("meta-information-container");

cytoscape.use(klay);

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
      { data: { id: "c" } },
      { data: { id: "d" } }
    ],
    edges: [
      {
        data: { id: "ab", source: "a", target: "b" }
      },
      { data: { id: "bc", source: "b", target: "c" } },
      { data: { id: "dc", source: "d", target: "c" } }
    ]
  },
  layout: {
    name: "klay"
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

cy.on("tap", e => {
  const node = e.target;
});

export default cy;
