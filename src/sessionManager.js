// Session manager for persisting test state to localStorage
const SESSION_KEY = 'beweisguard-session'

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
