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

  test('Invalid Password', async ({ loginPage, page }, testInfo) => {
    Logger.step('Starting invalid password test');
    
    await loginPage.navigateToLogin();
    await CustomAssertions.toBeFullyLoaded(page);
    
    // Use TestDataManager for test data
    const validUser = TestDataManager.getUser('user');
    const invalidPassword = TestDataManager.generateRandomPassword(8, false);
    
    Logger.info(`Using valid username: ${validUser.username}`);
    Logger.info('Using randomly generated invalid password');
    
    await loginPage.enterUsername(validUser.username);
    await loginPage.enterPassword(invalidPassword);
    
    // Verify form validation state
    await loginPage.verifyFormValidationState('valid');
    
    await loginPage.clickLogin();
    
    // Verify error message appears
    await loginPage.verifyInvalidPasswordError();
    
    // Verify we're still on login page
    await CustomAssertions.toHaveUrlPattern(page, '/login');
    
    // Verify login page elements are still present
    await loginPage.verifyLoginPageElements();
    
    Logger.result(true, 'Invalid password test completed successfully');
  });
});