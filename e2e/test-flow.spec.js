import { test, expect } from '@playwright/test';

test.describe('BeweisGuard E2E Tests', () => {
  test('should display home page and navigate to test', async ({ page }) => {
    await page.goto('/beweisguard/');
    
    // Check title and test buttons
    await expect(page.locator('h1')).toContainText('BeweisGuard');
    await expect(page.locator('h2')).toContainText('Polizei Asservatestelle Übungstest');
    await expect(page.getByRole('button', { name: /Test A/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Test B/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Test C/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Test D/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Test E/ })).toBeVisible();
    
    // Check 43 questions per test
    await expect(page.getByText('43 Fragen').first()).toBeVisible();
    
    // Select Test A
    await page.getByRole('button', { name: /Test A/ }).click();
    
    // Verify test info page
    await expect(page.getByText('Testinformationen')).toBeVisible();
    await expect(page.getByText(/Anzahl der Fragen: 43/)).toBeVisible();
    
    // Start test
    await page.getByRole('button', { name: /Test starten/ }).click();
    
    // Verify first question and category badge
    await expect(page.getByText(/Frage 1 von 43/)).toBeVisible();
    const categoryBadge = page.locator('.category-badge');
    await expect(categoryBadge).toBeVisible();
  });

  test('should navigate between questions', async ({ page }) => {
    await page.goto('/beweisguard/');
    await page.getByRole('button', { name: /Test A/ }).click();
    await page.getByRole('button', { name: /Test starten/ }).click();
    
    // Answer first question
    await page.getByRole('button', { name: /A / }).first().click();
    
    // Go to next question
    await page.getByRole('button', { name: /Weiter/ }).click();
    await expect(page.getByText(/Frage 2 von 43/)).toBeVisible();
    
    // Go back to first question
    await page.getByRole('button', { name: /Zurück/ }).click();
    await expect(page.getByText(/Frage 1 von 43/)).toBeVisible();
  });
});
