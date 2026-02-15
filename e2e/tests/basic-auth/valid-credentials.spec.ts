import { pageTest as test, expect } from '../../fixtures';

test.describe('Basic Authentication', () => {
  test('Valid Basic Auth Credentials', async ({ basicAuthPage }) => {
    await basicAuthPage.navigateWithValidCredentials();
    await basicAuthPage.verifySuccessMessage();
    await basicAuthPage.verifyBasicAuthHeading();
  });
});