"use strict";
(() => {
  // src/models/User.ts
  var User = class {
    constructor(id, name, email) {
      this.id = id;
      this.name = name;
      this.email = email;
    }
  };

  // src/data/Database.ts
  var Database = class {
    constructor() {
      this.users = [];
      this.tasks = [];
    }
  };
  var db = new Database();

  // src/services/UserService.ts
  var UserService = class {
    constructor() {
      this.idCounter = 1;
    }
    createUser(name, email) {
      const user = new User(this.idCounter++, name, email);
      db.users.push(user);
      return user;
    }
    getUsers() {
      return db.users;
    }
    updateUser(id, name, email) {
      const user = db.users.find((u) => u.id === id);
      if (user) {
        user.name = name;
        user.email = email;
        return user;
      }
      return null;
    }
    deleteUser(id) {
      const index = db.users.findIndex((u) => u.id === id);
      if (index !== -1) {
        db.users.splice(index, 1);
        return true;
      }
      return false;
    }
  };

  // src/models/Task.ts
  var Task = class {
    constructor(id, title, description, assignedToUserId = null) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.assignedToUserId = assignedToUserId;
    }
  };

  // src/services/TaskService.ts
  var TaskService = class {
    constructor() {
      this.idCounter = 1;
    }
    createTask(title, desc) {
      const task = new Task(this.idCounter++, title, desc);
      db.tasks.push(task);
      return task;
    }
    getTasks() {
      return db.tasks;
    }
    updateTask(id, title, desc) {
      const task = db.tasks.find((t) => t.id === id);
      if (task) {
        task.title = title;
        task.description = desc;
        return task;
      }
      return null;
    }
    deleteTask(id) {
      const index = db.tasks.findIndex((t) => t.id === id);
      if (index !== -1) {
        db.tasks.splice(index, 1);
        return true;
      }
      return false;
    }
    assignTask(taskId, userId) {
      const task = db.tasks.find((t) => t.id === taskId);
      const userExists = db.users.some((u) => u.id === userId);
      if (task && userExists) {
        task.assignedToUserId = userId;
        return true;
      }
      return false;
    }
    unassignTask(taskId) {
      const task = db.tasks.find((t) => t.id === taskId);
      if (task) {
        task.assignedToUserId = null;
        return true;
      }
      return false;
    }
    getTasksForUser(userId) {
      return db.tasks.filter((t) => t.assignedToUserId === userId);
    }
  };

  // src/frontend.ts
  var userService = new UserService();
  var taskService = new TaskService();
  var userForm = document.getElementById("userForm");
  var taskForm = document.getElementById("taskForm");
  var userList = document.getElementById("userList");
  var taskList = document.getElementById("taskList");
  var userSelect = document.getElementById("taskAssign");
  var tasksByUserContainer = document.getElementById("tasksByUser");
  userForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("userName").value;
    const email = document.getElementById("userEmail").value;
    if (name && email) {
      userService.createUser(name, email);
      userForm.reset();
      renderAll();
    }
  });
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("taskTitle").value;
    const desc = document.getElementById("taskDescription").value;
    const assignId = parseInt(userSelect.value);
    const task = taskService.createTask(title, desc);
    if (!isNaN(assignId)) {
      taskService.assignTask(task.id, assignId);
    }
    taskForm.reset();
    renderAll();
  });
  function renderUsers() {
    const users = userService.getUsers();
    userList.innerHTML = "";
    userSelect.innerHTML = `<option value="">-- Unassigned --</option>`;
    users.forEach((user) => {
      const div = document.createElement("div");
      div.className = "user-item";
      div.innerHTML = `
      <div class="user-info">
        <div class="user-name">${user.name}</div>
        <div class="user-email">${user.email}</div>
      </div>
      <button class="btn btn-small btn-danger" onclick="deleteUser(${user.id})">Remove</button>
    `;
      userList.appendChild(div);
      const option = document.createElement("option");
      option.value = user.id.toString();
      option.textContent = user.name;
      userSelect.appendChild(option);
    });
  }
  function renderTasks() {
    const tasks = taskService.getTasks();
    const users = userService.getUsers();
    taskList.innerHTML = "";
    tasks.forEach((task) => {
      const div = document.createElement("div");
      div.className = "task-item";
      const assignOptions = users.map(
        (user) => `<option value="${user.id}" ${user.id === task.assignedToUserId ? "selected" : ""}>${user.name}</option>`
      ).join("");
      div.innerHTML = `
      <div class="task-info">
        <div class="task-title">${task.title}</div>
        <div class="task-description">${task.description}</div>
        <div class="task-assignment">
          <select onchange="assignTask(${task.id}, this.value)">
            <option value="">Unassigned</option>
            ${assignOptions}
          </select>
          <button class="btn btn-small btn-danger" onclick="unassignTask(${task.id})">Unassign</button>
        </div>
      </div>
      <button class="btn btn-small btn-danger" onclick="deleteTask(${task.id})">Remove</button>
    `;
      taskList.appendChild(div);
    });
  }
  function renderTasksByUser() {
    const users = userService.getUsers();
    const tasks = taskService.getTasks();
    tasksByUserContainer.innerHTML = "";
    const grouped = {};
    users.forEach((user) => grouped[user.id] = []);
    grouped["unassigned"] = [];
    tasks.forEach((task) => {
      if (task.assignedToUserId !== null) {
        grouped[task.assignedToUserId]?.push(task);
      } else {
        grouped["unassigned"].push(task);
      }
    });
    [...users, { id: "unassigned", name: "Unassigned Tasks", email: "Tasks without assignment" }].forEach((u) => {
      const list = grouped[u.id] || [];
      const div = document.createElement("div");
      div.className = "user-tasks-card";
      div.innerHTML = `
      <div class="user-tasks-header">
        <div class="user-tasks-name">${u.name}<span class="task-count">${list.length}</span></div>
        <div class="user-tasks-email">${u.email}</div>
      </div>
      <div class="user-tasks-list">
        ${list.length === 0 ? `<div class="no-tasks">No tasks assigned</div>` : list.map((t) => `
            <div class="user-task-item">
              <div class="user-task-title">${t.title}</div>
              <div class="user-task-description">${t.description}</div>
            </div>
          `).join("")}
      </div>
    `;
      tasksByUserContainer.appendChild(div);
    });
  }
  window.assignTask = (taskId, userId) => {
    if (userId === "") {
      taskService.unassignTask(taskId);
    } else {
      taskService.assignTask(taskId, parseInt(userId));
    }
    renderAll();
  };
  window.unassignTask = (taskId) => {
    taskService.unassignTask(taskId);
    renderAll();
  };
  window.deleteUser = (userId) => {
    userService.deleteUser(userId);
    renderAll();
  };
  window.deleteTask = (taskId) => {
    taskService.deleteTask(taskId);
    renderAll();
  };
  function renderAll() {
    renderUsers();
    renderTasks();
    renderTasksByUser();
  }
  renderAll();
})();
