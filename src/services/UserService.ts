import { User } from '../models/User';
import { db } from '../data/Database';

export class UserService {
  private idCounter = 1;

  createUser(name: string, email: string): User {
    const user = new User(this.idCounter++, name, email);
    db.users.push(user);
    return user;
  }

  getUsers(): User[] {
    return db.users;
  }

  updateUser(id: number, name: string, email: string): User | null {
    const user = db.users.find(u => u.id === id);
    if (user) {
      user.name = name;
      user.email = email;
      return user;
    }
    return null;
  }

  deleteUser(id: number): boolean {
    const index = db.users.findIndex(u => u.id === id);
    if (index !== -1) {
      db.users.splice(index, 1);
      return true;
    }
    return false;
  }
}
