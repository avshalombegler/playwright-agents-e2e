import { pageTest as test, expect } from '../../fixtures';

test.describe('Secure File Download', () => {
  test('Secure Download with Authentication', async ({ downloadPage }) => {
    await downloadPage.navigateToSecureDownloadWithAuth();
    await downloadPage.verifySecureDownloaderElements();
    await downloadPage.verifyPdfDownload();
  });
});