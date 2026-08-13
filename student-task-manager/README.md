# Student Task Manager

A simple, beginner-friendly task manager built with React. Tasks are saved
in the browser's localStorage, so they stay even after you refresh the page.

## Folder Structure

```
student-task-manager/
├── package.json
├── public/
│   └── index.html
└── src/
    ├── index.js
    ├── App.jsx
    ├── App.css
    └── components/
        ├── TaskForm.jsx
        └── TaskList.jsx
```

## How to Run This Project

1. Install Node.js (v16 or higher) from https://nodejs.org if you don't
   already have it. Running `node -v` in a terminal should print a version
   number.
2. Unzip this project and open a terminal inside the `student-task-manager`
   folder.
3. Install the dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```
5. Your browser should open automatically at `http://localhost:3000`.
   If it doesn't, open that address manually.

## How to Test It

- Type a task into the input box and click **Add Task** — it should appear
  in the list below.
- Click **Complete** on a task — its text gets a strikethrough and the
  "Completed" / "Pending" counts update.
- Click **Delete** — the task disappears from the list.
- Refresh the page — your tasks should still be there (thanks to
  localStorage).
- Resize your browser window (or open it on your phone) — the layout should
  adjust nicely.
