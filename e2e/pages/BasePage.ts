import { Page, Locator, expect } from '@playwright/test';
import { Logger, CustomAssertions } from '../utils';
import { getEnvironmentConfig } from '../config';

export abstract class BasePage {
  protected page: Page;
  protected baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    const envConfig = getEnvironmentConfig();
    this.baseUrl = envConfig.baseURL;
  }

  /**
   * Navigate to the page
   */
  async goto(path: string = '') {
    const fullUrl = `${this.baseUrl}${path}`;
    Logger.step(`Navigating to: ${fullUrl}`);
    await this.page.goto(fullUrl);
    await CustomAssertions.toBeFullyLoaded(this.page);
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
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
  async fillInput(locator: Locator, value: string, fieldName?: string) {
    const name = fieldName || 'input field';
    Logger.step(`Filling ${name}`);
    await locator.waitFor({ state: 'visible' });
    await locator.fill(value);
  }

  /**
   * Click element
   */
  async clickElement(locator: Locator, elementName?: string) {
    const name = elementName || 'element';
    Logger.step(`Clicking ${name}`);
    await locator.waitFor({ state: 'visible' });
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
    const url = new URL(this.baseUrl);
    const urlWithAuth = `${url.protocol}//${username}:${password}@${url.host}${path}`;
    Logger.step(`Navigating with authentication to: ${path}`);
    await this.page.goto(urlWithAuth);
    await this.waitForPageLoad();
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
   * Get error message
   */
  async getErrorMessage(): Promise<string | null> {
    const errorSelectors = [
      '.flash.error', '.flash-error', '[role="alert"]',
      '.error-message', '.alert-error'
    ];
    
    for (const selector of errorSelectors) {
      const errorElement = this.page.locator(selector);
      if (await errorElement.isVisible()) {
        return await errorElement.textContent();
      }
    }
    return null;
  }

  /**
   * Get success message
   */
  async getSuccessMessage(): Promise<string | null> {
    const successSelectors = [
      '.flash.success', '.flash-success', '[role="status"]',
      '.success-message', '.alert-success'
    ];
    
    for (const selector of successSelectors) {
      const successElement = this.page.locator(selector);
      if (await successElement.isVisible()) {
        return await successElement.textContent();
      }
    }
    return null;
  }

  /**
   * Verify page heading
   */
  async verifyPageHeading(expectedHeading: string) {
    Logger.step(`Verifying page heading: ${expectedHeading}`);
    const heading = this.page.getByRole('heading', { name: expectedHeading });
    await expect(heading).toBeVisible();
    await CustomAssertions.toBeAccessible(heading);
  }

  /**
   * Verify flash message
   */
  async verifyFlashMessage(message: string, type: 'success' | 'error' = 'success') {
    const flashMessage = this.page.getByText(message);
    await expect(flashMessage).toBeVisible();
    
    if (type === 'success') {
      await CustomAssertions.toHaveSuccessMessage(flashMessage);
    } else {
      await CustomAssertions.toHaveErrorMessage(flashMessage);
    }
  }

  /**
   * Wait for and verify page URL pattern
   */
  async verifyUrlPattern(pattern: string | RegExp, timeout: number = 5000) {
    await this.page.waitForFunction(
      (pattern) => {
        if (typeof pattern === 'string') {
          return window.location.href.includes(pattern);
        }
        return pattern.test(window.location.href);
      },
      pattern,
      { timeout }
    );
    await CustomAssertions.toHaveUrlPattern(this.page, pattern);
  }

  /**
   * Take screenshot with context
   */
  async takeScreenshot(name: string, options?: { fullPage?: boolean }) {
    return await Logger.screenshot(this.page, name, {
      fullPage: options?.fullPage ?? false
    });
  }
}
