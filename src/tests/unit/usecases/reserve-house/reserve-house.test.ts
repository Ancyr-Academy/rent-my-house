import {
  IHouseRepository,
  IIdProvider,
  IReservationRepository,
  ReserveHouseCommand,
  ReserveHouseCommandHandler,
} from '../../../../application/commands/reserve-house';
import { Reservation } from '../../../../domain/entities/reservation';
import { House } from '../../../../domain/entities/house';

class RamReservationRepository implements IReservationRepository {
  constructor(public readonly database: Reservation[] = []) {}

  async save(entity: Reservation): Promise<void> {
    this.database.push(entity);
  }

  async findById(id: string): Promise<Reservation | null> {
    return (
      this.database.find((reservation) => reservation.getId() === id) || null
    );
  }
}

class RamHouseRepository implements IHouseRepository {
  constructor(public readonly database: House[] = []) {}

  async findById(id: string): Promise<House | null> {
    return this.database.find((house) => house.getId() === id) || null;
  }
}

class FixedIdProvider implements IIdProvider {
  constructor(public readonly ID = '2') {}
  nextId(): string {
    return this.ID;
  }
}

describe('Feature: reserving a house', () => {
  let reservationRepository: RamReservationRepository;
  let houseRepository: RamHouseRepository;
  let idProvider: FixedIdProvider;
  let commandHandler: ReserveHouseCommandHandler;

  beforeEach(() => {
    reservationRepository = new RamReservationRepository();
    houseRepository = new RamHouseRepository([new House({ id: 'house-id' })]);
    idProvider = new FixedIdProvider('2');

    commandHandler = new ReserveHouseCommandHandler(
      reservationRepository,
      houseRepository,
      idProvider,
    );
  });

  describe('Scenario: happy path', () => {
    it('should reserve a house', async () => {
      const command = new ReserveHouseCommand({
        houseId: 'house-id',
        startDate: '2024-01-01',
        endDate: '2024-01-02',
      });

      await commandHandler.execute(command);

      const reservation = await reservationRepository.findById(idProvider.ID);

      expect(reservation.getId()).toBe(idProvider.ID);
      expect(reservation.getStartDate()).toEqual(new Date('2024-01-01'));
      expect(reservation.getEndDate()).toEqual(new Date('2024-01-02'));
      expect(reservation.getHouseId()).toEqual('house-id');
    });
  });

  describe('Scenario: the house does not exist', () => {
    it('should reject', async () => {
      const command = new ReserveHouseCommand({
        houseId: 'not-a-house',
        startDate: '2024-01-01',
        endDate: '2024-01-02',
      });

      await expect(() => commandHandler.execute(command)).rejects.toThrow(
        'House not found',
      );
    });
  });
});
