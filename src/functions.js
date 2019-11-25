import cy, {
    layoutObject,
    styleArray
} from "./cy";
import {
    state
} from "./index";
import {
    changeNodeNameInput,
    changeNodeStartDate,
    changeNodeEndDate,
    changeNodeDesc,
    goalCategorySelect,
    checkboxContainer,
    todoView,
    evalFormContainer,
    evalSurveyWrapper,
    evalSurveyControls
} from "./events";

import {
    evalObject
} from "./evaluation";

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
        data: {
            id: name,
            name: name,
            startDate: now,
            endDate: now,
            desc: "",
            goalsList: [],
            category: state.lastCategory
        }
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
    goalCategorySelect.value = node.category ? node.category : "micro";

    checkboxContainer.innerHTML = "";
    if (!node.goalsList) {
        return;
    }
    for (let i = 0; i < node.goalsList.length; i++) {
        checkboxContainer.appendChild(
            newCheckboxGoal(node.goalsList[i].id, node.goalsList[i].name, node.goalsList[i].done)
        );
    }
    console.log(node);

    // metaInformationContainer.innerHTML = metaData;
};

// Update Active Node
export const updateActiveNode = () => {
    state.getNode.data("name", changeNodeNameInput.value);
    state.getNode.data("startDate", changeNodeStartDate.value);
    state.getNode.data("endDate", changeNodeEndDate.value);
    state.getNode.data("desc", changeNodeDesc.value);
    state.getNode.data("category", goalCategorySelect.value);

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

    state.getNode.data("goalsList", goalsList);

    state.lastCategory = goalCategorySelect.value;

    renderMetaData();
    redraw();
    drawTodoList();
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
    drawTodoList();
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
<div id="checkbox-row{number}" class="checkbox-row" data-goal-id={number}>
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
    checkBox.setAttribute("tabindex", -1);
    checkBox.checked = checked;

    const goalName = document.createElement("input");
    goalName.setAttribute("type", "text");
    goalName.setAttribute("class", "input-flat");
    goalName.setAttribute("placeholder", "name...");
    goalName.value = name;

    const deleteGoal = document.createElement("button");
    deleteGoal.setAttribute("class", "remove-goal btn-flat");
    deleteGoal.setAttribute("data-goal-id", number);
    deleteGoal.setAttribute("tabindex", -1);
    deleteGoal.appendChild(document.createTextNode("X"));

    const checkBoxDiv = document.createElement("div");
    checkBoxDiv.setAttribute("id", `checkbox-row${number}`);
    checkBoxDiv.setAttribute("data-goal-id", number);
    checkBoxDiv.classList.add("checkbox-row");

    checkBoxDiv.appendChild(checkBox);
    checkBoxDiv.appendChild(goalName);
    checkBoxDiv.appendChild(deleteGoal);

    return checkBoxDiv;
};

// Export Graph
export const exportGraph = () => {
    return cy.elements().filter((ele, i, eles) => {
        return ele.classes()[0] != "eh-handle";
    });
};

const exportNodes = () => {
    return cy.elements().filter((ele, i, eles) => {
        return ele.classes()[0] != "eh-handle" && ele.group() == "nodes";
    });
};

// Create Todo List from Nodes
const createTodoList = () => {
    const todos = [];
    const allNodes = exportNodes().jsons();
    for (let i = 0; i < allNodes.length; i++) {
        const nodeData = allNodes[i].data;
        todos.push(nodeData.name);

        if (nodeData.goalsList) {
            for (let j = 0; j < nodeData.goalsList.length; j++) {
                nodeData.goalsList[j].name != "" && todos.push(nodeData.goalsList[j]);
            }
        }
    }
    return todos;
};

// Display Todos on DOM
export const drawTodoList = () => {
    const todos = createTodoList();
    console.log(todos);
    const ul = todoView.querySelector("ul");
    ul.innerHTML = "";
    for (let i = 0; i < todos.length; i++) {
        const listElement = document.createElement("li");
        if (typeof todos[i] == "string") {
            listElement.appendChild(document.createTextNode(todos[i]));
        }
        if (typeof todos[i] == "object") {
            if (todos[i].done) {
                const crossedOut = document.createElement("s");
                crossedOut.appendChild(document.createTextNode(todos[i].name));
                listElement.appendChild(crossedOut);
            } else {
                listElement.appendChild(document.createTextNode(todos[i].name));
            }
        }
        // typeof todos[i] == "string"
        //     ? listElement.appendChild(document.createTextNode(todos[i]))
        //     : listElement.appendChild(document.createTextNode(todos[i].name));
        ul.appendChild(listElement);
    }
};

// Toggle Eval Form
export const toggleEvalForm = () => {
    if (state.evaluateClickable == false) return;

    if (evalFormContainer.classList.contains("show")) {
        state.evaluateClickable = false;
        evalFormContainer.classList.remove("show");
        // change z-index after transition of .3s
        setTimeout(() => {
            evalFormContainer.style.zIndex = "-999";
            state.evaluateClickable = true;
        }, 300);
        return;
    }

    evalFormContainer.style.zIndex = "999";
    evalFormContainer.classList.add("show");
}

// Handle Survey display
export const displayActiveSurvey = (id = 1) => {
    const activeId = evalSurveyWrapper.dataset.active || id;
    const backBtn = evalSurveyControls.querySelector(".prev");
    const nextBtn = evalSurveyControls.querySelector(".next");

    const allSurveys = evalSurveyWrapper.querySelectorAll("[id^=survey]");

    // Disable other questions
    allSurveys.forEach(survey => {
        survey.classList.remove("active");
    });

    evalSurveyWrapper.querySelector(`#survey-${activeId}`).classList.add("active");

    allSurveys.length == activeId ? console.log("letzte seite") : console.log("noch nicht die letzte");

    activeId == 1 ? backBtn.disabled = true : backBtn.disabled = false;
    activeId == allSurveys.length ? nextBtn.disabled = true : nextBtn.disabled = false;
}

// Render rating questions on survey
