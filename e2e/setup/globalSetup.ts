import { FullConfig } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';

async function globalSetup(_config: FullConfig) {
  // Only clear screenshots on local runs (not in CI)
  if (!process.env.CI) {
    const screenshotsDir = path.join(process.cwd(), 'screenshots');

    try {
      // Check if screenshots directory exists
      await fs.access(screenshotsDir);

      // Clear all files in the screenshots directory
      const files = await fs.readdir(screenshotsDir);
      const deletePromises = files.map(file => fs.unlink(path.join(screenshotsDir, file)));

      await Promise.all(deletePromises);
      // eslint-disable-next-line no-console
      console.log('🧹 Screenshots folder cleared for local test run');
    } catch (error) {
      // Directory doesn't exist or is already empty, which is fine
      if ((error as NodeJS.ErrnoException)?.code !== 'ENOENT') {
        // eslint-disable-next-line no-console
        console.warn('Warning: Could not clear screenshots folder:', error);
      }
    }
  }
}

export default globalSetup;
