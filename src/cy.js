// Initialise Graph

import cytoscape from "cytoscape";
import klay from "cytoscape-klay";
import edgehandles from "cytoscape-edgehandles";

cytoscape.use(klay);
cytoscape.use(edgehandles);

export const layoutObject = {
  name: "klay",
  animate: true,
  animationDuration: 200,
  fit: true
};

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
        label: "data(name)",
        width: "label",
        height: "label",
        shape: "rectangle",
        "text-halign": "center",
        "text-valign": "center",
        padding: 4
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

export default cy;
