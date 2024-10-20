import { NestFactory } from '@nestjs/core';
import { BootstrapModule } from './bootstrap-module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;

  const app = await NestFactory.create<NestFastifyApplication>(
    BootstrapModule,
    new FastifyAdapter(),
  );

  await app.listen(
    {
      port,
      host: '0.0.0.0',
    },
    () => {
      console.log(`Listening at http://localhost:${port}`);
    },
  );
}

bootstrap();
