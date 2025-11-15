import { describe, it, expect, beforeEach } from 'vitest'
import { saveSession, loadSession, clearSession, saveTestResult, loadTestHistory, clearTestHistory } from './sessionManager'

describe('Session Manager', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  it('should save session data to localStorage', () => {
    const sessionData = {
      selectedTest: 'Test A',
      currentQuestionIndex: 5,
      userAnswers: [0, 1, 2],
      showResults: false,
      testStarted: true
    }

    saveSession(sessionData)
    
    const stored = localStorage.getItem('beweisguard-session')
    expect(stored).toBeTruthy()
    expect(JSON.parse(stored)).toEqual(sessionData)
  })

  it('should load session data from localStorage', () => {
    const sessionData = {
      selectedTest: 'Test B',
      currentQuestionIndex: 10,
      userAnswers: [1, 2, 3, 0],
      showResults: false,
      testStarted: true
    }

    localStorage.setItem('beweisguard-session', JSON.stringify(sessionData))
    
    const loaded = loadSession()
    expect(loaded).toEqual(sessionData)
  })

  it('should return null when no session exists', () => {
    const loaded = loadSession()
    expect(loaded).toBeNull()
  })

  it('should return null when session data is invalid', () => {
    localStorage.setItem('beweisguard-session', 'invalid-json')
    
    const loaded = loadSession()
    expect(loaded).toBeNull()
  })

  it('should clear session from localStorage', () => {
    const sessionData = {
      selectedTest: 'Test C',
      currentQuestionIndex: 3,
      userAnswers: [0],
      showResults: false,
      testStarted: true
    }

    localStorage.setItem('beweisguard-session', JSON.stringify(sessionData))
    expect(localStorage.getItem('beweisguard-session')).toBeTruthy()
    
    clearSession()
    
    expect(localStorage.getItem('beweisguard-session')).toBeNull()
  })
})

describe('Test History Manager', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  it('should save test result to history', () => {
    const testResult = {
      testName: 'Test A',
      correct: 8,
      total: 10,
      percentage: 80
    }

    saveTestResult(testResult)
    
    const history = loadTestHistory()
    expect(history).toHaveLength(1)
    expect(history[0]).toMatchObject(testResult)
    expect(history[0]).toHaveProperty('id')
    expect(history[0]).toHaveProperty('timestamp')
  })

  it('should append multiple test results to history', () => {
    const testResult1 = {
      testName: 'Test A',
      correct: 7,
      total: 10,
      percentage: 70
    }
    
    const testResult2 = {
      testName: 'Test B',
      correct: 9,
      total: 10,
      percentage: 90
    }

    saveTestResult(testResult1)
    saveTestResult(testResult2)
    
    const history = loadTestHistory()
    expect(history).toHaveLength(2)
    expect(history[0]).toMatchObject(testResult1)
    expect(history[1]).toMatchObject(testResult2)
  })

  it('should load test history from localStorage', () => {
    const history = [
      {
        id: 1,
        timestamp: '2024-01-01T12:00:00.000Z',
        testName: 'Test A',
        correct: 6,
        total: 10,
        percentage: 60
      }
    ]

    localStorage.setItem('beweisguard-test-history', JSON.stringify(history))
    
    const loaded = loadTestHistory()
    expect(loaded).toEqual(history)
  })

  it('should return empty array when no history exists', () => {
    const history = loadTestHistory()
    expect(history).toEqual([])
  })

  it('should return empty array when history data is invalid', () => {
    localStorage.setItem('beweisguard-test-history', 'invalid-json')
    
    const history = loadTestHistory()
    expect(history).toEqual([])
  })

  it('should clear test history from localStorage', () => {
    const testResult = {
      testName: 'Test C',
      correct: 5,
      total: 10,
      percentage: 50
    }

    saveTestResult(testResult)
    expect(loadTestHistory()).toHaveLength(1)
    
    clearTestHistory()
    
    expect(loadTestHistory()).toEqual([])
    expect(localStorage.getItem('beweisguard-test-history')).toBeNull()
  })
})
