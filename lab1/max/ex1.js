'use strict'
function Task(id, description, urgent=false, priv=false, deadline){
    this.id=id;
    this.description = description;
    this.urgent = urgent;
    this.priv = priv;
    this.deadline = deadline;
}

function TaskList(){
    this.tasks = [];
    this.add = (el) => this.tasks.push(el);
    this.sortAndPrint = () => {
        console.log(this.tasks.sort((a,b) => (dayjs(a.deadline).isBefore(dayjs(b.deadline)) ? -1 : 1)));
    }
    this.filterAndPrint = () => {
        console.log(this.tasks.filter((el) => el.urgent === true));
    }

}

const dayjs = require('dayjs');

let a = new Task(1,'one', false, false,  dayjs("2020-03-01").format());
let b = new Task(2,'two', true, false, dayjs("2020-02-03").format());
let c = new Task(3,'three', true, false, dayjs("2020-01-02").format());
let d = new Task(4,'four', false, false);

let mytasks = new TaskList();
mytasks.add(a);
mytasks.add(b);
mytasks.add(c);
mytasks.add(d);
//mytasks.sortAndPrint();
//mytasks.filterAndPrint();