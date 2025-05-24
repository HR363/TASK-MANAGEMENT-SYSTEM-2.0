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
  var userList = document.getElementById("user-list");
  var taskList = document.getElementById("task-list");
  function renderUsers() {
    userList.innerHTML = "";
    userService.getUsers().forEach((user) => {
      const li = document.createElement("li");
      li.textContent = `${user.name} (${user.email})`;
      userList.appendChild(li);
    });
  }
  function renderTasks() {
    taskList.innerHTML = "";
    taskService.getTasks().forEach((task) => {
      const li = document.createElement("li");
      li.textContent = `${task.title} - ${task.description}`;
      taskList.appendChild(li);
    });
  }
  window.addUser = () => {
    const nameInput = document.getElementById("user-name");
    const emailInput = document.getElementById("user-email");
    if (nameInput.value && emailInput.value) {
      userService.createUser(nameInput.value, emailInput.value);
      nameInput.value = "";
      emailInput.value = "";
      renderUsers();
    }
  };
  window.addTask = () => {
    const titleInput = document.getElementById("task-title");
    const descInput = document.getElementById("task-desc");
    if (titleInput.value && descInput.value) {
      taskService.createTask(titleInput.value, descInput.value);
      titleInput.value = "";
      descInput.value = "";
      renderTasks();
    }
  };
  renderUsers();
  renderTasks();
})();
