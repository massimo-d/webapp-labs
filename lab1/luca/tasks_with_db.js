"use strict";

const dayjs = require("dayjs");
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");

function Task(id, description, urgent = false, priv = true, deadline) {
    this.id = id;
    this.description = description;
    this.urgent = urgent;
    this.priv = priv;
    this.deadline = deadline;

    this.toString = () => `Id: ${id} - Description: ${description} - Urgent: ${urgent} - Priv: ${priv} - Deadline: ${deadline ? deadline.format("YYYY-MM-DD HH:mm") : "N/A"}`;
}

function TaskList() {
    this._tasks = [];

    this.add = t => this._tasks.push(t);

    this.sortAndPrint = _ => {
        this._tasks.sort((a, b) => {
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


const point1 = async (db) => {
    const list = new TaskList();
    const rows = await db.all("SELECT * FROM TASKS");
    list.add(
        rows.map(r =>
            new Task(
                r.id,
                r.description,
                r.urgent === 1,
                r.private === 1,
                r.deadline !== null ? dayjs(r.deadline) : undefined
            )
        )
    );
    console.log(list.toString());
}

const point2 = async (db, date) => {
    const list = new TaskList();

    const rows = await db.all("SELECT * FROM TASKS WHERE deadline > date(?)", [date.format("YYYY-MM-DD")]);
    rows.forEach(r => {
        list.add(
            new Task(
                r.id,
                r.description,
                r.urgent === 1,
                r.private === 1,
                r.deadline !== null ? dayjs(r.deadline) : undefined
            )
        );
    });
    console.log(list.toString());
}

const point3 = async (db, word) => {
    const list = new TaskList();

    const rows = await db.all("SELECT * FROM TASKS WHERE INSTR(description, ?) <> 0", [word]);
    rows.forEach(r => {
        list.add(
            new Task(
                r.id,
                r.description,
                r.urgent === 1,
                r.private === 1,
                r.deadline !== null ? dayjs(r.deadline) : undefined
            )
        );
    });
    console.log(list.toString());
}

const main = async () => {
    const db = await sqlite.open({ filename: "tasks.db", driver: sqlite3.Database });

    console.log("PUNTO 1");
    await point1(db);
    console.log("PUNTO 2");
    await point2(db, dayjs("2021-03-14"));
    console.log("PUNTO 3");
    await point3(db, "laundry");

    await db.close();

}

main();
