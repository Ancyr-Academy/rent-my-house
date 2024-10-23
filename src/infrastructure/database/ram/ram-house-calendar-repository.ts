import { IHouseCalendarRepository } from '../../../application/ports/house-calendar-repository';
import { HouseCalendar } from '../../../domain/entities/house-calendar';

export class RamHouseCalendarRepository implements IHouseCalendarRepository {
  constructor(private readonly database: HouseCalendar[] = []) {}

  async findByHouseId(houseId: string): Promise<HouseCalendar | null> {
    return (
      this.database.find((schedule) => schedule.getId() === houseId) ?? null
    );
  }

  async save(schedule: HouseCalendar): Promise<void> {
    this.database.push(schedule);
  }
}
