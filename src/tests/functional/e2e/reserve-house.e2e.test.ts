import request from 'supertest';
import { Tester } from '../../runner/test-runner';
import { User } from '../../../domain/entities/user';
import { UserFixture } from '../fixtures/user-fixture';
import { HouseFixture } from '../fixtures/house-fixture';
import { House } from '../../../domain/entities/house';
import { HouseCalendarFixture } from '../fixtures/house-calendar-fixture';
import { HouseCalendarFactory } from '../../../domain/entities/house-calendar-factory';
import {
  I_RESERVATION_REPOSITORY,
  IReservationRepository,
} from '../../../application/ports/reservation-repository';
import {
  I_HOUSE_CALENDAR_REPOSITORY,
  IHouseCalendarRepository,
} from '../../../application/ports/house-calendar-repository';

describe('Feature: reserving a house', () => {
  const tester = new Tester();
  const user = new UserFixture(
    new User({
      id: 'anthony',
      emailAddress: 'anthony@ancyracademy.fr',
    }),
  );

  beforeAll(() => tester.beforeAll());
  afterEach(() => tester.afterEach());
  afterAll(() => tester.afterAll());
  beforeEach(async () => {
    await tester.beforeEach();
    await tester.loadFixtures([
      user,
      new UserFixture(
        new User({
          id: 'host',
          emailAddress: 'host@rentmyhouse.fr',
        }),
      ),
      new HouseFixture(
        new House({
          id: 'house-id',
          hostId: 'host',
        }),
      ),
      new HouseCalendarFixture(
        HouseCalendarFactory.create({
          houseId: 'house-id',
        }),
      ),
    ]);
  });

  describe('Scenario: happy path', () => {
    it('should be successful', async () => {
      const result = await request(tester.getHttpServer())
        .post('/reserve-house')
        .send({
          houseId: 'house-id',
          startDate: '2024-01-03',
          endDate: '2024-01-05',
        })
        .set('Authorization', user.authorize())
        .expect(201);

      expect(result.body).toEqual({
        id: expect.any(String),
      });

      const id = result.body.id;

      const reservationRepository = tester.get<IReservationRepository>(
        I_RESERVATION_REPOSITORY,
      );

      const reservation = await reservationRepository.findById(id);

      expect(reservation).not.toBeNull();
      expect(reservation.getHouseId()).toEqual('house-id');
      expect(reservation.getStartDate()).toEqual(new Date('2024-01-03'));
      expect(reservation.getEndDate()).toEqual(new Date('2024-01-05'));

      const mailTester = tester.getMailTester();

      expect(
        mailTester.didSendMail({
          to: 'anthony@ancyracademy.fr',
          from: 'noreply@rentmyhouse.fr',
          subject: 'Your reservation',
        }),
      ).toBe(true);

      expect(
        mailTester.didSendMail({
          to: 'host@rentmyhouse.fr',
          from: 'noreply@rentmyhouse.fr',
          subject: 'You have a pending reservation',
        }),
      ).toBe(true);

      const calendarRepository = tester.get<IHouseCalendarRepository>(
        I_HOUSE_CALENDAR_REPOSITORY,
      );
      const calendar = await calendarRepository.findByHouseId('house-id');

      expect(
        calendar.isAvailable(new Date('2024-01-03'), new Date('2024-01-05')),
      ).toBe(false);
    });
  });

  describe('Scenario: not authenticated', () => {
    it('should reject', async () => {
      return request(tester.getHttpServer())
        .post('/reserve-house')
        .send({
          houseId: 'house-id',
          startDate: '2024-01-03',
          endDate: '2024-01-05',
        })
        .expect(403);
    });
  });
});
