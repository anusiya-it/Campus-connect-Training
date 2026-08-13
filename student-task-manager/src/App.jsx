import React, { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

// This is the key we use to store our tasks inside the browser's localStorage
const STORAGE_KEY = "student-task-manager-tasks";

function App() {
  // 1. "tasks" holds the array of all tasks.
  // We give useState a function so it only reads localStorage ONE time,
  // when the app first loads (this is called "lazy initialization").
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  // 2. Every time "tasks" changes (add, complete, delete),
  // this effect runs and saves the new list into localStorage.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // 3. Add a new task to the list.
  const addTask = (taskText) => {
    const newTask = {
      id: Date.now(), // a simple unique id based on the current time
      text: taskText,
      completed: false,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  // 4. Flip a task between completed and not completed.
  const toggleComplete = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // 5. Remove a task from the list.
  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  // 6. Work out the counts for the summary bar.
  const totalCount = tasks.length;
  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = totalCount - completedCount;

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">📚 Student Task Manager</h1>

        <TaskForm onAddTask={addTask} />

        <div className="stats">
          <div className="stat-box total">
            <span className="stat-number">{totalCount}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-box pending">
            <span className="stat-number">{pendingCount}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-box completed">
            <span className="stat-number">{completedCount}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        <TaskList
          tasks={tasks}
          onToggleComplete={toggleComplete}
          onDeleteTask={deleteTask}
        />
      </div>
    </div>
  );
}

export default App;
