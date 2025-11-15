// Session manager for persisting test state to localStorage
const SESSION_KEY = 'beweisguard-session'
const HISTORY_KEY = 'beweisguard-test-history'

export const saveSession = (sessionData) => {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData))
  } catch (error) {
    console.error('Failed to save session:', error)
  }
}

export const loadSession = () => {
  try {
    const data = localStorage.getItem(SESSION_KEY)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Failed to load session:', error)
    return null
  }
}

export const clearSession = () => {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch (error) {
    console.error('Failed to clear session:', error)
  }
}

// Test history management
export const saveTestResult = (testResult) => {
  try {
    const history = loadTestHistory()
    history.push({
      ...testResult,
      id: Date.now(),
      timestamp: new Date().toISOString()
    })
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch (error) {
    console.error('Failed to save test result:', error)
  }
}

export const loadTestHistory = () => {
  try {
    const data = localStorage.getItem(HISTORY_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Failed to load test history:', error)
    return []
  }
}

export const clearTestHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY)
  } catch (error) {
    console.error('Failed to clear test history:', error)
  }
}
