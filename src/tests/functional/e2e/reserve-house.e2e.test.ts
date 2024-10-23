import request from 'supertest';
import { Tester } from '../../runner/test-runner';

describe('Feature: reserving a house', () => {
  const tester = new Tester();

  beforeAll(() => tester.beforeAll());
  afterEach(() => tester.afterEach());
  afterAll(() => tester.afterAll());
  beforeEach(() => tester.beforeEach());

  describe('Scenario: happy path', () => {
    it('should be successful', async () => {
      const result = await request(tester.getHttpServer())
        .post('/reserve-house')
        .expect(200);
    });
  });
});
