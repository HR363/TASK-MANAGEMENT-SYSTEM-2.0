#  Task Management System

This is a simple yet powerful browser-based application built with **TypeScript**, **HTML**, and **CSS**, designed to help manage users and tasks efficiently.

YOU CAN ALSO CHECKOUT THE CLI VERSION HERE: https://github.com/HR363/TASK-MANAGEMENT-SYSTEM.git



## Features

- **Create Users** — Add users with a name and email.
- **List Users** — View all registered users.
- **Create Tasks** — Add tasks with a title and description.
- **List Tasks** — View all created tasks.
- **Assign/Unassign Tasks** — Assign tasks to specific users or unassign them.
- **View Tasks by User** — Group tasks by assigned user for better clarity.
- **Remove Users or Tasks** — Delete any user or task easily.

---

##  Technologies Used

- **TypeScript (OOP)** for core logic and data management
- **HTML5** for structured interface
- **CSS** for styling and layout
- **ESBuild** for bundling frontend TypeScript into `bundle.js`



## How to Run the Project

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

## Preview

### Creating New User

![creating new user2](https://github.com/user-attachments/assets/51e5b81a-384d-403f-9d9e-518176a71a07)

### Creating New Task & Assigning it toUser
![creating task 2](https://github.com/user-attachments/assets/74c84a3a-81f1-4d19-a49e-2cf3bb2d3afb)

