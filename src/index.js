import cy, { layoutObject } from "./cy";

const addNodeForm = document.getElementById("add-node-form");
const nodeNameInput = document.getElementById("node-name-input");

const addNode = name => {
  cy.add({
    group: "nodes",
    data: { id: name, name: name }
  });

  cy.layout(layoutObject).run();
};

addNodeForm.addEventListener("submit", e => {
  e.preventDefault();
  addNode(nodeNameInput.value);
  nodeNameInput.value = "";
});
