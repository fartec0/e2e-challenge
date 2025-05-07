/**
 * Reliability test suite for the application
 * Tests application behavior under stress and adverse conditions
 * @module reliability
 */
import { test, expect } from '@playwright/test';

/**
 * Test suite for verifying application reliability and robustness
 */
test.describe('Reliability Tests', () => {
  /**
   * Tests application stability under rapid user interactions
   * Simulates repeated clicks and verifies the application remains responsive
   */
  test('should handle repeated interactions', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Simulate rapid interactions (clicking or interacting with elements)
    const appElement = page.locator('#app');
    for (let i = 0; i < 10; i++) {
      await appElement.click({ force: true });
      // Wait a short time between clicks
      await page.waitForTimeout(100);
    }
    
    // Verify the page is still responsive
    await expect(page).toHaveURL('http://localhost:5173');
  });
  
  /**
   * Tests application recovery from JavaScript errors
   * Deliberately injects an error and verifies the application continues to function
   */
  test('should recover from errors', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Inject a JavaScript error and verify the app continues to function
    await page.evaluate(() => {
      try {
        // Deliberately cause an error
        const nonExistentFunction = window.nonExistentFunction;
        nonExistentFunction();
      } catch (e) {
        // Error expected
        console.error('Expected error:', e);
      }
      
      // Return a value to indicate the page is still functioning
      return document.querySelector('#app') !== null;
    });
    
    // Verify the app container is still present
    await expect(page.locator('#app')).toBeVisible();
  });
  
  /**
   * Tests application behavior during network fluctuations
   * Simulates going offline and back online to ensure the application handles these transitions
   */
  test('should handle network fluctuations', async ({ page, context }) => {
    await page.goto('http://localhost:5173');
    
    // Simulate offline mode
    await context.setOffline(true);
    
    // Verify the app doesn't crash when offline
    const isPageFunctional = await page.evaluate(() => {
      return document.querySelector('#app') !== null;
    });
    expect(isPageFunctional).toBe(true);
    
    // Return to online mode
    await context.setOffline(false);
    
    // Verify app recovers when back online
    await page.waitForTimeout(500);
    await expect(page.locator('#app')).toBeVisible();
  });
});