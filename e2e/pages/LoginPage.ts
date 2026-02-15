import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger, CustomAssertions } from '../utils';
import { TestDataManager } from '../data';

export class LoginPage extends BasePage {
  // Locators
  private usernameInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;
  private loginHeading: Locator;
  private flashMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = this.page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = this.page.getByRole('textbox', { name: 'Password' });
    this.loginButton = this.page.getByRole('button', { name: ' Login' });
    this.loginHeading = this.page.getByRole('heading', { name: 'Login Page' });
    this.flashMessage = this.page.locator('#flash');
  }

  /**
   * Navigate to login page
   */
  async navigateToLogin() {
    Logger.step('Navigating to login page');
    await this.goto('/login');
    await this.waitForPageLoad();
    await this.verifyLoginPageDisplayed();
  }

  /**
   * Perform login with credentials
   */
  async login(username: string, password: string) {
    Logger.step(`Performing login for user: ${username}`);
    await this.fillInput(this.usernameInput, username, 'Username field');
    await this.fillInput(this.passwordInput, password, 'Password field');
    await expect(this.loginButton).toBeEnabled();
    await this.clickElement(this.loginButton, 'Login button');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Alias for backward compatibility
   */
  async loginWithCredentials(username: string, password: string) {
    return await this.login(username, password);
  }

  /**
   * Perform login with valid credentials using TestDataManager
   */
  async loginWithValidCredentials() {
    const user = TestDataManager.getUser('user');
    await this.login(user.username, user.password);
  }

  /**
   * Perform login with invalid credentials using TestDataManager
   */
  async loginWithInvalidCredentials() {
    const invalidUser = TestDataManager.getAuthCredentials().invalid;
    await this.login(invalidUser.username, invalidUser.password);
  }

  /**
   * Verify login page elements
   */
  async verifyLoginPageElements() {
    Logger.step('Verifying all login page elements are present');
    await expect(this.loginHeading).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    await CustomAssertions.toBeAccessible(this.usernameInput);
    await CustomAssertions.toBeAccessible(this.passwordInput);
    await CustomAssertions.toBeAccessible(this.loginButton);
  }

  /**
   * Verify login page is displayed
   */
  async verifyLoginPageDisplayed() {
    await expect(this.loginHeading).toBeVisible();
    await this.verifyUrlPattern('/login');
  }

  /**
   * Enter username
   */
  async enterUsername(username: string) {
    await this.fillInput(this.usernameInput, username, 'Username field');
  }

  /**
   * Enter password
   */
  async enterPassword(password: string) {
    await this.fillInput(this.passwordInput, password, 'Password field');
  }

  /**
   * Click login button
   */
  async clickLogin() {
    await this.clickElement(this.loginButton, 'Login button');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify error message for invalid credentials
   */
  async verifyInvalidCredentialsError() {
    const errorMessage = this.page.getByText('Your username is invalid!');
    await CustomAssertions.toHaveErrorMessage(errorMessage);
  }

  /**
   * Verify error message for invalid password
   */
  async verifyInvalidPasswordError() {
    const errorMessage = this.page.getByText('Your password is invalid!');
    await CustomAssertions.toHaveErrorMessage(errorMessage);
  }

  /**
   * Verify logout success message
   */
  async verifyLogoutMessage() {
    const successMessage = this.page.getByText('You logged out of the secure area!');
    await CustomAssertions.toHaveSuccessMessage(successMessage);
  }

  /**
   * Verify unauthorized access message
   */
  async verifyUnauthorizedAccessMessage() {
    const errorMessage = this.page.getByText('You must login to view the secure area!');
    await CustomAssertions.toHaveErrorMessage(errorMessage);
  }

  /**
   * Clear form fields
   */
  async clearForm() {
    Logger.step('Clearing login form fields');
    await this.usernameInput.clear();
    await this.passwordInput.clear();
    await expect(this.usernameInput).toHaveValue('');
    await expect(this.passwordInput).toHaveValue('');
  }

  /**
   * Get form validation state
   */
  async getFormValidationState(): Promise<'valid' | 'invalid'> {
    const form = this.page.locator('form');
    const isValid = await form.evaluate((formEl) => {
      if (formEl instanceof HTMLFormElement) {
        return formEl.checkValidity();
      }
      return true;
    });
    return isValid ? 'valid' : 'invalid';
  }

  /**
   * Verify form validation state
   */
  async verifyFormValidationState(expectedState: 'valid' | 'invalid') {
    const form = this.page.locator('form');
    await CustomAssertions.toHaveValidFormState(form, expectedState);
  }
}