"use strict";

const dayjs = require("dayjs");

function Task(id, description, urgent = false, priv = true, deadline ) {
    this.id = id;
    this.description = description;
    this.urgent = urgent;
    this.priv = priv;
    this.deadline = deadline;

    this.toString = () => `Id: ${id} - Description: ${description} - Urgent: ${urgent} - Priv: ${priv} - Deadline: ${deadline !== undefined && deadline.format("YYYY-MM-DD HH:mm")}`;
}

function TaskList() {
    this._tasks = [];

    this.add = t => this._tasks.push(t);

    this.sortAndPrint = _ => {
        this._tasks.sort((a,b) => {
            if (a.deadline === undefined) return 1;
            if (b.deadline === undefined) return -1;
            return a.deadline.isBefore(b.deadline) ? -1 : 1;
        })
        console.log(this.toString());
    }

    this.filterAndPrint = () => {
        console.log(this._tasks.filter(e => e.urgent === true).map(t => t.toString()));
    }

    this.toString = () => this._tasks.map(t => t.toString());
}

const t1 = new Task(1, "Desc1", false, true, dayjs().add(10, 'days'));
const t2 = new Task(2, "Desc2", true, true, dayjs().add(20, 'days'));
const t3 = new Task(3, "Desc3", true, false, dayjs());
const t4 = new Task(4, "Desc4", true, false);

const list = new TaskList();

list.add(t1);
list.add(t2);
list.add(t3);
list.add(t4);

console.log(list.toString());

console.log("*".repeat(10) + " Task sorted by deadline " + "*".repeat(10));
list.sortAndPrint();

console.log("*".repeat(10) + " Task filtered by urgent " + "*".repeat(10));
list.filterAndPrint();
