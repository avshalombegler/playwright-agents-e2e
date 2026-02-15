import { pageTest as test, expect } from '../../fixtures';

test.describe('Secure File Download', () => {
  test('Secure Download without Authentication', async ({ downloadPage, page }) => {
    await downloadPage.navigateToSecureDownload();
    await expect(page.getByText('Not authorized')).toBeVisible();
  });
});