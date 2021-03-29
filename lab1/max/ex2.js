'use strict'

const dayjs = require('dayjs');
const sqlite = require('sqlite3');

const db =  new sqlite.Database('tasks.db', (err) => {
    if (err) throw err;
});


function Task(id, description, urgent = false, priv = false, deadline) {
    this.id = id;
    this.description = description;
    this.urgent = urgent;
    this.priv = priv;
    this.deadline = deadline;
}

function TaskList() {
    this.tasks = [];
    this.add = (el) => this.tasks.push(el);
    this.sortAndPrint = () => {
        console.log(this.tasks.sort((a, b) => (dayjs(a.deadline).isAfter(dayjs(b.deadline)) ? 1 : -1)));
    }
    this.filterAndPrint = () => {
        console.log(this.tasks.filter((el) => el.urgent === true));
    }

}

//nested
// db.all('SELECT * FROM tasks', (err, rows) => {
//     if (err)
//         throw (err);
//     else {
//         for (let row of rows) {
//             mytasksdb.add(new Task(row.id, row.description, row.urgent, row.priv, row.deadline));
//         }
//         console.log('***printing all tasks***');
//         console.table(mytasksdb.tasks);

//         let mytasksdb1 = new TaskList();
//         let mydate = dayjs("2021-03-12").format();
//         db.all('SELECT * FROM tasks where deadline > ?', [mydate], (err, rows) => {
//             if (err)
//                 throw (err);
//             else {
//                 for (let row of rows) {
//                     mytasksdb1.add(new Task(row.id, row.description, row.urgent, row.priv, row.deadline));
//                 }
//                 console.log(`***printing tasks with a given date: ${mydate}***`);
//                 console.table(mytasksdb1.tasks);

//                 let mytasksdb2 = new TaskList();
//                 let myword = 'lab';
//                 db.all('SELECT * FROM tasks where INSTR(description, ?) <> 0', [myword], (err, rows) => {
//                     if (err)
//                         throw (err);
//                     else {
//                         for (let row of rows) {
//                             mytasksdb2.add(new Task(row.id, row.description, row.urgent, row.priv, row.deadline));
//                         }
//                         console.log(`***printing tasks with a certain word: ${myword}***`);
//                         console.table(mytasksdb2.tasks);
//                     }
//                 });

//             }
//         });

//     }
// });

//with async-await

function querydb(db, query, param) {
    return new Promise((resolve, reject) => {
        db.all(query, [param], (err, rows) => {
            if (err) reject(err);
            else {
                let mylist = new TaskList();
                for (let row of rows) {
                    mylist.add(new Task(row.id, row.description, row.urgent, row.priv, row.deadline));
                }
                resolve(mylist);
            }
        });

    });
}

async function main() {
    let myrows = await querydb(db, 'select * from tasks');
    console.log('***printing all tasks***');
    console.table(myrows.tasks);
    myrows = await querydb(db, 'SELECT * FROM tasks where deadline > ?', dayjs('2021-03-12').format());
    console.log('***printing task filter by date***');
    console.table(myrows.tasks);
    myrows = await querydb(db, 'SELECT * FROM tasks where INSTR(description, ?) <> 0', 'call');
    console.log('***printing task filter by word***');
    console.table(myrows.tasks);
}

main();

