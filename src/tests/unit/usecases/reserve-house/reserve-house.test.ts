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

describe('Feature: reserving a house', () => {
  let reservationRepository: RamReservationRepository;
  let houseRepository: RamHouseRepository;
  let idProvider: FixedIdProvider;
  let mailer: RamMailer;
  let commandHandler: ReserveHouseCommandHandler;

  const authContext = new AuthContext({
    id: 'requester-id',
    emailAddress: 'anthony@ancyracademy.fr',
  });

  beforeEach(() => {
    reservationRepository = new RamReservationRepository();
    houseRepository = new RamHouseRepository([new House({ id: 'house-id' })]);
    idProvider = new FixedIdProvider('2');
    mailer = new RamMailer();

    commandHandler = new ReserveHouseCommandHandler(
      reservationRepository,
      houseRepository,
      idProvider,
      mailer,
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
        authContext,
      );

      await commandHandler.execute(command);

      const reservation = await reservationRepository.findById(idProvider.ID);

      expect(reservation.getId()).toBe(idProvider.ID);
      expect(reservation.getStartDate()).toEqual(new Date('2024-01-01'));
      expect(reservation.getEndDate()).toEqual(new Date('2024-01-02'));
      expect(reservation.getHouseId()).toEqual('house-id');
      expect(reservation.getTenantId()).toEqual('requester-id');
    });

    it('should send an e-mail to the tenant', async () => {
      const command = new ReserveHouseCommand(
        {
          houseId: 'house-id',
          startDate: '2024-01-01',
          endDate: '2024-01-02',
        },
        authContext,
      );

      await commandHandler.execute(command);

      expect(
        mailer.didSendMail({
          to: 'anthony@ancyracademy.fr',
          from: 'noreply@rentmyhouse.fr',
          subject: 'Your reservation',
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
});
