import { pageTest as test, expect } from '../../fixtures';
import { Logger, CustomAssertions } from '../../utils';

test.describe('Basic Authentication', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    Logger.initializeForTest(page, testInfo);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await Logger.cleanupAfterTest(page, testInfo);
  });

  test('Valid Basic Auth Credentials', async ({ basicAuthPage, page }, testInfo) => {
    Logger.step('Starting valid basic auth credentials test');
    
    await basicAuthPage.navigateWithValidCredentials();
    
    // Verify page loads completely
    await CustomAssertions.toBeFullyLoaded(page);
    
    await basicAuthPage.verifySuccessMessage();
    await basicAuthPage.verifyBasicAuthHeading();
    
    // Verify URL pattern
    await CustomAssertions.toHaveUrlPattern(page, '/basic_auth');
    
    Logger.result(true, 'Valid basic auth credentials test completed successfully');
  });
});