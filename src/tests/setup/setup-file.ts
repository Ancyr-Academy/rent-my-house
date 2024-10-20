import { startDocker, stopDocker } from './docker-helpers.js';

beforeAll(async () => {
  await startDocker();
});

afterAll(async () => {
  await stopDocker();
});
