import { pageTest as test, expect } from '../fixtures';
import { TestData } from '../utils';

test.describe('Seed / Global Setup', () => {
  test('Navigate to the-internet.herokuapp.com and verify landing page', async ({ page, loginPage }) => {
    // Navigate to base URL using utilities
    await page.goto(TestData.BASE_URL);

    // Verify landing page title and content
    await expect(page).toHaveTitle(/The Internet/);
    await expect(page.getByRole('heading', { name: 'Welcome to the-internet' })).toBeVisible();

    // Additional verification that key pages are accessible
    await loginPage.navigateToLogin();
    await loginPage.verifyLoginPageDisplayed();
  });
});