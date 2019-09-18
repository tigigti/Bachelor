// Initialise Graph

import cytoscape from "cytoscape";
import klay from "cytoscape-klay";
import edgehandles from "cytoscape-edgehandles";
import dagre from "cytoscape-dagre";

cytoscape.use(klay);
cytoscape.use(dagre);
cytoscape.use(edgehandles);

export const layoutObject = {
  name: "dagre",
  animate: true,
  animationDuration: 200,
  fit: true,
  borderSpacing: 5
};

const cy = cytoscape({
  container: document.getElementById("cy"),

  elements: {
    nodes: [
      {
        data: { id: "a", startDate: "2000-11-27", endDate: "2020-01-07", name: "get a degree" }
      },

      {
        data: { id: "b", name: "make your fam proud", startDate: "2000-01-01", endDate: "2021-10-31" }
      },
      { data: { id: "c", name: "c", startDate: "2000-01-01", endDate: "2021-10-31" } },
      { data: { id: "d", name: "d", startDate: "2000-01-01", endDate: "2021-10-31" } }
    ],
    edges: [
      {
        data: { id: "ab", source: "a", target: "b" }
      },
      { data: { id: "bc", source: "b", target: "c" } },
      { data: { id: "ad", source: "d", target: "c" } }
    ]
  },
  // layout: {
  //   name: "klay"
  // },

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
        width: 9,
        height: 9,
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

cy.layout(layoutObject).run();

export default cy;
