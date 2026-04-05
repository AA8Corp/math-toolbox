import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright configuration for math-toolbox end-to-end tests.
 *
 * Scope in Phase 0: smoke test that the home page loads and the PWA
 * service worker registers. Later phases will add per-tool smoke tests
 * and visual regression screenshots (§7.6 of the architecture doc).
 *
 * Runs against the Vite dev server on port 5173. CI uses the same
 * config; a separate `npm run preview` target is used for the
 * production-build smoke if needed.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html']] : 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
})
