import cy from "./cy";
import { addNode } from "./functions";
import { state } from "./index";

const addNodeForm = document.getElementById("add-node-form");
const nodeNameInput = document.getElementById("node-name-input");
const submitNewNodeBtn = document.querySelector("#add-node-form button");

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
