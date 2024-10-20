import { defaultExclude, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul',
    },
    globals: true,
    include: ['src/**/*.test.ts'],
    exclude: [...defaultExclude, '**/*.e2e.test.ts', '**/*.int.test.ts'],
  },
});
