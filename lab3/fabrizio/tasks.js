"use strict";

function Task(id, description, urgent = false, priv = true, deadline = undefined) {
    this.id = id;
    this.description = description;
    this.urgent = urgent;
    this.priv = priv;
    if (deadline === undefined)
        this.deadline = undefined;
    else
        this.deadline = dayjs(deadline).format();
};

function TaskList() {
    this.tasks = [];

    this.add = (task) => {
        this.tasks.push(task);
    };
}

function populate(item) {

    let table = document.getElementById("content_table");

    // tr
    let tr = document.createElement("tr");
    tr.id = "table_row"

    // td
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");

    // td1
    let check = document.createElement("input");
    check.type = "checkbox";
    check.id = "task";
    check.name = "task";
    check.value = "task" + item.id;

    let l1 = document.createElement("label");
    l1.htmlFor = "task" + item.id;
    l1.innerHTML = "\xa0" + item.description;
    if (item.urgent === true) {
        l1.className = "important";
    }

    td1.appendChild(check);
    td1.appendChild(l1);
    tr.appendChild(td1);

    // td2
    tr.appendChild(td2);
    if (item.priv === true) {
        let i = document.createElement("i");
        i.className = "fas fa-user-check";
        td2.appendChild(i);
    }
    tr.appendChild(td2);

    //td3
    tr.appendChild(td3);
    td3.className = "right-text";
    if (item.deadline != undefined) {
        td3.innerHTML = dayjs(item.deadline).format("ddd D MMM YYYY HH:mm");
    }

    table.appendChild(tr);

}

async function clear() {
    let table = document.getElementById("content_table");
    let div = document.getElementById("content-div");
    table.remove();
    table = document.createElement("table");
    table.className = "table border-bottom";
    table.id = "content_table";
    div.appendChild(table);

    let categories = document.getElementsByClassName("btn btn-success");
    let cats = Array.from(categories);
    cats.forEach(function (e) {
        if (e.className != "btn btn-success addbutton") {
            e.className = "btn btn-light btn-block text-justify";
        }
    });
}

async function populateAll() {
    await clear();
    document.getElementById("section-title").innerHTML = "All";
    const a = document.getElementById("all-filter");
    const a2 = document.getElementById("all-filter-sm");
    a.className = "btn btn-success btn-block text-justify";
    a2.className = "btn btn-success btn-block text-justify";
    task_list.tasks.forEach(populate);
}

async function populateImportant() {
    await clear();
    document.getElementById("section-title").innerHTML = "Important";
    const a = document.getElementById("important-filter");
    const a2 = document.getElementById("important-filter-sm");
    a.className = "btn btn-success btn-block text-justify";
    a2.className = "btn btn-success btn-block text-justify";
    const filtered = task_list.tasks.filter(function (t) {
        return t.urgent === true;
    });
    filtered.forEach(populate);
}

async function populateToday() {
    await clear();
    document.getElementById("section-title").innerHTML = "Today";
    const a = document.getElementById("today-filter");
    const a2 = document.getElementById("today-filter-sm");
    a.className = "btn btn-success btn-block text-justify";
    a2.className = "btn btn-success btn-block text-justify";
    const filtered = task_list.tasks.filter(function (t) {
        return dayjs(t.deadline).format("YYYYMMDD") === dayjs().format("YYYYMMDD") && t.deadline != undefined;
    });
    filtered.forEach(populate);
}

async function populate7days() {
    await clear();
    document.getElementById("section-title").innerHTML = "Next 7 days"
    const a = document.getElementById("7days-filter");
    const a2 = document.getElementById("7days-filter-sm");
    a.className = "btn btn-success btn-block text-justify";
    a2.className = "btn btn-success btn-block text-justify";
    const filtered = task_list.tasks.filter(function (t) {
        return dayjs(t.deadline).diff(dayjs(), "week") === 0 && t.deadline != undefined;
    });
    filtered.forEach(populate);
}

async function populatePrivate() {
    await clear();
    document.getElementById("section-title").innerHTML = "Private";
    const a = document.getElementById("private-filter");
    const a2 = document.getElementById("private-filter-sm");
    a.className = "btn btn-success btn-block text-justify";
    a2.className = "btn btn-success btn-block text-justify";
    const filtered = task_list.tasks.filter(function (t) {
        return t.priv === true;
    });
    filtered.forEach(populate);
}

const t1 = new Task(1, 'Complete Lab 2', false, false, '20210321 14:30');
const t2 = new Task(2, 'Buy some groceries', false, true, '20210329 14:00');
const t3 = new Task(3, 'Read a good book', true, false);
const t4 = new Task(4, 'More groceries', false, true, '20210331 17:00');
const t5 = new Task(5, 'Extra groceries', true, true, '20210404 12:00');
const t6 = new Task(5, 'Lab 3', false, false, '20210405 18:00');
const t7 = new Task(5, 'Lab personal', false, true, '20210405 18:00');


const task_list = new TaskList();
task_list.add(t1);
task_list.add(t2);
task_list.add(t3);
task_list.add(t4);
task_list.add(t5);
task_list.add(t6);
task_list.add(t7);

populateAll();

document.getElementById("all-filter").addEventListener("click", populateAll);
document.getElementById("important-filter").addEventListener("click", populateImportant);
document.getElementById("today-filter").addEventListener("click", populateToday);
document.getElementById("7days-filter").addEventListener("click", populate7days);
document.getElementById("private-filter").addEventListener("click", populatePrivate);
document.getElementById("all-filter-sm").addEventListener("click", populateAll);
document.getElementById("important-filter-sm").addEventListener("click", populateImportant);
document.getElementById("today-filter-sm").addEventListener("click", populateToday);
document.getElementById("7days-filter-sm").addEventListener("click", populate7days);
document.getElementById("private-filter-sm").addEventListener("click", populatePrivate);