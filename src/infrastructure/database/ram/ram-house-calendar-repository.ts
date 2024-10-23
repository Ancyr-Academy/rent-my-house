import { IHouseCalendarRepository } from '../../../application/ports/house-calendar-repository';
import { HouseCalendar } from '../../../domain/entities/house-calendar';

export class RamHouseCalendarRepository implements IHouseCalendarRepository {
  constructor(private readonly database: HouseCalendar[] = []) {}

  async save(entity: HouseCalendar): Promise<void> {
    const idx = this.database.findIndex(
      (entity) => entity.getId() === entity.getId(),
    );

    if (idx >= 0) {
      this.database[idx] = entity;
      return;
    }

    this.database.push(entity);
  }

  async findByHouseId(id: string): Promise<HouseCalendar | null> {
    const entity =
      this.database.find((entity) => entity.getId() === id) || null;

    if (!entity) {
      return null;
    }

    return entity.clone();
  }
}
