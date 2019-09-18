// DOM Binding

import cy, { layoutObject } from "./cy";

const metaInformationContainer = document.getElementById("meta-information-container");
const changeMetaDataForm = document.getElementById("change-metadata-form");

// Change Meta Data Form
const changeNodeNameInput = document.getElementById("change-node-name-input");
const changeNodeStartDate = document.getElementById("change-node-start-date");
const changeNodeEndDate = document.getElementById("change-node-end-date");

// Bind Buttons
const deleteBtn = document.getElementById("delete-btn");
const exportBtn = document.getElementById("export-btn");
// const importBtn = document.getElementById("import-btn");

const addNodeForm = document.getElementById("add-node-form");
const nodeNameInput = document.getElementById("node-name-input");

// ======= State =======

const state = {
  activeNode: null,
  activeNodeListener: value => {
    // Toggle display of meta information
    if (value == null || value.group() == "edges") {
      changeMetaDataForm.style.display = "none";
      metaInformationContainer.innerHTML = "";
      return;
    }
    changeMetaDataForm.style.display = "flex";
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

  changeNodeNameInput.value = node.name;
  changeNodeStartDate.value = node.startDate;
  changeNodeEndDate.value = node.endDate;
  metaInformationContainer.innerHTML = metaData;
};

// Add new node
const addNode = name => {
  const now = new Date().toISOString().slice(0, 10);
  const node = cy.add({
    group: "nodes",
    data: { id: name, name: name, startDate: now, endDate: now }
  });

  redraw(layoutObject);
  return node;
};

// Clear the active node
const removeActive = () => {
  cy.remove(state.getNode);
  redraw(layoutObject);
  state.setNode = null;
};

// ======= Event Listener =======

// Add Node
addNodeForm.addEventListener("submit", e => {
  e.preventDefault();
  const node = addNode(nodeNameInput.value);
  state.setNode = node;
  nodeNameInput.value = "";
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
    redraw(layoutObject);
    // Set node as active when it's handler is clicked
    state.setNode = sourceNode;
    cy.filter("node").unselect();
    state.getNode.select();
  }
});

// Change Meta Information
changeMetaDataForm.addEventListener("submit", e => {
  e.preventDefault();
  state.getNode.data("name", changeNodeNameInput.value);
  state.getNode.data("startDate", changeNodeStartDate.value);
  state.getNode.data("endDate", changeNodeEndDate.value);
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
  // console.log(e.keyCode);
  if (e.keyCode == 46 && state.getNode) {
    removeActive();
  }
});

// Export the graph
exportBtn.addEventListener("click", e => {
  // Exports the elements as flat array to be imported at a later state
  console.log(cy.elements().jsons());
});

// Import elements into graph
const importMyShit = elements => {
  cy.json({
    elements: elements
  });
  // Maybe redraw here
};
