import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const CLOUD_URL = 'https://vedio-working.web.app';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  workers: 4,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],
  use: {
    baseURL: process.env.TARGET === 'cloud' ? CLOUD_URL : BASE_URL,
    trace: 'off',
    screenshot: 'only-on-failure',
    viewport: { width: 1440, height: 900 },
  },
  webServer: process.env.TARGET === 'cloud' ? undefined : {
    command: 'node "../self reserch with video/website/server.js"',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 12000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    }
  ]
});
