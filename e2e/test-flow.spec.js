import { test, expect } from '@playwright/test';

test.describe('BeweisGuard E2E Tests', () => {
  test('should display home page with test selection', async ({ page }) => {
    await page.goto('/beweisguard/');
    
    // Check title
    await expect(page.locator('h1')).toContainText('BeweisGuard');
    await expect(page.locator('h2')).toContainText('Polizei Asservatestelle Übungstest');
    
    // Check test buttons
    await expect(page.getByRole('button', { name: /Test A/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Test B/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Test C/ })).toBeVisible();
    
    // Check 30 questions per test
    await expect(page.getByText('30 Fragen').first()).toBeVisible();
  });

  test('should complete full test flow', async ({ page }) => {
    await page.goto('/beweisguard/');
    
    // Select Test A
    await page.getByRole('button', { name: /Test A/ }).click();
    
    // Verify test info page
    await expect(page.getByText('Testinformationen')).toBeVisible();
    await expect(page.getByText(/Anzahl der Fragen: 30/)).toBeVisible();
    
    // Start test
    await page.getByRole('button', { name: /Test starten/ }).click();
    
    // Verify first question
    await expect(page.getByText(/Frage 1 von 30/)).toBeVisible();
    
    // Answer first question
    await page.getByRole('button', { name: /A / }).first().click();
    
    // Go to next question
    await page.getByRole('button', { name: /Weiter/ }).click();
    
    // Verify second question
    await expect(page.getByText(/Frage 2 von 30/)).toBeVisible();
    
    // Go back to first question
    await page.getByRole('button', { name: /Zurück/ }).click();
    await expect(page.getByText(/Frage 1 von 30/)).toBeVisible();
  });

  test('should display category badges', async ({ page }) => {
    await page.goto('/beweisguard/');
    
    // Select and start test
    await page.getByRole('button', { name: /Test A/ }).click();
    await page.getByRole('button', { name: /Test starten/ }).click();
    
    // Check for category badge
    const categoryBadge = page.locator('.category-badge');
    await expect(categoryBadge).toBeVisible();
    await expect(categoryBadge).toHaveText('Grundlagen');
  });

  test('should answer multiple questions and submit', async ({ page }) => {
    await page.goto('/beweisguard/');
    
    // Select and start test
    await page.getByRole('button', { name: /Test A/ }).click();
    await page.getByRole('button', { name: /Test starten/ }).click();
    
    // Answer first 5 questions
    for (let i = 0; i < 5; i++) {
      await page.getByRole('button', { name: /A / }).first().click();
      if (i < 4) {
        await page.getByRole('button', { name: /Weiter/ }).click();
      }
    }
    
    // Navigate to last question
    for (let i = 0; i < 25; i++) {
      await page.getByRole('button', { name: /Weiter/ }).click();
    }
    
    // Answer last question
    await page.getByRole('button', { name: /A / }).first().click();
    
    // Submit test
    await page.getByRole('button', { name: /Test abschließen/ }).click();
    
    // Verify results page
    await expect(page.getByText('Testergebnis')).toBeVisible();
    await expect(page.locator('.score-percentage')).toBeVisible();
  });

  test('should show results with question review', async ({ page }) => {
    await page.goto('/beweisguard/');
    
    // Select and start test
    await page.getByRole('button', { name: /Test A/ }).click();
    await page.getByRole('button', { name: /Test starten/ }).click();
    
    // Answer first question
    await page.getByRole('button', { name: /A / }).first().click();
    
    // Skip to end
    for (let i = 0; i < 29; i++) {
      await page.getByRole('button', { name: /Weiter/ }).click();
    }
    
    // Submit
    await page.getByRole('button', { name: /Test abschließen/ }).click();
    
    // Check results
    await expect(page.getByText('Fragen-Übersicht')).toBeVisible();
    await expect(page.locator('.review-item').first()).toBeVisible();
  });

  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/beweisguard/');
    
    // Check mobile layout
    await expect(page.getByText('BeweisGuard')).toBeVisible();
    await expect(page.getByRole('button', { name: /Test A/ })).toBeVisible();
    
    // Start test
    await page.getByRole('button', { name: /Test A/ }).click();
    await page.getByRole('button', { name: /Test starten/ }).click();
    
    // Check question is visible on mobile
    await expect(page.getByText(/Frage 1 von 30/)).toBeVisible();
  });

  test('should display new question categories', async ({ page }) => {
    await page.goto('/beweisguard/');
    
    // Select and start test
    await page.getByRole('button', { name: /Test A/ }).click();
    await page.getByRole('button', { name: /Test starten/ }).click();
    
    // Navigate through questions to find new categories
    let foundMath = false;
    let foundLogic = false;
    let foundContext = false;
    let foundLogistics = false;
    
    for (let i = 0; i < 30; i++) {
      const categoryBadge = await page.locator('.category-badge').textContent();
      
      if (categoryBadge.includes('Mathematik')) foundMath = true;
      if (categoryBadge.includes('Logik')) foundLogic = true;
      if (categoryBadge.includes('Kontextfrage')) foundContext = true;
      if (categoryBadge.includes('Logistik')) foundLogistics = true;
      
      if (i < 29) {
        await page.getByRole('button', { name: /Weiter/ }).click();
      }
    }
    
    // Verify at least some of the new categories were found
    expect(foundMath || foundLogic || foundContext || foundLogistics).toBeTruthy();
  });

  test('should retry same test', async ({ page }) => {
    await page.goto('/beweisguard/');
    
    // Complete a quick test
    await page.getByRole('button', { name: /Test A/ }).click();
    await page.getByRole('button', { name: /Test starten/ }).click();
    
    // Answer first question
    await page.getByRole('button', { name: /A / }).first().click();
    
    // Skip to end
    for (let i = 0; i < 29; i++) {
      await page.getByRole('button', { name: /Weiter/ }).click();
    }
    
    // Submit
    await page.getByRole('button', { name: /Test abschließen/ }).click();
    
    // Retry test
    await page.getByRole('button', { name: /Test wiederholen/ }).click();
    
    // Should be back at test info
    await expect(page.getByText('Testinformationen')).toBeVisible();
  });

  test('should select different test', async ({ page }) => {
    await page.goto('/beweisguard/');
    
    // Complete Test A
    await page.getByRole('button', { name: /Test A/ }).click();
    await page.getByRole('button', { name: /Test starten/ }).click();
    await page.getByRole('button', { name: /A / }).first().click();
    
    for (let i = 0; i < 29; i++) {
      await page.getByRole('button', { name: /Weiter/ }).click();
    }
    
    await page.getByRole('button', { name: /Test abschließen/ }).click();
    
    // Go to new test selection
    await page.getByRole('button', { name: /Neuer Test/ }).click();
    
    // Should be back at home
    await expect(page.getByText('Wählen Sie einen Test aus')).toBeVisible();
    
    // Select Test B
    await page.getByRole('button', { name: /Test B/ }).click();
    await expect(page.getByText('Test B')).toBeVisible();
  });
});
