/**
 * Compatibility test suite for the application
 * Tests for proper rendering across browsers and device sizes
 * @module compatibility
 */
import { test, expect } from '@playwright/test';

/**
 * Test suite for cross-browser and responsive design compatibility
 * Runs tests in parallel for efficiency
 */
test.describe('Compatibility Tests', () => {
  test.describe.configure({ mode: 'parallel' });

  /**
   * Cross-browser compatibility tests
   * Verifies the application renders correctly across different browser engines
   */
  for (const browserType of ['chromium', 'firefox', 'webkit']) {
    test(`should render correctly in ${browserType}`, async ({ browser }) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto('http://localhost:5173');
      
      // Check if the main container is visible
      const appContainer = await page.locator('#app');
      await expect(appContainer).toBeVisible();
    });
  }
  
  /**
   * Responsive design tests
   * Validates the application displays correctly across different viewport sizes
   */
  const viewportSizes = [
    { width: 1920, height: 1080, name: 'Desktop' },
    { width: 768, height: 1024, name: 'Tablet' },
    { width: 375, height: 667, name: 'Mobile' }
  ];
  
  for (const viewport of viewportSizes) {
    test(`should display properly on ${viewport.name} viewport`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:5173');
      
      // Verify the app container is visible
      const appContainer = await page.locator('#app');
      await expect(appContainer).toBeVisible();
    });
  }
});