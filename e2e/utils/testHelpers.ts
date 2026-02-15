import { Page } from '@playwright/test';

/**
 * Test data and constants
 */
export const TestData = {
  // Valid credentials
  VALID_CREDENTIALS: {
    username: 'tomsmith',
    password: 'SuperSecretPassword!'
  },

  // Invalid credentials for testing
  INVALID_CREDENTIALS: {
    username: 'invalid_user',
    password: 'invalid_password'
  },

  // Basic/Digest auth credentials
  AUTH_CREDENTIALS: {
    valid: { username: 'admin', password: 'admin' },
    invalid: { username: 'invalid', password: 'invalid' }
  },

  // Test emails
  EMAILS: {
    valid: 'test@example.com',
    invalid: 'invalid-email'
  },

  // URLs
  BASE_URL: 'https://the-internet.herokuapp.com',
  
  PATHS: {
    login: '/login',
    secure: '/secure',
    forgotPassword: '/forgot_password',
    basicAuth: '/basic_auth',
    digestAuth: '/digest_auth',
    downloadSecure: '/download_secure'
  }
};

/**
 * Common test helpers
 */
export class TestHelpers {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Clear all form fields on the page
   */
  async clearAllFormFields(): Promise<void> {
    const inputs = this.page.locator('input[type="text"], input[type="password"], input[type="email"]');
    const count = await inputs.count();
    
    for (let i = 0; i < count; i++) {
      await inputs.nth(i).clear();
    }
  }

  /**
   * Take screenshot with timestamp
   */
  async takeScreenshot(name?: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotName = name ? `${name}-${timestamp}` : `screenshot-${timestamp}`;
    await this.page.screenshot({ path: `screenshots/${screenshotName}.png`, fullPage: true });
  }

  /**
   * Get current timestamp for test data
   */
  getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Generate random test data
   */
  generateRandomData(): {
    username: string;
    email: string;
    timestamp: string;
  } {
    const timestamp = Date.now();
    return {
      username: `testuser_${timestamp}`,
      email: `test_${timestamp}@example.com`,
      timestamp: this.getCurrentTimestamp()
    };
  }

  /**
   * Wait for element and perform action
   */
  async waitAndClick(selector: string, timeout: number = 5000): Promise<void> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible', timeout });
    await element.click();
  }

  /**
   * Wait for element and fill input
   */
  async waitAndFill(selector: string, value: string, timeout: number = 5000): Promise<void> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible', timeout });
    await element.fill(value);
  }

  /**
   * Retry action with exponential backoff
   */
  async retryAction<T>(
    action: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await action();
      } catch (error) {
        lastError = error as Error;
        if (i < maxRetries - 1) {
          const delay = baseDelay * Math.pow(2, i);
          await this.page.waitForTimeout(delay);
        }
      }
    }

    throw lastError || new Error('Retry action failed');
  }

  /**
   * Check if running in headless mode
   */
  async isHeadless(): Promise<boolean> {
    // This is a simplified check - in real scenarios you might need to access browser context
    return process.env.CI === 'true' || process.env.HEADLESS === 'true';
  }

  /**
   * Get browser info
   */
  async getBrowserInfo(): Promise<{ name: string; version: string }> {
    const browserName = this.page.context().browser()?.browserType().name() || 'unknown';
    const browserVersion = this.page.context().browser()?.version() || 'unknown';
    
    return {
      name: browserName,
      version: browserVersion
    };
  }
}