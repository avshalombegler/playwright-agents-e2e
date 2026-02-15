import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger, CustomAssertions } from '../utils';
import { TestDataManager } from '../data';

/**
 * Unified HTTP Authentication Page (Basic and Digest Auth)
 * Consolidates BasicAuthPage and DigestAuthPage to eliminate duplication
 */
export class HttpAuthPage extends BasePage {
  private authHeading: Locator;
  private successMessage: Locator;
  private authType: 'basic' | 'digest';
  private authPath: string;

  constructor(page: Page, authType: 'basic' | 'digest' = 'basic') {
    super(page);
    this.authType = authType;
    this.authPath = authType === 'basic' ? '/basic_auth' : '/digest_auth';
    const headingName = authType === 'basic' ? 'Basic Auth' : 'Digest Auth';
    this.authHeading = this.page.getByRole('heading', { name: headingName });
    this.successMessage = this.page.getByText('Congratulations! You must have the proper credentials.');
  }

  /**
   * Navigate to auth page with credentials
   */
  async navigateWithCredentials(username: string = 'admin', password: string = 'admin') {
    Logger.step(`Navigating to ${this.authType} auth with credentials: ${username}`);
    await this.gotoWithAuth(this.authPath, username, password);
  }

  /**
   * Navigate with valid credentials using TestDataManager
   */
  async navigateWithValidCredentials() {
    const credentials = TestDataManager.getAuthCredentials(this.authType).valid;
    await this.navigateWithCredentials(credentials.username, credentials.password);
  }

  /**
   * Navigate with invalid credentials using TestDataManager
   */
  async navigateWithInvalidCredentials() {
    const credentials = TestDataManager.getAuthCredentials(this.authType).invalid;
    await this.navigateWithCredentials(credentials.username, credentials.password);
  }

  /**
   * Verify successful authentication
   */
  async verifySuccessfulAuth() {
    Logger.step(`Verifying successful ${this.authType} authentication`);
    await expect(this.successMessage).toBeVisible();
    await expect(this.authHeading).toBeVisible();
    await CustomAssertions.toHaveSuccessMessage(this.successMessage);
    await CustomAssertions.toBeAccessible(this.authHeading);
    await this.verifyUrlPattern(this.authPath);
  }

  /**
   * Verify auth page heading
   */
  async verifyAuthHeading() {
    await expect(this.authHeading).toBeVisible();
    await CustomAssertions.toBeAccessible(this.authHeading);
  }

  /**
   * Verify success message
   */
  async verifySuccessMessage() {
    await expect(this.successMessage).toBeVisible();
    await CustomAssertions.toHaveSuccessMessage(this.successMessage);
  }

  /**
   * Check if authentication was successful
   */
  async isAuthenticationSuccessful(): Promise<boolean> {
    return await this.isElementVisible(this.successMessage);
  }
}

// Backward compatibility aliases
export class BasicAuthPage extends HttpAuthPage {
  constructor(page: Page) {
    super(page, 'basic');
  }
  async navigateToBasicAuthWithCredentials(username: string = 'admin', password: string = 'admin') {
    return this.navigateWithCredentials(username, password);
  }
  async verifySuccessfulBasicAuth() {
    return this.verifySuccessfulAuth();
  }
  async verifyBasicAuthHeading() {
    return this.verifyAuthHeading();
  }
}