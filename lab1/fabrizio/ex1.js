'use strict';
const dayjs = require('dayjs');

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

const t1 = new Task(1, 'laundry');
const t2 = new Task(2, 'monday lab', false, false, '20210316 22:00');
const t3 = new Task(3, 'phone call', true, false, '20210308 04:20');

const task_list = new TaskList();
task_list.add(t1);
task_list.add(t2);
task_list.add(t3);

task_list.sortAndPrint();
task_list.filterAndPrint();