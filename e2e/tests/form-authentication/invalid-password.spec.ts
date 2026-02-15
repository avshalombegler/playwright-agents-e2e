import { pageTest as test, expect } from '../../fixtures';

test.describe('Form Authentication', () => {
  test('Invalid Password', async ({ loginPage }) => {
    await loginPage.navigateToLogin();
    await loginPage.enterUsername('tomsmith');
    await loginPage.enterPassword('wrongpassword');
    await loginPage.clickLogin();
    await loginPage.verifyInvalidPasswordError();
    await loginPage.verifyLoginPageElements();
  });
});