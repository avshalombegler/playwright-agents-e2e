import { Page } from '@playwright/test';

/**
 * Common test helper utilities
 * Note: Test data has been consolidated into TestDataManager
 * @see TestDataManager for all test data and credentials
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