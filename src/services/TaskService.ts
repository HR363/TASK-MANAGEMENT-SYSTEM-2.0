import { Task } from '../models/Task';
import { db } from '../data/Database';

export class TaskService {
  private idCounter = 1;

  createTask(title: string, desc: string): Task {
    const task = new Task(this.idCounter++, title, desc);
    db.tasks.push(task);
    return task;
  }

  getTasks(): Task[] {
    return db.tasks;
  }

  updateTask(id: number, title: string, desc: string): Task | null {
    const task = db.tasks.find(t => t.id === id);
    if (task) {
      task.title = title;
      task.description = desc;
      return task;
    }
    return null;
  }

  deleteTask(id: number): boolean {
    const index = db.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      db.tasks.splice(index, 1);
      return true;
    }
    return false;
  }

  assignTask(taskId: number, userId: number): boolean {
    const task = db.tasks.find(t => t.id === taskId);
    const userExists = db.users.some(u => u.id === userId);
    if (task && userExists) {
      task.assignedToUserId = userId;
      return true;
    }
    return false;
  }

  unassignTask(taskId: number): boolean {
    const task = db.tasks.find(t => t.id === taskId);
    if (task) {
      task.assignedToUserId = null;
      return true;
    }
    return false;
  }

  getTasksForUser(userId: number): Task[] {
    return db.tasks.filter(t => t.assignedToUserId === userId);
  }
}
