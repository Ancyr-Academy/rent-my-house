import { HouseCalendar } from '../../domain/entities/house-calendar';

export const I_HOUSE_CALENDAR_REPOSITORY = 'IHouseCalendarRepository';

export interface IHouseCalendarRepository {
  findByHouseId(houseId: string): Promise<HouseCalendar | null>;

  save(schedule: HouseCalendar): Promise<void>;
}
