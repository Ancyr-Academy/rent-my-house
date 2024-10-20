import { EntityName, MikroORM } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import path from 'path';

export class MikroOrmProvider {
  constructor(private orm: MikroORM) {}

  static async create() {
    const orm = await MikroORM.init({
      clientUrl: 'postgresql://user:azerty123@localhost:7654/rentmyhouse',
      entities: ['./src/**/infrastructure/persistence/sql/entities/*.ts'],
      baseDir: path.join(__dirname, '../../../'),
      extensions: [Migrator],
      metadataProvider: TsMorphMetadataProvider,
      dynamicImportProvider: (id) => import(id),
      allowGlobalContext: true,
      migrations: {
        tableName: 'mikro_orm_migrations',
        path: './migrations',
        pathTs: './migrations',
        glob: '*.{js,ts}',
        transactional: true,
        disableForeignKeys: true,
        allOrNothing: true,
        emit: 'ts',
      },
    });

    return new MikroOrmProvider(orm);
  }

  async init() {
    await this.orm.getSchemaGenerator().refreshDatabase();
  }

  entityManager() {
    return this.orm.em;
  }

  repository<T extends {}>(name: EntityName<T>) {
    return this.orm.em.getRepository(name);
  }

  async flush() {
    await this.orm.em.flush();
    this.orm.em.clear();
  }

  async truncate() {}
}
