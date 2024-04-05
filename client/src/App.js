import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import shortid from 'shortid';

function App() {

  const [socket, setSocket] = useState();
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  useEffect(() => {
    const socket = io('ws://localhost:8000', { transports: ['websocket'] });
    setSocket(socket);

    socket.on('updateData', (tasks) => {
      updateTasks(tasks);
    });

    socket.on('removeTask', (id) => {
      removeTask(id);
    });
    socket.on('addTask', (task) => {
      addTask(task);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const updateTasks = (tasksData) => {
    setTasks(tasksData);
  };

  const handleInputChange = e => {
    setTaskName(e.target.value);
  };

  const addTask = (newTask) => {
    if (taskName === '') {
      alert('Wypełnij pole!')
    } else {
      setTasks(prevTasks => [...prevTasks, newTask]);
      setTaskName('');
    };
  };

  const removeTask = (taskId, locallyTriggered = true) => {
    setTasks(tasks => tasks.filter(task => task.id !== taskId));
    if (locallyTriggered) {
      socket.emit('removeTask', taskId);
    };
  };

  const submitForm = e => {
    e.preventDefault();
    const newTask = { name: taskName, id: shortid() };
    addTask(newTask)
    socket.emit('addTask', newTask)
  };

  return (
    <div className="App">
      <header>
        <h1>ToDoList.app</h1>
      </header>
      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>
        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map(task => (
            <li className='task' key={task.id}>{task.name}
              <button className="btn btn--red" onClick={() => removeTask(task.id)}>Remove</button>
            </li>
          ))}
        </ul>
        <form id="add-task-form" onSubmit={submitForm}>
          <input
            className="text-input"
            autoComplete="off"
            type="text"
            placeholder="Type your description"
            id="task-name"
            value={taskName}
            onChange={handleInputChange} />
          <button className="btn" type="submit" >Add</button>
        </form>
      </section>
    </div>
  );
};

export default App;
