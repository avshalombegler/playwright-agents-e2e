import { Page, expect } from '@playwright/test';

/**
 * Common validation utilities for tests
 */
export class ValidationUtils {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Validate URL matches expected pattern
   */
  async validateUrl(expectedUrl: string): Promise<boolean> {
    return this.page.url() === expectedUrl;
  }

  /**
   * Validate page title
   */
  async validatePageTitle(expectedTitle: string): Promise<boolean> {
    const actualTitle = await this.page.title();
    return actualTitle === expectedTitle;
  }

  /**
   * Validate element is visible
   */
  async validateElementVisible(selector: string): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      return await element.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Validate text content matches expected value
   */
  async validateTextContent(selector: string, expectedText: string): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      const actualText = await element.textContent();
      return actualText?.trim() === expectedText.trim();
    } catch {
      return false;
    }
  }

  /**
   * Validate flash/alert message
   */
  async validateFlashMessage(expectedMessage: string): Promise<boolean> {
    try {
      const flashElement = this.page.locator('#flash, .flash, [role="alert"], [role="status"]');
      await expect(flashElement).toBeVisible();
      const messageText = await flashElement.textContent();
      return messageText?.includes(expectedMessage) || false;
    } catch {
      return false;
    }
  }

  /**
   * Validate form field has expected value
   */
  async validateFieldValue(selector: string, expectedValue: string): Promise<boolean> {
    try {
      const field = this.page.locator(selector);
      const actualValue = await field.inputValue();
      return actualValue === expectedValue;
    } catch {
      return false;
    }
  }

  /**
   * Validate element attribute
   */
  async validateElementAttribute(selector: string, attribute: string, expectedValue: string): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      const actualValue = await element.getAttribute(attribute);
      return actualValue === expectedValue;
    } catch {
      return false;
    }
  }

  /**
   * Validate element count
   */
  async validateElementCount(selector: string, expectedCount: number): Promise<boolean> {
    try {
      const elements = this.page.locator(selector);
      const actualCount = await elements.count();
      return actualCount === expectedCount;
    } catch {
      return false;
    }
  }

  /**
   * Wait and validate element becomes visible
   */
  async waitAndValidateVisible(selector: string, timeout: number = 5000): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate security headers (for security tests)
   */
  async validateSecurityHeaders(): Promise<{ [key: string]: string | null }> {
    const response = await this.page.waitForResponse(() => true);
    return {
      'x-frame-options': response.headers()['x-frame-options'] || null,
      'x-content-type-options': response.headers()['x-content-type-options'] || null,
      'x-xss-protection': response.headers()['x-xss-protection'] || null,
      'strict-transport-security': response.headers()['strict-transport-security'] || null,
      'content-security-policy': response.headers()['content-security-policy'] || null
    };
  }
}