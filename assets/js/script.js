var tasksToDoEl = document.querySelector("#tasks-to-do");
var formEl = document.querySelector("#task-form");
var taskIdCounter = 0;

var taskFormHandler = function(event) {
    event.preventDefault(); //this prevents the browser from immediately refreshing
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // validate form input before creating an object
    if (!taskNameInput || !taskTypeInput) {
        window.alert("You must fill completely fill out the form.");
        return false; // the function will stop evaluating when it returns a value of false, aka not-null
    }

    // reset the form to blanks to increase user experience
    formEl.reset();

    // define inputted data as an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };

    // send obj as an argument to createTaskEl
    createTaskEl(taskDataObj);

};

var createTaskEl = function(taskDataObj) {
    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // add task id as a custom attribute
    listItemEl.setAttribute("data-task-id" , taskIdCounter);

    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
        // give it a class name
        taskInfoEl.className = "task-info";
        // add HTML content to div
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

    listItemEl.appendChild(taskInfoEl);

    // add entire list item to list
    tasksToDoEl.appendChild(listItemEl);

    // increase task counter for next unique id
    taskIdCounter++;
}

// parameter of taskId below. this passes a different id into the function each time
var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // create edit button
    var editButtonEl = document.createElement("button");
        editButtonEl.textContent = "Edit";
        editButtonEl.className = "btn edit-btn";
        editButtonEl.setAttribute("data-task-id" , taskId);
};

formEl.addEventListener("submit", taskFormHandler);