import { pageTest as test, expect } from '../../fixtures';
import { Logger, CustomAssertions } from '../../utils';
import { TestDataManager } from '../../data';

test.describe('Form Authentication', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    Logger.initializeForTest(page, testInfo);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await Logger.cleanupAfterTest(page, testInfo);
  });

  test('Invalid Username', async ({ loginPage, page }, testInfo) => {
    Logger.step('Starting invalid username test');
    
    await loginPage.navigateToLogin();
    await CustomAssertions.toBeFullyLoaded(page);
    
    // Use TestDataManager for test data
    const validUser = TestDataManager.getUser('user');
    const invalidUsername = TestDataManager.generateRandomUsername('invalid');
    
    Logger.info(`Using invalid username: ${invalidUsername}`);
    
    await loginPage.enterUsername(invalidUsername);
    await loginPage.enterPassword(validUser.password);
    
    // Verify form validation state before submission
    await loginPage.verifyFormValidationState('valid');
    
    await loginPage.clickLogin();
    
    // Verify error message appears
    await loginPage.verifyInvalidCredentialsError();
    
    // Verify we're still on login page
    await CustomAssertions.toHaveUrlPattern(page, '/login');
    
    // Verify login page elements are still present
    await loginPage.verifyLoginPageElements();
    
    Logger.result(true, 'Invalid username test completed successfully');
  });
});