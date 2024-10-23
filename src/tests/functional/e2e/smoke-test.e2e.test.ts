import request from 'supertest';
import { Tester } from '../../runner/test-runner';
import { UserFixture } from '../fixtures/user-fixture';
import { User } from '../../../domain/entities/user';

describe('Smoke Test', () => {
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
    await tester.loadFixtures([user]);
  });

  describe('Scenario: the user is not authenticated', () => {
    it('should fail', () => {
      return request(tester.getHttpServer())
        .get('/')
        .expect(403)
        .expect('Hello World!');
    });
  });

  describe('Scenario: the user is authenticated', () => {
    it('should succeed', () => {
      return request(tester.getHttpServer())
        .get('/')
        .expect(200)
        .set('Authorization', user.authorize())
        .expect('Hello World!');
    });
  });
});
