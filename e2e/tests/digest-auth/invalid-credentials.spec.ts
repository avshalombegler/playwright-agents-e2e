import { pageTest as test, expect } from '../../fixtures';

test.describe('Digest Authentication', () => {
  test('Invalid Digest Auth Credentials', async ({ digestAuthPage, page }) => {
    // Track response to check for 401 status (Chromium behavior)
    let response;
    let navigationError = false;
    
    // Listen for response event to capture the status
    page.on('response', (resp) => {
      if (resp.url().includes('/digest_auth')) {
        response = resp;
      }
    });

    // Try navigation - Firefox throws error, Chromium returns 401
    try {
      await digestAuthPage.navigateWithInvalidCredentials();
    } catch (error) {
      // Firefox-specific: Invalid digest auth credentials cause NS_ERROR_NET_EMPTY_RESPONSE
      if (error instanceof Error && 
          (error.message.includes('NS_ERROR_NET_EMPTY_RESPONSE') || 
           error.message.includes('net::ERR_EMPTY_RESPONSE') ||
           error.message.includes('Navigation failed'))) {
        navigationError = true;
      } else {
        throw error; // Re-throw if it's an unexpected error
      }
    }

    // Verify behavior based on browser:
    // Firefox: Navigation error should be thrown
    // Chromium: Should get 401 response
    if (navigationError) {
      // Firefox behavior - navigation error indicates auth failure
      expect(navigationError).toBe(true);
    } else {
      // Chromium behavior - check for 401 response
      expect(response).toBeDefined();
      expect(response!.status()).toBe(401);
    }
  });
});