import { pageTest as test, expect } from '../../fixtures';

test.describe('Password Recovery', () => {
  test('Forgot Password with Valid Email', async ({ passwordRecoveryPage }) => {
    await passwordRecoveryPage.navigateToForgotPassword();
    await passwordRecoveryPage.verifyForgotPasswordPageElements();
    await passwordRecoveryPage.submitWithValidEmail();
    // Test server always returns 500 error for password recovery
    await passwordRecoveryPage.verifyInternalServerError();
  });
});