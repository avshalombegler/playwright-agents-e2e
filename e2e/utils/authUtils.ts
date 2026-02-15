import { Page } from '@playwright/test';

/**
 * Authentication utilities for different auth methods
 */
export class AuthUtils {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Perform form-based login
   */
  async performFormLogin(username: string, password: string) {
    await this.page.goto('https://the-internet.herokuapp.com/login');
    await this.page.getByRole('textbox', { name: 'Username' }).fill(username);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    await this.page.getByRole('button', { name: ' Login' }).click();
  }

  /**
   * Navigate to URL with basic/digest auth credentials
   */
  async navigateWithEmbeddedCredentials(path: string, username: string, password: string) {
    const urlWithAuth = `https://${username}:${password}@the-internet.herokuapp.com${path}`;
    await this.page.goto(urlWithAuth);
  }

  /**
   * Perform logout
   */
  async performLogout() {
    await this.page.getByRole('link', { name: 'Logout' }).click();
  }

  /**
   * Check if user is currently authenticated
   */
  async isUserAuthenticated(): Promise<boolean> {
    const logoutLink = this.page.getByRole('link', { name: 'Logout' });
    return await logoutLink.isVisible();
  }

  /**
   * Get current authentication state
   */
  async getAuthenticationState(): Promise<'authenticated' | 'unauthenticated' | 'unknown'> {
    try {
      if (await this.isUserAuthenticated()) {
        return 'authenticated';
      }
      const loginHeading = this.page.getByRole('heading', { name: 'Login Page' });
      if (await loginHeading.isVisible()) {
        return 'unauthenticated';
      }
      return 'unknown';
    } catch {
      return 'unknown';
    }
  }
}