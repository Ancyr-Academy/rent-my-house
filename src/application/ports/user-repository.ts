import { User } from '../../domain/entities/user';

export const I_USER_REPOSITORY = 'IUserRepository';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
