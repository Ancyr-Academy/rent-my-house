import { Test } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Type } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { ConfigModule } from '@nestjs/config';

import { ITester } from './tester.interface.js';
import { IFixture } from './fixture.interface.js';
import { IMailTester } from './mail-tester.interface';
import { testConfig } from '../setup/test-config';
import { AppModule } from '../../app-module';
import { MikroOrmProvider } from './mikro-orm-provider';

export class Tester implements ITester {
  private app: NestFastifyApplication;
  private orm: MikroOrmProvider;

  async beforeAll() {
    const config = testConfig();

    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          ignoreEnvVars: true,
          isGlobal: true,
          load: [() => config],
        }),
        AppModule,
      ],
    }).compile();

    this.app = module.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await this.app.init();
    await this.app.getHttpAdapter().getInstance().ready();

    this.orm = new MikroOrmProvider(this.app.get(MikroORM));
    await this.orm.init();
  }

  async beforeEach() {
    // Unused for now
  }

  async afterEach() {
    // Unused for now
  }

  async afterAll() {
    if (this.app) {
      await this.app.close();
    }
  }

  async loadFixtures(fixtures: IFixture[]) {
    for (const fixture of fixtures) {
      await fixture.load(this);
    }

    await this.orm.flush();
  }

  getHttpServer() {
    return this.app.getHttpServer() as any;
  }

  get<T = any>(token: string | symbol | Type<T>) {
    return this.app.get<T>(token);
  }

  getOrm() {
    return this.orm;
  }

  clearDatabase() {
    return this.orm.truncate();
  }

  getMailTester(): IMailTester {
    return {
      assertOnlyOne: () => {
        throw new Error('Method not implemented.');
      },
    };
  }
}
