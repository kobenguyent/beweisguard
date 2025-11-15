import { describe, it, expect, beforeEach } from 'vitest'
import { saveSession, loadSession, clearSession } from './sessionManager'

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
