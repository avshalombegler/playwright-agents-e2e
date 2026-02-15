import { pageTest as test, expect } from '../../fixtures';

test.describe('Form Authentication', () => {
  test('Valid Login Flow', async ({ loginPage, securePage }) => {
    await loginPage.navigateToLogin();
    await loginPage.loginWithValidCredentials();
    await securePage.verifyLoginSuccessMessage();
    await securePage.verifySecureAreaHeading();
    await securePage.verifyLogoutLinkPresent();
  });
});