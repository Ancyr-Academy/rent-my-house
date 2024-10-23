import { IUserRepository } from '../../../application/ports/user-repository';
import { User } from '../../../domain/entities/user';

export class RamUserRepository implements IUserRepository {
  constructor(private readonly database: User[] = []) {}

  async findById(id: string): Promise<User | null> {
    return this.database.find((user) => user.getId() === id) ?? null;
  }

  async save(user: User): Promise<void> {
    this.database.push(user);
  }
}
