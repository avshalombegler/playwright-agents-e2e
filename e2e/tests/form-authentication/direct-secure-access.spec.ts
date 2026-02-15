import { pageTest as test, expect } from '../../fixtures';

test.describe('Form Authentication', () => {
  test('Direct Secure Area Access', async ({ securePage, loginPage }) => {
    // Attempt to bypass authentication by direct URL access
    await securePage.navigateToSecureArea();
    await loginPage.verifyUnauthorizedAccessMessage();
    await loginPage.verifyLoginPageDisplayed();
  });
});