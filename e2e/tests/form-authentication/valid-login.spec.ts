import { pageTest as test, expect } from '../../fixtures';
import { Logger, CustomAssertions } from '../../utils';
import { TestDataManager } from '../../data';

test.describe('Form Authentication', () => {
  test('Valid Login Flow', async ({ loginPage, securePage, page }, testInfo) => {
    // Initialize logging for this test
    Logger.initializeForTest(page, testInfo);
    
    Logger.step('Navigate to login page');
    await loginPage.navigateToLogin();
    
    // Verify page is fully loaded
    await CustomAssertions.toBeFullyLoaded(page);
    
    Logger.step('Login with valid credentials');
    const user = TestDataManager.getUser('user');
    await loginPage.loginWithCredentials(user.username, user.password);
    
    Logger.step('Verify successful login');
    await securePage.verifyLoginSuccessMessage();
    
    // Use custom assertion to verify success message
    const successMessage = page.locator('[data-testid="flash-message"], .flash.success');
    await CustomAssertions.toHaveSuccessMessage(successMessage);
    
    Logger.step('Verify secure area access');
    await securePage.verifySecureAreaHeading();
    await securePage.verifyLogoutLinkPresent();
    
    // Verify URL pattern
    await CustomAssertions.toHaveUrlPattern(page, '/secure');
    
    Logger.step('Test completed successfully');
    await Logger.cleanupAfterTest(page, testInfo);
  });
});