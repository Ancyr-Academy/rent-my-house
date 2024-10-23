import { Entity, ManyToOne, OneToMany, PrimaryKey, Ref } from '@mikro-orm/core';
import { SqlUser } from './sql-user';

@Entity({ tableName: 'houses' })
export class SqlHouse {
  @PrimaryKey()
  id: string;

  @ManyToOne({
    entity: () => SqlUser,
    ref: true,
    nullable: false,
    deleteRule: 'cascade',
  })
  host: Ref<SqlUser>;
}
