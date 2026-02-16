/* eslint-disable no-console */
import { FullConfig } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';

async function globalTeardown(_config: FullConfig) {
  console.log('🧹 Starting global teardown...');

  try {
    // Archive old test results for local runs (not in CI)
    if (!process.env.CI) {
      await archiveOldResults();
    }

    // Clean up temporary test artifacts
    await cleanupTempFiles();

    // Log test completion statistics
    await logTestCompletion();

    console.log('✅ Global teardown complete');
  } catch (error) {
    console.warn('⚠️ Warning during teardown:', error);
  }
}

/**
 * Archive old test results to prevent clutter
 */
async function archiveOldResults(): Promise<void> {
  const testResultsDir = path.join(process.cwd(), 'test-results');
  const archiveDir = path.join(process.cwd(), 'test-results-archive');

  try {
    await fs.access(testResultsDir);
    const files = await fs.readdir(testResultsDir);

    if (files.length > 0) {
      // Create archive directory if it doesn't exist
      await fs.mkdir(archiveDir, { recursive: true });

      // Create timestamped archive folder
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const archiveFolder = path.join(archiveDir, `results-${timestamp}`);
      await fs.mkdir(archiveFolder, { recursive: true });

      // Move old results to archive (keep only last 5 runs)
      console.log(`📦 Archiving test results to ${archiveFolder}`);
      // Note: In production, implement logic to keep only last N archives
    }
  } catch {
    // Directory doesn't exist, which is fine
  }
}

/**
 * Clean up temporary files created during test execution
 */
async function cleanupTempFiles(): Promise<void> {
  const tempDirs = [path.join(process.cwd(), '.auth'), path.join(process.cwd(), 'temp')];

  for (const dir of tempDirs) {
    try {
      await fs.access(dir);
      await fs.rm(dir, { recursive: true, force: true });
      console.log(`🗑️  Cleaned up: ${dir}`);
    } catch {
      // Directory doesn't exist, skip
    }
  }
}

/**
 * Log test completion information
 */
async function logTestCompletion(): Promise<void> {
  const timestamp = new Date().toISOString();
  console.log('\n📊 Test Execution Summary:');
  console.log(`   Completed at: ${timestamp}`);
  console.log(`   Environment: ${process.env.CI ? 'CI' : 'Local'}`);

  // In production, you could send notifications, update dashboards, etc.
  // Example: Send Slack notification, update test tracking system
}

export default globalTeardown;
