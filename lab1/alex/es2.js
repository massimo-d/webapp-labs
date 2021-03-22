'use strict' ;

const dayjs = require('dayjs');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

function Task (id ,description,urgent = false , priv = true , deadline = undefined) {
    this.id = id;
    this.description = description;
    this.urgent= urgent;
    this.priv = priv ;
    if (deadline === null){
        this.deadline = undefined;
    } else {
        this.deadline = dayjs(deadline).toString();
    }
}

function Tasklist() {
    this.tasks = [] ;

    this.add = (task) => {
        this.tasks.push(task);
    };

    this.sortAndprint= () => {
        const ret = this.tasks.sort((x, y) => {
            if (x.deadline === undefined)
                return 1;
            if (y.deadline === undefined)
                return -1;
            return dayjs(x.deadline).isBefore(dayjs(x.deadline)) ? -1 : 1;
        });
        console.log("****** Tasks sorted by deadline (most recent first): ******")
        console.table(ret)
    }

    this.filterAndPrint= () => {
        const res = this.tasks.filter(ex => ex.urgent===true);
        console.log("****** Tasks filtered, only (urgent == true): ******")
        console.table(res);
    }
}

async function opendb () {
    const db = await sqlite.open({filename: 'tasks.db', driver: sqlite3.Database}) 
    return db;
}

async function loadandPrint(db) {
    let tas = new Tasklist();
    const rows = await db.all('SELECT * FROM tasks');
    rows.forEach( row => {
        tas.add(new Task(row.id , row.description , row.urgent , row.private ,row.deadline));
    });
    console.table(tas.tasks);
    return tas;
}

async function loaddeadline(db,deadline) {
    let tas = new Tasklist();
    const rows = await db.all('SELECT * FROM tasks WHERE deadline > date(?) OR deadline IS NULL', [dayjs(deadline).format("YYYY-MM-DD")] );
    rows.forEach( row => {
        tas.add(new Task(row.id , row.description , row.urgent , row.private ,row.deadline));
    });
    console.table(tas.tasks);
    return tas;
}

async function loadword(db,word) {
    let tas = new Tasklist();
    const rows = await db.all('SELECT * FROM tasks WHERE description LIKE ?',['%' +word +'%']);
    rows.forEach( row => {
        tas.add(new Task(row.id , row.description , row.urgent , row.private ,row.deadline));
    });
    console.table(tas.tasks);
    return tas;
}

async function main () {
    const db = await opendb();

    let tasklist1 = await loadandPrint(db);
    let tasklist2 = await loaddeadline(db,dayjs());
    let tasklist3 = await loadword(db,'ph');

    tasklist1.sortAndprint();

}

main() ;

debugger;
