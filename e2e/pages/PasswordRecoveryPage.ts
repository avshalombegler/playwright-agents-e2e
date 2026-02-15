import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class PasswordRecoveryPage extends BasePage {
  // Locators
  private emailInput: Locator;
  private retrievePasswordButton: Locator;
  private forgotPasswordHeading: Locator;
  private internalServerErrorHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = this.page.getByRole('textbox', { name: 'E-mail' });
    this.retrievePasswordButton = this.page.getByRole('button', { name: 'Retrieve password' });
    this.forgotPasswordHeading = this.page.getByRole('heading', { name: 'Forgot Password' });
    this.internalServerErrorHeading = this.page.getByRole('heading', { name: 'Internal Server Error' });
  }

  /**
   * Navigate to forgot password page
   */
  async navigateToForgotPassword() {
    await this.goto('/forgot_password');
  }

  /**
   * Verify forgot password page elements
   */
  async verifyForgotPasswordPageElements() {
    await expect(this.forgotPasswordHeading).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.retrievePasswordButton).toBeVisible();
  }

  /**
   * Enter email address
   */
  async enterEmail(email: string) {
    await this.fillInput(this.emailInput, email);
  }

  /**
   * Click retrieve password button
   */
  async clickRetrievePassword() {
    await this.clickElement(this.retrievePasswordButton);
  }

  /**
   * Submit password recovery with email
   */
  async submitPasswordRecovery(email: string) {
    await this.enterEmail(email);
    await this.clickRetrievePassword();
  }

  /**
   * Submit with valid email format
   */
  async submitWithValidEmail() {
    await this.submitPasswordRecovery('test@example.com');
  }

  /**
   * Verify internal server error (known application limitation)
   */
  async verifyInternalServerError() {
    await expect(this.internalServerErrorHeading).toBeVisible();
  }

  /**
   * Verify forgot password page is displayed
   */
  async verifyForgotPasswordPageDisplayed() {
    await expect(this.forgotPasswordHeading).toBeVisible();
  }
}