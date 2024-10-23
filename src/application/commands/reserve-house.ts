import { Reservation } from '../../domain/entities/reservation';
import { IIdProvider } from '../services/id-provider/id-provider';
import { IHouseRepository } from '../ports/house-repository';
import { IReservationRepository } from '../ports/reservation-repository';
import { AuthContext } from '../../domain/models/auth-context';
import { Mail } from '../../domain/models/mail';
import { IMailer } from '../ports/mailer';
import { IHouseCalendarRepository } from '../ports/house-calendar-repository';

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

export class ReserveHouseCommandHandler {
  constructor(
    private readonly reservationRepository: IReservationRepository,
    private readonly houseRepository: IHouseRepository,
    private readonly idProvider: IIdProvider,
    private readonly mailer: IMailer,
    private readonly houseCalendarRepository: IHouseCalendarRepository,
  ) {}

  async execute({ data, auth }: ReserveHouseCommand) {
    const house = await this.houseRepository.findById(data.houseId);
    if (house === null) {
      throw new Error('House not found');
    }

    const calendar = await this.houseCalendarRepository.findByHouseId(
      house.getId(),
    );

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
  }
}
