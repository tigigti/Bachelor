import cy, { layoutObject, styleArray } from "./cy";
import { state } from "./index";
import {
    changeNodeNameInput,
    changeNodeStartDate,
    changeNodeEndDate,
    changeNodeDesc,
    checkboxContainer
} from "./events";

export let deletedNodes = [];

export const redraw = () => {
    cy.resize();
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

    checkboxContainer.innerHTML = "";
    if (!node.goalsList) {
        return;
    }
    for (let i = 0; i < node.goalsList.length; i++) {
        checkboxContainer.appendChild(
            newCheckboxGoal(node.goalsList[i].id, node.goalsList[i].name, node.goalsList[i].done)
        );
    }

    // metaInformationContainer.innerHTML = metaData;
};

// Update Active Node
export const updateActiveNode = () => {
    state.getNode.data("name", changeNodeNameInput.value);
    state.getNode.data("startDate", changeNodeStartDate.value);
    state.getNode.data("endDate", changeNodeEndDate.value);
    state.getNode.data("desc", changeNodeDesc.value);

    // Extract data from checkbox container
    let goalsList = [];
    const goalsListElements = checkboxContainer.querySelectorAll("div[id^='check']");
    goalsListElements.forEach(goalElement => {
        goalsList.push({
            id: goalElement.dataset.goalId,
            name: goalElement.querySelector("input[type='text']").value,
            done: goalElement.querySelector("input[type='checkbox']").checked
        });
    });
    console.log(goalsList);

    state.getNode.data("goalsList", goalsList);

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
    unselectActive();
};

/* 
<div id="checkbox-row{number}" data-goal-id={number}>
    <input type="checkbox" id={id} name={id} tabindex="-1" checked={checked}/>
    <input type="text" class="input-flat" placeholder="name..." value={name}/>
    <button class="remove-goal btn-flat" data-goal-id={number} tabindex="-1"/>
</div>
*/
export const newCheckboxGoal = (number, name = "", checked = false) => {
    const id = `goal-checkbox${number}`;

    const checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.setAttribute("id", id);
    checkBox.setAttribute("name", id);
    checkBox.setAttribute("tabindex",-1);
    checkBox.checked = checked;

    const goalName = document.createElement("input");
    goalName.setAttribute("type", "text");
    goalName.setAttribute("class", "input-flat");
    goalName.setAttribute("placeholder", "name...");
    goalName.value = name;

    const deleteGoal = document.createElement("button");
    deleteGoal.setAttribute("class", "remove-goal btn-flat");
    deleteGoal.setAttribute("data-goal-id", number);
    deleteGoal.setAttribute("tabindex",-1);
    deleteGoal.appendChild(document.createTextNode("X"));

    const checkBoxDiv = document.createElement("div");
    checkBoxDiv.setAttribute("id", `checkbox-row${number}`);
    checkBoxDiv.setAttribute("data-goal-id", number);
    checkBoxDiv.appendChild(checkBox);
    // checkBoxDiv.appendChild(document.createTextNode(name));
    checkBoxDiv.appendChild(goalName);
    checkBoxDiv.appendChild(deleteGoal);

    return checkBoxDiv;
};
