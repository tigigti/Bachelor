import cy, { layoutObject, styleArray } from "./cy";
import { state } from "./index";
import { changeNodeNameInput, changeNodeStartDate, changeNodeEndDate, changeNodeDesc } from "./events";

export let deletedNodes = [];

export const redraw = () => {
    cy.layout(layoutObject).run();
};

// Add new node
export const addNode = name => {
    const now = new Date().toISOString().slice(0, 10);
    const node = cy.add({
        group: "nodes",
        data: { id: name, name: name, startDate: now, endDate: now, desc: "" }
    });

    redraw();
    return node;
};

// Render information to Sidebar
export const renderMetaData = () => {
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

// Update Active Node
export const updateActiveNode = () => {
    state.getNode.data("name", changeNodeNameInput.value);
    state.getNode.data("startDate", changeNodeStartDate.value);
    state.getNode.data("endDate", changeNodeEndDate.value);
    state.getNode.data("desc", changeNodeDesc.value);

    renderMetaData();
    redraw();
};

// delete the active node
export const removeActive = () => {
    if (!state.getNode) {
        return;
    }
    cy.remove(state.getNode);
    redraw();
    deletedNodes.push(state.getNode);
    state.setNode = null;
};

// Reset Selection
export const unselectActive = () => {
    cy.filter().unselect();
    state.setNode = null;
};

export const startNewRoadmap = () => {
    deletedNodes = [];
    cy.json({
        layout: layoutObject,
        style: styleArray,
        elements: {}
    });
};
