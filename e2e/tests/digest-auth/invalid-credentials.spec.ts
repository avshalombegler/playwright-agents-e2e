import { pageTest as test, expect } from '../../fixtures';

test.describe('Digest Authentication', () => {
  test('Invalid Digest Auth Credentials', async ({ digestAuthPage, page }) => {
    // Firefox throws navigation error for invalid digest auth credentials in URL
    // Instead of a 401 response, we expect a network error
    let navigationError = false;
    
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

    // For Firefox with digest auth, invalid credentials cause navigation error
    expect(navigationError).toBe(true);
  });
});