import React from "react";

// This component receives the full task array and just displays it.
// It does not manage any state itself — it simply calls the functions
// it was given (onToggleComplete / onDeleteTask) when buttons are clicked.
function TaskList({ tasks, onToggleComplete, onDeleteTask }) {
  if (tasks.length === 0) {
    return <p className="empty-message">No tasks yet. Add one above! ✏️</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li
          key={task.id}
          className={`task-item ${task.completed ? "completed" : ""}`}
        >
          <span className="task-text">{task.text}</span>

          <div className="task-buttons">
            <button
              className="complete-btn"
              onClick={() => onToggleComplete(task.id)}
            >
              {task.completed ? "Undo" : "Complete"}
            </button>
            <button
              className="delete-btn"
              onClick={() => onDeleteTask(task.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
