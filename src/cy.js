import cytoscape from "cytoscape";
import klay from "cytoscape-klay";
import edgehandles from "cytoscape-edgehandles";

const metaInformationContainer = document.getElementById("meta-information-container");

cytoscape.use(klay);
cytoscape.use(edgehandles);

console.log("ai gude");

const cy = cytoscape({
  container: document.getElementById("cy"),

  elements: {
    nodes: [
      {
        data: { id: "a", age: 12, time: "12 hours", name: "a" }
      },

      {
        data: { id: "b", name: "b" }
      },
      { data: { id: "c", name: "c" } },
      { data: { id: "d", name: "d" } }
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

  style: [
    {
      selector: "node[name]",
      style: {
        content: "data(name)"
      }
    },
    {
      selector: "edge",
      style: {
        "curve-style": "bezier",
        "target-arrow-shape": "triangle"
      }
    },

    {
      selector: ".eh-handle",
      style: {
        "background-color": "red",
        width: 6,
        height: 6,
        shape: "ellipse",
        "overlay-opacity": 0,
        "border-width": 6, // makes the handle easier to hit
        "border-opacity": 0
      }
    },

    {
      selector: ".eh-hover",
      style: {
        "background-color": "red"
      }
    },

    {
      selector: ".eh-source",
      style: {
        "border-width": 1,
        "border-color": "red"
      }
    },

    {
      selector: ".eh-target",
      style: {
        "border-width": 1,
        "border-color": "red"
      }
    },

    {
      selector: ".eh-preview, .eh-ghost-edge",
      style: {
        "background-color": "red",
        "line-color": "red",
        "target-arrow-color": "red",
        "source-arrow-color": "red"
      }
    },

    {
      selector: ".eh-ghost-edge.eh-preview-active",
      style: {
        opacity: 0
      }
    }
  ]
});

// Display node metadata on click
cy.on("tap", e => {
  const node = e.target.data();
  for (let data in node) {
    console.log(data, node[data]);
  }
});

cy.edgehandles({
  complete: () => {
    cy.layout({ name: "klay" }).run();
  }
});

export default cy;
