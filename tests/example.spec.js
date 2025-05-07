/**
 * Basic example test to demonstrate Playwright functionality
 * Simple smoke test to verify application loading
 * @module example
 */
import { test, expect } from '@playwright/test';

/**
 * Verifies that the application loads successfully and has the correct page title
 * Acts as a smoke test to ensure basic application functionality
 */
test('basic test', async ({ page }) => {
  await page.goto('http://localhost:5173');
  const title = await page.title();
  expect(title).toBe('Vite App');
});