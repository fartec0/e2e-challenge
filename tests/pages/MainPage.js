import BasePage from './BasePage';

/**
 * Page object for the Calculator application
 */
class MainPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page - Playwright page object
   */
  constructor(page) {
    super(page);
    
    // Define element selectors for calculator
    this.appContainer = page.locator('#app');
    this.expressionDisplay = page.locator('#expression');
    this.resultDisplay = page.locator('#result');
    
    // Calculator buttons by type
    this.digitButtons = {
      0: page.locator('#btn-0'),
      1: page.locator('#btn-1'),
      2: page.locator('#btn-2'),
      3: page.locator('#btn-3'),
      4: page.locator('#btn-4'),
      5: page.locator('#btn-5'),
      6: page.locator('#btn-6'),
      7: page.locator('#btn-7'),
      8: page.locator('#btn-8'),
      9: page.locator('#btn-9')
    };
    
    // Operator buttons
    this.operatorButtons = {
      add: page.locator('#btn-add'),
      subtract: page.locator('#btn-subtract'),
      multiply: page.locator('#btn-multiply'),
      divide: page.locator('#btn-divide'),
      equals: page.locator('#btn-equals')
    };
    
    // Function buttons
    this.functionButtons = {
      clear: page.locator('#btn-ac'),
      plusMinus: page.locator('#btn-plus-minus'),
      percent: page.locator('#btn-percent'),
      decimal: page.locator('#btn-decimal')
    };
  }

  /**
   * Navigate to the calculator page
   */
  async navigateToCalculator() {
    await this.navigate('/');
    await this.waitForPageLoad();
  }

  /**
   * Check if the calculator is loaded
   */
  async isLoaded() {
    await this.resultDisplay.waitFor({ state: 'visible' });
    return await this.appContainer.isVisible();
  }

  /**
   * Press a digit button (0-9)
   * @param {number} digit - The digit to press
   */
  async pressDigit(digit) {
    await this.digitButtons[digit].click();
  }
  
  /**
   * Press a sequence of digits for a number
   * @param {string} number - The number to enter (e.g. "123")
   */
  async enterNumber(number) {
    for (const digit of number.toString()) {
      await this.pressDigit(parseInt(digit, 10));
    }
  }
  
  /**
   * Press an operator button
   * @param {string} operator - The operator to press ('add', 'subtract', 'multiply', 'divide', 'equals')
   */
  async pressOperator(operator) {
    await this.operatorButtons[operator].click();
  }
  
  /**
   * Press a function button
   * @param {string} func - The function to press ('clear', 'plusMinus', 'percent', 'decimal')
   */
  async pressFunction(func) {
    await this.functionButtons[func].click();
  }
  
  /**
   * Get the current result displayed
   * @returns {Promise<string>} The current result
   */
  async getResult() {
    return await this.resultDisplay.textContent();
  }
  
  /**
   * Get the current expression displayed
   * @returns {Promise<string>} The current expression
   */
  async getExpression() {
    return await this.expressionDisplay.textContent();
  }
  
  /**
   * Perform a calculation
   * @param {string|number} a - First number
   * @param {string} operator - Operator to use ('add', 'subtract', 'multiply', 'divide')
   * @param {string|number} b - Second number
   * @returns {Promise<string>} The result
   */
  async calculate(a, operator, b) {
    await this.enterNumber(a);
    await this.pressOperator(operator);
    await this.enterNumber(b);
    await this.pressOperator('equals');
    return await this.getResult();
  }
  
  /**
   * Clear the calculator
   */
  async clear() {
    await this.pressFunction('clear');
  }
}

export default MainPage;