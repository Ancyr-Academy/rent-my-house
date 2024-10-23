import { Reservation } from '../../domain/entities/reservation';
import {
  I_ID_PROVIDER,
  IIdProvider,
} from '../services/id-provider/id-provider';
import {
  I_HOUSE_REPOSITORY,
  IHouseRepository,
} from '../ports/house-repository';
import {
  I_RESERVATION_REPOSITORY,
  IReservationRepository,
} from '../ports/reservation-repository';
import { AuthContext } from '../../domain/models/auth-context';
import { Mail } from '../../domain/models/mail';
import { I_MAILER, IMailer } from '../ports/mailer';
import {
  I_HOUSE_CALENDAR_REPOSITORY,
  IHouseCalendarRepository,
} from '../ports/house-calendar-repository';
import { I_USER_REPOSITORY, IUserRepository } from '../ports/user-repository';
import { Inject, Injectable } from '@nestjs/common';

export class ReserveHouseCommand {
  constructor(
    public readonly data: {
      houseId: string;
      startDate: string;
      endDate: string;
    },
    public readonly auth: AuthContext,
  ) {}
}

@Injectable()
export class ReserveHouseCommandHandler {
  constructor(
    @Inject(I_RESERVATION_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
    @Inject(I_HOUSE_REPOSITORY)
    private readonly houseRepository: IHouseRepository,
    @Inject(I_ID_PROVIDER) private readonly idProvider: IIdProvider,
    @Inject(I_MAILER) private readonly mailer: IMailer,
    @Inject(I_HOUSE_CALENDAR_REPOSITORY)
    private readonly houseCalendarRepository: IHouseCalendarRepository,
    @Inject(I_USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute({ data, auth }: ReserveHouseCommand): Promise<{ id: string }> {
    const house = await this.houseRepository.findById(data.houseId);
    if (house === null) {
      throw new Error('House not found');
    }

    const calendar = await this.houseCalendarRepository.findByHouseId(
      house.getId(),
    );

    if (
      !calendar.isAvailable(new Date(data.startDate), new Date(data.endDate))
    ) {
      throw new Error('House is not available');
    }

    const reservation = new Reservation({
      id: this.idProvider.nextId(),
      tenantId: auth.getId(),
      houseId: data.houseId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    });

    await this.reservationRepository.save(reservation);

    calendar.book(
      reservation.getId(),
      reservation.getStartDate(),
      reservation.getEndDate(),
    );

    await this.houseCalendarRepository.save(calendar);

    await this.mailer.send(
      new Mail({
        to: auth.getEmailAddress(),
        from: 'noreply@rentmyhouse.fr',
        subject: 'Your reservation',
        body: 'Your reservation has been successfully sent to the owner of the house',
      }),
    );

    const host = await this.userRepository.findById(house.getHostId());
    await this.mailer.send(
      new Mail({
        to: host.getEmailAddress(),
        from: 'noreply@rentmyhouse.fr',
        subject: 'You have a pending reservation',
        body: 'You have a new reservation request for your house',
      }),
    );

    return {
      id: reservation.getId(),
    };
  }
}
