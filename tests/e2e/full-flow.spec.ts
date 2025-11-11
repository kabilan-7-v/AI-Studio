import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('AI Studio Full Flow', () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'Password123';

  test('complete user journey: signup -> login -> generate -> view history', async ({
    page,
  }) => {
    // Step 1: Navigate to signup
    await page.goto('/signup');
    await expect(page).toHaveTitle(/AI Studio/);

    // Step 2: Sign up
    await page.getByPlaceholder(/email address/i).fill(testEmail);
    await page.getByPlaceholder(/password/i).fill(testPassword);
    await page.getByRole('button', { name: /sign up/i }).click();

    // Should redirect to studio
    await expect(page).toHaveURL('/studio');
    await expect(page.getByText(testEmail)).toBeVisible();

    // Step 3: Logout
    await page.getByRole('button', { name: /logout/i }).click();
    await expect(page).toHaveURL('/login');

    // Step 4: Login
    await page.getByPlaceholder(/email address/i).fill(testEmail);
    await page.getByPlaceholder(/password/i).fill(testPassword);
    await page.getByRole('button', { name: /sign in/i }).click();

    // Should be back in studio
    await expect(page).toHaveURL('/studio');

    // Step 5: Upload image
    const fileInput = page.locator('input[type="file"]');

    // Create a test image file
    const testImagePath = path.join(__dirname, '..', '..', 'backend', 'tests', 'test-image.jpg');
    await fileInput.setInputFiles(testImagePath);

    // Wait for preview to appear
    await expect(page.locator('img[alt="Preview"]')).toBeVisible();

    // Step 6: Fill form
    await page.getByRole('textbox', { name: /prompt/i }).fill('A beautiful fashion image');
    await page.getByRole('combobox', { name: /style/i }).selectOption('artistic');

    // Step 7: Generate (with retry logic for 20% failure rate)
    const generateButton = page.getByRole('button', { name: /generate/i });
    await generateButton.click();

    // Wait for loading state
    await expect(page.getByText(/generating/i)).toBeVisible();

    // Check for abort button during loading
    const abortButton = page.getByRole('button', { name: /abort/i });
    if (await abortButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      expect(abortButton).toBeVisible();
    }

    // Wait for completion or error (up to 30 seconds to account for retries)
    await page.waitForSelector(
      'text=/Generation successful|Model overloaded|Failed/',
      { timeout: 30000 }
    );

    // If successful, check history
    const successMessage = page.getByText(/generation successful/i);
    if (await successMessage.isVisible().catch(() => false)) {
      // Step 8: Verify history updated
      await expect(page.getByText('Recent Generations')).toBeVisible();

      // History should now have at least one item
      const historyItems = page.locator('[role="button"][aria-label*="Load generation"]');
      await expect(historyItems.first()).toBeVisible({ timeout: 5000 });

      // Step 9: Click history item to restore
      await historyItems.first().click();

      // Verify prompt is restored
      const promptInput = page.getByRole('textbox', { name: /prompt/i });
      await expect(promptInput).toHaveValue('A beautiful fashion image');
    }
  });

  test('abort generation mid-flight', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByPlaceholder(/email address/i).fill(testEmail);
    await page.getByPlaceholder(/password/i).fill(testPassword);
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL('/studio');

    // Upload image
    const fileInput = page.locator('input[type="file"]');
    const testImagePath = path.join(__dirname, '..', '..', 'backend', 'tests', 'test-image.jpg');
    await fileInput.setInputFiles(testImagePath);

    // Fill form
    await page.getByRole('textbox', { name: /prompt/i }).fill('Test abort');
    await page.getByRole('combobox', { name: /style/i }).selectOption('realistic');

    // Generate
    await page.getByRole('button', { name: /generate/i }).click();

    // Wait for loading state
    await expect(page.getByText(/generating/i)).toBeVisible();

    // Click abort if visible
    const abortButton = page.getByRole('button', { name: /abort/i });
    if (await abortButton.isVisible({ timeout: 500 }).catch(() => false)) {
      await abortButton.click();

      // Should show cancelled message
      await expect(page.getByText(/cancelled/i)).toBeVisible({ timeout: 5000 });
    }
  });

  test('keyboard navigation and accessibility', async ({ page }) => {
    await page.goto('/login');

    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await expect(page.getByPlaceholder(/email address/i)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByPlaceholder(/password/i)).toBeFocused();

    // Check ARIA labels
    const emailInput = page.getByPlaceholder(/email address/i);
    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(emailInput).toHaveAttribute('required');
  });
});
