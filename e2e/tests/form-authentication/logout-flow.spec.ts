import { pageTest as test, expect } from '../../fixtures';

test.describe('Form Authentication', () => {
  test('Logout Functionality', async ({ loginPage, securePage }) => {
    // Complete login-to-logout user journey
    await loginPage.navigateToLogin();
    await loginPage.loginWithValidCredentials();
    await securePage.verifySecureAreaDisplayed();
    await securePage.logout();
    await loginPage.verifyLogoutMessage();
    await loginPage.verifyLoginPageElements();
  });
});