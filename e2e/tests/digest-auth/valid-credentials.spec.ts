import { pageTest as test, expect } from '../../fixtures';
import { Logger, CustomAssertions } from '../../utils';

test.describe('Digest Authentication', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    Logger.initializeForTest(page, testInfo);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await Logger.cleanupAfterTest(page, testInfo);
  });

  test('Valid Digest Auth Credentials', async ({ digestAuthPage, page }, testInfo) => {
    Logger.step('Starting valid digest auth credentials test');
    
    await digestAuthPage.navigateWithValidCredentials();
    
    // Verify page loads completely
    await CustomAssertions.toBeFullyLoaded(page);
    
    await digestAuthPage.verifySuccessMessage();
    await digestAuthPage.verifyDigestAuthHeading();
    
    // Verify URL pattern
    await CustomAssertions.toHaveUrlPattern(page, '/digest_auth');
    
    Logger.result(true, 'Valid digest auth credentials test completed successfully');
  });
});