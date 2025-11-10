# Testing Guide

This project includes comprehensive test coverage with unit, component, and end-to-end tests.

## Test Structure

```
├── src/
│   ├── App.test.jsx          # Component tests for App
│   ├── testData.test.js      # Unit tests for test data
│   └── test/
│       └── setup.js          # Test setup and configuration
├── e2e/
│   └── test-flow.spec.js     # End-to-end tests
├── vitest.config.js          # Vitest configuration
└── playwright.config.js      # Playwright configuration
```

## Running Tests

### Unit and Component Tests

Run all unit and component tests with Vitest:

```bash
npm test
```

Run tests in watch mode:

```bash
npm test -- --watch
```

Run tests with UI:

```bash
npm run test:ui
```

Generate coverage report:

```bash
npm run test:coverage
```

### End-to-End Tests

Run E2E tests with Playwright:

```bash
npm run test:e2e
```

Run E2E tests in UI mode:

```bash
npm run test:e2e:ui
```

## Test Coverage

### Unit Tests (`src/testData.test.js`)
- Validates test data structure
- Ensures all tests have exactly 30 questions
- Verifies question format and options
- Confirms presence of new categories (Math, Logic, Context, Logistics)
- Checks category distribution across tests

### Component Tests (`src/App.test.jsx`)
- Test selection screen rendering
- Navigation between screens
- Question display with category badges
- Answer selection and highlighting
- Progress tracking
- Result calculation and display

### E2E Tests (`e2e/test-flow.spec.js`)
- Complete test flow from selection to results
- Category badge display
- Multi-question answering
- Results review functionality
- Mobile viewport compatibility
- Test retry and navigation
- Cross-browser testing (Chrome, Firefox, Safari)

## Test Categories

The application now includes diverse question categories:

### Traditional Categories
- Grundlagen, Aufbewahrung, Dokumentation
- Sicherheit, Zugriffskontrolle, Kennzeichnung
- Lagerung, Transport, Vernichtung
- Betäubungsmittel, Waffen, Digitale Asservate
- And more...

### New Categories
- **Mathematik**: Calculation and quantitative reasoning questions
- **Logik**: Logic puzzles and reasoning questions
- **Kontextfrage**: Context-based scenario questions
- **Logistik**: Logistics and planning questions

## Continuous Integration

Tests are automatically run on:
- Every pull request
- Every commit to main branch
- Before deployment to GitHub Pages

## Writing New Tests

### Adding Unit Tests

```javascript
import { describe, it, expect } from 'vitest'

describe('My Feature', () => {
  it('should do something', () => {
    expect(result).toBe(expected)
  })
})
```

### Adding Component Tests

```javascript
import { render, screen, fireEvent } from '@testing-library/react'

it('should render component', () => {
  render(<MyComponent />)
  expect(screen.getByText('Hello')).toBeInTheDocument()
})
```

### Adding E2E Tests

```javascript
import { test, expect } from '@playwright/test'

test('should complete user flow', async ({ page }) => {
  await page.goto('/beweisguard/')
  await expect(page.getByText('BeweisGuard')).toBeVisible()
})
```

## Test Data Validation

All questions must:
- Have a unique ID (sequential)
- Include a category
- Have exactly 4 options
- Have a valid correct answer (0-3)
- Include meaningful question text (>10 characters)

## Browser Support

E2E tests run on:
- Desktop: Chrome, Firefox, Safari
- Mobile: Pixel 5, iPhone 12

## Troubleshooting

### Tests failing locally

1. Ensure dependencies are installed: `npm install`
2. Clear cache: `npm run test -- --clearCache`
3. Update Playwright browsers: `npx playwright install`

### E2E tests timing out

Increase timeout in `playwright.config.js`:

```javascript
use: {
  timeout: 30000, // 30 seconds
}
```

### Coverage not generating

Ensure v8 provider is installed:

```bash
npm install -D @vitest/coverage-v8
```
