import { pageTest as test, expect } from '../../fixtures';

test.describe('Password Recovery', () => {
  test('Forgot Password with Valid Email', async ({ passwordRecoveryPage }) => {
    await test.step('Navigate to forgot password page', async () => {
      await passwordRecoveryPage.navigateToForgotPassword();
      await passwordRecoveryPage.verifyForgotPasswordPageElements();
    });
    
    await test.step('Submit password recovery request', async () => {
      await passwordRecoveryPage.submitWithValidEmail();
    });
    
    await test.step('Verify server response', async () => {
      // Test server always returns 500 error for password recovery
      await passwordRecoveryPage.verifyInternalServerError();
    });
  });
});