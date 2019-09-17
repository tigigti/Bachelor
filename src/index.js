// DOM Binding

import cy, { layoutObject } from "./cy";

const metaInformationContainer = document.getElementById("meta-information-container");
const changeMetaDataForm = document.getElementById("change-metadata-form");

// Change Meta Data Form
const changeNodeNameInput = document.getElementById("change-node-name-input");

const deleteBtn = document.getElementById("delete-btn");

const addNodeForm = document.getElementById("add-node-form");
const nodeNameInput = document.getElementById("node-name-input");

// ======= State =======

const state = {
  activeNode: null,
  activeNodeListener: value => {
    // Toggle display of meta information
    if (value == null) {
      changeMetaDataForm.style.display = "none";
      return;
    }
    changeMetaDataForm.style.display = "block";
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

const redraw = layoutObject => {
  cy.layout(layoutObject).run();
};

// Render information to Sidebar
const renderMetaData = () => {
  if (state.getNode == null) {
    return (metaInformationContainer.innerHTML = "");
  }
  const node = state.getNode.data();
  let metaData = "";
  for (let data in node) {
    metaData += `
      <div>${data}: ${node[data]}</div>
    `;
  }
  metaInformationContainer.innerHTML = metaData;
};

// Add new node
const addNode = name => {
  const node = cy.add({
    group: "nodes",
    data: { id: name, name: name }
  });

  redraw(layoutObject);
  return node;
};

// Clear the active node
const removeActive = () => {
  cy.remove(state.getNode);
  metaInformationContainer.innerHTML = "";
  redraw(layoutObject);
  state.setNode = null;
};

// ======= Event Listener =======

// Add Node
addNodeForm.addEventListener("submit", e => {
  e.preventDefault();
  const node = addNode(nodeNameInput.value);
  console.log(node);
  state.setNode = node;
  nodeNameInput.value = "";
});

// Display node metadata on click
cy.on("tap", e => {
  state.setNode = e.target;
});

// Redraw Graph on Edge connection
cy.edgehandles({
  stop: sourceNode => {
    redraw(layoutObject);
    state.setNode = sourceNode;
    console.log(sourceNode.data());
  }
});

// Change Meta Information
changeMetaDataForm.addEventListener("submit", e => {
  e.preventDefault();
  state.getNode.data("name", changeNodeNameInput.value);
  changeNodeNameInput.value = "";
  renderMetaData();
  redraw(layoutObject);
});

// Delete data
deleteBtn.addEventListener("click", e => {
  if (!state.getNode) {
    return;
  }
  removeActive();
});

// By pressing delete key
document.addEventListener("keydown", e => {
  if (e.keyCode == 46 && state.getNode) {
    removeActive();
  }
});
