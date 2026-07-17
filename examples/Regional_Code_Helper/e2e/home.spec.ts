import { test, expect } from '@playwright/test';

test.describe('Home Page functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the home page before each test
    await page.goto('/');
  });

  test('should display the main layout and elements', async ({ page }) => {
    // Expect a title "Sarvam Talk"
    await expect(page.locator('h1')).toContainText('Sarvam Talk');

    // Check if the Explanation placeholder is visible
    await expect(page.locator('text=Ready to Explain')).toBeVisible();

    // Check if Settings button exists
    const settingsButton = page.locator('button', { hasText: 'Settings' });
    await expect(settingsButton).toBeVisible();
  });

  test('should open settings modal and allow key entry', async ({ page }) => {
    await page.locator('button', { hasText: 'Settings' }).click();

    // Modal should be visible
    await expect(page.locator('h2', { hasText: 'API Settings' })).toBeVisible();

    // Fill the key input
    await page.fill('input[type="password"]', 'test-api-key');

    // Click save
    await page.locator('button', { hasText: 'Save Settings' }).click();

    // Modal should close
    await expect(page.locator('h2', { hasText: 'API Settings' })).not.toBeVisible();
  });
});
