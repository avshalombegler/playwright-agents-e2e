import { pageTest as test, expect } from '../../fixtures';
import { Logger, CustomAssertions } from '../../utils';
import { TestDataManager } from '../../data';

test.describe('Basic Authentication', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    Logger.initializeForTest(page, testInfo);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await Logger.cleanupAfterTest(page, testInfo);
  });

  test('Invalid Basic Auth Credentials', async ({ basicAuthPage, page }, testInfo) => {
    Logger.step('Starting invalid basic auth credentials test');
    
    const invalidCredentials = TestDataManager.getAuthCredentials('basic').invalid;
    Logger.info(`Using invalid credentials: ${invalidCredentials.username}`);
    
    // This should trigger authentication failure
    await basicAuthPage.navigateWithInvalidCredentials();
    
    // Check for "Not authorized" message or similar authentication failure
    const unauthorizedMessage = page.getByText('Not authorized');
    await expect(unauthorizedMessage).toBeVisible();
    
    // Use custom assertion to verify this is an error state
    await CustomAssertions.toHaveErrorMessage(unauthorizedMessage, 'Unauthorized message should be displayed');
    
    // Verify authentication was not successful
    const isSuccessful = await basicAuthPage.isAuthenticationSuccessful();
    expect(isSuccessful, 'Authentication should fail with invalid credentials').toBeFalsy();
    
    Logger.result(true, 'Invalid basic auth credentials test completed successfully');
  });
});