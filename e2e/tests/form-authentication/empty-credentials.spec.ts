import { pageTest as test, expect } from '../../fixtures';
import { Logger, CustomAssertions } from '../../utils';

test.describe('Form Authentication', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    Logger.initializeForTest(page, testInfo);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await Logger.cleanupAfterTest(page, testInfo);
  });

  test('Empty Credentials', async ({ loginPage, page }, testInfo) => {
    Logger.step('Starting empty credentials test');
    
    await loginPage.navigateToLogin();
    await CustomAssertions.toBeFullyLoaded(page);
    
    // Verify page elements before interaction
    await loginPage.verifyLoginPageElements();
    
    // Attempt login with empty fields
    Logger.step('Attempting login with empty credentials');
    await loginPage.clickLogin();
    
    // Verify error message appears
    await loginPage.verifyInvalidCredentialsError();
    
    // Verify we're still on login page
    await CustomAssertions.toHaveUrlPattern(page, '/login');
    
    // Verify login page elements are still present
    await loginPage.verifyLoginPageElements();
    
    Logger.result(true, 'Empty credentials test completed successfully');
  });
});