const { test, expect } = require('@playwright/test');

// Helper to emulate barcode scan (fast keypresses ending with Enter)
async function emulateBarcodeScan(page, barcode) {
  for (const char of barcode) {
    await page.keyboard.press(char);
    await page.waitForTimeout(10); // fast typing
  }
  await page.keyboard.press('Enter');
}

// test.use({ launchOptions: { slowMo: 100 } });

test.describe('Barcode Scan Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + require('path').resolve(__dirname, 'index.html'));
  });

  test('navigates iframe to scanned URL', async ({ page }) => {
    const testUrl = 'https://example.com';
    await emulateBarcodeScan(page, testUrl);
    const frame = await page.locator('#browser-frame');
    await expect(frame).toBeVisible();
    await expect(frame).toHaveAttribute('src', testUrl);
    const lastScan = await page.locator('#last-scan').textContent();
    expect(lastScan).toContain(testUrl);
  });

  test('does not navigate for short input', async ({ page }) => {
    await emulateBarcodeScan(page, 'abc');
    const frame = await page.locator('#browser-frame');
    await expect(frame).toBeHidden();
  });

  test('can navigate multiple times', async ({ page }) => {
    const url1 = 'https://example.com';
    const url2 = 'https://playwright.dev';
    await emulateBarcodeScan(page, url1);
    await expect(page.locator('#browser-frame')).toHaveAttribute('src', url1);
    // await page.frameLocator('#browser-frame').frameLocator('').waitForLoadState('load');
    await page.waitForTimeout(3000);
    await emulateBarcodeScan(page, url2);
    await expect(page.locator('#browser-frame')).toHaveAttribute('src', url2);
    await page.waitForTimeout(3000);
  });
});
