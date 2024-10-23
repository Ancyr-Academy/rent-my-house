import { House } from '../../../../domain/entities/house';
import { RamReservationRepository } from '../../../../infrastructure/database/ram/ram-reservation-repository';
import { RamHouseRepository } from '../../../../infrastructure/database/ram/ram-house-repository';
import { AuthContext } from '../../../../domain/models/auth-context';
import { RamMailer } from '../../../../infrastructure/mailer/ram/ram-mailer';
import { HouseCalendarFactory } from '../../../../domain/entities/house-calendar-factory';
import { RamHouseCalendarRepository } from '../../../../infrastructure/database/ram/ram-house-calendar-repository';
import {
  AcceptReservation,
  AcceptReservationCommandHandler,
} from '../../../../application/commands/accept-reservation';
import { ReservationFactory } from '../../../../domain/entities/reservation-factory';
import { RamUserRepository } from '../../../../infrastructure/database/ram/ram-user-repository';
import { User } from '../../../../domain/entities/user';

describe('Feature: reserving a house', () => {
  let reservationRepository: RamReservationRepository;
  let houseRepository: RamHouseRepository;
  let mailer: RamMailer;
  let houseCalendarRepository: RamHouseCalendarRepository;
  let userRepository: RamUserRepository;
  let commandHandler: AcceptReservationCommandHandler;

  const hostContext = new AuthContext({
    id: 'host',
    emailAddress: 'host@rentmyhouse.fr',
  });

  const tenantContext = new AuthContext({
    id: 'tenant',
    emailAddress: 'tenant@rentmyhouse.fr',
  });

  const expectEmailToBeSent = () => {
    expect(
      mailer.didSendMail({
        from: 'noreply@rentmyhouse.fr',
        to: 'tenant@rentmyhouse.fr',
        subject: 'Your reservation has been accepted',
      }),
    ).toBe(true);
  };

  const expectReservationToBeAccepted = async (id: string) => {
    const reservation = await reservationRepository.findById(id);
    expect(reservation.isAccepted()).toBe(true);
  };

  beforeEach(() => {
    reservationRepository = new RamReservationRepository([
      ReservationFactory.create({
        id: 'pending-reservation-id',
        tenantId: 'tenant',
        houseId: 'house-id',
        startDate: new Date('2024-01-04'),
        endDate: new Date('2024-01-05'),
        status: 'PENDING',
      }),
      ReservationFactory.create({
        id: 'accepted-reservation-id',
        tenantId: 'tenant',
        houseId: 'house-id',
        startDate: new Date('2024-01-06'),
        endDate: new Date('2024-01-07'),
        status: 'ACCEPTED',
      }),
      ReservationFactory.create({
        id: 'refused-reservation-id',
        tenantId: 'tenant',
        houseId: 'house-id',
        startDate: new Date('2024-01-08'),
        endDate: new Date('2024-01-09'),
        status: 'REFUSED',
      }),
    ]);
    houseRepository = new RamHouseRepository([
      new House({ id: 'house-id', hostId: 'host' }),
    ]);
    mailer = new RamMailer();
    houseCalendarRepository = new RamHouseCalendarRepository([
      HouseCalendarFactory.create({
        houseId: 'house-id',
        entries: [
          {
            type: 'reservation',
            id: 'pending-reservation-id',
            startDate: new Date('2024-01-04'),
            endDate: new Date('2024-01-05'),
          },
          {
            type: 'reservation',
            id: 'accepted-reservation-id',
            startDate: new Date('2024-01-06'),
            endDate: new Date('2024-01-07'),
          },
          {
            type: 'reservation',
            id: 'refused-reservation-id',
            startDate: new Date('2024-01-08'),
            endDate: new Date('2024-01-09'),
          },
        ],
      }),
    ]);
    userRepository = new RamUserRepository([
      new User({
        id: 'host',
        emailAddress: 'host@rentmyhouse.fr',
      }),
      new User({
        id: 'tenant',
        emailAddress: 'tenant@rentmyhouse.fr',
      }),
    ]);

    commandHandler = new AcceptReservationCommandHandler(
      reservationRepository,
      houseRepository,
      mailer,
      houseCalendarRepository,
      userRepository,
    );
  });

  describe('Scenario: happy path', () => {
    const command = new AcceptReservation(
      {
        reservationId: 'pending-reservation-id',
      },
      hostContext,
    );

    it('should mark the reservation as accepted', async () => {
      await commandHandler.execute(command);
      await expectReservationToBeAccepted('pending-reservation-id');
    });

    it('should send an e-mail to the tenant', async () => {
      await commandHandler.execute(command);
      expectEmailToBeSent();
    });
  });

  describe('Scenario: the reservation does not exist', () => {
    const command = new AcceptReservation(
      {
        reservationId: 'wrong-reservation',
      },
      hostContext,
    );

    it('should fail', async () => {
      await expect(() => commandHandler.execute(command)).rejects.toThrow(
        'Reservation not found',
      );
    });
  });

  describe('Scenario: the requester is not the host', () => {
    const command = new AcceptReservation(
      {
        reservationId: 'pending-reservation-id',
      },
      tenantContext,
    );

    it('should fail', async () => {
      await expect(() => commandHandler.execute(command)).rejects.toThrow(
        'You are not allowed to do this action',
      );
    });
  });

  describe('Scenario: the reservation is already accepted', () => {
    const command = new AcceptReservation(
      {
        reservationId: 'accepted-reservation-id',
      },
      hostContext,
    );

    it('should mark the reservation as accepted', async () => {
      await commandHandler.execute(command);
      await expectReservationToBeAccepted('accepted-reservation-id');
    });

    it('should send an e-mail to the tenant', async () => {
      await commandHandler.execute(command);
      expectEmailToBeSent();
    });
  });

  describe('Scenario: the reservation is already refused', () => {
    const command = new AcceptReservation(
      {
        reservationId: 'refused-reservation-id',
      },
      hostContext,
    );

    it('should fail', async () => {
      await expect(() => commandHandler.execute(command)).rejects.toThrow(
        'This reservation is already refused',
      );
    });
  });
});
