import { EntityManager, EntityRepository, ref } from '@mikro-orm/postgresql';
import { SqlUser } from '../entities/sql-user';
import { SqlHouse } from '../entities/sql-house';
import { IHouseRepository } from '../../../../application/ports/house-repository';
import { House } from '../../../../domain/entities/house';

export class SqlHouseRepository implements IHouseRepository {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly repository: EntityRepository<SqlHouse>,
  ) {}

  async findById(id: string): Promise<House | null> {
    const entity = await this.repository.findOne({ id });
    if (!entity) {
      return null;
    }

    return new House({
      id: entity.id,
      hostId: entity.host.id,
    });
  }

  async save(house: House): Promise<void> {
    let record: SqlHouse = await this.repository.findOne({ id: house.getId() });
    if (!record) {
      record = new SqlHouse();
    }

    record.id = house.getId();
    record.host = ref(SqlUser, house.getHostId());

    await this.entityManager.persistAndFlush(record);
  }
}
