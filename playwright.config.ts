import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: 'e2e',
  timeout: 90_000,
  use: { baseURL: 'http://localhost:4173', ...devices['iPhone 15'], browserName: 'webkit' },
  webServer: { command: 'npx vite preview --port 4173 --strictPort', port: 4173, reuseExistingServer: true },
});
