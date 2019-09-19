// DOM Binding

import cy, { layoutObject, styleArray } from "./cy";
// import "./events";

const metaInformationContainer = document.getElementById("meta-information-container");
const changeMetaDataForm = document.getElementById("change-metadata-form");

// Change Meta Data Form
const changeNodeNameInput = document.getElementById("change-node-name-input");
const changeNodeStartDate = document.getElementById("change-node-start-date");
const changeNodeEndDate = document.getElementById("change-node-end-date");
const changeNodeDesc = document.getElementById("change-node-description");

// Bind Buttons
const deleteBtn = document.getElementById("delete-btn");
const exportBtn = document.getElementById("export-btn");
const newRoadmapBtn = document.getElementById("new-roadmap-btn");
const importBtn = document.getElementById("import-btn");

// New Node Form
const addNodeForm = document.getElementById("add-node-form");
const nodeNameInput = document.getElementById("node-name-input");
const submitNewNodeBtn = document.querySelector("#add-node-form button");

let deletedNodes = [];

let testImports;

// ======= State =======

export const state = {
    activeNode: null,
    activeNodeListener: value => {
        // Toggle display of meta information
        if (value == null) {
            changeMetaDataForm.style.display = "none";
            deleteBtn.style.display = "none";
            metaInformationContainer.innerHTML = "";
            return;
        }

        if (value.group() == "edges") {
            changeMetaDataForm.style.display = "none";
            deleteBtn.style.display = "block";
            return;
        }
        changeMetaDataForm.style.display = "flex";
        deleteBtn.style.display = "block";
        renderMetaData();
    },
    get getNode() {
        return this.activeNode;
    },
    set setNode(x) {
        this.activeNode = x;
        this.activeNodeListener(x);
    }
};

// ======= Functions =======

const redraw = () => {
    cy.layout(layoutObject).run();
};

// Render information to Sidebar
const renderMetaData = () => {
    if (state.getNode == null) {
        return (metaInformationContainer.innerHTML = "");
    }
    const node = state.getNode.data();
    // let metaData = "";
    // for (let data in node) {
    //   metaData += `
    //     <div>${data}: ${node[data]}</div>
    //   `;
    // }

    changeNodeNameInput.value = node.name;
    changeNodeStartDate.value = node.startDate;
    changeNodeEndDate.value = node.endDate;
    changeNodeDesc.value = node.desc;

    // metaInformationContainer.innerHTML = metaData;
};

// Add new node
const addNode = name => {
    const now = new Date().toISOString().slice(0, 10);
    const node = cy.add({
        group: "nodes",
        data: { id: name, name: name, startDate: now, endDate: now, desc: "" }
    });

    redraw();
    return node;
};

// delete the active node
const removeActive = () => {
    if (!state.getNode) {
        return;
    }
    cy.remove(state.getNode);
    redraw();
    deletedNodes.push(state.getNode);
    state.setNode = null;
};

// Reset Selection
const unselectActive = () => {
    cy.filter().unselect();
    state.setNode = null;
};

// Update Active Node
const updateActiveNode = () => {
    state.getNode.data("name", changeNodeNameInput.value);
    state.getNode.data("startDate", changeNodeStartDate.value);
    state.getNode.data("endDate", changeNodeEndDate.value);
    state.getNode.data("desc", changeNodeDesc.value);

    renderMetaData();
    redraw();
};

// ======= Event Listener =======

// Add Node
addNodeForm.addEventListener("submit", e => {
    e.preventDefault();
    const node = addNode(nodeNameInput.value);
    state.setNode = node;
    cy.filter().unselect();
    cy.elements(node).select();
    nodeNameInput.value = "";
    submitNewNodeBtn.style.display = "none";
});

// Display add Node Button
nodeNameInput.addEventListener("input", e => {
    submitNewNodeBtn.style.display = e.target.value == "" ? "none" : "block";
});

// Display node metadata on click
cy.on("tap", e => {
    if (typeof e.target.group == "undefined") {
        return;
    }

    // Don't display Edgehandle Metadata (is in nodes group)
    if (e.target.classes()[0] == "eh-handle") {
        return;
    }

    if (e.target.group() == "nodes" || e.target.group() == "edges") {
        state.setNode = e.target;
    }
});

// Redraw Graph on Edge connection
cy.edgehandles({
    stop: sourceNode => {
        redraw();
        // Set node as active when it's handler is clicked
        state.setNode = sourceNode;
        cy.filter("node").unselect();
        state.getNode.select();
    }
});

// Change Meta Information
changeMetaDataForm.addEventListener("submit", e => {
    e.preventDefault();
    updateActiveNode();
});

changeNodeStartDate.addEventListener("change", e => {
    e.preventDefault();
    updateActiveNode();
});

changeNodeEndDate.addEventListener("change", e => {
    updateActiveNode();
});

// Delete data
deleteBtn.addEventListener("click", e => {
    if (!state.getNode) {
        return;
    }
    removeActive();
});

// Export the graph
exportBtn.addEventListener("click", e => {
    // Exports the elements as flat array to be imported at a later state
    // Exclude the edgehandler from being exported as a node
    const exportedEles = cy.elements().filter((ele, i, eles) => {
        return ele.classes()[0] != "eh-handle";
    });
    console.log(exportedEles);
    testImports = exportedEles.jsons();
});

// Import elements into graph
importBtn.addEventListener("click", e => {
    cy.json({
        layout: layoutObject,
        style: styleArray,
        elements: testImports
    });
    redraw();
    unselectActive();
});

// TODO: Add Buttons for mobile version
document.onkeydown = e => {
    // console.log(e.keyCode);
    // Delete Element
    if (e.ctrlKey && e.keyCode == 46) {
        return removeActive();
    }

    // Unselect current element
    if (/*e.ctrlKey && */ e.keyCode == 27) {
        return unselectActive();
    }

    // Revert latest deleted Element
    if (e.ctrlKey && e.keyCode == 90 && deletedNodes.length > 0) {
        // Restore latest removed Node
        const restoredNode = deletedNodes.pop();
        restoredNode.restore();
        cy.elements(restoredNode).unselect();
        redraw();
        return;
    }
};

// Start new Roadmap
newRoadmapBtn.addEventListener("click", e => {
    if (!window.confirm("Start a new Roadmap? Current one will be deleted!")) {
        return;
    }
    deletedNodes = [];
    cy.json({
        layout: layoutObject,
        style: styleArray,
        elements: {}
    });
});
