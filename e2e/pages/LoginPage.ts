import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

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
    await this.goto('/login');
  }

  /**
   * Perform login with credentials
   */
  async login(username: string, password: string) {
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.loginButton);
  }

  /**
   * Perform valid login
   */
  async loginWithValidCredentials() {
    await this.login('tomsmith', 'SuperSecretPassword!');
  }

  /**
   * Verify login page elements
   */
  async verifyLoginPageElements() {
    await expect(this.loginHeading).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  /**
   * Verify login page is displayed
   */
  async verifyLoginPageDisplayed() {
    await expect(this.loginHeading).toBeVisible();
    expect(this.getCurrentUrl()).toBe('https://the-internet.herokuapp.com/login');
  }

  /**
   * Enter username
   */
  async enterUsername(username: string) {
    await this.fillInput(this.usernameInput, username);
  }

  /**
   * Enter password
   */
  async enterPassword(password: string) {
    await this.fillInput(this.passwordInput, password);
  }

  /**
   * Click login button
   */
  async clickLogin() {
    await this.clickElement(this.loginButton);
  }

  /**
   * Verify error message for invalid credentials
   */
  async verifyInvalidCredentialsError() {
    await this.verifyFlashMessage('Your username is invalid!');
  }

  /**
   * Verify error message for invalid password
   */
  async verifyInvalidPasswordError() {
    await this.verifyFlashMessage('Your password is invalid!');
  }

  /**
   * Verify logout success message
   */
  async verifyLogoutMessage() {
    await this.verifyFlashMessage('You logged out of the secure area!');
  }

  /**
   * Verify unauthorized access message
   */
  async verifyUnauthorizedAccessMessage() {
    await this.verifyFlashMessage('You must login to view the secure area!');
  }

  /**
   * Clear form fields
   */
  async clearForm() {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }
}