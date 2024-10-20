import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Migrator } from '@mikro-orm/migrations';
import * as fs from 'fs';
import dotenv from 'dotenv';

if (!process.env.DATABASE_URL) {
  // Run these command using ENVFILE=.env.prod pnpm orm:up for example
  const envFile = process.env.ENVFILE ?? '.env';
  console.log('Environment file : ' + envFile);

  dotenv.config({
    path: envFile,
  });
} else {
  console.log('Loading from environment variables');
}

const DATABASE_URL = process.env.DATABASE_URL;

export default defineConfig({
  clientUrl: DATABASE_URL,
  entities: ['./src/**/infrastructure/database/sql/entities/*.ts'],
  entitiesTs: ['./src/**/infrastructure/database/sql/entities/*.ts'],
  extensions: [Migrator],
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: './migrations',
    pathTs: './migrations',
    glob: '*.{js,ts}',
    transactional: true,
    disableForeignKeys: false,
    allOrNothing: true,
    emit: 'ts',
  },
  debug: true,
  metadataProvider: TsMorphMetadataProvider,
});
