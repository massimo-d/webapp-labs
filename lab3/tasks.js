'use strict'
// const dayjs = require('dayjs');
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
        console.log(this.tasks.sort((a, b) => (dayjs(a.deadline).isBefore(dayjs(b.deadline)) ? -1 : 1)));
    }
    this.filterAndPrint = () => {
        console.log(this.tasks.filter((el) => el.urgent === true));
    }
    this.length = this.tasks.length;

}

const task1 = new Task(1, 'one', false, true, dayjs("2020-03-01").format());
const task2 = new Task(2, 'two', true, false, dayjs("2020-02-03").format());
const task3 = new Task(3, 'three', true, false, dayjs("2020-01-02").format());
const task4 = new Task(4, 'four', false, true);
const task5 = new Task(5, 'five', true, false, dayjs("2021-03-31").format());
const task6 = new Task(6, 'six', true, false, dayjs("2021-04-30").format());

function displayTasks(tasks) {
    for (let [n, i] of tasks.entries()) {
        let newRow = document.createElement('tr');
        document.querySelector('tbody').appendChild(newRow);

        //checkbox
        let newCol = document.createElement('td');
        let a = document.createElement('input');
        a.setAttribute('type', 'checkbox');
        newCol.appendChild(a);
        document.querySelectorAll('tr')[n].appendChild(newCol);

        //description
        newCol = document.createElement('td');
        let text = document.createTextNode(i.description);
        newCol.appendChild(text);
        if(i.urgent) newCol.classList.add('red');
        document.querySelectorAll('tr')[n].appendChild(newCol);

        //private
        newCol = document.createElement('td');
        if (i.priv) {
            newCol.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lock-fill" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" /></svg>';
        }
        else {
            text = document.createTextNode('');
            newCol.appendChild(text);
        }
        document.querySelectorAll('tr')[n].appendChild(newCol);

        //deadline
        newCol = document.createElement('td');
        // text = document.createTextNode(dayjs(i.deadline));
        // newCol.appendChild(text);
        newCol.innerHTML += `<span class="float-right"> ${dayjs(i.deadline)} </span>`;
        document.querySelectorAll('tr')[n].appendChild(newCol);
    }
}

function removeTasks(arr) {
    for (let i of arr.entries()) {
        if (document.querySelectorAll('tr')[0] != undefined)
            document.querySelectorAll('tr')[0].remove();
    }

}



const mytasks = new TaskList();
const arr = mytasks.tasks;
mytasks.add(task1);
mytasks.add(task2);
mytasks.add(task3);
mytasks.add(task4);
mytasks.add(task5);
mytasks.add(task6);



displayTasks(arr);

let elements = document.querySelectorAll('li>p');



function myF(event) {

    //change active class
    Array.from(elements).forEach((el) => {
        el.classList.remove('active');
    });
    event.target.classList.add('active');


    let f = event.target.innerText;

    document.querySelector('h3').removeChild(document.querySelector('h3').firstChild);
    document.querySelector('h3').appendChild(document.createTextNode(f));


    if (f === 'All') {
        removeTasks(arr);
        displayTasks(arr);
    }
    else if (f === 'Important') {
        removeTasks(arr);
        displayTasks(arr.filter(el => el.urgent === true));
    }
    else if (f === 'Private') {
        removeTasks(arr);
        displayTasks(arr.filter(el => el.priv === true));
    }
    else if (f === 'Today') {
        removeTasks(arr);
        displayTasks(arr.filter(el => dayjs().isSame(el.deadline, 'day')));
    }
    else if (f === '7 days') {
        removeTasks(arr);
        displayTasks(arr.filter(el => (dayjs(el.deadline).isBefore(dayjs().add(7, 'day'))) && (dayjs(el.deadline).isAfter(dayjs().add(1, 'day')))));

    }



}
Array.from(elements).forEach(function (element) {
    element.addEventListener('click', myF);
});

function menuF(event) {
    document.querySelector('#menu').classList.toggle('d-none');
    // document.querySelector('#menu').classList.toggle('myheight');

}

document.querySelector('#menu-icon').addEventListener('click', menuF);
