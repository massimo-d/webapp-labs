'use strict';

const dayjs = require('dayjs');
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

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

    this.sortAndPrint = () => {
        const ret = this.tasks.sort((x, y) => {
            if (x.deadline === undefined)
                return 1;
            if (y.deadline === undefined)
                return -1;
            return dayjs(x.deadline).isBefore(dayjs(y.deadline)) ? -1 : 1;
        });
        console.log(ret);
    };

    this.filterAndPrint = () => {
        const ret = this.tasks.filter(task => task.urgent === true);
        console.log(ret);
    };
};

const get_tasks = async (db) => {
    const ret = new TaskList();
    const query = 'SELECT * FROM tasks';
    const rows = await db.all(query);
    rows.forEach(row => {
        const task = new Task(row.id, row.description, row.urgent, row.private, row.deadline);
        ret.add(task);
    });
    return ret;
};

const open_db = async (db_name) => {
    return sqlite.open({ filename: db_name, driver: sqlite3.Database });
};

const task_by_deadline = async (db, date) => {
    const query = 'SELECT * FROM tasks WHERE deadline > date(?) AND deadline NOT NULL';
    const rows = await db.all(query, [dayjs(date).format("YYYY-MM-DD")]);
    rows.forEach(row => console.log(row));
};

const task_by_word = async (db, word) => {
    const query = 'SELECT * FROM tasks WHERE description LIKE ?';
    const param = '%' + word + '%';
    const rows = await db.all(query, [param]);
    rows.forEach(row => console.log(row));
};

const main = async () => {
    const db = await open_db('tasks.db');
    const task_list = await get_tasks(db);
    console.log(task_list)
    task_by_deadline(db, '20210309');
    task_by_word(db, 'laundry');
}

main()
