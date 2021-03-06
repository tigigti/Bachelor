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
	drawTodoList,
	toggleEvalForm,
	displayActiveSurvey,
	flipPage,
	flashMessage
} from "./functions";
import { state } from "./index";

import { evalObject } from "./evaluation";

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
const closeAuthPromptBtn = authPrompt.querySelector(".close-form-btn");

// Todo View
const toggleTodoBtn = document.querySelector("#toggle-todo-btn");
export const todoView = document.querySelector("#todo-view");

// Goal category
export const goalCategorySelect = document.querySelector("#goal-category");

// Evaluation
const evalBtn = document.querySelector("#evaluate-btn");
export const evalFormContainer = document.querySelector("#eval-form-container");
const closeEvalbtn = evalFormContainer.querySelector(".close-form-btn");
export const evalSurveyWrapper = evalFormContainer.querySelector(".survey-wrapper");
export const evalSurveyControls = evalFormContainer.querySelector(".survey-controls");
export const ratingsWrapper = evalSurveyWrapper.querySelector("#survey-4 .rating-container");

const user = {
	name: "",
	secret: ""
};

displayActiveSurvey();

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

goalCategorySelect.addEventListener("change", e => {
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
		: 0;
	const domElement = newCheckboxGoal(numberChecks + 1);
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
	drawTodoList();
	viewContainer.classList.toggle("todo-visible");
	redraw();
});

evalBtn.addEventListener("click", e => {
	toggleEvalForm();
});

closeEvalbtn.addEventListener("click", e => {
	toggleEvalForm();
});

evalSurveyControls.addEventListener("click", e => {
	if (e.target.classList.contains("prev")) {
		evalSurveyWrapper.dataset.active = parseInt(evalSurveyWrapper.dataset.active - 1);
		displayActiveSurvey();
		flipPage();
	}

	if (e.target.classList.contains("next")) {
		evalSurveyWrapper.dataset.active = parseInt(evalSurveyWrapper.dataset.active) + 1;
		displayActiveSurvey();
		flipPage();
	}
});

// update eval object on input change
document.querySelector("#survey-1").addEventListener("change", e => {
	evalObject.micro[e.target.dataset.micro] = {
		...evalObject.micro[e.target.dataset.micro],
		text: e.target.value
	};
});

document.querySelector("#survey-2").addEventListener("change", e => {
	evalObject.meso[e.target.dataset.meso] = {
		...evalObject.meso[e.target.dataset.meso],
		text: e.target.value
	};
});

document.querySelector("#survey-3").addEventListener("change", e => {
	evalObject.macro[e.target.dataset.macro] = {
		...evalObject.macro[e.target.dataset.macro],
		text: e.target.value
	};
});

// Rating wrapper selectbox change event
ratingsWrapper.addEventListener("change", e => {
	const value = e.target.value;
	const cat = e.target.dataset.category;
	const goal = e.target.dataset.goalId;

	evalObject[cat][goal] = {
		...evalObject[cat][goal],
		rating: parseInt(value)
	};
});

// Non SUS Evaluation
document.querySelector("#evaluation-form").addEventListener("submit", e => {
	e.preventDefault();
	// Collect values and export as object
	const values = [];
	document.querySelectorAll("#evaluation-form select,#evaluation-form textarea").forEach(input => {
		values.push(input.value);
	});
	const results = {
		clarifyConnection: values[0],
		positives: values[1],
		negatives: values[2]
	};

	const data = {
		user,
		results
	};
	fetch("api/eval.php", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		mode: "cors",
		body: JSON.stringify(data)
	})
		.then(res => res.json())
		.then(res => flashMessage(res.msg));
});

// SUS Evaluation
const labels = [
	"I think that i would like to use this system frequently",
	"I found the system unnecessarily complex",
	"I thought the system was easy to use",
	"I think that i would need the support of a technical person to be able to use this system",
	"I found the various functions in this system were well integrated",
	"I thought there was too much inconsistency in this system",
	"I would imagine that most people would learn to use this system very quickly",
	"I found the system very cumbersome to use",
	"I felt very confident using the system",
	"I neded to learn a lot of things before I could get going with this system",
	"Formulating academic goals is more motivating than general goals",
	"I have used some form of goal structuring before",
	"I am more likely to pursue my goals when i structure them in a hierarchy",
	"I prefer the ToDo-List approach over the hierarchy",
	"I am comfortable with publishing my goals publicly"
];

document.querySelector("#sus-evaluation").addEventListener("submit", e => {
	e.preventDefault();
	const values = [];
	document.querySelectorAll("#sus-evaluation select").forEach(select => {
		values.push(select.value);
	});
	const results = [];
	for (let i = 0; i < labels.length; i++) {
		results.push({
			text: labels[i],
			value: values[i]
		});
	}
	const data = {
		results,
		user,
		graph: exportGraph().jsons(),
		goals: evalObject
	};
	flashMessage("Sending...");
	fetch("api/sus.php", {
		method: "POST",
		mode: "cors",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data)
	})
		.then(res => res.json())
		.then(res => flashMessage(res.msg));
});

// Fill SUS evaluation
const susForm = document.querySelector("#sus-evaluation .question-container");

const questions = labels
	.map((question, index) => {
		const el = `
        <div class="form-group">
            <label>${index + 1}. ${question}</label>
            <select>
                <option value="1">Strongly disagree</option>
                <option value="2">Disagree</option>
                <option value="3" selected="selected">Neutral</option>
                <option value="4">Agree</option>
                <option value="5">Strongly agree</option>
            </select>
        </div>
    `;
		return el;
	})
	.join("");

susForm.innerHTML = questions;

// Login
document.querySelector("#login-form").addEventListener("submit", e => {
	e.preventDefault();
	const data = {
		username: document.querySelector("#login-form #username").value,
		password: document.querySelector("#login-form #password").value
	};
	fetch("api/auth.php", {
		method: "POST",
		mode: "cors",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data)
	})
		.then(res => res.json())
		.then(res => {
			flashMessage(res.msg);
			if (res.success == false) {
				user.name = "";
				user.secret = "";
				return;
			}
			user.name = res.name;
			user.secret = res.secret;
		});
});
