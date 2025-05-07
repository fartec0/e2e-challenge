# Page Object Model (POM) Testing Strategy

## Overview

This document explains the Page Object Model (POM) design pattern implemented in our Playwright end-to-end testing suite. The POM pattern improves test maintainability, readability, and reusability by separating page-specific logic from test logic.

## Directory Structure

```
tests/
├── pages/
│   ├── BasePage.js    # Base class with common functionality
│   └── MainPage.js    # Calculator-specific implementation
├── e2e.spec.js        # End-to-end test suite using the POM
└── various test suites (accessibility.spec.js, etc.)
```

## Page Object Model Architecture

Our POM implementation follows a two-layer architecture:

### 1. Base Page Layer

The `BasePage` class (`tests/pages/BasePage.js`) provides common functionality that applies to all pages:

```javascript
class BasePage {
  constructor(page) {
    this.page = page;
    this.baseUrl = 'http://localhost:5173';
  }

  async navigate(path = '') {
    await this.page.goto(`${this.baseUrl}${path}`);
  }

  async getTitle() {
    return await this.page.title();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }
}
```

**Key Responsibilities:**
- Page navigation
- Title retrieval
- Page load state management
- Other common operations that apply across all pages

### 2. Specific Page Layer

The `MainPage` class (`tests/pages/MainPage.js`) extends `BasePage` and implements calculator-specific functionality:

```javascript
class MainPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Element selectors defined here
    this.appContainer = page.locator('#app');
    this.expressionDisplay = page.locator('#expression');
    this.resultDisplay = page.locator('#result');
    
    // Button groupings
    this.digitButtons = { /* digit buttons */ };
    this.operatorButtons = { /* operator buttons */ };
    this.functionButtons = { /* function buttons */ };
  }
  
  // Calculator-specific actions
  async pressDigit(digit) { /* implementation */ }
  async enterNumber(number) { /* implementation */ }
  async pressOperator(operator) { /* implementation */ }
  async calculate(a, operator, b) { /* implementation */ }
  // ...other methods
}
```

**Key Responsibilities:**
- Defining page element selectors
- Implementing page-specific actions
- Providing high-level operations that combine multiple actions
- Handling page-specific validations

## Benefits of Our POM Implementation

### 1. Enhanced Maintainability

When UI elements change, we only need to update the relevant Page Object, not every test that uses that element. For example, if the calculator's button IDs change, we only update the `MainPage` class, and all tests remain valid.

### 2. Improved Readability

Tests become more readable and expressive because they use domain-specific language:

```javascript
// Without POM:
await page.locator('#btn-5').click();
await page.locator('#btn-add').click();
await page.locator('#btn-3').click();
await page.locator('#btn-equals').click();
const result = await page.locator('#result').textContent();

// With POM:
const result = await calculatorPage.calculate(5, 'add', 3);
```

### 3. Reusability Across Test Suites

The same Page Object can be used across multiple test suites (e2e, accessibility, performance), eliminating code duplication.

### 4. Abstraction of Complex Interactions

Complex UI interactions are abstracted into simple method calls:

```javascript
// Multi-step operation wrapped in a single method
async calculate(a, operator, b) {
  await this.enterNumber(a);
  await this.pressOperator(operator);
  await this.enterNumber(b);
  await this.pressOperator('equals');
  return await this.getResult();
}
```

### 5. Isolation of Test Logic from UI Implementation

Tests focus on business logic and scenarios rather than implementation details, making them more resilient to UI changes.

## Usage Examples

### Basic Usage

```javascript
test('should perform addition', async ({ page }) => {
  const calculatorPage = new MainPage(page);
  await calculatorPage.navigateToCalculator();
  
  const result = await calculatorPage.calculate(5, 'add', 3);
  expect(result).toBe('8');
});
```

### Testing Complex Flows

```javascript
test('should perform chained operations', async ({ page }) => {
  const calculatorPage = new MainPage(page);
  await calculatorPage.navigateToCalculator();
  
  await calculatorPage.enterNumber(5);
  await calculatorPage.pressOperator('add');
  await calculatorPage.enterNumber(3);
  await calculatorPage.pressOperator('multiply');
  await calculatorPage.enterNumber(2);
  await calculatorPage.pressOperator('equals');
  
  const result = await calculatorPage.getResult();
  expect(result).toBe('16');
});
```

## Best Practices

1. **Keep Page Objects Focused**: Each Page Object should represent a single page or component.

2. **No Assertions in Page Objects**: Page Objects should return data/state, but assertions belong in test files.

3. **Descriptive Method Names**: Use descriptive names like `pressOperator()` instead of generic names like `clickButton()`.

4. **Encapsulate Element Selectors**: Never expose selectors directly to tests.

5. **Handle Waiting Appropriately**: Include proper waiting mechanisms in Page Object methods.

6. **Flexible Abstraction Level**: Provide both low-level (e.g., `pressDigit()`) and high-level (e.g., `calculate()`) methods.

## Extending the Pattern

Our POM strategy can be extended as the application grows:

1. **Component Objects**: For reusable UI components that appear across multiple pages.

2. **API Objects**: To represent API interactions when testing requires backend operations.

3. **Test Data Management**: Page Objects can be enhanced to work with test data providers.

## Conclusion

The Page Object Model pattern implemented in our test suite significantly improves the maintainability, readability, and reusability of our end-to-end tests. By separating page structure from test logic, our tests become more robust and easier to maintain as the application evolves.