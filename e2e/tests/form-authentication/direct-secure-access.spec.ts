import { pageTest as test, expect } from '../../fixtures';

test.describe('Form Authentication', () => {
  test('Direct Secure Area Access', async ({ securePage, loginPage }) => {
    await test.step('Attempt direct access to secure area', async () => {
      // Attempt to bypass authentication by direct URL access
      await securePage.navigateToSecureArea();
    });
    
    await test.step('Verify unauthorized access is blocked', async () => {
      await loginPage.verifyUnauthorizedAccessMessage();
      await loginPage.verifyLoginPageDisplayed();
    });
  });
});