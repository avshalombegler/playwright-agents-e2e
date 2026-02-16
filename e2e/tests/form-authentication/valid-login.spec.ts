import { pageTest as test, expect } from '../../fixtures';

test.describe('Form Authentication', () => {
  test('Valid Login Flow @smoke', async ({ loginPage, securePage }) => {
    await test.step('Navigate to login page', async () => {
      await loginPage.navigateToLogin();
    });

    await test.step('Perform login with valid credentials', async () => {
      await loginPage.loginWithValidCredentials();
    });

    await test.step('Verify successful login', async () => {
      await securePage.verifyLoginSuccessMessage();
      await securePage.verifySecureAreaHeading();
      await securePage.verifyLogoutLinkPresent();
    });
  });
});
