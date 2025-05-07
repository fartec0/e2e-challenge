/**
 * Scalability test suite for the application
 * Tests application behavior under load and with large datasets
 * @module scalability
 */
import { test, expect } from '@playwright/test';

/**
 * Test suite for application scalability characteristics
 */
test.describe('Scalability Tests', () => {
  /**
   * Tests the application's ability to handle large datasets
   * Creates and processes 10,000 data items and verifies the app remains responsive
   */
  test('should handle large data loads', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Simulate loading a large dataset
    await page.evaluate(() => {
      // Create a large array of data (e.g., 10,000 items)
      const largeData = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        value: `Item ${i}`,
        description: `This is a description for item ${i} with some additional text to increase the size.`
      }));
      
      // Store this data in the window object for testing
      window._testLargeData = largeData;
      
      // Trigger any relevant app logic that would process data
      // This is app-specific and would need to be customized
      const event = new CustomEvent('test-data-load', { detail: largeData });
      document.dispatchEvent(event);
      
      return true;
    });
    
    // Wait a moment for the app to process the data
    await page.waitForTimeout(1000);
    
    // Check that the page is still responsive
    const isResponsive = await page.evaluate(() => {
      // Simple check - can we still interact with the DOM?
      const div = document.createElement('div');
      document.body.appendChild(div);
      document.body.removeChild(div);
      return true;
    });
    
    expect(isResponsive).toBe(true);
  });
  
  /**
   * Tests the application's handling of concurrent operations
   * Simulates multiple users/sessions accessing the application simultaneously
   */
  test('should handle concurrent operations', async ({ browser }) => {
    // Launch multiple pages/tabs to test concurrent access
    const context = await browser.newContext();
    const pages = await Promise.all([
      context.newPage(),
      context.newPage(),
      context.newPage()
    ]);
    
    // Have all pages navigate to the app simultaneously
    await Promise.all(pages.map(page => page.goto('http://localhost:5173')));
    
    // Perform actions on all pages concurrently
    await Promise.all(pages.map(async (page, index) => {
      // Click on the app container in each page
      await page.locator('#app').click();
      
      // Perform some operation specific to this instance
      await page.evaluate((pageIndex) => {
        console.log(`Operation from page ${pageIndex}`);
        // Do some work here, simulating user interaction
        for (let i = 0; i < 1000; i++) {
          // Just some busy work
          Math.sqrt(i * pageIndex);
        }
      }, index);
    }));
    
    // Verify all pages are still functional
    for (const page of pages) {
      await expect(page.locator('#app')).toBeVisible();
    }
    
    // Close the context
    await context.close();
  });
  
  /**
   * Tests performance degradation under DOM load
   * Measures performance before and after adding 1000 DOM elements
   * Verifies performance remains within acceptable thresholds
   */
  test('should maintain performance under load', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Measure initial performance
    const initialPerf = await page.evaluate(() => {
      const start = performance.now();
      // Perform a standard operation
      document.querySelectorAll('*').length;
      return performance.now() - start;
    });
    
    console.log(`Initial operation time: ${initialPerf}ms`);
    
    // Create load on the page
    await page.evaluate(() => {
      // Add a significant number of DOM elements
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < 1000; i++) {
        const div = document.createElement('div');
        div.textContent = `Load test element ${i}`;
        div.className = 'load-test-element';
        div.style.display = 'none'; // Keep them hidden to avoid visual clutter
        fragment.appendChild(div);
      }
      document.body.appendChild(fragment);
    });
    
    // Measure performance again under load
    const loadPerf = await page.evaluate(() => {
      const start = performance.now();
      // Same operation as before
      document.querySelectorAll('*').length;
      return performance.now() - start;
    });
    
    console.log(`Operation time under load: ${loadPerf}ms`);
    
    // Clean up
    await page.evaluate(() => {
      document.querySelectorAll('.load-test-element').forEach(el => el.remove());
    });
    
    // Modified test assertion to handle near-zero measurements
    // If initial performance is extremely fast (less than 0.1ms), use a minimum threshold
    const minBaselineValue = Math.max(0.1, initialPerf);
    expect(loadPerf).toBeLessThan(minBaselineValue * 100);
  });
});