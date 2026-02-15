import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SecurePage extends BasePage {
  // Locators
  private secureAreaHeading: Locator;
  private logoutLink: Locator;
  private successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.secureAreaHeading = this.page
      .getByRole('heading', { level: 2 })
      .filter({ hasText: 'Secure Area' });
    this.logoutLink = this.page.getByRole('link', { name: 'Logout' });
    this.successMessage = this.page.getByText('You logged into a secure area!');
  }

  /**
   * Navigate directly to secure area
   */
  async navigateToSecureArea() {
    await this.goto('/secure');
  }

  /**
   * Verify secure area is displayed
   */
  async verifySecureAreaDisplayed() {
    await expect(this.secureAreaHeading).toBeVisible();
    await expect(this.logoutLink).toBeVisible();
  }

  /**
   * Verify login success message
   */
  async verifyLoginSuccessMessage() {
    await expect(this.successMessage).toBeVisible();
  }

  /**
   * Perform logout
   */
  async logout() {
    await this.clickElement(this.logoutLink);
  }

  /**
   * Verify logout link is present
   */
  async verifyLogoutLinkPresent() {
    await expect(this.logoutLink).toBeVisible();
  }

  /**
   * Verify secure area heading
   */
  async verifySecureAreaHeading() {
    await expect(this.secureAreaHeading).toBeVisible();
  }

  /**
   * Check if user is authenticated (secure area is accessible)
   */
  async isUserAuthenticated(): Promise<boolean> {
    return await this.isElementVisible(this.secureAreaHeading);
  }

  /**
   * Verify secure content is accessible
   */
  async verifySecureContentAccessible() {
    await this.verifySecureAreaHeading();
    await this.verifyLogoutLinkPresent();
  }
}
