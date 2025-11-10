import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

describe('App Component', () => {
  describe('Test Selection Screen', () => {
    it('should render the main title', () => {
      render(<App />)
      expect(screen.getByText('BeweisGuard')).toBeInTheDocument()
      expect(screen.getByText('Polizei Asservatestelle Übungstest')).toBeInTheDocument()
    })

    it('should display all five test options', () => {
      render(<App />)
      expect(screen.getByText('Test A')).toBeInTheDocument()
      expect(screen.getByText('Test B')).toBeInTheDocument()
      expect(screen.getByText('Test C')).toBeInTheDocument()
    })

    it('should show 30 questions per test', () => {
      render(<App />)
      const testButtons = screen.getAllByText(/40 Fragen/)
      expect(testButtons).toHaveLength(5)
    })
  })

  describe('Test Flow', () => {
    it('should navigate to test info when test is selected', () => {
      render(<App />)
      const testAButton = screen.getByRole('button', { name: /Test A/ })
      fireEvent.click(testAButton)
      
      expect(screen.getByText('Testinformationen')).toBeInTheDocument()
      expect(screen.getByText(/Anzahl der Fragen: 40/)).toBeInTheDocument()
    })

    it('should start test when start button is clicked', () => {
      render(<App />)
      
      // Select test
      const testAButton = screen.getByRole('button', { name: /Test A/ })
      fireEvent.click(testAButton)
      
      // Start test
      const startButton = screen.getByRole('button', { name: /Test starten/ })
      fireEvent.click(startButton)
      
      // Should show first question
      expect(screen.getByText(/Frage 1 von 40/)).toBeInTheDocument()
    })

    it('should return to test selection when back button is clicked', () => {
      render(<App />)
      
      // Select test
      const testAButton = screen.getByRole('button', { name: /Test A/ })
      fireEvent.click(testAButton)
      
      // Go back
      const backButton = screen.getByRole('button', { name: /Zurück/ })
      fireEvent.click(backButton)
      
      // Should be back at selection screen
      expect(screen.getByText(/Wählen Sie einen Test aus/)).toBeInTheDocument()
    })
  })

  describe('Question Interface', () => {
    it('should display question with category badge', () => {
      render(<App />)
      
      // Select and start test
      fireEvent.click(screen.getByRole('button', { name: /Test A/ }))
      fireEvent.click(screen.getByRole('button', { name: /Test starten/ }))
      
      // Should show category badge
      expect(screen.getByText('Grundlagen')).toBeInTheDocument()
    })

    it('should have 4 answer options', () => {
      render(<App />)
      
      // Select and start test
      fireEvent.click(screen.getByRole('button', { name: /Test A/ }))
      fireEvent.click(screen.getByRole('button', { name: /Test starten/ }))
      
      // Should have options A, B, C, D
      expect(screen.getByText('A')).toBeInTheDocument()
      expect(screen.getByText('B')).toBeInTheDocument()
      expect(screen.getByText('C')).toBeInTheDocument()
      expect(screen.getByText('D')).toBeInTheDocument()
    })

    it('should highlight selected answer', () => {
      render(<App />)
      
      // Select and start test
      fireEvent.click(screen.getByRole('button', { name: /Test A/ }))
      fireEvent.click(screen.getByRole('button', { name: /Test starten/ }))
      
      // Click first option
      const firstOption = screen.getByRole('button', { name: /A Beweismittel/ })
      fireEvent.click(firstOption)
      
      // Should have selected class
      expect(firstOption).toHaveClass('selected')
    })

    it('should navigate to next question', () => {
      render(<App />)
      
      // Select and start test
      fireEvent.click(screen.getByRole('button', { name: /Test A/ }))
      fireEvent.click(screen.getByRole('button', { name: /Test starten/ }))
      
      // Click next
      const nextButton = screen.getByRole('button', { name: /Weiter/ })
      fireEvent.click(nextButton)
      
      // Should show question 2
      expect(screen.getByText(/Frage 2 von 40/)).toBeInTheDocument()
    })
  })

  describe('Progress Tracking', () => {
    it('should show progress bar', () => {
      render(<App />)
      
      // Select and start test
      fireEvent.click(screen.getByRole('button', { name: /Test A/ }))
      fireEvent.click(screen.getByRole('button', { name: /Test starten/ }))
      
      // Should have progress bar
      const progressBar = document.querySelector('.progress-bar')
      expect(progressBar).toBeInTheDocument()
    })

    it('should show question indicators', () => {
      render(<App />)
      
      // Select and start test
      fireEvent.click(screen.getByRole('button', { name: /Test A/ }))
      fireEvent.click(screen.getByRole('button', { name: /Test starten/ }))
      
      // Should have 30 indicator dots
      const indicators = document.querySelectorAll('.indicator-dot')
      expect(indicators).toHaveLength(40)
    })
  })
})
