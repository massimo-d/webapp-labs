'use strict' ;
dayjs.extend(window.dayjs_plugin_isBetween);

function Task (id ,description,urgent = false , priv = true , deadline = undefined) {
    this.id = id;
    this.description = description;
    this.urgent= urgent;
    this.priv = priv ;
    if (deadline === null){
        this.deadline = undefined;
    } else {
        this.deadline = dayjs(deadline);
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

let myTasklist = new Tasklist();

myTasklist.add(new Task ("0","Task0",true,true,dayjs()));
myTasklist.add(new Task ("1","Task1",false,false));
myTasklist.add(new Task ("2","Task2",true,true,dayjs('20210510')));
myTasklist.add(new Task ("3","Task3",false,false,dayjs('20211212')));
myTasklist.add(new Task ("4","Task4",true,true,dayjs().add(3, 'day')));
myTasklist.add(new Task ("5","Task5",false,false,dayjs().add(1, 'day')));
myTasklist.add(new Task ("6","Task6",true,false,dayjs().add(7, 'day')));

document.addEventListener('DOMContentLoaded', (event)=>{

    function populate(element) {     
        let newtask = document.createElement("li");
        newtask.setAttribute("class","list-group-item d-flex");
        newtask.setAttribute("id",element.id);

        let newDesc = document.createElement("span");
        let clas = "";
        element.urgent ? clas="pt-2 text-danger"  :  clas="pt-2" ;
        newDesc.setAttribute("class",clas);
        newDesc.setAttribute("tag","description");
        newDesc.setAttribute("style","flex-basis : 48%");
        let check = document.createElement("input");
        check.setAttribute("type","checkbox");
        check.setAttribute("value","");
        let text = document.createTextNode(element.description);
        newDesc.appendChild(check);
        newDesc.appendChild(text);

        let newPriv = document.createElement("span");
        newPriv.setAttribute("class","pt-2 flex-fill text-center");
        if(!element.priv){
            let imgp = document.createElement("i");
            imgp.setAttribute("class","fas fa-users");
            newPriv.appendChild(imgp);
        }

        let newDate = document.createElement("span");
        newDate.setAttribute("class","pt-2 text-right");
        newDate.setAttribute("tag","Date");
        newDate.setAttribute("style","flex-basis : 48%");
        let small = document.createElement("small");
        let dtext = document.createTextNode(element.deadline.format("dddd, DD MMM YYYY , HH:mm"));
        small.appendChild(dtext);
        newDate.appendChild(small);

        newtask.appendChild(newDesc);
        newtask.appendChild(newPriv);
        newtask.appendChild(newDate);

        let list = document.getElementById('TaskList');
        list.appendChild(newtask);
    }

    myTasklist.tasks.forEach( e => {
        populate(e);
    })

    let sidebar = document.getElementById("sidebar");
    let filters = document.getElementById("filters").children;
    let title = document.getElementById("ActFilter");
    let All = document.getElementById("All");
    let impor = document.getElementById("Important");
    let today = document.getElementById("Today");
    let days = document.getElementById("7days");
    let priva = document.getElementById("private");

    All.addEventListener('click', (event) => {
        for(let i = 0 ; i < filters.length ; i++){
            filters[i].classList.remove("active")
        };
        All.classList.add("active");
        title.innerHTML="All";
        let list = document.getElementById("TaskList");
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        myTasklist.tasks.forEach( e => {
            populate(e);
        })
    })

    impor.addEventListener('click', (event) => {
        for(let i = 0 ; i < filters.length ; i++){
            filters[i].classList.remove("active")
        };       
        impor.classList.toggle("active");
        title.innerHTML="Important";
        let list = document.getElementById("TaskList");
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        myTasklist.tasks.forEach( e => {
            if(e.urgent) populate(e);
        })
    })

    today.addEventListener('click', (event) => {
        for(let i = 0 ; i < filters.length ; i++){
            filters[i].classList.remove("active")
        };        
        today.classList.add("active");
        title.innerHTML="Today";
        let list = document.getElementById("TaskList");
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        myTasklist.tasks.forEach( e => {
            if(e.deadline.isSame(dayjs(),"day")) populate(e);
        })
    })

    days.addEventListener('click', (event) => {
        for(let i = 0 ; i < filters.length ; i++){
            filters[i].classList.remove("active")
        };        
        days.classList.add("active");
        title.innerHTML="Next 7 Days";
        let list = document.getElementById("TaskList");
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        myTasklist.tasks.forEach( e => {
            if(e.deadline.isBetween( dayjs().add(1, 'day') , dayjs().add(7, 'day') , "day" , '[]' )) populate(e);
        })
    })

    priva.addEventListener('click', (event) => {
        for(let i = 0 ; i < filters.length ; i++){
            filters[i].classList.remove("active")
        };
        priva.classList.add("active");
        title.innerHTML="Private";
        let list = document.getElementById("TaskList");
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        myTasklist.tasks.forEach( e => {
            if(e.priv) populate(e);
        })
    })
})