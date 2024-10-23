import { IFixture } from '../../runner/fixture.interface';
import { ITester } from '../../runner/tester.interface';
import { HouseCalendar } from '../../../domain/entities/house-calendar';
import {
  I_HOUSE_CALENDAR_REPOSITORY,
  IHouseCalendarRepository,
} from '../../../application/ports/house-calendar-repository';

export class HouseCalendarFixture implements IFixture {
  constructor(public readonly entity: HouseCalendar) {}

  async load(tester: ITester): Promise<void> {
    const repository = tester.get<IHouseCalendarRepository>(
      I_HOUSE_CALENDAR_REPOSITORY,
    );
    await repository.save(this.entity);
  }
}
