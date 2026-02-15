import { pageTest as test, expect } from '../../fixtures';
import { Response, Page } from '@playwright/test';

interface AuthTestContext {
  digestAuthPage: any;
  page: Page;
}

test.describe('Digest Authentication', () => {
  test('Invalid Digest Auth Credentials', async ({ digestAuthPage, page }: AuthTestContext) => {
    // Track response to check for 401 status (Chromium behavior)  
    let response: Response | undefined;
    let navigationError: boolean = false;
    
    await test.step('Set up response monitoring', async () => {
      // Listen for response event to capture the status
      page.on('response', (resp) => {
        if (resp.url().includes('/digest_auth')) {
          response = resp;
        }
      });
    });
    
    await test.step('Attempt navigation with invalid credentials', async () => {
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
    });
    
    await test.step('Verify browser-specific authentication failure behavior', async () => {
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
});