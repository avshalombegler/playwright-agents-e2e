import { pageTest as test, expect } from '../../fixtures';

test.describe('Basic Authentication', () => {
  test('Valid Basic Auth Credentials', async ({ basicAuthPage }) => {
    await test.step('Navigate with valid basic auth credentials', async () => {
      await basicAuthPage.navigateWithValidCredentials();
    });
    
    await test.step('Verify authentication success', async () => {
      await basicAuthPage.verifySuccessMessage();
      await basicAuthPage.verifyBasicAuthHeading();
    });
  });
});