import { pageTest as test, expect } from '../../fixtures';

test.describe('Form Authentication', () => {
  test('Empty Credentials', async ({ loginPage }) => {
    await test.step('Navigate to login page and verify elements', async () => {
      await loginPage.navigateToLogin();
      await loginPage.verifyLoginPageElements();
    });
    
    await test.step('Submit login form with empty credentials', async () => {
      await loginPage.clickLogin();
    });
    
    await test.step('Verify login failure with empty credentials', async () => {
      await loginPage.verifyInvalidCredentialsError();
      await loginPage.verifyLoginPageElements();
    });
  });
});