import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { IHouseCalendarRepository } from '../../../../application/ports/house-calendar-repository';
import { HouseCalendar } from '../../../../domain/entities/house-calendar';
import { SqlHouseCalendar } from '../entities/sql-house-calendar';

export class SqlHouseCalendarRepository implements IHouseCalendarRepository {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly repository: EntityRepository<SqlHouseCalendar>,
  ) {}

  async findByHouseId(houseId: string): Promise<HouseCalendar | null> {
    const entity = await this.repository.findOne({ houseId });
    if (!entity) {
      return null;
    }

    return new HouseCalendar({
      houseId: entity.houseId,
      entries: entity.entries.map((entry) => ({
        id: entry.id,
        type: entry.type,
        startDate: new Date(entry.startDate),
        endDate: new Date(entry.endDate),
      })),
    });
  }

  async save(reservation: HouseCalendar): Promise<void> {
    let record: SqlHouseCalendar = await this.repository.findOne({
      houseId: reservation.getId(),
    });

    if (!record) {
      record = new SqlHouseCalendar();
    }

    record.houseId = reservation.getId();
    record.entries = reservation.getEntries().map((entry) => ({
      id: entry.id,
      type: entry.type,
      startDate: entry.startDate.toISOString(),
      endDate: entry.endDate.toISOString(),
    }));

    await this.entityManager.persistAndFlush(record);
  }
}
