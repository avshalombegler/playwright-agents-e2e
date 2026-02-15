import { pageTest as test, expect } from '../../fixtures';

test.describe('Basic Authentication', () => {
  test('Invalid Basic Auth Credentials', async ({ basicAuthPage, page }) => {
    await test.step('Navigate with invalid basic auth credentials', async () => {
      await basicAuthPage.navigateWithInvalidCredentials();
    });
    
    await test.step('Verify unauthorized access message', async () => {
      await expect(page.getByText('Not authorized')).toBeVisible();
    });
  });
});