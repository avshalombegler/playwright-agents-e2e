import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DigestAuthPage extends BasePage {
  // Locators
  private digestAuthHeading: Locator;
  private successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.digestAuthHeading = this.page.getByRole('heading', { name: 'Digest Auth' });
    this.successMessage = this.page.getByText(
      'Congratulations! You must have the proper credentials.'
    );
  }

  /**
   * Navigate to digest auth page with credentials
   */
  async navigateToDigestAuthWithCredentials(
    username: string = 'admin',
    password: string = 'admin'
  ) {
    await this.gotoWithAuth('/digest_auth', username, password);
  }

  /**
   * Navigate to digest auth page without credentials
   */
  async navigateToDigestAuth() {
    await this.goto('/digest_auth');
  }

  /**
   * Navigate with valid credentials
   */
  async navigateWithValidCredentials() {
    await this.navigateToDigestAuthWithCredentials('admin', 'admin');
  }

  /**
   * Navigate with invalid credentials
   */
  async navigateWithInvalidCredentials() {
    await this.navigateToDigestAuthWithCredentials('invalid', 'invalid');
  }

  /**
   * Verify successful digest authentication
   */
  async verifySuccessfulDigestAuth() {
    await expect(this.successMessage).toBeVisible();
    await expect(this.digestAuthHeading).toBeVisible();
  }

  /**
   * Verify digest auth page heading
   */
  async verifyDigestAuthHeading() {
    await expect(this.digestAuthHeading).toBeVisible();
  }

  /**
   * Verify success message
   */
  async verifySuccessMessage() {
    await expect(this.successMessage).toBeVisible();
  }

  /**
   * Check if authentication was successful
   */
  async isAuthenticationSuccessful(): Promise<boolean> {
    return await this.isElementVisible(this.successMessage);
  }
}
