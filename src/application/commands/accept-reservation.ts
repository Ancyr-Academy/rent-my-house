import { AuthContext } from '../../domain/models/auth-context';
import { Inject, Injectable } from '@nestjs/common';
import {
  I_RESERVATION_REPOSITORY,
  IReservationRepository,
} from '../ports/reservation-repository';
import {
  I_HOUSE_REPOSITORY,
  IHouseRepository,
} from '../ports/house-repository';
import { I_MAILER, IMailer } from '../ports/mailer';
import {
  I_HOUSE_CALENDAR_REPOSITORY,
  IHouseCalendarRepository,
} from '../ports/house-calendar-repository';
import { Mail } from '../../domain/models/mail';
import { I_USER_REPOSITORY, IUserRepository } from '../ports/user-repository';

export class AcceptReservation {
  constructor(
    public readonly data: {
      reservationId: string;
    },
    public readonly auth: AuthContext,
  ) {}
}

@Injectable()
export class AcceptReservationCommandHandler {
  constructor(
    @Inject(I_RESERVATION_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
    @Inject(I_HOUSE_REPOSITORY)
    private readonly houseRepository: IHouseRepository,
    @Inject(I_MAILER)
    private readonly mailer: IMailer,
    @Inject(I_HOUSE_CALENDAR_REPOSITORY)
    private readonly houseCalendarRepository: IHouseCalendarRepository,
    @Inject(I_USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute({ data, auth }: AcceptReservation) {
    const reservation = await this.reservationRepository.findById(
      data.reservationId,
    );

    if (reservation === null) {
      throw new Error('Reservation not found');
    }

    const house = await this.houseRepository.findById(reservation.getHouseId());
    if (!house.isHost(auth.getId())) {
      throw new Error('You are not allowed to do this action');
    }

    if (reservation.isRefused()) {
      throw new Error('This reservation is already refused');
    }

    reservation.accept();

    await this.reservationRepository.save(reservation);

    const tenant = await this.userRepository.findById(
      reservation.getTenantId(),
    );

    await this.mailer.send(
      new Mail({
        from: 'noreply@rentmyhouse.fr',
        to: tenant.getEmailAddress(),
        subject: 'Your reservation has been accepted',
        body: '',
      }),
    );
  }
}
