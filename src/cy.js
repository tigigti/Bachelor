// Initialise Graph

import cytoscape from "cytoscape";
// import klay from "cytoscape-klay";
import edgehandles from "cytoscape-edgehandles";
import dagre from "cytoscape-dagre";

// cytoscape.use(klay);
cytoscape.use(dagre);
cytoscape.use(edgehandles);

export const layoutObject = {
    name: "dagre",
    animate: true,
    animationDuration: 200,
    fit: true,
    borderSpacing: 5
};

export const styleArray = [
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
            // "background-color": "#86c232",
            // color: "white"
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
        selector: ":selected",
        style: {
            "background-color": "#86c232",
            color: "white",
            "line-color": "#86c232",
            "target-arrow-color": "#86c232",
            "source-arrow-color": "#86c232"
        }
    },

    {
        selector: ".eh-handle",
        style: {
            "background-color": "#61892f",
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
            "background-color": "#61892f"
        }
    },

    {
        selector: ".eh-source",
        style: {
            "border-width": 1,
            "border-color": "#61892f"
        }
    },

    {
        selector: ".eh-target",
        style: {
            "border-width": 1,
            "border-color": "#61892f"
        }
    },

    {
        selector: ".eh-preview, .eh-ghost-edge",
        style: {
            "background-color": "#61892f",
            "line-color": "#61892f",
            "target-arrow-color": "#61892f",
            "source-arrow-color": "#61892f",
            color: "white"
        }
    },

    {
        selector: ".eh-ghost-edge.eh-preview-active",
        style: {
            opacity: 0
        }
    }
];

// TODO: Make a request in production App and import elements from DB
export const elementsObject = {
    nodes: [
        {
            data: {
                id: "a",
                startDate: "2000-11-27",
                endDate: "2020-01-07",
                name: "get a degree",
                desc: "desc",
                goalsList: [
                    { id: 1, name: "get motivated", done: false },
                    { id: 2, name: "even more motivation", done: true }
                ],
                category: "micro"
            }
        },

        {
            data: {
                id: "b",
                name: "make your fam proud",
                startDate: "2000-01-01",
                endDate: "2021-10-31",
                desc: "description",
                category: "meso"
            }
        },
        {
            data: {
                id: "c",
                name: "c",
                startDate: "2000-01-01",
                endDate: "2021-10-31",
                desc: "Hola amigo",
                category: "macro"
            }
        },
        { data: { id: "d", name: "d", startDate: "2000-01-01", endDate: "2021-10-31", desc: "Bogdaaan" } }
    ],
    edges: [
        {
            data: { id: "ab", source: "a", target: "b" }
        },
        { data: { id: "bc", source: "b", target: "c" } },
        { data: { id: "ad", source: "d", target: "c" } }
    ]
};

const cy = cytoscape({
    container: document.getElementById("cy"),

    elements: elementsObject,
    layout: layoutObject,
    // userZoomingEnabled: false,
    // userPanningEnabled: false,

    style: styleArray
});

export default cy;
