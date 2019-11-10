import cy, { layoutObject, styleArray } from "./cy";
import {
    addNode,
    redraw,
    updateActiveNode,
    removeActive,
    unselectActive,
    deletedNodes,
    startNewRoadmap,
    newCheckboxGoal,
    exportGraph,
    drawTodoList
} from "./functions";
import { state } from "./index";

// Sidebar
export const metaInformationContainer = document.getElementById("meta-information-container");
export const changeMetaDataForm = document.getElementById("change-metadata-form");

const uiToggler = document.querySelector(".ui .toggler");
const UI = document.querySelector(".ui");

const viewContainer = document.querySelector(".view-container");

// Change Meta Data Form
export const changeNodeNameInput = document.getElementById("change-node-name-input");
export const changeNodeStartDate = document.getElementById("change-node-start-date");
export const changeNodeEndDate = document.getElementById("change-node-end-date");
export const changeNodeDesc = document.getElementById("change-node-description");

// Goal Checkboxes
const addCheckboxBtn = document.querySelector(".add-checkbox");
export const checkboxContainer = document.querySelector(".checkbox-container");

// Bind Buttons
export const deleteBtn = document.getElementById("delete-btn");
const exportBtn = document.getElementById("export-btn");
const newRoadmapBtn = document.getElementById("new-roadmap-btn");
const importBtn = document.getElementById("import-btn");
const loginBtn = document.getElementById("login-btn");

// New Node Form
const addNodeForm = document.getElementById("add-node-form");
const nodeNameInput = document.getElementById("node-name-input");
const submitNewNodeBtn = document.querySelector("#add-node-form button");

// Authentication Prompt
const authPrompt = document.querySelector("#auth-prompt");
const closeAuthPromptBtn = document.querySelector("#auth-prompt .close-form-btn");

// Todo View
const toggleTodoBtn = document.querySelector("#toggle-todo-btn");
export const todoView = document.querySelector("#todo-view");

let testImports;

// Add Node
addNodeForm.addEventListener("submit", e => {
    e.preventDefault();
    const node = addNode(nodeNameInput.value);
    state.setNode = node;
    cy.filter().unselect();
    cy.elements(node).select();
    nodeNameInput.value = "";
    submitNewNodeBtn.style.display = "none";
    drawTodoList();
});

// Redraw Graph on Edge connection
cy.edgehandles({
    stop: sourceNode => {
        redraw();
        // Set node as active when it's handler is clicked
        state.setNode = sourceNode;
        cy.filter("node").unselect();
        state.getNode.select();
    },
    hoverDelay: 50
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
    const exportedEles = exportGraph();
    // console.log(exportedEles);
    console.log(exportedEles.jsons());
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
    startNewRoadmap();
});

// Login
loginBtn.addEventListener("click", e => {
    console.log("login");
    authPrompt.style.top = "10%";
    viewContainer.style.display = "none";
});

// Close Prompt
closeAuthPromptBtn.addEventListener("click", e => {
    authPrompt.style.top = "-100%";
    viewContainer.style.display = "flex";
});

// Toggle sidebar
uiToggler.addEventListener("click", e => {
    UI.classList.toggle("minimized");
    redraw();
});

// Add new checkbox goal
addCheckboxBtn.addEventListener("click", e => {
    e.preventDefault();
    const numberChecks = checkboxContainer.lastElementChild
        ? parseInt(checkboxContainer.lastElementChild.dataset.goalId)
        : 1;
    const domElement = newCheckboxGoal(numberChecks + 1);
    console.log(domElement);
    checkboxContainer.appendChild(domElement);
    domElement.querySelector(".input-flat").focus();
});

// Remove checkbox goal from container
checkboxContainer.addEventListener("click", e => {
    if (e.target && e.target.classList.contains("remove-goal")) {
        const goalId = e.target.dataset.goalId;
        checkboxContainer.removeChild(document.querySelector(`#checkbox-row${goalId}`));
    }
});

// Toggle Todo View
toggleTodoBtn.addEventListener("click", () => {
    console.log("toggle todo view");
    drawTodoList();
    viewContainer.classList.toggle("todo-visible");
    redraw();
});
