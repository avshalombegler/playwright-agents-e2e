import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger, CustomAssertions } from '../utils';

export class SecurePage extends BasePage {
  // Locators
  private secureAreaHeading: Locator;
  private logoutLink: Locator;
  private successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.secureAreaHeading = this.page.getByRole('heading', { level: 2 }).filter({ hasText: 'Secure Area' });
    this.logoutLink = this.page.getByRole('link', { name: 'Logout' });
    this.successMessage = this.page.getByText('You logged into a secure area!');
  }

  /**
   * Navigate directly to secure area
   */
  async navigateToSecureArea() {
    Logger.step('Navigating directly to secure area');
    await this.goto('/secure');
    await this.waitForPageLoad();
  }

  /**
   * Verify secure area is displayed
   */
  async verifySecureAreaDisplayed() {
    await expect(this.secureAreaHeading).toBeVisible();
    await expect(this.logoutLink).toBeVisible();
    await this.verifyUrlPattern('/secure');
    await CustomAssertions.toBeAccessible(this.secureAreaHeading);
    await CustomAssertions.toBeAccessible(this.logoutLink);
  }

  /**
   * Verify login success message
   */
  async verifyLoginSuccessMessage() {
    await expect(this.successMessage).toBeVisible();
    await CustomAssertions.toHaveSuccessMessage(this.successMessage);
  }

  /**
   * Perform logout
   */
  async logout() {
    Logger.step('Performing logout');
    await this.clickElement(this.logoutLink, 'Logout link');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify logout link is present
   */
  async verifyLogoutLinkPresent() {
    await expect(this.logoutLink).toBeVisible();
    await expect(this.logoutLink).toBeEnabled();
    const href = await this.logoutLink.getAttribute('href');
    expect(href).toContain('/logout');
  }

  /**
   * Verify secure area heading
   */
  async verifySecureAreaHeading() {
    await expect(this.secureAreaHeading).toBeVisible();
    await CustomAssertions.toBeAccessible(this.secureAreaHeading);
    const headingText = await this.secureAreaHeading.textContent();
    expect(headingText).toContain('Secure Area');
  }

  /**
   * Check if user is authenticated
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
    await this.verifyUrlPattern('/secure');
  }

  /**
   * Get current user session info
   */
  async getUserSessionInfo(): Promise<{ isLoggedIn: boolean; hasLogoutOption: boolean }> {
    const isLoggedIn = await this.successMessage.isVisible();
    const hasLogoutOption = await this.logoutLink.isVisible();
    
    return {
      isLoggedIn,
      hasLogoutOption
    };
  }
}