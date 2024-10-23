import { IUserRepository } from '../../../../application/ports/user-repository';
import { User } from '../../../../domain/entities/user';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { SqlUser } from '../entities/sql-user';

export class SqlUserRepository implements IUserRepository {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly repository: EntityRepository<SqlUser>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({ id });
    if (!entity) {
      return null;
    }

    return new User({
      id: entity.id,
      emailAddress: entity.emailAddress,
    });
  }

  async save(user: User): Promise<void> {
    let record: SqlUser = await this.repository.findOne({ id: user.getId() });
    if (!record) {
      record = new SqlUser();
    }

    record.id = user.getId();
    record.emailAddress = user.getEmailAddress();

    await this.entityManager.persistAndFlush(record);
  }
}
