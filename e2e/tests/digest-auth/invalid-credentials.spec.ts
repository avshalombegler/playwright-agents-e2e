import { pageTest as test, expect } from '../../fixtures';

test.describe('Digest Authentication', () => {
  test('Invalid Digest Auth Credentials', async ({ digestAuthPage, page }) => {
    // Listen for 401 responses since digest auth fails at HTTP level
    let authFailed = false;
    page.on('response', response => {
      if (response.status() === 401) {
        authFailed = true;
      }
    });

    await digestAuthPage.navigateWithInvalidCredentials();
    expect(authFailed).toBe(true);
  });
});