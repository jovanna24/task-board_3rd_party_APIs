const taskDisplayEl = $('#task-display');
const taskFormEl = $('#task-form');
const taskNameInputEl= $('#task-name-input');
const taskTypeInputEl= $('#task-type-input');
const taskDateInputEl= $('#taskDueDate');


// Retrieve tasks and nextId from localStorage
//let taskList = JSON.parse(localStorage.getItem("newTask")) || [];
//let nextId = JSON.parse(localStorage.getItem("nextId"));


// Todo: create a function to generate a unique task id
//Need Help using Crypto UUID
// function generateTaskId() {
//   let uuid = self.crypto.randomUUID();
// }
function readTasksFromStorage() {
let tasks=JSON.parse(localStorage.getItem("tasks"));
if (!tasks){
  tasks=[];
}
return tasks;
}


function saveTasksToStorage(tasks){
localStorage.setItem('newTask', JSON.stringify(tasks));
}

// Todo: create a function to create a task card
function createTaskCard(task) {
const taskCard = $('div')
  .addClass('card task-card draggable my-3')
  .attr('data-task-id', task.id);
const cardHeader = $('<div>').addClass('card-header h4').text(task.name);
const cardBody = $('<div>').addClass('card-body');
const cardDescription = $('<p>').addClass('card-text').text(task.type);
const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
const cardDeleteBtn = $('<button>')
  .addClass('btn btn-danger delete')
  .text('Delete')
  .attr('data-task-id', task.id);
cardDeleteBtn.on('click', handleDeleteTask);

if (task.dueDate && task.status !== 'done') {
  const now = dayjs();
  const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

  if (now.isSame(taskDueDate, 'day')) {
    taskCard.addClass ('bg-warning text-white');
  } else if (now.isAfter(taskDueDate)) {
    taskCard.addClass ('bg-danger text-white');
    cardDeleteBtn.addClass('border-light');
  }
}

cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
taskCard.append(cardHeader, cardBody);

return taskCard;
}




function handleTaskFormSubmit(event){
  event.preventDefault();

  const taskName = taskNameInputEl.val().trim();
  const taskType= taskTypeInputEl.val().trim();
  const taskDate = taskDateInputEl.val();

  const newTask = {
    name: taskName,
    type: taskType,
    dueDate: taskDate,
    status: 'to-do',
  };

  const tasks = readTasksFromStorage();
  tasks.push(newTask);

  localStorage.setItem('newTask', JSON.stringify(tasks))

  saveTasksToStorage(newTask);

  printTaskData();

  taskNameInputEl.val ('');
  taskTypeInputEl.val('');
  taskDateInputEl.val('');
}


// Todo: create a function to render the task list and make cards draggable
//function renderTaskList() {
function printTaskData () {
  const tasks = readTasksFromStorage();
  const todoList = $('#todo-cards');
  todoList.empty();

  const inProgressList = $('#in-progress-cards');
  inProgressList.empty();

  const doneList = $('#done-cards');
  doneList.empty();

  for (let task of tasks) {
    if (task.status === 'to-do'){
      todoList.append(createTaskCard(task));
    } else if (task.status === 'in-progress'){
      inProgressList.append(createTaskCard(task));
    } else if (task.status === 'done') {
      doneList.append(createTaskCard(task));
    }
}

$('.draggable').draggable({
  opacity: 0.7,
  zIndex: 100,

  helper: function (e) {
    const original = $(e.target).hasClass('ui-draggable')
      ? $(e.target)
      : $(e.target).closest('.ui-draggable');
    return original.clone().css({
      width: original.outerWidth(),
    });
  },
});
}

// Todo: create a function to handle adding a new task
// function handleAddTask(event){

// }

// Todo: create a function to handle deleting a task
function handleDeleteTask(){
  const taskId= $(this).attr('data-task-id');
  const tasks = readTasksFromStorage();

  tasks.forEach((task)=>{
    if (task.id === taskId) {
      tasks.splice(tasks.indexOf(task), 1);
    }
  });
  saveTasksToStorage(tasks);
  printTaskData();

}


// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
const tasks = readTasksFromStorage();
const taskId = ui.draggable[0].dataset.taskId;
const newStatus = event.target.id;

for (let task of tasks) {
  if (task.id === taskId) {
    task.status = newStatus;
  }
}
localStorage.setItem('tasks', JSON.stringify(tasks));
printTaskData();
}

taskFormEl.on('submit', handleTaskFormSubmit);

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

printTaskData();


 taskDisplayEl.on('click','.btn-delete-task', handleDeleteTask );

$('#taskDueDate').datepicker({
  changeMonth: true,
  changeYear: true,
});

$('.lane').droppable({
  accept: '.draggable',
  drop: handleDrop
});

});

