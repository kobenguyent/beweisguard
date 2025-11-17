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

  test('should persist session on page refresh', async ({ page }) => {
    await page.goto('/beweisguard/');
    
    // Clear any existing session first
    await page.evaluate(() => {
      localStorage.clear();
    });
    
    // Select and start test
    await page.getByRole('button', { name: /Test A/ }).click();
    await page.getByRole('button', { name: /Test starten/ }).click();
    
    // Answer first question
    await expect(page.getByText(/Frage 1 von 43/)).toBeVisible();
    await page.getByRole('button', { name: /A / }).first().click();
    
    // Verify answer is selected
    const firstOption = page.getByRole('button', { name: /A / }).first();
    await expect(firstOption).toHaveClass(/selected/);
    
    // Navigate to question 2
    await page.getByRole('button', { name: /Weiter/ }).click();
    await expect(page.getByText(/Frage 2 von 43/)).toBeVisible();
    
    // Verify session data in localStorage
    const sessionData = await page.evaluate(() => {
      const data = localStorage.getItem('beweisguard-session');
      return JSON.parse(data);
    });
    expect(sessionData.selectedTest).toBe('Test A');
    expect(sessionData.currentQuestionIndex).toBe(1);
    expect(sessionData.userAnswers).toEqual([0]);
    expect(sessionData.testStarted).toBe(true);
    
    // Refresh the page
    await page.reload();
    
    // Wait for page to load and verify we're still on question 2
    await expect(page.getByText(/Frage 2 von 43/)).toBeVisible();
    
    // Go back to question 1 and verify answer is still selected
    await page.getByRole('button', { name: /Zurück/ }).click();
    await expect(page.getByText(/Frage 1 von 43/)).toBeVisible();
    
    // Verify the answer is still selected after refresh
    const selectedOption = page.getByRole('button', { name: /A / }).first();
    await expect(selectedOption).toHaveClass(/selected/);
  });

  test('should persist text answers on page refresh', async ({ page }) => {
    await page.goto('/beweisguard/');
    
    // Clear session and set up to go to a context question (question 25)
    await page.evaluate(() => {
      localStorage.setItem('beweisguard-session', JSON.stringify({
        selectedTest: 'Test A',
        currentQuestionIndex: 24,
        userAnswers: [],
        showResults: false,
        testStarted: true
      }));
    });
    
    // Reload to apply the session
    await page.reload();
    
    // Verify we're on question 25 (context question)
    await expect(page.getByText(/Frage 25 von 43/)).toBeVisible();
    await expect(page.getByText(/Kontextfrage/)).toBeVisible();
    
    // Type an answer in the textarea
    const testAnswer = 'Dies ist eine Testantwort für die Kontextfrage mit mehreren Wörtern und Sätzen.';
    await page.getByRole('textbox', { name: /Geben Sie hier Ihre Antwort ein/ }).fill(testAnswer);
    
    // Verify character count updated
    await expect(page.getByText(testAnswer.length + ' Zeichen')).toBeVisible();
    
    // Refresh the page
    await page.reload();
    
    // Verify we're still on question 25
    await expect(page.getByText(/Frage 25 von 43/)).toBeVisible();
    
    // Verify the answer is still there
    const textarea = page.getByRole('textbox', { name: /Geben Sie hier Ihre Antwort ein/ });
    await expect(textarea).toHaveValue(testAnswer);
    await expect(page.getByText(testAnswer.length + ' Zeichen')).toBeVisible();
  });
});
