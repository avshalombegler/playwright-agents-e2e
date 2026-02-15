import { expect, Locator, Page } from '@playwright/test';
import { Logger } from './logger';

/**
 * Custom assertions to extend Playwright's built-in assertions
 * with domain-specific validation logic
 */
export class CustomAssertions {
  
  /**
   * Assert element has success styling/state
   */
  static async toHaveSuccessMessage(locator: Locator, message?: string) {
    const assertionMessage = message || 'Element should have success state';
    
    await expect(locator).toBeVisible();
    
    // Check for common success indicators
    const hasSuccessClass = await locator.getAttribute('class');
    const successPattern = /success|valid|correct|ok|pass/i;
    
    if (hasSuccessClass && successPattern.test(hasSuccessClass)) {
      await expect(locator).toHaveClass(successPattern);
    } else {
      // Check text content for success keywords
      const textContent = await locator.textContent();
      const successKeywords = /success|succeed|successful|congratulations|welcome|logged in|authenticated|correct|valid/i;
      
      if (textContent && successKeywords.test(textContent)) {
        expect(textContent, assertionMessage).toMatch(successKeywords);
      } else {
        // Check for green color styling
        const styles = await locator.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return [computed.color, computed.backgroundColor, computed.borderColor];
        });
        
        const isGreenish = styles.some(style => 
          style.includes('green') || style.includes('rgb(0, 128, 0)') || style.includes('rgb(34, 139, 34)')
        );
        
        expect(isGreenish, assertionMessage).toBeTruthy();
      }
    }
  }

  /**
   * Assert element has error styling/state
   */
  static async toHaveErrorMessage(locator: Locator, message?: string) {
    const assertionMessage = message || 'Element should have error state';
    
    await expect(locator).toBeVisible();
    
    // Check for common error indicators
    const hasErrorClass = await locator.getAttribute('class');
    const errorPattern = /error|invalid|fail|danger|warn/i;
    
    if (hasErrorClass && errorPattern.test(hasErrorClass)) {
      await expect(locator).toHaveClass(errorPattern);
    } else {
      // Check text content for error keywords
      const textContent = await locator.textContent();
      const errorKeywords = /error|invalid|failed|incorrect|wrong|denied|unauthorized|not authorized/i;
      
      if (textContent && errorKeywords.test(textContent)) {
        expect(textContent, assertionMessage).toMatch(errorKeywords);
      } else {
        // Check for red color styling
        const styles = await locator.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return [computed.color, computed.backgroundColor, computed.borderColor];
        });
        
        const isRedish = styles.some(style => 
          style.includes('red') || style.includes('rgb(255, 0, 0)') || style.includes('rgb(220, 20, 60)')
        );
        
        expect(isRedish, assertionMessage).toBeTruthy();
      }
    }
  }

  /**
   * Assert page has loaded completely
   */
  static async toBeFullyLoaded(page: Page, timeout: number = 30000) {
    // Wait for network to be idle
    await page.waitForLoadState('networkidle', { timeout });
    
    // Wait for any pending DOM mutations
    await page.waitForLoadState('domcontentloaded', { timeout });
    
    // Check that page is not showing loading indicators
    const loadingIndicators = page.locator('[data-loading], .loading, .spinner, [aria-label*="loading" i]');
    const hasLoading = await loadingIndicators.count();
    
    if (hasLoading > 0) {
      await expect(loadingIndicators.first()).not.toBeVisible({ timeout });
    }
  }

  /**
   * Assert URL matches expected pattern
   */
  static async toHaveUrlPattern(page: Page, pattern: string | RegExp, message?: string) {
    const assertionMessage = message || `URL should match pattern: ${pattern}`;
    const currentUrl = page.url();
    
    if (typeof pattern === 'string') {
      expect(currentUrl, assertionMessage).toContain(pattern);
    } else {
      expect(currentUrl, assertionMessage).toMatch(pattern);
    }
  }

  /**
   * Assert form validation state
   */
  static async toHaveValidFormState(formLocator: Locator, expectedState: 'valid' | 'invalid') {
    const assertionMessage = `Form should be in ${expectedState} state`;
    await expect(formLocator).toBeVisible();
    
    // Check HTML5 validity
    const isFormValid = await formLocator.evaluate((form) => {
      if (form instanceof HTMLFormElement) {
        return form.checkValidity();
      }
      return true;
    });
    
    if (expectedState === 'valid') {
      expect(isFormValid, assertionMessage).toBeTruthy();
    } else {
      expect(isFormValid, assertionMessage).toBeFalsy();
    }
  }

  /**
   * Assert element is accessible (basic accessibility check)
   */
  static async toBeAccessible(locator: Locator, message?: string) {
    const assertionMessage = message || 'Element should be accessible';
    await expect(locator).toBeVisible();
    
    const element = locator.first();
    
    // Get element details for accessibility check
    const elementInfo = await element.evaluate((el) => {
      return {
        tagName: el.tagName.toLowerCase(),
        hasAriaLabel: el.hasAttribute('aria-label'),
        hasAriaLabelledBy: el.hasAttribute('aria-labelledby'),
        hasTitle: el.hasAttribute('title'),
        hasAltText: el.hasAttribute('alt'),
        isFormElement: ['input', 'button', 'select', 'textarea'].includes(el.tagName.toLowerCase()),
        hasLabel: el.tagName.toLowerCase() === 'input' && 
                 document.querySelector(`label[for="${el.id}"]`) !== null
      };
    });
    
    // Basic accessibility validations
    if (elementInfo.isFormElement) {
      let hasAccessibleName = elementInfo.hasAriaLabel || 
                             elementInfo.hasAriaLabelledBy || 
                             elementInfo.hasLabel ||
                             elementInfo.hasTitle;
      
      // For buttons, also check if they have meaningful text content
      if (!hasAccessibleName && elementInfo.tagName === 'button') {
        const textContent = await element.textContent();
        hasAccessibleName = !!(textContent && textContent.trim().length > 0);
      }
      
      expect(hasAccessibleName, `${assertionMessage} - Form element needs accessible name`).toBeTruthy();
    }
    
    if (elementInfo.tagName === 'img') {
      expect(elementInfo.hasAltText, `${assertionMessage} - Image needs alt text`).toBeTruthy();
    }
  }

  /**
   * Assert download was successful
   */
  static async toHaveDownloadedFile(download: any, expectedFilename?: string | RegExp) {
    expect(download, 'Download should exist').toBeTruthy();
    
    if (expectedFilename) {
      const actualFilename = download.suggestedFilename();
      
      if (typeof expectedFilename === 'string') {
        expect(actualFilename, 'Downloaded filename should match').toBe(expectedFilename);
      } else {
        expect(actualFilename, 'Downloaded filename should match pattern').toMatch(expectedFilename);
      }
    }
  }

  /**
   * Assert performance metrics meet thresholds
   */
  static async toMeetPerformanceThresholds(
    page: Page, 
    thresholds: {
      loadTime?: number;
      domContentLoaded?: number;
      firstContentfulPaint?: number;
    }
  ) {
    const performanceMetrics = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: perfData.loadEventEnd - perfData.fetchStart,
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
        firstContentfulPaint: performance.getEntriesByType('paint')
          .find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
      };
    });
    
    if (thresholds.loadTime) {
      expect(performanceMetrics.loadTime, 
        `Load time ${performanceMetrics.loadTime}ms should be under ${thresholds.loadTime}ms`)
        .toBeLessThan(thresholds.loadTime);
    }
    
    if (thresholds.domContentLoaded) {
      expect(performanceMetrics.domContentLoaded,
        `DOM Content Loaded ${performanceMetrics.domContentLoaded}ms should be under ${thresholds.domContentLoaded}ms`)
        .toBeLessThan(thresholds.domContentLoaded);
    }
  }
}