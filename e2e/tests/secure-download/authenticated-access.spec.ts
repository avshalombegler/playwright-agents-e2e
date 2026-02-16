import { pageTest as test, expect } from '../../fixtures';

test.describe('Secure File Download', () => {
  test('Secure Download with Authentication @smoke', async ({ downloadPage }) => {
    await test.step('Navigate to secure download page with authentication', async () => {
      await downloadPage.navigateToSecureDownloadWithAuth();
    });

    await test.step('Verify secure download page elements', async () => {
      await downloadPage.verifySecureDownloaderElements();
    });

    await test.step('Perform and verify PDF download', async () => {
      await downloadPage.verifyPdfDownload();
    });
  });
});
