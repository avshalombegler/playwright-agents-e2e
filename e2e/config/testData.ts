/**
 * Centralized test data configuration
 * All test data and configuration should be accessed through this module
 */

export const TestConfig = {
  // Base URLs
  baseUrl: process.env.BASE_URL || 'https://the-internet.herokuapp.com',

  // Authentication credentials
  credentials: {
    valid: {
      username: process.env.TEST_USERNAME || 'tomsmith',
      password: process.env.TEST_PASSWORD || 'SuperSecretPassword!',
    },
    invalid: {
      username: 'invalid_user',
      password: 'wrong_password',
    },
    empty: {
      username: '',
      password: '',
    },
  },

  // Timeout configurations (in milliseconds)
  timeouts: {
    short: 5000,
    medium: 10000,
    long: 30000,
    download: 60000,
  },

  // Application paths
  paths: {
    login: '/login',
    secure: '/secure',
    logout: '/logout',
    basicAuth: '/basic_auth',
    digestAuth: '/digest_auth',
    download: '/download',
    secureDownload: '/download_secure',
    forgotPassword: '/forgot_password',
  },

  // Expected messages
  messages: {
    loginSuccess: 'You logged into a secure area!',
    loginFailed: 'Your username is invalid!',
    passwordInvalid: 'Your password is invalid!',
    logoutSuccess: 'You logged out of the secure area!',
    basicAuthSuccess: 'Congratulations! You must have the proper credentials.',
    recoveryEmailSent: "Your e-mail's been sent!",
  },

  // Test files for download testing
  files: {
    sampleFile: 'some-file.txt',
  },

  // Retry configuration
  retries: {
    test: process.env.CI ? 2 : 0,
    action: 3,
  },

  // Screenshot configuration
  screenshots: {
    enabled: true,
    onFailure: true,
    directory: process.env.SCREENSHOTS_DIR || './screenshots',
  },
} as const;

/**
 * Test data factory for generating dynamic test data
 * Use this when you need unique data for each test run
 */
export class TestDataFactory {
  /**
   * Generate a unique email address for testing
   */
  static generateEmail(prefix: string = 'test'): string {
    const timestamp = Date.now();
    return `${prefix}_${timestamp}@example.com`;
  }

  /**
   * Generate a unique username
   */
  static generateUsername(prefix: string = 'user'): string {
    const timestamp = Date.now();
    return `${prefix}_${timestamp}`;
  }

  /**
   * Generate a random password meeting common requirements
   */
  static generatePassword(length: number = 12): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';
    const allChars = uppercase + lowercase + numbers + symbols;

    let password = '';
    // Ensure at least one of each type
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }

  /**
   * Generate test data for form inputs
   */
  static generateFormData(overrides: Record<string, string> = {}): Record<string, string> {
    return {
      username: this.generateUsername(),
      email: this.generateEmail(),
      password: this.generatePassword(),
      ...overrides,
    };
  }

  /**
   * Get current timestamp for unique identifiers
   */
  static getTimestamp(): string {
    return new Date().toISOString().replace(/[:.]/g, '-');
  }

  /**
   * Generate a unique test identifier
   */
  static generateTestId(prefix: string = 'test'): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Environment-specific configuration
 */
export class EnvironmentConfig {
  /**
   * Check if running in CI environment
   */
  static isCI(): boolean {
    return process.env.CI === 'true' || !!process.env.CI;
  }

  /**
   * Check if running in headless mode
   */
  static isHeadless(): boolean {
    return process.env.HEADLESS !== 'false';
  }

  /**
   * Get number of workers
   */
  static getWorkers(): number | string {
    if (process.env.WORKERS) {
      return parseInt(process.env.WORKERS, 10);
    }
    return this.isCI() ? 4 : '50%';
  }

  /**
   * Get browser name
   */
  static getBrowser(): string {
    return process.env.BROWSER || 'chromium';
  }

  /**
   * Get test timeout
   */
  static getTimeout(): number {
    return parseInt(process.env.TIMEOUT || '30000', 10);
  }
}
