import {
  ReserveHouseCommand,
  ReserveHouseCommandHandler,
} from '../../../../application/commands/reserve-house';
import { House } from '../../../../domain/entities/house';
import { RamReservationRepository } from '../../../../infrastructure/database/ram/ram-reservation-repository';
import { RamHouseRepository } from '../../../../infrastructure/database/ram/ram-house-repository';
import { FixedIdProvider } from '../../../../application/services/id-provider/fixed-id-provider';
import { AuthContext } from '../../../../domain/models/auth-context';

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
      const command = new ReserveHouseCommand(
        {
          houseId: 'house-id',
          startDate: '2024-01-01',
          endDate: '2024-01-02',
        },
        new AuthContext({ id: 'requester-id' }),
      );

      await commandHandler.execute(command);

      const reservation = await reservationRepository.findById(idProvider.ID);

      expect(reservation.getId()).toBe(idProvider.ID);
      expect(reservation.getStartDate()).toEqual(new Date('2024-01-01'));
      expect(reservation.getEndDate()).toEqual(new Date('2024-01-02'));
      expect(reservation.getHouseId()).toEqual('house-id');
      expect(reservation.getTenantId()).toEqual('requester-id');
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
        new AuthContext({ id: '1' }),
      );

      await expect(() => commandHandler.execute(command)).rejects.toThrow(
        'House not found',
      );
    });
  });
});
