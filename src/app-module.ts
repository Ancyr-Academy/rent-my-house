import { Module } from '@nestjs/common';
import { AppController } from './application/controllers/app-controller';
import { AppService } from './application/services/app-service';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isTestEnvironment = config.getOrThrow('ENVIRONMENT') === 'test';

        return {
          clientUrl: config.getOrThrow('DATABASE_URL'),
          driver: PostgreSqlDriver,
          entities: [],
          metadataProvider: TsMorphMetadataProvider,
          discovery: {
            warnWhenNoEntities: false,
          },
          dynamicImportProvider: (id) => import(id),
          ...(isTestEnvironment
            ? {
                allowGlobalContext: true,
                disableIdentityMap: false,
              }
            : {}),
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
