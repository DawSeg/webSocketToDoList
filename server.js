const express = require('express');
const socket = require('socket.io');

const app = express();
const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const io = socket(server);
let tasks = [];

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.emit('updateData', tasks);

  socket.on('addTask', (taskData) => {
    tasks.push(taskData);
    socket.broadcast.emit('addTask', taskData);
  });

  socket.on('removeTask', (taskId) => {
    tasks = tasks.filter(task => task.id !== taskId);
    socket.broadcast.emit('removeTask', taskId);
  });
});