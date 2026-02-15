import { pageTest as test, expect } from '../../fixtures';

test.describe('Form Authentication', () => {
  test('Invalid Username', async ({ loginPage }) => {
    await loginPage.navigateToLogin();
    await loginPage.enterUsername('wronguser');
    await loginPage.enterPassword('anypassword');
    await loginPage.clickLogin();
    await loginPage.verifyInvalidCredentialsError();
    await loginPage.verifyLoginPageElements();
  });
});