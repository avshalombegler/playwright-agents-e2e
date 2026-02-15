import { pageTest as test, expect } from '../../fixtures';

test.describe('Form Authentication', () => {
  test('Invalid Password', async ({ loginPage }) => {
    await test.step('Navigate to login page', async () => {
      await loginPage.navigateToLogin();
    });
    
    await test.step('Enter valid username with invalid password', async () => {
      await loginPage.enterUsername('tomsmith');
      await loginPage.enterPassword('wrongpassword');
      await loginPage.clickLogin();
    });
    
    await test.step('Verify login failure with invalid password', async () => {
      await loginPage.verifyInvalidPasswordError();
      await loginPage.verifyLoginPageElements();
    });
  });
});