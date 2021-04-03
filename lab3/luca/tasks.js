const ul = document.getElementById("tasklist-ul");
const filtersButtons = document.querySelectorAll("#todoListFilter li");
const filterTitle = document.getElementById("filterTitle");

const todayEnd = dayjs().hour(23).minute(59).second(0);
const todayStart = todayEnd.hour(0).minute(0).second(0);

const taskToString = (task) => {
  return `<li class="row border-bottom p-2 d-flex align-items-center">
    <input class="col-1 h-75" type="checkbox" name="" id="" />
    <span class="col-7 col-sm-5 ${task.important ? "text-danger" : ""}">${task.description}</span>
    ${task.private ? "<span class='col-1 col-sm-1 text-center fas fa-user'></span>" : ""}
    ${task.deadline !== undefined ? `<span class="col-12 col-sm-5 ml-auto text-right fs-6">${task.deadline.format("DD/MM/YYYY - hh:mm")}</span>` : ""}
  </li>`;
}

const filterTasks = (type) => {
  switch (type) {
    case "all":
      return tasks;
    case "important":
      return tasks.filter(t => t.important);
    case "today":
      return tasks.filter(t => t.deadline?.isBefore(todayEnd) && t.deadline?.isAfter(todayStart));
    case "next7days":
      return tasks.filter(t => t.deadline?.isBefore(todayEnd.add(7, "day")) && t.deadline?.isAfter(todayStart.add(1, "day")));
    case "private":
      return tasks.filter(t => t.private);
    default:
      return tasks;
  }
}

// Event listener for click on filter
for (const filter of filtersButtons) {
  filter.addEventListener("click", (e) => {
    // Set Bootstrap active class
    filtersButtons.forEach(f => f.classList.remove("active"));
    filter.classList.add("active");
    filterTitle.textContent = filter.textContent;
    // Update the content of ul
    ul.innerHTML = "";
    filterTasks(filter.attributes["name"].value).forEach(t => ul.innerHTML += taskToString(t));
  })
}

// Default behavior = All tasks
filterTasks("all").forEach(t => ul.innerHTML += taskToString(t));
