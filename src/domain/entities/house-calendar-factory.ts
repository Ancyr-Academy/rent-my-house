import { HouseCalendar, State } from './house-calendar';

export class HouseCalendarFactory {
  static create(data?: Partial<State>) {
    return new HouseCalendar({
      houseId: 'house-id',
      entries: [],
      ...data,
    });
  }
}
