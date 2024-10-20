import { AppController } from '../../../application/controllers/app-controller';
import { Tester } from '../../runner/test-runner';

describe('Smoke Test', () => {
  const tester = new Tester();
  let appController: AppController;

  beforeAll(() => tester.beforeAll());
  afterEach(() => tester.afterEach());
  afterAll(() => tester.afterAll());

  beforeEach(async () => {
    await tester.beforeEach();
    appController = tester.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
