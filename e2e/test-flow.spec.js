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

  test('should complete test and show results', async ({ page }) => {
    await page.goto('/beweisguard/');
    await page.getByRole('button', { name: /Test A/ }).click();
    await page.getByRole('button', { name: /Test starten/ }).click();
    
    // Answer a few questions quickly
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: /A / }).first().click();
      await page.getByRole('button', { name: /Weiter/ }).click();
    }
    
    // Jump to last question using direct URL manipulation
    await page.evaluate(() => {
      const questions = document.querySelectorAll('.indicator-dot');
      if (questions.length > 0) {
        questions[questions.length - 1].click();
      }
    });
    
    // Wait for last question to load
    await page.waitForTimeout(500);
    
    // Answer last question
    await page.getByRole('button', { name: /A / }).first().click();
    
    // Submit test
    await page.getByRole('button', { name: /Test abschließen/ }).click();
    
    // Verify results page
    await expect(page.getByText('Testergebnis')).toBeVisible();
    await expect(page.locator('.score-percentage')).toBeVisible();
    await expect(page.getByText('Fragen-Übersicht')).toBeVisible();
  });

  test('should verify multiple test options and retry', async ({ page }) => {
    await page.goto('/beweisguard/');
    await page.getByRole('button', { name: /Test B/ }).click();
    await page.getByRole('button', { name: /Test starten/ }).click();
    
    // Answer first question
    await page.getByRole('button', { name: /A / }).first().click();
    
    // Jump to end using indicator dots
    await page.evaluate(() => {
      const dots = document.querySelectorAll('.indicator-dot');
      dots[dots.length - 1]?.click();
    });
    await page.waitForTimeout(500);
    
    // Submit
    await page.getByRole('button', { name: /Test abschließen/ }).click();
    
    // Check results and retry
    await expect(page.getByText('Testergebnis')).toBeVisible();
    await page.getByRole('button', { name: /Test wiederholen/ }).click();
    await expect(page.getByText('Testinformationen')).toBeVisible();
    
    // Go back and select different test
    await page.getByRole('button', { name: /Zurück/ }).click();
    await expect(page.getByText('Wählen Sie einen Test aus')).toBeVisible();
  })
});
