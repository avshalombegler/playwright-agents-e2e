import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */

export default defineConfig({
  // Look for test files in the "./e2e/tests" directory, relative to this configuration file.
  testDir: './e2e/tests',

  // Global setup/teardown
  globalSetup: './e2e/setup/globalSetup.ts',
  globalTeardown: './e2e/setup/globalTeardown.ts',

  // Test filtering with tags (e.g., npx playwright test --grep @smoke)
  grep: process.env.TEST_GREP ? new RegExp(process.env.TEST_GREP) : undefined,
  grepInvert: process.env.TEST_GREP_INVERT ? new RegExp(process.env.TEST_GREP_INVERT) : undefined,

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Parallel run configuration with environment variable support
  workers: process.env.WORKERS ? parseInt(process.env.WORKERS, 10) : process.env.CI ? 4 : undefined,

  // Timeout configuration
  timeout: parseInt(process.env.TIMEOUT || '30000', 10),

  // Test sharding support (for CI parallelization)
  // Use with: npx playwright test --shard=1/4
  shard: process.env.SHARD
    ? {
        current: parseInt(process.env.SHARD.split('/')[0], 10),
        total: parseInt(process.env.SHARD.split('/')[1], 10),
      }
    : undefined,

  // Multiple reporters for better CI reporting
  reporter: process.env.CI
    ? [
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
        ['json', { outputFile: 'test-results/results.json' }],
        ['junit', { outputFile: 'test-results/results.xml' }],
        ['github'],
      ]
    : [['html', { open: 'on-failure', host: 'localhost', port: 9323 }]],

  // Shared settings for all the projects below
  use: {
    // Base URL from environment or default
    baseURL: process.env.BASE_URL || 'https://the-internet.herokuapp.com',

    // Collect trace when retrying the failed test
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Additional context for better debugging
    contextOptions: {
      recordVideo: process.env.CI
        ? undefined
        : {
            dir: process.env.VIDEO_DIR || './test-results/videos',
          },
    },
  },

  // Enhanced expect configuration for visual testing
  expect: {
    timeout: 5000,
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
    },
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Test against mobile viewports
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    // Test against branded browsers
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
});
