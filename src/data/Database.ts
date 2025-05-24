import { User } from '../models/User';
import { Task } from '../models/Task';

export class Database {
  users: User[] = [];
  tasks: Task[] = [];
}
export const db = new Database();
