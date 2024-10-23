import request from 'supertest';
import { Tester } from '../../runner/test-runner';
import { User } from '../../../domain/entities/user';
import { UserFixture } from '../fixtures/user-fixture';
import { HouseFixture } from '../fixtures/house-fixture';
import { House } from '../../../domain/entities/house';
import { HouseCalendarFixture } from '../fixtures/house-calendar-fixture';
import { HouseCalendarFactory } from '../../../domain/entities/house-calendar-factory';
import { ReservationFixture } from '../fixtures/reservation-fixture';
import { ReservationFactory } from '../../../domain/entities/reservation-factory';
import {
  I_RESERVATION_REPOSITORY,
  IReservationRepository,
} from '../../../application/ports/reservation-repository';
import {
  I_HOUSE_CALENDAR_REPOSITORY,
  IHouseCalendarRepository,
} from '../../../application/ports/house-calendar-repository';

describe('Feature: accept a reservation', () => {
  const tester = new Tester();
  const tenant = new UserFixture(
    new User({
      id: 'tenant',
      emailAddress: 'tenant@rentmyhouse.fr',
    }),
  );
  const host = new UserFixture(
    new User({
      id: 'host',
      emailAddress: 'host@rentmyhouse.fr',
    }),
  );

  beforeAll(() => tester.beforeAll());
  afterEach(() => tester.afterEach());
  afterAll(() => tester.afterAll());
  beforeEach(async () => {
    await tester.beforeEach();
    await tester.loadFixtures([
      tenant,
      host,
      new HouseFixture(
        new House({
          id: 'house-id',
          hostId: 'host',
        }),
      ),
      new HouseCalendarFixture(
        HouseCalendarFactory.create({
          houseId: 'house-id',
          entries: [
            {
              type: 'reservation',
              id: 'reservation-id',
              startDate: new Date('2022-01-01'),
              endDate: new Date('2022-01-10'),
              status: 'PENDING',
            },
          ],
        }),
      ),
      new ReservationFixture(
        ReservationFactory.create({
          id: 'reservation-id',
          houseId: 'house-id',
          tenantId: 'tenant',
          status: 'PENDING',
        }),
      ),
    ]);
  });

  describe('Scenario: happy path', () => {
    it('should be successful', async () => {
      await request(tester.getHttpServer())
        .post('/accept-reservation')
        .send({
          reservationId: 'reservation-id',
        })
        .set('Authorization', host.authorize())
        .expect(200);

      const reservationRepository = tester.get<IReservationRepository>(
        I_RESERVATION_REPOSITORY,
      );
      const reservation =
        await reservationRepository.findById('reservation-id');
      expect(reservation.isAccepted()).toBe(true);

      const calendarRepository = tester.get<IHouseCalendarRepository>(
        I_HOUSE_CALENDAR_REPOSITORY,
      );
      const calendar = await calendarRepository.findByHouseId('house-id');
      expect(calendar.isReservationAccepted('reservation-id')).toBe(true);
    });
  });
});
