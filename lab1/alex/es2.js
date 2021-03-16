'use strict' ;

const dayjs = require('dayjs');
const sqlite3 = require('sqlite3');

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
    const db = new sqlite3.Database('tasks.db', (err)=>{
        if(err) throw err ;
    }) ;
    return db;
}

async function loadandPrint(db) {
    let tasklist = new Tasklist();
    db.all('SELECT * FROM tasks', (err, rows) => {
        if(err)
            throw(err);
        else {
            for(let row of rows) {
                tasklist.add(new Task(row.id , row.description , row.urgent , row.private ,row.deadline));
                console.log(new Task(row.id , row.description , row.urgent , row.private ,row.deadline));
            }
        }
    }) ;
    return tasklist;
}

async function loaddeadline(db,deadline) {
    let tasklist = new Tasklist();
    db.all('SELECT * FROM tasks WHERE deadline > date(?)', [dayjs(deadline).format("YYYY-MM-DD")] , (err, rows) => {
        if(err)
            throw(err);
        else {
            for(let row of rows) {
                tasklist.add(new Task(row.id , row.description , row.urgent , row.private ,row.deadline));
                console.log(new Task(row.id , row.description , row.urgent , row.private ,row.deadline));
            }
        }
    }) ;
    return tasklist;
}

async function loadword(db,word) {
    let tasklist = new Tasklist();
    db.all('SELECT * FROM tasks WHERE description LIKE ?',['%' +word +'%'], (err, rows) => {
        if(err)
            throw(err);
        else {
            for(let row of rows) {
                tasklist.add(new Task(row.id , row.description , row.urgent , row.private ,row.deadline));
                console.log(new Task(row.id , row.description , row.urgent , row.private ,row.deadline));
            }
        }
    }) ;
    return tasklist;
}
async function main () {
    const db = await opendb();

    let Tasklist1 = await loadandPrint(db);
    let Tasklist2 = await loaddeadline(db,dayjs());
    let Tasklist3 = await loadword(db,'ph');

    console.log("XXXXX")
}

main() ;

debugger;
