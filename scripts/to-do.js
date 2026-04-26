const buttonCheckBox =document.getElementsByClassName("check-box")
const imgCheckBox =document.getElementById('check-box-img')
const buttonCreateTask= document.getElementById('create-task-button')
const popup=document.getElementById('popup-menu')
const buttonCancel=document.getElementById('cancel-button')
const buttonAddTask=document.getElementById('add-task-button')
const taskInput=document.getElementById('task-input')
const taskBox= document.getElementById("task-box")
const placeHolder= document.getElementById("place-holder")

// buttonCheckBox.addEventListener("click" ,checkBox)
buttonCreateTask.addEventListener("click", createTask)
buttonCancel.addEventListener("click", cancelCreate)
buttonAddTask.addEventListener("click", addTask)

let tasks = [];

// Asynchronous Stuff
// using setTimeout I can make a function that when the mouse is clicked it calls a timeout function
// basically an AFK timer. If that timer runs out without it being called again it will run a function that hides all my tasks


// function checkBox(){
//   imgCheckBox.src="checked-box.svg";
// }

function createTask(){
  placeHolder.style.display="none";
  popup.style.display = "block";
}

function cancelCreate(){
  if (tasks.length==0){
  placeHolder.style.display="flex";
  }
  popup.style.display = "none";
  
}

async function addTask(){
 const text = taskInput.value.trim(); // gets the text from the input line

  if (text === '') return; 

  try {
    const response = await fetch('/api/tasks', { // Tries to POST to API using fetch
      method: 'POST', // POST HTML 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error('Failed to create task');
    }

    const newTask = await response.json(); // Gets the task from API and assigns it to NewTask

    tasks.push(newTask);
    renderTask(newTask);

    taskInput.value = '';
    popup.style.display = 'none';
    placeHolder.style.display = 'none';
  } catch (error) {
    console.error('Error adding task:', error);
  }
}

function renderTask(task){
const taskDiv = document.createElement('div');
  taskDiv.classList.add('task-div');

  taskDiv.innerHTML = `
    <button class="check-box">
      <img src="${task.checked ? 'icons/checked-box.svg' : 'icons/unchecked-box.svg'}" class="check-box-img" />
    </button>
    <div class="task-info">
      <p class="task-text-title">${task.text}</p>
    </div>
    <button class="close-button">X</button>
  `;
 
  const checkButton = taskDiv.querySelector('.check-box');
  const img = taskDiv.querySelector('.check-box-img');
  const closeButton = taskDiv.querySelector('.close-button');

  checkButton.addEventListener('click', function () {
    task.checked = !task.checked;
    img.src = task.checked ? 'icons/checked-box.svg' : 'icons/unchecked-box.svg';
  });

  closeButton.addEventListener('click', async function () {
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      taskDiv.remove();
      tasks = tasks.filter(t => t.id !== task.id);

      if (tasks.length === 0) {
        placeHolder.style.display = 'flex';
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  });

  taskBox.appendChild(taskDiv);
}

async function loadTasks(){
 try {
    const response = await fetch('/api/tasks');

    if (!response.ok) {
      throw new Error('Failed to load tasks');
    }

    tasks = await response.json();

    taskBox.innerHTML = '';

    if (tasks.length === 0) {
      placeHolder.style.display = 'flex';
    } else {
      placeHolder.style.display = 'none';
      tasks.forEach(task => renderTask(task));
    }
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
}


loadTasks(); //Loads up my tasks


// Operation ADD BACKEND 


