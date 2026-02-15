import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  protected page: Page;
  protected baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = 'https://the-internet.herokuapp.com';
  }

  /**
   * Navigate to the page
   */
  async goto(path: string = '') {
    await this.page.goto(`${this.baseUrl}${path}`);
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  /**
   * Fill input field
   */
  async fillInput(locator: Locator, value: string) {
    await locator.fill(value);
  }

  /**
   * Click element
   */
  async clickElement(locator: Locator) {
    await locator.click();
  }

  /**
   * Get text content
   */
  async getTextContent(locator: Locator): Promise<string | null> {
    return await locator.textContent();
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(locator: Locator) {
    await locator.waitFor({ state: 'visible' });
  }

  /**
   * Navigate with authentication
   */
  async gotoWithAuth(path: string, username: string, password: string) {
    const urlWithAuth = `https://${username}:${password}@the-internet.herokuapp.com${path}`;
    await this.page.goto(urlWithAuth);
  }

  /**
   * Handle browser navigation
   */
  async goBack() {
    await this.page.goBack();
  }

  async goForward() {
    await this.page.goForward();
  }

  /**
   * Wait for download
   */
  async waitForDownload() {
    return await this.page.waitForEvent('download');
  }

  /**
   * Get error message if any
   */
  async getErrorMessage(): Promise<string | null> {
    const errorElement = this.page.locator('.flash.error, .flash-error, [role="alert"]');
    if (await errorElement.isVisible()) {
      return await errorElement.textContent();
    }
    return null;
  }

  /**
   * Get success message if any
   */
  async getSuccessMessage(): Promise<string | null> {
    const successElement = this.page.locator('.flash.success, .flash-success, [role="status"]');
    if (await successElement.isVisible()) {
      return await successElement.textContent();
    }
    return null;
  }

  /**
   * Verify page heading
   */
  async verifyPageHeading(expectedHeading: string) {
    const heading = this.page.getByRole('heading', { name: expectedHeading });
    await expect(heading).toBeVisible();
  }

  /**
   * Verify flash message
   */
  async verifyFlashMessage(message: string) {
    const flashMessage = this.page.getByText(message);
    await expect(flashMessage).toBeVisible();
  }
}
