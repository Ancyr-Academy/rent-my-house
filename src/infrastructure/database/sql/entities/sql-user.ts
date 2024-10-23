import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'users' })
export class SqlUser {
  @PrimaryKey()
  id: string;

  @Property()
  emailAddress: string;
}