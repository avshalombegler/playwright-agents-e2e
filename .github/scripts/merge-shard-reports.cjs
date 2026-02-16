const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Merges Playwright shard reports by OS/browser combination
 * @param {string} allReportsDir - Directory containing all shard reports
 * @param {string} mergedReportsDir - Output directory for merged reports
 */
function mergeShardReports(allReportsDir, mergedReportsDir) {
  console.log('🔄 Starting report merge process...\n');

  // Define OS/browser combinations
  const combinations = [
    { os: 'ubuntu-latest', browser: 'chromium' },
    { os: 'ubuntu-latest', browser: 'firefox' },
    { os: 'ubuntu-latest', browser: 'webkit' },
    { os: 'windows-latest', browser: 'chromium' },
    { os: 'windows-latest', browser: 'firefox' },
    { os: 'macos-latest', browser: 'chromium' },
    { os: 'macos-latest', browser: 'firefox' },
    { os: 'macos-latest', browser: 'webkit' },
  ];

  // Ensure output directory exists
  if (!fs.existsSync(mergedReportsDir)) {
    fs.mkdirSync(mergedReportsDir, { recursive: true });
  }

  let successCount = 0;
  let failureCount = 0;

  for (const { os, browser } of combinations) {
    const comboName = `${os}-${browser}`;
    console.log(`📊 Processing: ${comboName}`);

    try {
      // Find all blob report directories for this combination
      const shardDirs = fs
        .readdirSync(allReportsDir)
        .filter(dir => {
          const pattern = `blob-report-${os}-${browser}-node20-shard`;
          return dir.startsWith(pattern);
        })
        .map(dir => path.join(allReportsDir, dir))
        .filter(dir => fs.statSync(dir).isDirectory());

      if (shardDirs.length === 0) {
        console.log(`  ⚠️  No blob reports found for ${comboName}`);
        failureCount++;
        continue;
      }

      console.log(`  📁 Found ${shardDirs.length} shard(s)`);

      // Create output directory for merged report
      const mergedDir = path.join(mergedReportsDir, `${os}-${browser}`);
      fs.mkdirSync(mergedDir, { recursive: true });

      // Create a temporary directory to consolidate all shards
      const tempCombinedDir = path.join(process.cwd(), 'temp-blob-reports', comboName);
      fs.mkdirSync(tempCombinedDir, { recursive: true });

      // Copy all shard blob reports into the temp directory
      console.log(`  🔀 Consolidating ${shardDirs.length} shards...`);
      for (const shardDir of shardDirs) {
        const shardFiles = fs.readdirSync(shardDir);
        for (const file of shardFiles) {
          const src = path.join(shardDir, file);
          const dest = path.join(tempCombinedDir, file);
          // Skip if already exists (shouldn't happen, but just in case)
          if (!fs.existsSync(dest)) {
            fs.copyFileSync(src, dest);
          }
        }
      }

      // Merge blob reports and generate HTML
      console.log(`  📊 Generating HTML report...`);
      execSync(`npx playwright merge-reports --reporter html "${tempCombinedDir}"`, {
        stdio: 'inherit',
        cwd: process.cwd(),
      });

      // Clean up temp directory
      fs.rmSync(tempCombinedDir, { recursive: true, force: true });

      // Move merged report to output directory
      const tempReportDir = path.join(process.cwd(), 'playwright-report');
      if (fs.existsSync(tempReportDir)) {
        const files = fs.readdirSync(tempReportDir);
        for (const file of files) {
          const src = path.join(tempReportDir, file);
          const dest = path.join(mergedDir, file);
          fs.renameSync(src, dest);
        }
        fs.rmdirSync(tempReportDir);
      }

      // Create metadata file
      const metadata = {
        os,
        browser,
        nodeVersion: '20',
        shards: '1-4 (merged)',
        shardsCount: shardDirs.length,
        timestamp: new Date().toISOString(),
        gitRef: process.env.GITHUB_REF || 'unknown',
        runId: process.env.GITHUB_RUN_ID || 'unknown',
      };

      fs.writeFileSync(path.join(mergedDir, 'matrix-info.json'), JSON.stringify(metadata, null, 2));

      console.log(`  ✅ Successfully merged report for ${comboName}\n`);
      successCount++;
    } catch (error) {
      console.error(`  ❌ Failed to merge ${comboName}:`, error.message);

      // Clean up temp directory on failure
      const tempCombinedDir = path.join(process.cwd(), 'temp-blob-reports', comboName);
      if (fs.existsSync(tempCombinedDir)) {
        fs.rmSync(tempCombinedDir, { recursive: true, force: true });
      }

      failureCount++;
    }
  }

  // Clean up temp directory
  const tempParentDir = path.join(process.cwd(), 'temp-blob-reports');
  if (fs.existsSync(tempParentDir)) {
    fs.rmSync(tempParentDir, { recursive: true, force: true });
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`📈 Merge Summary:`);
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${failureCount}`);
  console.log(`   📊 Total combinations: ${combinations.length}`);
  console.log('='.repeat(50) + '\n');

  if (failureCount > 0) {
    console.warn(`⚠️  Warning: ${failureCount} combination(s) failed to merge`);
    // Don't exit with error - allow partial success
  }

  return { successCount, failureCount };
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: node merge-shard-reports.cjs <all-reports-dir> <merged-reports-dir>');
    process.exit(1);
  }

  const [allReportsDir, mergedReportsDir] = args;

  if (!fs.existsSync(allReportsDir)) {
    console.error(`❌ Error: Directory not found: ${allReportsDir}`);
    process.exit(1);
  }

  mergeShardReports(allReportsDir, mergedReportsDir);
}

module.exports = { mergeShardReports };
