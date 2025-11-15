import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TestReports from './TestReports'
import * as sessionManager from './sessionManager'

describe('TestReports Component', () => {
  const mockOnBack = vi.fn()

  beforeEach(() => {
    mockOnBack.mockClear()
    vi.clearAllMocks()
  })

  it('should render empty state when no test history exists', () => {
    vi.spyOn(sessionManager, 'loadTestHistory').mockReturnValue([])
    
    render(<TestReports onBack={mockOnBack} />)
    
    expect(screen.getByText(/Noch keine Tests abgeschlossen/i)).toBeInTheDocument()
  })

  it('should display test history statistics', () => {
    const mockHistory = [
      {
        id: 1,
        timestamp: '2024-01-01T12:00:00.000Z',
        testName: 'Test A',
        correct: 8,
        total: 10,
        percentage: 80
      },
      {
        id: 2,
        timestamp: '2024-01-02T12:00:00.000Z',
        testName: 'Test B',
        correct: 5,
        total: 10,
        percentage: 50
      }
    ]
    
    vi.spyOn(sessionManager, 'loadTestHistory').mockReturnValue(mockHistory)
    
    render(<TestReports onBack={mockOnBack} />)
    
    // Check total tests
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('Gesamt Tests')).toBeInTheDocument()
    
    // Check passed tests
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('Bestanden')).toBeInTheDocument()
    
    // Check average score
    expect(screen.getByText('65.0%')).toBeInTheDocument()
    expect(screen.getByText('Durchschnitt')).toBeInTheDocument()
  })

  it('should display test reports in the list', () => {
    const mockHistory = [
      {
        id: 1,
        timestamp: '2024-01-15T14:30:00.000Z',
        testName: 'Test A',
        correct: 9,
        total: 10,
        percentage: 90
      }
    ]
    
    vi.spyOn(sessionManager, 'loadTestHistory').mockReturnValue(mockHistory)
    
    render(<TestReports onBack={mockOnBack} />)
    
    expect(screen.getAllByText('Test A').length).toBeGreaterThan(0)
    expect(screen.getByText('9 von 10 Fragen richtig')).toBeInTheDocument()
    expect(screen.getByText('✅ Bestanden')).toBeInTheDocument()
  })

  it('should show failed status for tests below 60%', () => {
    const mockHistory = [
      {
        id: 1,
        timestamp: '2024-01-15T14:30:00.000Z',
        testName: 'Test A',
        correct: 5,
        total: 10,
        percentage: 50
      }
    ]
    
    vi.spyOn(sessionManager, 'loadTestHistory').mockReturnValue(mockHistory)
    
    render(<TestReports onBack={mockOnBack} />)
    
    expect(screen.getByText('❌ Nicht bestanden')).toBeInTheDocument()
  })

  it('should display learning progress by test', () => {
    const mockHistory = [
      {
        id: 1,
        timestamp: '2024-01-01T12:00:00.000Z',
        testName: 'Test A',
        correct: 5,
        total: 10,
        percentage: 50
      },
      {
        id: 2,
        timestamp: '2024-01-02T12:00:00.000Z',
        testName: 'Test A',
        correct: 8,
        total: 10,
        percentage: 80
      }
    ]
    
    vi.spyOn(sessionManager, 'loadTestHistory').mockReturnValue(mockHistory)
    
    render(<TestReports onBack={mockOnBack} />)
    
    expect(screen.getByText('Lernfortschritt nach Test')).toBeInTheDocument()
    expect(screen.getByText('2 Versuche')).toBeInTheDocument()
    expect(screen.getByText('Erste Bewertung:')).toBeInTheDocument()
    expect(screen.getByText('Letzte Bewertung:')).toBeInTheDocument()
    expect(screen.getByText('Verbesserung:')).toBeInTheDocument()
    expect(screen.getByText('+30%')).toBeInTheDocument()
  })

  it('should sort by date by default', () => {
    const mockHistory = [
      {
        id: 1,
        timestamp: '2024-01-01T12:00:00.000Z',
        testName: 'Test A',
        correct: 5,
        total: 10,
        percentage: 50
      },
      {
        id: 2,
        timestamp: '2024-01-02T12:00:00.000Z',
        testName: 'Test B',
        correct: 8,
        total: 10,
        percentage: 80
      }
    ]
    
    vi.spyOn(sessionManager, 'loadTestHistory').mockReturnValue(mockHistory)
    
    render(<TestReports onBack={mockOnBack} />)
    
    const testNames = screen.getAllByRole('heading', { level: 3 })
    // Newer test should be first (Test B)
    expect(testNames[0]).toHaveTextContent('Lernfortschritt')
    // Find report items
    const reportItems = document.querySelectorAll('.report-header h3')
    expect(reportItems[0]).toHaveTextContent('Test B')
    expect(reportItems[1]).toHaveTextContent('Test A')
  })

  it('should allow sorting by score', () => {
    const mockHistory = [
      {
        id: 1,
        timestamp: '2024-01-01T12:00:00.000Z',
        testName: 'Test A',
        correct: 5,
        total: 10,
        percentage: 50
      },
      {
        id: 2,
        timestamp: '2024-01-02T12:00:00.000Z',
        testName: 'Test B',
        correct: 8,
        total: 10,
        percentage: 80
      }
    ]
    
    vi.spyOn(sessionManager, 'loadTestHistory').mockReturnValue(mockHistory)
    
    render(<TestReports onBack={mockOnBack} />)
    
    const sortSelect = screen.getByLabelText(/Sortieren nach/i)
    fireEvent.change(sortSelect, { target: { value: 'score' } })
    
    // After sorting by score, highest should be first
    const reportItems = document.querySelectorAll('.report-header h3')
    expect(reportItems[0]).toHaveTextContent('Test B')
    expect(reportItems[1]).toHaveTextContent('Test A')
  })

  it('should call onBack when back button is clicked', () => {
    vi.spyOn(sessionManager, 'loadTestHistory').mockReturnValue([])
    
    render(<TestReports onBack={mockOnBack} />)
    
    const backButton = screen.getByText(/Zurück zum Hauptmenü/i)
    fireEvent.click(backButton)
    
    expect(mockOnBack).toHaveBeenCalledTimes(1)
  })

  it('should clear history when clear button is clicked and confirmed', () => {
    const mockHistory = [
      {
        id: 1,
        timestamp: '2024-01-01T12:00:00.000Z',
        testName: 'Test A',
        correct: 8,
        total: 10,
        percentage: 80
      }
    ]
    
    vi.spyOn(sessionManager, 'loadTestHistory').mockReturnValue(mockHistory)
    const clearSpy = vi.spyOn(sessionManager, 'clearTestHistory')
    
    // Mock window.confirm
    window.confirm = vi.fn(() => true)
    
    render(<TestReports onBack={mockOnBack} />)
    
    const clearButton = screen.getByText(/Historie löschen/i)
    fireEvent.click(clearButton)
    
    expect(window.confirm).toHaveBeenCalled()
    expect(clearSpy).toHaveBeenCalled()
  })

  it('should not clear history when clear button is clicked but not confirmed', () => {
    const mockHistory = [
      {
        id: 1,
        timestamp: '2024-01-01T12:00:00.000Z',
        testName: 'Test A',
        correct: 8,
        total: 10,
        percentage: 80
      }
    ]
    
    vi.spyOn(sessionManager, 'loadTestHistory').mockReturnValue(mockHistory)
    const clearSpy = vi.spyOn(sessionManager, 'clearTestHistory')
    
    // Mock window.confirm to return false
    window.confirm = vi.fn(() => false)
    
    render(<TestReports onBack={mockOnBack} />)
    
    const clearButton = screen.getByText(/Historie löschen/i)
    fireEvent.click(clearButton)
    
    expect(window.confirm).toHaveBeenCalled()
    expect(clearSpy).not.toHaveBeenCalled()
  })
})
