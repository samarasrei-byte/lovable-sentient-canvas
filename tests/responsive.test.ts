import { test, expect } from '@playwright/test';

test.describe('Responsive Layout Verification', () => {
  const routes = ['/', '/login', '/termos', '/privacidade'];

  for (const route of routes) {
    test(`Verify no horizontal scroll on ${route}`, async ({ page }) => {
      await page.goto(route);
      // Wait for lazy images/content to stabilize
      await page.waitForTimeout(1000);
      
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasHorizontalScroll, `Horizontal scroll detected on ${route}`).toBe(false);
    });

    test(`Capture screenshot on ${route}`, async ({ page }, testInfo) => {
      await page.goto(route);
      await page.waitForTimeout(500);
      await page.screenshot({ 
        path: `tests/screenshots/${testInfo.project.name.replace(/\s+/g, '-')}-${route.replace(/\//g, 'home')}.png`,
        fullPage: true 
      });
    });
  }
});
