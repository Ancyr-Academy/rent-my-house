import { HouseCalendar } from '../../domain/entities/house-calendar';

export interface IHouseCalendarRepository {
  findByHouseId(houseId: string): Promise<HouseCalendar | null>;

  save(schedule: HouseCalendar): Promise<void>;
}
