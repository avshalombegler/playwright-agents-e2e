import { Page, Download } from '@playwright/test';

/**
 * File download utilities
 */
export class DownloadUtils {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Download file and return download object
   */
  async downloadFile(linkSelector: string): Promise<Download> {
    const downloadPromise = this.page.waitForEvent('download');
    await this.page.locator(linkSelector).click();
    return await downloadPromise;
  }

  /**
   * Download file by link text
   */
  async downloadFileByLinkText(linkText: string): Promise<Download> {
    const downloadPromise = this.page.waitForEvent('download');
    await this.page.getByRole('link', { name: linkText }).click();
    return await downloadPromise;
  }

  /**
   * Verify download properties
   */
  async verifyDownload(download: Download, expectedFilename?: string): Promise<boolean> {
    try {
      const filename = download.suggestedFilename();
      
      if (expectedFilename && filename !== expectedFilename) {
        return false;
      }

      // Additional download verification could include:
      // - File size validation
      // - Content type validation
      // - Saving and reading file content
      
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Save download to specific path
   */
  async saveDownload(download: Download, path: string): Promise<void> {
    await download.saveAs(path);
  }

  /**
   * Get download failure reason if any
   */
  async getDownloadFailureReason(download: Download): Promise<string | null> {
    try {
      await download.failure();
      return 'Download failed';
    } catch (error) {
      return error instanceof Error ? error.message : 'Unknown download error';
    }
  }
}