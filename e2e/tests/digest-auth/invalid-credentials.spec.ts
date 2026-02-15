import { pageTest as test, expect } from '../../fixtures';
import { Logger, CustomAssertions } from '../../utils';
import { TestDataManager } from '../../data';

test.describe('Digest Authentication', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    Logger.initializeForTest(page, testInfo);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await Logger.cleanupAfterTest(page, testInfo);
  });

  test('Invalid Digest Auth Credentials', async ({ digestAuthPage, page }, testInfo) => {
    Logger.step('Starting invalid digest auth credentials test');
    
    const invalidCredentials = TestDataManager.getAuthCredentials('digest').invalid;
    Logger.info(`Using invalid credentials: ${invalidCredentials.username}`);
    
    // Different browsers handle digest auth failures differently
    let authenticationFailed = false;
    let navigationError = false;
    
    try {
      // Attempt to navigate with invalid credentials
      const response = await page.goto('https://invalid:invalid@the-internet.herokuapp.com/digest_auth');
      
      // Check if we got a 401 response
      if (response && response.status() === 401) {
        authenticationFailed = true;
        Logger.info('Expected 401 response for invalid digest auth');
      } else {
        // Check if page is empty (another sign of auth failure)
        const bodyText = await page.textContent('body') || '';
        if (bodyText.trim() === '') {
          authenticationFailed = true;
          Logger.info('Empty page content indicates auth failure');
        }
      }
      
    } catch (error) {
      Logger.debug('Navigation error caught during digest auth', error);
      
      // Firefox-specific: Invalid digest auth credentials cause NS_ERROR_NET_EMPTY_RESPONSE
      if (error instanceof Error && 
          (error.message.includes('NS_ERROR_NET_EMPTY_RESPONSE') || 
           error.message.includes('net::ERR_EMPTY_RESPONSE') ||
           error.message.includes('Navigation failed'))) {
        navigationError = true;
        authenticationFailed = true;
        Logger.info('Expected navigation error occurred for invalid digest auth');
      } else {
        Logger.error('Unexpected error during digest auth', error);
        throw error; // Re-throw if it's an unexpected error
      }
    }

    // Authentication should fail either through navigation error or empty response
    expect(authenticationFailed, 'Authentication should fail with invalid digest auth credentials').toBe(true);
    
    Logger.result(true, 'Invalid digest auth credentials test completed successfully');
  });
});