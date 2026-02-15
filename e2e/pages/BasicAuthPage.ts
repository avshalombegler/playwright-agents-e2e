import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class BasicAuthPage extends BasePage {
  // Locators
  private basicAuthHeading: Locator;
  private successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.basicAuthHeading = this.page.getByRole('heading', { name: 'Basic Auth' });
    this.successMessage = this.page.getByText('Congratulations! You must have the proper credentials.');
  }

  /**
   * Navigate to basic auth page with credentials
   */
  async navigateToBasicAuthWithCredentials(username: string = 'admin', password: string = 'admin') {
    await this.gotoWithAuth('/basic_auth', username, password);
  }

  /**
   * Navigate to basic auth page without credentials
   */
  async navigateToBasicAuth() {
    await this.goto('/basic_auth');
  }

  /**
   * Navigate with valid credentials
   */
  async navigateWithValidCredentials() {
    await this.navigateToBasicAuthWithCredentials('admin', 'admin');
  }

  /**
   * Navigate with invalid credentials
   */
  async navigateWithInvalidCredentials() {
    await this.navigateToBasicAuthWithCredentials('invalid', 'invalid');
  }

  /**
   * Verify successful basic authentication
   */
  async verifySuccessfulBasicAuth() {
    await expect(this.successMessage).toBeVisible();
    await expect(this.basicAuthHeading).toBeVisible();
  }

  /**
   * Verify basic auth page heading
   */
  async verifyBasicAuthHeading() {
    await expect(this.basicAuthHeading).toBeVisible();
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