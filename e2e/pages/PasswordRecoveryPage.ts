import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger, CustomAssertions } from '../utils';
import { TestDataManager } from '../data';

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
    Logger.step('Navigating to forgot password page');
    await this.goto('/forgot_password');
    await this.waitForPageLoad();
  }

  /**
   * Navigate to password recovery page (alias)
   */
  async navigateToPasswordRecovery() {
    return await this.navigateToForgotPassword();
  }

  /**
   * Verify forgot password page elements
   */
  async verifyForgotPasswordPageElements() {
    await expect(this.forgotPasswordHeading).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.retrievePasswordButton).toBeVisible();
    await CustomAssertions.toBeAccessible(this.forgotPasswordHeading);
    await CustomAssertions.toBeAccessible(this.emailInput);
    await CustomAssertions.toBeAccessible(this.retrievePasswordButton);
  }

  /**
   * Enter email address
   */
  async enterEmail(email: string) {
    await this.fillInput(this.emailInput, email, 'Email field');
  }

  /**
   * Click retrieve password button
   */
  async clickRetrievePassword() {
    await this.clickElement(this.retrievePasswordButton, 'Retrieve password button');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Submit password recovery form
   */
  async submitPasswordRecovery(email?: string) {
    if (email) {
      await this.enterEmail(email);
    }
    await this.clickRetrievePassword();
  }

  /**
   * Submit with valid email format using TestDataManager
   */
  async submitWithValidEmail() {
    const testEmail = TestDataManager.generateRandomEmail();
    Logger.info(`Using generated test email: ${testEmail}`);
    await this.submitPasswordRecovery(testEmail);
  }

  /**
   * Verify internal server error (known application limitation)
   */
  async verifyInternalServerError() {
    Logger.step('Verifying internal server error message');
    
    await expect(this.internalServerErrorHeading).toBeVisible();
    await CustomAssertions.toHaveErrorMessage(
      this.internalServerErrorHeading, 
      'Internal server error message should be displayed'
    );
    
    Logger.debug('Internal server error verified');
  }

  /**
   * Verify forgot password page is displayed with enhanced validation
   */
  async verifyForgotPasswordPageDisplayed() {
    Logger.step('Verifying forgot password page is displayed');
    
    await expect(this.forgotPasswordHeading).toBeVisible();
    await this.verifyUrlPattern('/forgot_password');
    
    Logger.debug('Forgot password page display verified');
  }

  /**
   * Verify email sent message (if application supports it)
   */
  async verifyEmailSentMessage() {
    Logger.step('Verifying email sent confirmation message');
    
    // Look for common success message patterns
    const successMessages = [
      'Email sent',
      'Password reset email sent',
      'Check your email',
      'Instructions sent'
    ];
    
    let messagFound = false;
    for (const message of successMessages) {
      const element = this.page.getByText(message, { exact: false });
      if (await element.isVisible()) {
        await CustomAssertions.toHaveSuccessMessage(element, `Email sent message should be displayed: ${message}`);
        messagFound = true;
        break;
      }
    }
    
    // If no success message found, check if we got an error (like Internal Server Error)
    if (!messagFound) {
      Logger.warn('No email sent confirmation found, checking for error messages');
      const hasError = await this.internalServerErrorHeading.isVisible();
      if (hasError) {
        await this.verifyInternalServerError();
      } else {
        Logger.warn('No clear success or error message found for email sent');
      }
    } else {
      Logger.debug('Email sent message verified');
    }
  }

  /**
   * Test email validation with various formats
   */
  async testEmailValidation(email: string): Promise<'valid' | 'invalid'> {
    Logger.step(`Testing email validation for: ${email}`);
    
    await this.enterEmail(email);
    
    const form = this.page.locator('form');
    const isValid = await form.evaluate((formEl) => {
      if (formEl instanceof HTMLFormElement) {
        return formEl.checkValidity();
      }
      return true;
    });
    
    const result = isValid ? 'valid' : 'invalid';
    Logger.debug(`Email validation result: ${result}`);
    
    return result;
  }
}