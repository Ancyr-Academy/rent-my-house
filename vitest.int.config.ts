import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
  test: {
    globals: true,
    include: ['src/**/*.int.test.ts', 'src/**/*.e2e.test.ts'],
    globalSetup: 'src/tests/setup/global-setup.ts',
    fileParallelism: false,
    maxWorkers: 1,
    maxConcurrency: 1,
  },
  plugins: [swc.vite()],
});
