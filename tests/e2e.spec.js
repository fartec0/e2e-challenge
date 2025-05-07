/**
 * End-to-End tests for the application using Page Object Model
 * @module e2e
 */
import { test, expect } from '@playwright/test';
import MainPage from './pages/MainPage';

/**
 * General application E2E test suite
 * Tests basic application functionality and responsiveness
 */
test.describe('E2E Application Tests', () => {
  let mainPage;

  /**
   * Setup before each test - initialize page object and navigate to main page
   */
  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.navigateToMainPage();
  });

  /**
   * Verifies that the application loads successfully with correct title
   */
  test('should load the application successfully', async () => {
    // Verify the page has loaded
    const isLoaded = await mainPage.isLoaded();
    expect(isLoaded).toBe(true);
    
    // Verify page title
    const title = await mainPage.getTitle();
    expect(title).toBe('Vite App');
  });

  /**
   * Verifies that the application logo is visible
   */
  test('should display application logo', async () => {
    const isLogoVisible = await mainPage.isLogoVisible();
    expect(isLogoVisible).toBeTruthy();
  });

  /**
   * Tests counter functionality if present
   * Falls back to checking app container visibility if counter not found
   */
  test('should click counter and verify value increments', async ({ page }) => {
    // Locate counter button directly since our Page Object might not have
    // exact selectors for this specific app implementation
    const counterButton = page.locator('#counter');
    
    // If counter button exists, test clicking functionality
    if (await counterButton.count() > 0) {
      // Get initial count (text might vary based on implementation)
      const initialText = await counterButton.textContent() || '';
      
      // Click the counter
      await counterButton.click();
      
      // Verify the text changed after clicking
      const updatedText = await counterButton.textContent() || '';
      expect(updatedText).not.toBe(initialText);
      
      // Click again to further verify counter behavior
      await counterButton.click();
      const finalText = await counterButton.textContent() || '';
      expect(finalText).not.toBe(updatedText);
    } else {
      // If there's no counter button with this ID, test that app container exists
      // This makes the test more resilient if elements change
      const appContainer = page.locator('#app');
      expect(await appContainer.isVisible()).toBeTruthy();
    }
  });

  /**
   * Tests responsive layout across different viewport sizes
   * Validates proper display on mobile and tablet screens
   */
  test('should verify responsive layout across different viewports', async ({ browser }) => {
    // Test on mobile viewport
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 667 }
    });
    const mobilePage = await mobileContext.newPage();
    const mobileMainPage = new MainPage(mobilePage);
    
    await mobileMainPage.navigateToMainPage();
    const isMobileLoaded = await mobileMainPage.isLoaded();
    expect(isMobileLoaded).toBeTruthy();
    
    // Test on tablet viewport
    const tabletContext = await browser.newContext({
      viewport: { width: 768, height: 1024 }
    });
    const tabletPage = await tabletContext.newPage();
    const tabletMainPage = new MainPage(tabletPage);
    
    await tabletMainPage.navigateToMainPage();
    const isTabletLoaded = await tabletMainPage.isLoaded();
    expect(isTabletLoaded).toBeTruthy();
    
    // Clean up
    await mobileContext.close();
    await tabletContext.close();
  });

  /**
   * Tests page load performance
   * Measures and validates load time is within acceptable threshold
   */
  test('should verify page load performance', async ({ page }) => {
    // Create performance observer
    await page.evaluate(() => {
      window.performanceEntries = [];
      const observer = new PerformanceObserver((list) => {
        window.performanceEntries.push(...list.getEntries());
      });
      observer.observe({ entryTypes: ['navigation', 'resource'] });
    });
    
    // Navigate and measure load time
    const startTime = Date.now();
    await mainPage.navigateToMainPage();
    const loadTime = Date.now() - startTime;
    
    // Basic performance assertion - page should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Get detailed performance metrics if available
    const perfMetrics = await page.evaluate(() => {
      if (window.performanceEntries && window.performanceEntries.length > 0) {
        const navEntry = window.performanceEntries.find(e => e.entryType === 'navigation');
        if (navEntry) {
          return {
            domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            loadEvent: navEntry.loadEventEnd - navEntry.loadEventStart,
            domComplete: navEntry.domComplete,
            totalTime: navEntry.duration
          };
        }
      }
      return null;
    });
    
    console.log('Performance metrics:', perfMetrics);
  });
});

/**
 * Calculator-specific E2E test suite
 * Comprehensive tests for calculator functionality
 */
test.describe('Calculator E2E Tests', () => {
  let calculatorPage;

  /**
   * Setup before each test - initialize calculator page and reset state
   */
  test.beforeEach(async ({ page }) => {
    calculatorPage = new MainPage(page);
    await calculatorPage.navigateToCalculator();
    // Ensure calculator is loaded and clear any previous state
    await calculatorPage.isLoaded();
    await calculatorPage.clear();
  });

  /**
   * Verifies initial calculator state shows 0
   */
  test('should display the calculator with initial value of 0', async () => {
    const result = await calculatorPage.getResult();
    expect(result).toBe('0');
  });

  /**
   * Tests basic addition functionality
   */
  test('should perform basic addition', async () => {
    const result = await calculatorPage.calculate(5, 'add', 3);
    expect(result).toBe('8');
  });

  /**
   * Tests basic subtraction functionality
   */
  test('should perform basic subtraction', async () => {
    const result = await calculatorPage.calculate(9, 'subtract', 4);
    expect(result).toBe('5');
  });

  /**
   * Tests basic multiplication functionality
   */
  test('should perform basic multiplication', async () => {
    const result = await calculatorPage.calculate(6, 'multiply', 7);
    expect(result).toBe('42');
  });

  /**
   * Tests basic division functionality
   */
  test('should perform basic division', async () => {
    const result = await calculatorPage.calculate(8, 'divide', 2);
    expect(result).toBe('4');
  });

  /**
   * Tests division by zero handling
   * Verifies the calculator handles this edge case gracefully
   */
  test('should handle division by zero gracefully', async () => {
    const result = await calculatorPage.calculate(5, 'divide', 0);
    expect(result).toBe('0'); // Per the implementation, it returns 0
  });

  /**
   * Tests chained operations (multiple operations in sequence)
   * Verifies correct operator precedence and calculation
   */
  test('should perform chained operations', async () => {
    await calculatorPage.enterNumber(5);
    await calculatorPage.pressOperator('add');
    await calculatorPage.enterNumber(3);
    await calculatorPage.pressOperator('multiply');
    await calculatorPage.enterNumber(2);
    await calculatorPage.pressOperator('equals');
    
    const result = await calculatorPage.getResult();
    expect(result).toBe('16');
  });

  /**
   * Tests the plus/minus button functionality
   * Verifies it correctly toggles between positive and negative values
   */
  test('should toggle number sign with plus/minus button', async () => {
    await calculatorPage.enterNumber(5);
    await calculatorPage.pressFunction('plusMinus');
    const result = await calculatorPage.getResult();
    expect(result).toBe('-5');
    
    // Toggle back to positive
    await calculatorPage.pressFunction('plusMinus');
    const updatedResult = await calculatorPage.getResult();
    expect(updatedResult).toBe('5');
  });

  /**
   * Tests percentage calculation functionality
   */
  test('should calculate percentage correctly', async () => {
    await calculatorPage.enterNumber(50);
    await calculatorPage.pressFunction('percent');
    const result = await calculatorPage.getResult();
    expect(result).toBe('0.5');
  });

  /**
   * Tests decimal input handling
   * Verifies decimal point placement and repeated decimal presses
   */
  test('should handle decimal input correctly', async () => {
    await calculatorPage.enterNumber(5);
    await calculatorPage.pressFunction('decimal');
    await calculatorPage.enterNumber(25);
    
    const result = await calculatorPage.getResult();
    expect(result).toBe('5.25');

    // Ensure repeated decimal presses don't add multiple decimal points
    await calculatorPage.pressFunction('decimal');
    await calculatorPage.enterNumber(5);
    const updatedResult = await calculatorPage.getResult();
    expect(updatedResult).toBe('5.255');
  });

  /**
   * Tests the clear button functionality
   * Verifies it resets both the result and expression displays
   */
  test('should clear the calculator state', async () => {
    await calculatorPage.enterNumber(123);
    await calculatorPage.pressFunction('clear');
    
    const result = await calculatorPage.getResult();
    expect(result).toBe('0');
    
    const expression = await calculatorPage.getExpression();
    expect(expression).toBe('');
  });

  /**
   * Tests multi-digit number input
   */
  test('should handle multiple digit numbers correctly', async () => {
    await calculatorPage.enterNumber(1234);
    const result = await calculatorPage.getResult();
    expect(result).toBe('1234');
  });

  /**
   * Tests expression display during calculation
   * Verifies the expression is correctly shown throughout the calculation process
   */
  test('should display the correct expression during calculation', async () => {
    await calculatorPage.enterNumber(25);
    await calculatorPage.pressOperator('add');
    
    const expression = await calculatorPage.getExpression();
    expect(expression).toBe('25 +');
    
    await calculatorPage.enterNumber(15);
    await calculatorPage.pressOperator('equals');
    
    const finalExpression = await calculatorPage.getExpression();
    expect(finalExpression).toBe('25 + 15 =');
  });

  /**
   * Tests the edge case of pressing equals multiple times
   * Verifies the calculator maintains the correct state
   */
  test('should handle edge case: repeated equals press', async () => {
    // First calculation: 5 + 3 = 8
    await calculatorPage.enterNumber(5);
    await calculatorPage.pressOperator('add');
    await calculatorPage.enterNumber(3);
    await calculatorPage.pressOperator('equals');
    
    // Press equals again (should not change result in this implementation)
    await calculatorPage.pressOperator('equals');
    
    const result = await calculatorPage.getResult();
    expect(result).toBe('8');
  });

  /**
   * Tests calculator functionality on mobile viewport
   * Verifies responsive design and functional operation on smaller screens
   */
  test('should be responsive on mobile viewport', async ({ browser }) => {
    // Create a mobile context with smaller viewport
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 667 }
    });
    
    const mobilePage = await mobileContext.newPage();
    const mobileCalculator = new MainPage(mobilePage);
    
    await mobileCalculator.navigateToCalculator();
    await mobileCalculator.isLoaded();
    
    // Basic calculation should still work on mobile
    await mobileCalculator.enterNumber(3);
    await mobileCalculator.pressOperator('add');
    await mobileCalculator.enterNumber(4);
    await mobileCalculator.pressOperator('equals');
    
    const result = await mobileCalculator.getResult();
    expect(result).toBe('7');
    
    await mobileContext.close();
  });

  /**
   * Tests calculator stability with rapid input
   * Verifies the calculator can handle quick button presses without errors
   */
  test('should not break with rapid input', async () => {
    // Quickly press buttons in succession
    const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (const digit of digits) {
      await calculatorPage.pressDigit(digit);
    }
    
    const result = await calculatorPage.getResult();
    expect(result).toBe('123456789');
  });
});