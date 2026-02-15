import { pageTest as test, expect } from '../../fixtures';

test.describe('Form Authentication', () => {
  test('Empty Credentials', async ({ loginPage }) => {
    await loginPage.navigateToLogin();
    await loginPage.verifyLoginPageElements();
    await loginPage.clickLogin();
    await loginPage.verifyInvalidCredentialsError();
    await loginPage.verifyLoginPageElements();
  });
});