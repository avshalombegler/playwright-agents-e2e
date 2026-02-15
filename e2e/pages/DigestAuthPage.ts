import { Page } from '@playwright/test';
import { HttpAuthPage } from './BasicAuthPage';

/**
 * DigestAuthPage - Specialized version of HttpAuthPage for digest authentication
 * Uses consolidated HttpAuthPage to eliminate code duplication
 */
export class DigestAuthPage extends HttpAuthPage {
  constructor(page: Page) {
    super(page, 'digest');
  }

  // Backward compatibility aliases
  async navigateToDigestAuthWithCredentials(username: string = 'admin', password: string = 'admin') {
    return this.navigateWithCredentials(username, password);
  }

  async verifySuccessfulDigestAuth() {
    return this.verifySuccessfulAuth();
  }

  async verifyDigestAuthHeading() {
    return this.verifyAuthHeading();
  }
}