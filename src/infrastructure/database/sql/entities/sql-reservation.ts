import { Entity, ManyToOne, PrimaryKey, Property, Ref } from '@mikro-orm/core';
import { SqlUser } from './sql-user';
import { SqlHouse } from './sql-house';

@Entity({ tableName: 'reservations' })
export class SqlReservation {
  @PrimaryKey()
  id: string;

  @ManyToOne({
    entity: () => SqlHouse,
    ref: true,
    nullable: false,
    deleteRule: 'cascade',
  })
  house: Ref<SqlHouse>;

  @ManyToOne({
    entity: () => SqlUser,
    ref: true,
    nullable: false,
    deleteRule: 'cascade',
  })
  tenant: Ref<SqlUser>;

  @Property()
  startDate: Date;

  @Property()
  endDate: Date;

  @Property()
  status: string;
}
