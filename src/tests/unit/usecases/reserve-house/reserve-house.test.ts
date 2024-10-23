import {
  ReserveHouseCommand,
  ReserveHouseCommandHandler,
} from '../../../../application/commands/reserve-house';
import { House } from '../../../../domain/entities/house';
import { RamReservationRepository } from '../../../../infrastructure/database/ram/ram-reservation-repository';
import { RamHouseRepository } from '../../../../infrastructure/database/ram/ram-house-repository';
import { FixedIdProvider } from '../../../../application/services/id-provider/fixed-id-provider';
import { AuthContext } from '../../../../domain/models/auth-context';
import { RamMailer } from '../../../../infrastructure/mailer/ram/ram-mailer';
import { IHouseCalendarRepository } from '../../../../application/ports/house-calendar-repository';
import { HouseCalendar } from '../../../../domain/entities/house-calendar';
import { HouseCalendarFactory } from '../../../../domain/entities/house-calendar-factory';
import { IUserRepository } from '../../../../application/ports/user-repository';
import { User } from '../../../../domain/entities/user';

class RamHouseCalendarRepository implements IHouseCalendarRepository {
  constructor(private readonly database: HouseCalendar[] = []) {}

  async findByHouseId(houseId: string): Promise<HouseCalendar | null> {
    return (
      this.database.find((schedule) => schedule.getId() === houseId) ?? null
    );
  }

  async save(schedule: HouseCalendar): Promise<void> {
    this.database.push(schedule);
  }
}

class RamUserRepository implements IUserRepository {
  constructor(private readonly database: User[] = []) {}

  async findById(id: string): Promise<User | null> {
    return this.database.find((user) => user.getId() === id) ?? null;
  }
}

describe('Feature: reserving a house', () => {
  let reservationRepository: RamReservationRepository;
  let houseRepository: RamHouseRepository;
  let idProvider: FixedIdProvider;
  let mailer: RamMailer;
  let houseCalendarRepository: RamHouseCalendarRepository;
  let userRepository: RamUserRepository;
  let commandHandler: ReserveHouseCommandHandler;

  const authContext = new AuthContext({
    id: 'requester-id',
    emailAddress: 'anthony@ancyracademy.fr',
  });

  beforeEach(() => {
    reservationRepository = new RamReservationRepository();
    houseRepository = new RamHouseRepository([
      new House({ id: 'house-id', hostId: 'host-id' }),
    ]);
    idProvider = new FixedIdProvider('2');
    mailer = new RamMailer();
    houseCalendarRepository = new RamHouseCalendarRepository([
      HouseCalendarFactory.create({
        houseId: 'house-id',
        entries: [
          {
            type: 'reservation',
            id: '1',
            startDate: new Date('2024-01-04'),
            endDate: new Date('2024-01-05'),
          },
        ],
      }),
    ]);
    userRepository = new RamUserRepository([
      new User({ id: 'host-id', emailAddress: 'host@rentmyhouse.fr' }),
    ]);

    commandHandler = new ReserveHouseCommandHandler(
      reservationRepository,
      houseRepository,
      idProvider,
      mailer,
      houseCalendarRepository,
      userRepository,
    );
  });

  describe('Scenario: happy path', () => {
    const command = new ReserveHouseCommand(
      {
        houseId: 'house-id',
        startDate: '2024-01-01',
        endDate: '2024-01-02',
      },
      authContext,
    );

    it('should reserve a house', async () => {
      await commandHandler.execute(command);

      const reservation = await reservationRepository.findById(idProvider.ID);

      expect(reservation.getId()).toBe(idProvider.ID);
      expect(reservation.getStartDate()).toEqual(new Date('2024-01-01'));
      expect(reservation.getEndDate()).toEqual(new Date('2024-01-02'));
      expect(reservation.getHouseId()).toEqual('house-id');
      expect(reservation.getTenantId()).toEqual('requester-id');
    });

    it('should send an e-mail to the tenant', async () => {
      await commandHandler.execute(command);

      expect(
        mailer.didSendMail({
          to: 'anthony@ancyracademy.fr',
          from: 'noreply@rentmyhouse.fr',
          subject: 'Your reservation',
        }),
      ).toBe(true);
    });

    it('should block the dates in the calendar', async () => {
      await commandHandler.execute(command);

      const calendar = await houseCalendarRepository.findByHouseId('house-id');

      expect(
        calendar.isAvailable(new Date('2024-01-01'), new Date('2024-01-02')),
      ).toBe(false);
    });

    it('should send an e-mail to the host', async () => {
      await commandHandler.execute(command);

      expect(
        mailer.didSendMail({
          to: 'host@rentmyhouse.fr',
          from: 'noreply@rentmyhouse.fr',
          subject: 'You have a pending reservation',
        }),
      ).toBe(true);
    });
  });

  describe('Scenario: the house does not exist', () => {
    it('should reject', async () => {
      const command = new ReserveHouseCommand(
        {
          houseId: 'not-a-house',
          startDate: '2024-01-01',
          endDate: '2024-01-02',
        },
        authContext,
      );

      await expect(() => commandHandler.execute(command)).rejects.toThrow(
        'House not found',
      );
    });
  });

  describe('Scenario: the entry is not available', () => {
    it('should reject', async () => {
      const command = new ReserveHouseCommand(
        {
          houseId: 'house-id',
          startDate: '2024-01-04',
          endDate: '2024-01-05',
        },
        authContext,
      );

      await expect(() => commandHandler.execute(command)).rejects.toThrow(
        'House is not available',
      );
    });
  });
});
