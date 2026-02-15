import { pageTest as test, expect } from '../../fixtures';

test.describe('Digest Authentication', () => {
  test('Valid Digest Auth Credentials', async ({ digestAuthPage }) => {
    await test.step('Navigate with valid digest auth credentials', async () => {
      await digestAuthPage.navigateWithValidCredentials();
    });
    
    await test.step('Verify digest authentication success', async () => {
      await digestAuthPage.verifySuccessMessage();
      await digestAuthPage.verifyDigestAuthHeading();
    });
  });
});