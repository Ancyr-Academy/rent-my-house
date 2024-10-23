import { Module } from '@nestjs/common';
import { EntityManager, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken, MikroOrmModule } from '@mikro-orm/nestjs';

import { AppController } from './application/controllers/app-controller';
import { AppService } from './application/services/app-service';
import { ReserveHouseCommandHandler } from './application/commands/reserve-house';
import { I_USER_REPOSITORY } from './application/ports/user-repository';
import { I_HOUSE_REPOSITORY } from './application/ports/house-repository';
import { I_HOUSE_CALENDAR_REPOSITORY } from './application/ports/house-calendar-repository';
import { I_RESERVATION_REPOSITORY } from './application/ports/reservation-repository';
import { I_ID_PROVIDER } from './application/services/id-provider/id-provider';
import { I_MAILER } from './application/ports/mailer';
import { RamMailer } from './infrastructure/mailer/ram/ram-mailer';
import { RandomIdProvider } from './application/services/id-provider/random-id-provider';
import { SqlUser } from './infrastructure/database/sql/entities/sql-user';
import { SqlUserRepository } from './infrastructure/database/sql/repositories/sql-user-repository';
import { SqlHouseRepository } from './infrastructure/database/sql/repositories/sql-house-repository';
import { SqlHouseCalendarRepository } from './infrastructure/database/sql/repositories/sql-house-calendar-repository';
import { SqlReservationRepository } from './infrastructure/database/sql/repositories/sql-reservation-repository';
import { SqlReservation } from './infrastructure/database/sql/entities/sql-reservation';
import { SqlHouseCalendar } from './infrastructure/database/sql/entities/sql-house-calendar';
import { SqlHouse } from './infrastructure/database/sql/entities/sql-house';
import { APP_GUARD } from '@nestjs/core';
import { AppAuthGuard } from './application/auth/app-auth-guard';
import { AcceptReservationCommandHandler } from './application/commands/accept-reservation';
import { ViewReservationQueryHandler } from './application/queries/view-reservations';

const entities = [SqlUser, SqlHouse, SqlHouseCalendar, SqlReservation];

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isTestEnvironment = config.getOrThrow('ENVIRONMENT') === 'test';

        return {
          clientUrl: config.getOrThrow('DATABASE_URL'),
          driver: PostgreSqlDriver,
          entities,
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
    MikroOrmModule.forFeature(entities),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: I_USER_REPOSITORY,
      inject: [EntityManager, getRepositoryToken(SqlUser)],
      useFactory: (entityManager, repository) =>
        new SqlUserRepository(entityManager, repository),
    },
    {
      provide: I_HOUSE_REPOSITORY,
      inject: [EntityManager, getRepositoryToken(SqlHouse)],

      useFactory: (entityManager, repository) =>
        new SqlHouseRepository(entityManager, repository),
    },
    {
      provide: I_HOUSE_CALENDAR_REPOSITORY,
      inject: [EntityManager, getRepositoryToken(SqlHouseCalendar)],

      useFactory: (entityManager, repository) =>
        new SqlHouseCalendarRepository(entityManager, repository),
    },
    {
      provide: I_RESERVATION_REPOSITORY,
      inject: [EntityManager, getRepositoryToken(SqlReservation)],

      useFactory: (entityManager, repository) =>
        new SqlReservationRepository(entityManager, repository),
    },
    {
      provide: I_ID_PROVIDER,
      useFactory: () => new RandomIdProvider(),
    },
    {
      provide: I_MAILER,
      useFactory: () => new RamMailer(),
    },
    {
      provide: APP_GUARD,
      useClass: AppAuthGuard,
    },
    AppService,
    ReserveHouseCommandHandler,
    AcceptReservationCommandHandler,
    ViewReservationQueryHandler,
  ],
})
export class AppModule {}
