import request from 'supertest';
import { Tester } from '../../runner/test-runner';

describe('Smoke Test', () => {
  const tester = new Tester();

  beforeAll(() => tester.beforeAll());
  afterEach(() => tester.afterEach());
  afterAll(() => tester.afterAll());
  beforeEach(() => tester.beforeEach());

  describe('Scenario: hitting the home API', () => {
    it('should be successful', () => {
      return request(tester.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });
  });
});
