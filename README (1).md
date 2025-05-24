# 📌 User and Task Management System

This is a simple yet powerful browser-based application built with **TypeScript**, **HTML**, and **CSS**, designed to help manage users and tasks efficiently.

---

## 🚀 Features

- 👥 **Create Users** — Add users with a name and email.
- 📋 **List Users** — View all registered users.
- ✅ **Create Tasks** — Add tasks with a title and description.
- 🗂️ **List Tasks** — View all created tasks.
- 🔄 **Assign/Unassign Tasks** — Assign tasks to specific users or unassign them.
- 📊 **View Tasks by User** — Group tasks by assigned user for better clarity.
- ❌ **Remove Users or Tasks** — Delete any user or task easily.

---

## 🛠️ Technologies Used

- **TypeScript (OOP)** for core logic and data management
- **HTML5** for structured interface
- **CSS3** for styling and layout
- **ESBuild** for bundling frontend TypeScript into `bundle.js`

---

## 📁 Folder Structure

```
project-root/
├── dist/
│   └── bundle.js         ← Compiled frontend logic
├── src/
│   ├── models/           ← User.ts, Task.ts
│   ├── services/         ← UserService.ts, TaskService.ts
│   └── frontend.ts       ← App logic & UI binding
├── index.html            ← Browser interface
├── style.css             ← Styling for the app
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ How to Run the Project

1. **Install Dependencies**  
   ```bash
   npm install
   ```

2. **Build the Project**  
   Use [esbuild](https://esbuild.github.io/)
   ```bash
   npx esbuild src/frontend.ts --bundle --outfile=dist/bundle.js
   ```

3. **Open the App**  
   Just open `index.html` in your browser — no server needed.

---

