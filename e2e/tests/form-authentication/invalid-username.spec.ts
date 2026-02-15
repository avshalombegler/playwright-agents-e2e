import { pageTest as test, expect } from '../../fixtures';

test.describe('Form Authentication', () => {
  test('Invalid Username', async ({ loginPage }) => {
    await test.step('Navigate to login page', async () => {
      await loginPage.navigateToLogin();
    });
    
    await test.step('Enter invalid credentials and submit', async () => {
      await loginPage.enterUsername('wronguser');
      await loginPage.enterPassword('anypassword');
      await loginPage.clickLogin();
    });
    
    await test.step('Verify login failure with invalid username', async () => {
      await loginPage.verifyInvalidCredentialsError();
      await loginPage.verifyLoginPageElements();
    });
  });
});