import { Page, Locator, expect, Download } from '@playwright/test';
import { BasePage } from './BasePage';

export class DownloadPage extends BasePage {
  // Locators
  private secureDownloaderHeading: Locator;
  private testPdfLink: Locator;

  constructor(page: Page) {
    super(page);
    this.secureDownloaderHeading = this.page.getByRole('heading', {
      name: 'Secure File Downloader',
    });
    this.testPdfLink = this.page.getByRole('link', { name: 'test-file.txt' });
  }

  /**
   * Navigate to secure download page with authentication
   */
  async navigateToSecureDownloadWithAuth() {
    await this.gotoWithAuth('/download_secure', 'admin', 'admin');
  }

  /**
   * Navigate to secure download page without authentication
   */
  async navigateToSecureDownload() {
    await this.goto('/download_secure');
  }

  /**
   * Verify secure downloader page elements
   */
  async verifySecureDownloaderElements() {
    await expect(this.secureDownloaderHeading).toBeVisible();
    await expect(this.testPdfLink).toBeVisible();
  }

  /**
   * Download test PDF file
   */
  async downloadTestPdf(): Promise<Download> {
    const downloadPromise = this.waitForDownload();
    await this.clickElement(this.testPdfLink);
    return await downloadPromise;
  }

  /**
   * Verify PDF download
   */
  async verifyPdfDownload() {
    const download = await this.downloadTestPdf();
    expect(download.suggestedFilename()).toBe('test-file.txt');
    return download;
  }

  /**
   * Verify secure downloader heading
   */
  async verifySecureDownloaderHeading() {
    await expect(this.secureDownloaderHeading).toBeVisible();
  }

  /**
   * Verify test PDF link is available
   */
  async verifyTestPdfLinkAvailable() {
    await expect(this.testPdfLink).toBeVisible();
  }

  /**
   * Get available download links
   */
  async getAvailableDownloadLinks() {
    return await this.page.locator('a[href*=".pdf"], a[href*=".txt"], a[href*=".doc"]').all();
  }
}
