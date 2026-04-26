
const cors = require('cors');
const express = require('express');
const app = express();
const port = 3000;
const path= require('path');
const fs =require('fs');

const dataFilePath =path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));



//READ/GET

function readTasksFromFile() {
  if(!fs.existsSync(dataFilePath)) { //AI slop
    fs.writeFileSync(dataFilePath,'[]');
  }

  const data=fs.readFileSync(dataFilePath,'utf8');
  return JSON.parse(data);
}

//WRITE/ADD
function writeTasksToFile(tasks){
  fs.writeFileSync(dataFilePath,JSON.stringify(tasks,null,2));
}


app.get("/health", (req,res) =>{
  res.sendStatus(200);
})

app.get('/api/tasks',(req,res) => {
  const tasks = readTasksFromFile();
  res.json(tasks);
})

app.post('/api/tasks',(req,res)=> {
  const {text} = req.body;

  if (!text || text.trim() === '') {
    return res.status(400).json({error: 'Task text is required'});
  }

  const tasks =readTasksFromFile();

  const newTask = {
    id: Date.now().toString(),
    text: text.trim(),
    checked:false
  };

  tasks.push(newTask); //Updates tasks array
  writeTasksToFile(tasks); //Pushes new updates to data.json

  res.status(201).json(newTask);
});

app.delete('/api/tasks/:id' , (req,res) => {
  const taskId = req.params.id;//Gets the ID of task to delete

  const tasks =readTasksFromFile();
  const filteredTasks = tasks.filter(task => task.id !== taskId);

  if(filteredTasks.length ===tasks.length){
    return res.status(404).json({error:'Task not found'});
  }

  writeTasksToFile(filteredTasks);

  res.json({ message: 'Task deleted successfully'});
});

app.listen(port,()=> {
  console.log(`App listening on port ${port}`);

})

// OPERATION API BACKEND

// GET API

// POST API

// DELETE API

//Eanble DATA FLOW BETWEEN CLIENT AND SERVER