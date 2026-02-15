import { pageTest as test, expect } from '../../fixtures';

test.describe('Form Authentication', () => {
  test('Logout Functionality', async ({ loginPage, securePage }) => {
    await test.step('Perform login', async () => {
      // Complete login-to-logout user journey
      await loginPage.navigateToLogin();
      await loginPage.loginWithValidCredentials();
      await securePage.verifySecureAreaDisplayed();
    });

    await test.step('Perform logout', async () => {
      await securePage.logout();
    });

    await test.step('Verify logout completed successfully', async () => {
      await loginPage.verifyLogoutMessage();
      await loginPage.verifyLoginPageElements();
    });
  });
});
