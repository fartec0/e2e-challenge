/**
 * Base page object with common functionality
 */
class BasePage {
  /**
   * @param {import('@playwright/test').Page} page - Playwright page object
   */
  constructor(page) {
    this.page = page;
    this.baseUrl = 'http://localhost:5173';
  }

  /**
   * Navigate to a specific path
   * @param {string} path - Path to navigate to (appended to baseUrl)
   */
  async navigate(path = '') {
    await this.page.goto(`${this.baseUrl}${path}`);
  }

  /**
   * Get the current page title
   * @returns {Promise<string>} The page title
   */
  async getTitle() {
    return await this.page.title();
  }

  /**
   * Wait for page to be loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }
}

export default BasePage;