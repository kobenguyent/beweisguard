import { useState } from 'react'
import { loadTestHistory, clearTestHistory } from './sessionManager'
import './TestReports.css'

function TestReports({ onBack }) {
  const [history, setHistory] = useState(loadTestHistory())
  const [sortBy, setSortBy] = useState('date') // 'date' or 'score'

  const handleClearHistory = () => {
    if (window.confirm('Möchten Sie wirklich die gesamte Testhistorie löschen?')) {
      clearTestHistory()
      setHistory([])
    }
  }

  // Sort history
  const sortedHistory = [...history].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.timestamp) - new Date(a.timestamp)
    } else {
      return b.percentage - a.percentage
    }
  })

  // Calculate statistics
  const totalTests = history.length
  const passedTests = history.filter(t => t.percentage >= 60).length
  const averageScore = totalTests > 0 
    ? (history.reduce((sum, t) => sum + t.percentage, 0) / totalTests).toFixed(1)
    : 0

  // Group by test name for learning progress
  const testsByName = {}
  history.forEach(test => {
    if (!testsByName[test.testName]) {
      testsByName[test.testName] = []
    }
    testsByName[test.testName].push(test)
  })

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">Testberichte</h1>
        
        {/* Statistics Summary */}
        <div className="reports-summary">
          <div className="stat-card">
            <div className="stat-value">{totalTests}</div>
            <div className="stat-label">Gesamt Tests</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{passedTests}</div>
            <div className="stat-label">Bestanden</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{averageScore}%</div>
            <div className="stat-label">Durchschnitt</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(0) : 0}%
            </div>
            <div className="stat-label">Erfolgsquote</div>
          </div>
        </div>

        {/* Learning Progress by Test */}
        {Object.keys(testsByName).length > 0 && (
          <div className="learning-progress">
            <h3>Lernfortschritt nach Test</h3>
            {Object.entries(testsByName).map(([testName, tests]) => {
              const attempts = tests.length
              const sortedTests = [...tests].sort((a, b) => 
                new Date(a.timestamp) - new Date(b.timestamp)
              )
              const firstScore = sortedTests[0].percentage
              const lastScore = sortedTests[sortedTests.length - 1].percentage
              const improvement = lastScore - firstScore
              
              return (
                <div key={testName} className="progress-card">
                  <div className="progress-header">
                    <h4>{testName}</h4>
                    <span className="attempts-badge">{attempts} Versuche</span>
                  </div>
                  <div className="progress-stats">
                    <div className="progress-stat">
                      <span className="stat-label">Erste Bewertung:</span>
                      <span className={`stat-value ${firstScore >= 60 ? 'passed' : 'failed'}`}>
                        {firstScore.toFixed(0)}%
                      </span>
                    </div>
                    <div className="progress-stat">
                      <span className="stat-label">Letzte Bewertung:</span>
                      <span className={`stat-value ${lastScore >= 60 ? 'passed' : 'failed'}`}>
                        {lastScore.toFixed(0)}%
                      </span>
                    </div>
                    {attempts > 1 && (
                      <div className="progress-stat">
                        <span className="stat-label">Verbesserung:</span>
                        <span className={`stat-value ${improvement >= 0 ? 'positive' : 'negative'}`}>
                          {improvement >= 0 ? '+' : ''}{improvement.toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Controls */}
        <div className="reports-controls">
          <label htmlFor="sort-select">Sortieren nach:</label>
          <select 
            id="sort-select"
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date">Datum (neueste zuerst)</option>
            <option value="score">Bewertung (höchste zuerst)</option>
          </select>
        </div>

        {/* Test History List */}
        {sortedHistory.length === 0 ? (
          <div className="empty-state">
            <p>📝 Noch keine Tests abgeschlossen.</p>
            <p>Beginnen Sie einen Test, um Ihren Fortschritt zu verfolgen!</p>
          </div>
        ) : (
          <div className="reports-list">
            {sortedHistory.map((test) => {
              const passed = test.percentage >= 60
              const date = new Date(test.timestamp)
              
              return (
                <div key={test.id} className={`report-item ${passed ? 'passed' : 'failed'}`}>
                  <div className="report-header">
                    <h3>{test.testName}</h3>
                    <span className={`status-badge ${passed ? 'passed' : 'failed'}`}>
                      {passed ? '✅ Bestanden' : '❌ Nicht bestanden'}
                    </span>
                  </div>
                  <div className="report-details">
                    <div className="report-score">
                      <span className="score-label">Bewertung:</span>
                      <span className="score-value">{test.percentage.toFixed(0)}%</span>
                    </div>
                    <div className="report-questions">
                      <span>{test.correct} von {test.total} Fragen richtig</span>
                    </div>
                    <div className="report-date">
                      <span>📅 {date.toLocaleDateString('de-DE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Action Buttons */}
        <div className="button-group">
          <button className="button button-secondary" onClick={onBack}>
            ← Zurück zum Hauptmenü
          </button>
          {history.length > 0 && (
            <button 
              className="button button-danger" 
              onClick={handleClearHistory}
            >
              Historie löschen
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TestReports
