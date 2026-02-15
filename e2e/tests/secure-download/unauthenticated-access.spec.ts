import { pageTest as test, expect } from '../../fixtures';

test.describe('Secure File Download', () => {
  test('Secure Download without Authentication', async ({ downloadPage, page }) => {
    await test.step('Navigate to secure download page without authentication', async () => {
      await downloadPage.navigateToSecureDownload();
    });

    await test.step('Verify unauthorized access message', async () => {
      await expect(page.getByText('Not authorized')).toBeVisible();
    });
  });
});
