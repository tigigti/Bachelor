import cy,{layoutObject} from "./cy";

const redraw = () => {
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
