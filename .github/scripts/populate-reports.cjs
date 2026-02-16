const fs = require('fs');
const path = require('path');

/**
 * Populates the index.html file with available test reports and statistics
 * @param {string} reportsDir - Path to the reports directory
 */
function populateReports(reportsDir = 'final-report') {
  let reportCards = '';
  let totalReports = 0;
  let lastRunTime = null;

  console.log(`🔍 Scanning for reports in: ${reportsDir}`);

  if (!fs.existsSync(reportsDir)) {
    console.log(`❌ Reports directory not found: ${reportsDir}`);
    return;
  }

  const items = fs.readdirSync(reportsDir);

  items.forEach(item => {
    const itemPath = path.join(reportsDir, item);
    const indexPath = path.join(itemPath, 'index.html');

    // Check if this is a valid report directory
    if (fs.statSync(itemPath).isDirectory() && fs.existsSync(indexPath)) {
      totalReports++;
      console.log(`📊 Found report: ${item}`);

      let matrixInfo = {};
      const metaPath = path.join(itemPath, 'matrix-info.json');

      // Try to read matrix metadata
      if (fs.existsSync(metaPath)) {
        try {
          matrixInfo = JSON.parse(fs.readFileSync(metaPath, 'utf8'));

          // Track the latest run time
          if (matrixInfo.timestamp) {
            const runTime = new Date(matrixInfo.timestamp);
            if (!lastRunTime || runTime > lastRunTime) {
              lastRunTime = runTime;
            }
          }
        } catch (e) {
          console.log(`⚠️ Could not parse matrix info for ${item}:`, e.message);
        }
      }

      // Generate display name
      const displayName =
        matrixInfo.os && matrixInfo.browser
          ? `${matrixInfo.os} - ${matrixInfo.browser} (Node ${matrixInfo.nodeVersion})`
          : item;

      // Format timestamp in Israeli format for consistency
      const timestampDisplay = matrixInfo.timestamp
        ? new Date(matrixInfo.timestamp).toLocaleString('he-IL', {
            timeZone: 'Asia/Jerusalem',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
        : '';

      // Generate HTML card for this report
      reportCards += `
        <div class="report-card">
          <div class="report-title">${displayName}</div>
          <div class="report-meta">
            ${timestampDisplay ? `Generated: ${timestampDisplay}` : ''}
          </div>
          <a href="${item}/index.html" class="report-link">View Report</a>
        </div>
      `;
    }
  });

  // Update the index.html file
  const indexPath = path.join(reportsDir, 'index.html');

  if (!fs.existsSync(indexPath)) {
    console.log(`❌ Index template not found: ${indexPath}`);
    return;
  }

  console.log(`📝 Updating index file: ${indexPath}`);

  let indexContent = fs.readFileSync(indexPath, 'utf8');

  // Replace the empty report grid with generated cards
  indexContent = indexContent.replace(
    '<div class="report-grid" id="reportGrid">',
    `<div class="report-grid" id="reportGrid">${reportCards}`
  );

  // Update total reports stat
  indexContent = indexContent.replace(
    '<span class="stat-value" id="totalReports">0</span>',
    `<span class="stat-value" id="totalReports">${totalReports}</span>`
  );

  // Format and update last run time in Israeli format
  const lastRunDisplay = lastRunTime
    ? lastRunTime.toLocaleString('he-IL', {
        timeZone: 'Asia/Jerusalem',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    : '-';

  indexContent = indexContent.replace(
    '<span class="stat-value" id="lastRun">-</span>',
    `<span class="stat-value" id="lastRun">${lastRunDisplay}</span>`
  );

  // Write the updated content back to the file
  fs.writeFileSync(indexPath, indexContent);

  // Log summary
  console.log(`✅ Successfully populated index with ${totalReports} reports`);
  console.log(`📊 Stats: Total Reports: ${totalReports}, Last Run: ${lastRunDisplay}`);

  if (totalReports === 0) {
    console.log('⚠️ No reports found. Make sure the matrix jobs completed successfully.');
  }
}

// Run the function if this script is executed directly
if (require.main === module) {
  const reportsDir = process.argv[2] || 'final-report';
  populateReports(reportsDir);
}

module.exports = { populateReports };
