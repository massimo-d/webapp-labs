'use strict' ;
const dayjs = require('dayjs');

function Task (id ,description,urgent = false , priv = true , deadline = undefined) {
    this.id = id;
    this.description = description;
    this.urgent= urgent;
    this.priv = priv ;
    this.deadline = deadline;
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

let myTasklist = new Tasklist();

myTasklist.add(new Task ("0","2",true,false,dayjs().toString()));
myTasklist.add(new Task ("1","9",false,false));
myTasklist.add(new Task ("2","7",true,false,dayjs('20210510').toString()));
myTasklist.add(new Task ("3","4",false,false,dayjs('20211212').toString()));

myTasklist.sortAndprint();
myTasklist.filterAndPrint();

debugger;

