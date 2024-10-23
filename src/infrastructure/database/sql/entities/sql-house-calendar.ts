import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

export type SqlEntry = {
  type: 'reservation';
  id: string;
  startDate: string;
  endDate: string;
};

@Entity({ tableName: 'house_calendars' })
export class SqlHouseCalendar {
  @PrimaryKey()
  houseId: string;

  @Property({ type: 'jsonb' })
  entries: SqlEntry[];
}
