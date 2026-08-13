import React, { useState } from "react";

// This component only cares about ONE thing: taking text input from the
// user and sending it back up to App.jsx through the "onAddTask" prop.
function TaskForm({ onAddTask }) {
  // "taskText" holds whatever the student is currently typing.
  const [taskText, setTaskText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // stop the page from refreshing

    const trimmedText = taskText.trim();
    if (trimmedText === "") {
      return; // don't add empty tasks
    }

    onAddTask(trimmedText); // send the new task up to App.jsx
    setTaskText(""); // clear the input box
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="task-input"
        placeholder="e.g. Finish math homework"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
      />
      <button type="submit" className="add-btn">
        Add Task
      </button>
    </form>
  );
}

export default TaskForm;
