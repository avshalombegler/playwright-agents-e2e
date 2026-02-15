import { pageTest as test, expect } from '../../fixtures';

test.describe('Basic Authentication', () => {
  test('Invalid Basic Auth Credentials', async ({ basicAuthPage, page }) => {
    await basicAuthPage.navigateWithInvalidCredentials();
    await expect(page.getByText('Not authorized')).toBeVisible();
  });
});