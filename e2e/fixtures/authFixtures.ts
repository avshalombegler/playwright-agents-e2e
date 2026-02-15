import { SecurePage } from '../pages';
import { test as pageTest } from './pageFixtures';

type AuthFixtures = {
  loggedInSecurePage: SecurePage;
  // Note: loginPage and securePage are already provided by pageTest
};

export const authTest = pageTest.extend<AuthFixtures>({
  loggedInSecurePage: async ({ loginPage, securePage }, use) => {
    // Navigate to login and authenticate
    await loginPage.navigateToLogin();
    await loginPage.loginWithValidCredentials();

    // Verify authentication was successful
    await securePage.verifySecureAreaDisplayed();

    await use(securePage);
  },
});

export { expect } from '@playwright/test';
