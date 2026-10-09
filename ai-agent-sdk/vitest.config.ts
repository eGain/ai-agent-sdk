import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json-summary', 'json'],
      reportsDirectory: 'coverage',
      // Allows json-summary (and PR comment action) when tests or thresholds fail
      reportOnFailure: true,
      // Only the SDK's own TypeScript sources: this leaves out the vendored
      // src/core/auth/msal-browser.js bundle, scripts/, and docs-src/.vitepress.
      include: ['src/**/*.ts'],
      exclude: ['**/*.d.ts', '**/*.test.ts'],
      // Global floor a few points under where the suite sits today; changed-line
      // coverage is enforced in CI via diff-cover.
      thresholds: {
        statements: 78,
        branches: 76,
        functions: 70,
        lines: 78,
      },
    },
  },
});
