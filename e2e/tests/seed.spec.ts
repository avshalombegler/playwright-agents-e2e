import { pageTest as test, expect } from '../fixtures';
import { Logger, CustomAssertions } from '../utils';
import { getEnvironmentConfig } from '../config';

test.describe('Seed / Global Setup', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    Logger.initializeForTest(page, testInfo);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await Logger.cleanupAfterTest(page, testInfo);
  });

  test('Navigate to the-internet.herokuapp.com and verify landing page', async ({ page, loginPage }, testInfo) => {
    Logger.step('Starting application connectivity and landing page verification');
    
    // Navigate to base URL using utilities
    Logger.step('Navigating to application base URL');
    await page.goto(getEnvironmentConfig().baseURL);
    
    // Verify page loads completely
    await CustomAssertions.toBeFullyLoaded(page);

    // Verify landing page title and content
    Logger.step('Verifying landing page title and content');
    await expect(page).toHaveTitle(/The Internet/);
    
    const welcomeHeading = page.getByRole('heading', { name: 'Welcome to the-internet' });
    await expect(welcomeHeading).toBeVisible();
    await CustomAssertions.toBeAccessible(welcomeHeading, 'Welcome heading should be accessible');
    
    // Performance check for landing page
    await CustomAssertions.toMeetPerformanceThresholds(page, {
      loadTime: 5000
    });

    // Additional verification that key pages are accessible
    Logger.step('Verifying key application pages are accessible');
    await loginPage.navigateToLogin();
    await CustomAssertions.toBeFullyLoaded(page);
    await loginPage.verifyLoginPageDisplayed();
    
    // Take screenshot for documentation
    await Logger.screenshot(page, 'application_landing_page', { 
      testInfo, 
      fullPage: true 
    });
    
    Logger.result(true, 'Application connectivity and landing page verification completed successfully');
  });
});