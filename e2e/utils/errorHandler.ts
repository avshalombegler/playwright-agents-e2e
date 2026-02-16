/* eslint-disable no-console */
import { Page, TestInfo } from '@playwright/test';

/**
 * Enhanced error handling utility for capturing comprehensive error context
 */
export class ErrorHandler {
  /**
   * Capture comprehensive error context when a test fails
   * @param page - The Playwright page object
   * @param testInfo - Test information object
   * @param error - The error that occurred
   */
  static async captureErrorContext(page: Page, testInfo: TestInfo, error: Error): Promise<never> {
    try {
      console.error(`❌ Error occurred in test: ${testInfo.title}`);
      console.error(`   Error message: ${error.message}`);

      // Capture full page screenshot
      await this.captureScreenshot(page, testInfo, 'error-screenshot');

      // Capture console logs
      await this.captureConsoleLogs(page, testInfo);

      // Capture page state
      await this.capturePageState(page, testInfo);

      // Capture network activity if available
      await this.captureNetworkLogs(page, testInfo);

      // Capture browser context storage
      await this.captureStorageState(page, testInfo);
    } catch (captureError) {
      console.warn('⚠️ Failed to capture some error context:', captureError);
    }

    // Re-throw the original error with enhanced context
    const enhancedError = new Error(
      `Test failed: ${error.message}\n\n` +
        `Test: ${testInfo.title}\n` +
        `File: ${testInfo.file}\n` +
        `Line: ${testInfo.line}\n\n` +
        `📎 Detailed error context has been captured in test attachments.\n` +
        `Original stack trace:\n${error.stack}`
    );
    enhancedError.stack = error.stack;

    throw enhancedError;
  }

  /**
   * Capture screenshot with custom name
   */
  private static async captureScreenshot(
    page: Page,
    testInfo: TestInfo,
    name: string = 'screenshot'
  ): Promise<void> {
    try {
      const screenshot = await page.screenshot({
        fullPage: true,
        timeout: 5000,
      });

      await testInfo.attach(name, {
        body: screenshot,
        contentType: 'image/png',
      });

      console.log(`   📷 Screenshot captured: ${name}.png`);
    } catch (error) {
      console.warn(`   ⚠️ Failed to capture screenshot: ${error}`);
    }
  }

  /**
   * Capture console logs from the browser
   */
  private static async captureConsoleLogs(page: Page, testInfo: TestInfo): Promise<void> {
    try {
      // Note: Console logs should be collected during test execution
      // This is a placeholder for the logs that were collected
      const logs = {
        message: 'Console logs should be collected during test execution using page.on("console")',
        timestamp: new Date().toISOString(),
      };

      await testInfo.attach('console-logs', {
        body: JSON.stringify(logs, null, 2),
        contentType: 'application/json',
      });

      console.log('   📝 Console logs captured');
    } catch (error) {
      console.warn(`   ⚠️ Failed to capture console logs: ${error}`);
    }
  }

  /**
   * Capture current page state (URL, title, etc.)
   */
  private static async capturePageState(page: Page, testInfo: TestInfo): Promise<void> {
    try {
      const pageState = {
        url: page.url(),
        title: await page.title(),
        timestamp: new Date().toISOString(),
        viewport: page.viewportSize(),
      };

      await testInfo.attach('page-state', {
        body: JSON.stringify(pageState, null, 2),
        contentType: 'application/json',
      });

      console.log(`   🌐 Page state captured: ${pageState.url}`);
    } catch (error) {
      console.warn(`   ⚠️ Failed to capture page state: ${error}`);
    }
  }

  /**
   * Capture network activity logs
   */
  private static async captureNetworkLogs(page: Page, testInfo: TestInfo): Promise<void> {
    try {
      // Note: Network logs should be collected during test execution
      // This would require setting up listeners in the test setup
      const networkInfo = {
        message:
          'Network logs should be collected using page.on("request") and page.on("response")',
        currentUrl: page.url(),
        timestamp: new Date().toISOString(),
      };

      await testInfo.attach('network-logs', {
        body: JSON.stringify(networkInfo, null, 2),
        contentType: 'application/json',
      });

      console.log('   🌐 Network logs placeholder attached');
    } catch (error) {
      console.warn(`   ⚠️ Failed to capture network logs: ${error}`);
    }
  }

  /**
   * Capture browser storage state (cookies, localStorage, sessionStorage)
   */
  private static async captureStorageState(page: Page, testInfo: TestInfo): Promise<void> {
    try {
      const storageState = await page.context().storageState();

      await testInfo.attach('storage-state', {
        body: JSON.stringify(storageState, null, 2),
        contentType: 'application/json',
      });

      console.log('   💾 Storage state captured');
    } catch (error) {
      console.warn(`   ⚠️ Failed to capture storage state: ${error}`);
    }
  }

  /**
   * Safely execute an async operation with error handling
   */
  static async safeExecute<T>(
    operation: () => Promise<T>,
    errorMessage: string,
    page: Page,
    testInfo: TestInfo
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      console.error(`${errorMessage}: ${error}`);
      await this.captureErrorContext(page, testInfo, error as Error);
      throw error; // This line won't be reached, but TypeScript needs it
    }
  }

  /**
   * Create a retry wrapper for flaky operations
   */
  static async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        console.warn(`   ⚠️ Attempt ${attempt}/${maxRetries} failed: ${error}`);

        if (attempt < maxRetries) {
          console.log(`   ⏳ Retrying in ${delayMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
    }

    throw lastError;
  }
}

/**
 * Custom error types for better error categorization
 */
export class NavigationError extends Error {
  constructor(
    message: string,
    public url: string
  ) {
    super(message);
    this.name = 'NavigationError';
  }
}

export class ElementNotFoundError extends Error {
  constructor(
    message: string,
    public selector: string
  ) {
    super(message);
    this.name = 'ElementNotFoundError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}
