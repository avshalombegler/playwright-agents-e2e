import { pageTest as test, expect } from '../../fixtures';

test.describe('Digest Authentication', () => {
  test('Valid Digest Auth Credentials', async ({ digestAuthPage }) => {
    await digestAuthPage.navigateWithValidCredentials();
    await digestAuthPage.verifySuccessMessage();
    await digestAuthPage.verifyDigestAuthHeading();
  });
});