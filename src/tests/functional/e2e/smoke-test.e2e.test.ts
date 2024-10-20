import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../../application/controllers/app-controller';
import { AppService } from '../../../application/services/app-service';

describe('Smoke Test', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
