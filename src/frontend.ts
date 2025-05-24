import { UserService } from "./services/UserService";
import { TaskService } from "./services/TaskService";

const userService = new UserService();
const taskService = new TaskService();

const userForm = document.getElementById("userForm") as HTMLFormElement;
const taskForm = document.getElementById("taskForm") as HTMLFormElement;

const userList = document.getElementById("userList")!;
const taskList = document.getElementById("taskList")!;
const userSelect = document.getElementById("taskAssign") as HTMLSelectElement;
const tasksByUserContainer = document.getElementById("tasksByUser")!;

userForm.addEventListener("submit", e => {
  e.preventDefault();
  const name = (document.getElementById("userName") as HTMLInputElement).value;
  const email = (document.getElementById("userEmail") as HTMLInputElement).value;
  if (name && email) {
    userService.createUser(name, email);
    userForm.reset();
    renderAll();
  }
});

taskForm.addEventListener("submit", e => {
  e.preventDefault();
  const title = (document.getElementById("taskTitle") as HTMLInputElement).value;
  const desc = (document.getElementById("taskDescription") as HTMLTextAreaElement).value;
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
  users.forEach(user => {
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

  tasks.forEach(task => {
    const div = document.createElement("div");
    div.className = "task-item";

    const assignOptions = users.map(user =>
      `<option value="${user.id}" ${user.id === task.assignedToUserId ? "selected" : ""}>${user.name}</option>`
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

  const grouped: { [userId: string]: typeof tasks } = {};

  users.forEach(user => grouped[user.id] = []);
  grouped["unassigned"] = [];

  tasks.forEach(task => {
    if (task.assignedToUserId !== null) {
      grouped[task.assignedToUserId]?.push(task);
    } else {
      grouped["unassigned"].push(task);
    }
  });

  // render user task cards
  [...users, { id: "unassigned", name: "Unassigned Tasks", email: "Tasks without assignment" }].forEach(u => {
    const list = grouped[u.id as string] || [];
    const div = document.createElement("div");
    div.className = "user-tasks-card";

    div.innerHTML = `
      <div class="user-tasks-header">
        <div class="user-tasks-name">${u.name}<span class="task-count">${list.length}</span></div>
        <div class="user-tasks-email">${u.email}</div>
      </div>
      <div class="user-tasks-list">
        ${list.length === 0
          ? `<div class="no-tasks">No tasks assigned</div>`
          : list.map(t => `
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

// Assign to user from task list dropdown
(window as any).assignTask = (taskId: number, userId: string) => {
  if (userId === "") {
    taskService.unassignTask(taskId);
  } else {
    taskService.assignTask(taskId, parseInt(userId));
  }
  renderAll();
};

(window as any).unassignTask = (taskId: number) => {
  taskService.unassignTask(taskId);
  renderAll();
};

(window as any).deleteUser = (userId: number) => {
  userService.deleteUser(userId);
  renderAll();
};

(window as any).deleteTask = (taskId: number) => {
  taskService.deleteTask(taskId);
  renderAll();
};

function renderAll() {
  renderUsers();
  renderTasks();
  renderTasksByUser();
}

renderAll();

