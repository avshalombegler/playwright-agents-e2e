import { Download, Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DownloadPage extends BasePage {
  // Locators
  private secureDownloaderHeading: Locator;
  private downloadLinks: Locator;

  constructor(page: Page) {
    super(page);
    this.secureDownloaderHeading = this.page.getByRole('heading', {
      name: 'Secure File Downloader',
    });
    this.downloadLinks = this.page.locator('a[href*="download_secure/"]');
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
    await expect(this.downloadLinks.first()).toBeVisible();
  }

  /**
   * Download first available file
   */
  async downloadFirstAvailableFile(): Promise<Download> {
    const downloadPromise = this.waitForDownload();
    await this.clickElement(this.downloadLinks.first());
    return await downloadPromise;
  }

  /**
   * Verify file download
   */
  async verifyPdfDownload() {
    const download = await this.downloadFirstAvailableFile();
    const suggestedFilename = download.suggestedFilename();
    expect(suggestedFilename).toBeTruthy();
    expect(suggestedFilename.length).toBeGreaterThan(0);
    return download;
  }

  /**
   * Verify secure downloader heading
   */
  async verifySecureDownloaderHeading() {
    await expect(this.secureDownloaderHeading).toBeVisible();
  }

  /**
   * Verify download links are available
   */
  async verifyDownloadLinksAvailable() {
    await expect(this.downloadLinks).toHaveCount(1, { timeout: 10000 });
    await expect(this.downloadLinks.first()).toBeVisible();
  }

  /**
   * Get available download links
   */
  async getAvailableDownloadLinks() {
    return await this.downloadLinks.all();
  }

  /**
   * Get download link for specific file type
   */
  async getDownloadLinkByType(fileType: string): Promise<Locator> {
    return this.page.locator(`a[href*="download_secure/"][href*=".${fileType}"]`).first();
  }

  /**
   * Get total count of available downloads
   */
  async getDownloadCount(): Promise<number> {
    return await this.downloadLinks.count();
  }
}
