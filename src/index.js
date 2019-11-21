// DOM Binding
import "./events";
import { changeMetaDataForm, deleteBtn, metaInformationContainer } from "./events";
import { renderMetaData } from "./functions";

// ======= State =======

export const state = {
    activeNode: null,
    lastCategory: "micro",
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
        // Update todo-view
    },
    get getNode() {
        return this.activeNode;
    },
    set setNode(x) {
        this.activeNode = x;
        this.activeNodeListener(x);
    }
};
