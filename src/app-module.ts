import { Module } from '@nestjs/common';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { AppController } from './application/controllers/app-controller';
import { AppService } from './application/services/app-service';
import { ReserveHouseCommandHandler } from './application/commands/reserve-house';
import { I_USER_REPOSITORY } from './application/ports/user-repository';
import { RamUserRepository } from './infrastructure/database/ram/ram-user-repository';
import { I_HOUSE_REPOSITORY } from './application/ports/house-repository';
import { RamHouseRepository } from './infrastructure/database/ram/ram-house-repository';
import { I_HOUSE_CALENDAR_REPOSITORY } from './application/ports/house-calendar-repository';
import { RamHouseCalendarRepository } from './infrastructure/database/ram/ram-house-calendar-repository';
import { I_RESERVATION_REPOSITORY } from './application/ports/reservation-repository';
import { I_ID_PROVIDER } from './application/services/id-provider/id-provider';
import { I_MAILER } from './application/ports/mailer';
import { RamMailer } from './infrastructure/mailer/ram/ram-mailer';
import { RandomIdProvider } from './application/services/id-provider/random-id-provider';
import { RamReservationRepository } from './infrastructure/database/ram/ram-reservation-repository';

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
  providers: [
    {
      provide: I_USER_REPOSITORY,
      useFactory: () => new RamUserRepository(),
    },
    {
      provide: I_HOUSE_REPOSITORY,
      useFactory: () => new RamHouseRepository(),
    },
    {
      provide: I_HOUSE_CALENDAR_REPOSITORY,
      useFactory: () => new RamHouseCalendarRepository(),
    },
    {
      provide: I_RESERVATION_REPOSITORY,
      useFactory: () => new RamReservationRepository(),
    },
    {
      provide: I_ID_PROVIDER,
      useFactory: () => new RandomIdProvider(),
    },
    {
      provide: I_MAILER,
      useFactory: () => new RamMailer(),
    },
    AppService,
    ReserveHouseCommandHandler,
  ],
})
export class AppModule {}
