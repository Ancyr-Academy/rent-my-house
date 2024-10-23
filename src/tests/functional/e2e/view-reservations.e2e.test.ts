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
          startDate: new Date('2022-01-01'),
          endDate: new Date('2022-01-10'),
          status: 'PENDING',
        }),
      ),
    ]);
  });

  describe('Scenario: happy path', () => {
    it('should be successful', async () => {
      await request(tester.getHttpServer())
        .get('/view-reservations')
        .set('Authorization', tenant.authorize())
        .expect(200)
        .expect([
          {
            id: 'reservation-id',
            house: {
              id: 'house-id',
              hostEmailAddress: 'host@rentmyhouse.fr',
            },
            startDate: '2022-01-01',
            endDate: '2022-01-10',
          },
        ]);
    });
  });
});
