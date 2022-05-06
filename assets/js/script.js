var pageContentEl = document.querySelector("#page-content");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var formEl = document.querySelector("#task-form");
var taskIdCounter = 0;
var tasks = [];

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

    // // define inputted data as an object
    // var taskDataObj = {
    //     name: taskNameInput,
    //     type: taskTypeInput,
    //     // STATUS HERE?
    // };

    // ability to use same form halndler for new and old tasks via task id
    var isEdit = formEl.hasAttribute("data-task-id");

    // has data attribute, so get task id and call function to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    //no data attribute, so create object as normal and pass to createTaskEl function
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"  // NOTE SURE THIS IS RIGHT?
        };
        createTaskEl(taskDataObj);
    }
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

    // get the id and push this to the obj by adding any content in the () to the end ofthe specificed array
    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    // count the task in the task counter and add action buttons to task
    var taskActionsEl = createTaskActions(taskIdCounter);
        listItemEl.appendChild(taskActionsEl);

    // add entire list item to list
    tasksToDoEl.appendChild(listItemEl);

    // increase task counter for next unique id
    taskIdCounter++;

    saveTasks();
};

// parameter of taskId below. this passes a different id into the function each time
var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // create edit button
    var editButtonEl = document.createElement("button");
        editButtonEl.textContent = "Edit";
        editButtonEl.className = "btn edit-btn";
        editButtonEl.setAttribute("data-task-id" , taskId);
    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    var deleteButtonEl = document.createElement("button");
        deleteButtonEl.textContent = "Delete";
        deleteButtonEl.className = "btn delete-btn";
        deleteButtonEl.setAttribute("data-task-id" , taskId);
    actionContainerEl.appendChild(deleteButtonEl);

    // create select element for status
    var statusSelectEl = document.createElement("select");
        statusSelectEl.className = "select-status";
        statusSelectEl.setAttribute("data-task-id" , taskId);
    actionContainerEl.appendChild(statusSelectEl);

    // for loop for status dropdown options
    var statusChoices = ["To Do" , "In Progress" , "Complete"];
        for(var i = 0; i < statusChoices.length; i++) {
            // create option element
            var statusOptionEl = document.createElement("option");
            statusOptionEl.textContent = statusChoices[i];
            statusOptionEl.setAttribute("value" , statusChoices[i]);
            statusSelectEl.appendChild(statusOptionEl);
        }

    return actionContainerEl;
};

// editing a task is taking the original task and updating it
var completeEditTask = function(taskName, taskType, taskId) {
    //find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i]. id  === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }

    alert("Task updated.");

    // reset the form and remote the task id
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Save Task";

    saveTasks();
};

// if the delete button on a task is clicked, get the task id and call the delete function
var taskButtonHandler = function(event) {
    // get target element from event
    var targetEl = event.target;

    // if edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }

    // if delete button was clicked
    else if (targetEl.matches(".delete-btn")) {
        // get the element's task id
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

var taskStatusChangeHandler = function(event) {
    //get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

    // get the currenlty selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // move the task based on the statusValue
    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    } else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    } else if (statusValue === "complete") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    // update task's in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }

    saveTasks();
};

// edit a task
var editTask = function(taskId) {

    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;

    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id" , taskId);
};

// delete a task
var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove()

    // create a new array to hold updated lists of tasks
    var updatedTaskArr = [];

    // loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        // if tasks[i].id does NOT match the value of taskId we want to delete, push it into the new array
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }

    // reassign tasks array to be the same as the updatedTaskArr
    tasks = updatedTaskArr;
    saveTasks();
};

// save tasks to local storage
var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks)); // this jSON.stringify is necessary bc local storage only works with strings, so we need to convert the array
};

// load tasks from local storage
var loadTasks = function() {
    // get tasks from local storage
    var savedTasks = localStorage.getItem("tasks");
    console.log("Saved tasks found." , savedTasks);
    // this confirms the correct status is being brought it and other task data

    // if there are no tasks, set tasks to an empty array and return out of the function
        if (!savedTasks) {
            return false;
        }

    // get the tasks into an object array
    savedTasks = JSON.parse(savedTasks);
        console.log(savedTasks); // confirms all data is being brough in as an array WITH THE CORRECT STATUS after reloading page

    for (var i = 0; i < savedTasks.length; i++) {
        // pass each tash object into the createTaskEl function
        createTaskEl(savedTasks[i]);
    }
};

// create a new task
formEl.addEventListener("submit", taskFormHandler);

// evnet listener for delete and edit button on #page-content
pageContentEl.addEventListener("click" , taskButtonHandler);

// event listener for chaging status of task
pageContentEl.addEventListener("change" , taskStatusChangeHandler);

loadTasks();