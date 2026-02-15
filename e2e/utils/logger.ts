import { Page, TestInfo } from '@playwright/test';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

/**
 * Enhanced logging and debugging utilities for Playwright tests
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogOptions {
  timestamp?: boolean;
  testInfo?: boolean;
  color?: boolean;
}

export class Logger {
  private static currentLogLevel: LogLevel = LogLevel.INFO;
  private static logDir = 'logs';
  private static screenshotDir = 'screenshots';

  /**
   * Set the minimum log level
   */
  static setLogLevel(level: LogLevel) {
    this.currentLogLevel = level;
  }

  /**
   * Log debug message
   */
  static debug(message: string, data?: any, options?: LogOptions) {
    if (this.currentLogLevel <= LogLevel.DEBUG) {
      this.log('DEBUG', message, data, options);
    }
  }

  /**
   * Log info message
   */
  static info(message: string, data?: any, options?: LogOptions) {
    if (this.currentLogLevel <= LogLevel.INFO) {
      this.log('INFO', message, data, options);
    }
  }

  /**
   * Log warning message
   */
  static warn(message: string, data?: any, options?: LogOptions) {
    if (this.currentLogLevel <= LogLevel.WARN) {
      this.log('WARN', message, data, options);
    }
  }

  /**
   * Log error message
   */
  static error(message: string, error?: any, options?: LogOptions) {
    if (this.currentLogLevel <= LogLevel.ERROR) {
      this.log('ERROR', message, error, options);
    }
  }

  /**
   * Log test step for better debugging
   */
  static step(stepName: string, details?: string) {
    const message = details ? `${stepName}: ${details}` : stepName;
    this.info(`🔄 Step: ${message}`, undefined, { color: true });
  }

  /**
   * Log test result
   */
  static result(success: boolean, message: string, details?: any) {
    const symbol = success ? '✅' : '❌';
    const level = success ? LogLevel.INFO : LogLevel.ERROR;
    if (this.currentLogLevel <= level) {
      this.log(success ? 'PASS' : 'FAIL', `${symbol} ${message}`, details, { color: true });
    }
  }

  /**
   * Take and save screenshot
   */
  static async screenshot(
    page: Page, 
    name: string, 
    options?: { 
      fullPage?: boolean; 
      testInfo?: TestInfo 
    }
  ): Promise<string> {
    try {
      this.ensureDirectoryExists(this.screenshotDir);
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const testName = options?.testInfo?.title.replace(/[^a-zA-Z0-9]/g, '_') || 'unknown';
      const filename = `${testName}_${name}_${timestamp}.png`;
      const filepath = join(this.screenshotDir, filename);

      await page.screenshot({ 
        path: filepath,
        fullPage: options?.fullPage ?? true 
      });

      this.info(`📸 Screenshot saved: ${filepath}`);
      return filepath;
    } catch (error) {
      this.error('Failed to take screenshot', error);
      throw error;
    }
  }

  /**
   * Take screenshot on failure
   */
  static async screenshotOnFailure(
    page: Page, 
    testInfo: TestInfo, 
    errorMessage?: string
  ): Promise<string | null> {
    if (testInfo.status === 'failed') {
      try {
        const name = errorMessage ? `failure_${errorMessage}` : 'failure';
        return await this.screenshot(page, name, { testInfo, fullPage: true });
      } catch (error) {
        this.error('Failed to take failure screenshot', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Log network activity
   */
  static logNetworkActivity(page: Page, testInfo?: TestInfo) {
    page.on('request', request => {
      this.debug(`➡️  Request: ${request.method()} ${request.url()}`);
    });

    page.on('response', response => {
      const status = response.status();
      const method = response.request().method();
      const url = response.url();
      
      if (status >= 400) {
        this.warn(`⬅️  Response: ${method} ${url} - ${status}`);
      } else {
        this.debug(`⬅️  Response: ${method} ${url} - ${status}`);
      }
    });

    page.on('requestfailed', request => {
      this.error(`❌ Request failed: ${request.method()} ${request.url()}`, 
        request.failure()?.errorText);
    });
  }

  /**
   * Log page console messages
   */
  static logConsoleMessages(page: Page) {
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      
      switch (type) {
        case 'error':
          this.error(`🖥️  Console Error: ${text}`);
          break;
        case 'warning':
          this.warn(`🖥️  Console Warning: ${text}`);
          break;
        default:
          this.debug(`🖥️  Console ${type}: ${text}`);
      }
    });

    page.on('pageerror', error => {
      this.error('🖥️  Page Error:', error.message);
    });
  }

  /**
   * Start performance monitoring
   */
  static async startPerformanceMonitoring(page: Page, testInfo?: TestInfo) {
    const testName = testInfo?.title || 'unknown';
    this.info(`⏱️  Starting performance monitoring for: ${testName}`);
    
    // Monitor page load
    const startTime = Date.now();
    
    page.once('load', () => {
      const loadTime = Date.now() - startTime;
      this.info(`⏱️  Page loaded in: ${loadTime}ms`);
      
      if (loadTime > 5000) {
        this.warn(`⚠️  Slow page load detected: ${loadTime}ms`);
      }
    });
  }

  /**
   * Private logging method
   */
  private static log(level: string, message: string, data?: any, options: LogOptions = {}) {
    const { timestamp = true, color = false } = options;
    
    let logMessage = '';
    
    if (timestamp) {
      logMessage += `[${new Date().toISOString()}] `;
    }
    
    logMessage += `[${level}] ${message}`;
    
    if (data !== undefined) {
      if (typeof data === 'object') {
        logMessage += ` ${JSON.stringify(data, null, 2)}`;
      } else {
        logMessage += ` ${data}`;
      }
    }

    // Apply colors if requested and environment supports it
    if (color && level === 'ERROR') {
      console.error(`\x1b[31m${logMessage}\x1b[0m`);
    } else if (color && level === 'WARN') {
      console.warn(`\x1b[33m${logMessage}\x1b[0m`);
    } else if (color && level === 'PASS') {
      console.log(`\x1b[32m${logMessage}\x1b[0m`);
    } else {
      console.log(logMessage);
    }
  }

  /**
   * Ensure directory exists
   */
  private static ensureDirectoryExists(dir: string) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Initialize logger for test
   */
  static initializeForTest(page: Page, testInfo: TestInfo) {
    this.info(`🚀 Starting test: ${testInfo.title}`);
    this.startPerformanceMonitoring(page, testInfo);
    
    if (process.env.DEBUG_NETWORK === 'true') {
      this.logNetworkActivity(page, testInfo);
    }
    
    if (process.env.DEBUG_CONSOLE === 'true') {
      this.logConsoleMessages(page);
    }
  }

  /**
   * Cleanup after test
   */
  static async cleanupAfterTest(page: Page, testInfo: TestInfo) {
    await this.screenshotOnFailure(page, testInfo);
    this.info(`🏁 Completed test: ${testInfo.title} - Status: ${testInfo.status}`);
  }
}