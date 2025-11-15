import { useState, useEffect } from 'react'
import { testData, calculateContextScore, getFoundKeywords } from './testData'
import { saveSession, loadSession, clearSession } from './sessionManager'
import './App.css'

function App() {
  // Initialize state from session or defaults
  const session = loadSession()
  const [selectedTest, setSelectedTest] = useState(session?.selectedTest || null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(session?.currentQuestionIndex || 0)
  const [userAnswers, setUserAnswers] = useState(session?.userAnswers || [])
  const [showResults, setShowResults] = useState(session?.showResults || false)
  const [testStarted, setTestStarted] = useState(session?.testStarted || false)

  // Save session whenever state changes
  useEffect(() => {
    if (selectedTest || testStarted || userAnswers.length > 0) {
      saveSession({
        selectedTest,
        currentQuestionIndex,
        userAnswers,
        showResults,
        testStarted
      })
    }
  }, [selectedTest, currentQuestionIndex, userAnswers, showResults, testStarted])

  const availableTests = Object.keys(testData)

  const handleTestSelection = (testName) => {
    clearSession()
    setSelectedTest(testName)
    setCurrentQuestionIndex(0)
    setUserAnswers([])
    setShowResults(false)
    setTestStarted(false)
  }

  const startTest = () => {
    setTestStarted(true)
  }

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestionIndex] = answerIndex
    setUserAnswers(newAnswers)
  }

  const handleTextAnswer = (text) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestionIndex] = text
    setUserAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestionIndex < testData[selectedTest].length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = () => {
    setShowResults(true)
  }

  const calculateResults = () => {
    const questions = testData[selectedTest]
    let correct = 0
    let totalScore = 0
    
    questions.forEach((question, index) => {
      if (question.type === 'context') {
        // For context questions, use keyword-based scoring
        const score = calculateContextScore(
          userAnswers[index],
          question.keywords,
          question.minKeywords
        )
        totalScore += score
        if (score >= 0.6) {
          correct++ // Count as correct if score is 60% or higher
        }
      } else {
        // For multiple choice questions
        if (userAnswers[index] === question.correctAnswer) {
          correct++
          totalScore += 1
        }
      }
    })

    const percentage = (totalScore / questions.length) * 100
    return { correct, total: questions.length, percentage, totalScore }
  }

  const resetTest = () => {
    clearSession()
    setSelectedTest(null)
    setCurrentQuestionIndex(0)
    setUserAnswers([])
    setShowResults(false)
    setTestStarted(false)
  }

  const retryTest = () => {
    setCurrentQuestionIndex(0)
    setUserAnswers([])
    setShowResults(false)
    setTestStarted(false)
  }

  // Test Selection Screen
  if (!selectedTest) {
    return (
      <div className="app">
        <div className="container">
          <h1 className="title">BeweisGuard</h1>
          <h2 className="subtitle">Polizei Asservatestelle Übungstest</h2>
          <p className="description">
            Wählen Sie einen Test aus, um Ihr Wissen über die Asservatenverwaltung zu testen.
          </p>
          <div className="test-selection">
            {availableTests.map((testName) => (
              <button
                key={testName}
                className="test-button"
                onClick={() => handleTestSelection(testName)}
              >
                {testName}
                <span className="test-info">
                  {testData[testName].length} Fragen
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Test Start Screen
  if (!testStarted) {
    return (
      <div className="app">
        <div className="container">
          <h1 className="title">{selectedTest}</h1>
          <div className="test-intro">
            <h3>Testinformationen</h3>
            <p>📝 Anzahl der Fragen: {testData[selectedTest].length}</p>
            <p>⏱️ Keine Zeitbegrenzung</p>
            <p>✅ Multiple-Choice-Format</p>
            <p>📊 Ergebnisse werden am Ende angezeigt</p>
          </div>
          <div className="button-group">
            <button className="button button-secondary" onClick={resetTest}>
              Zurück
            </button>
            <button className="button button-primary" onClick={startTest}>
              Test starten
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Results Screen
  if (showResults) {
    const results = calculateResults()
    const passed = results.percentage >= 60

    return (
      <div className="app">
        <div className="container">
          <h1 className="title">Testergebnis</h1>
          <div className={`results ${passed ? 'passed' : 'failed'}`}>
            <div className="score-circle">
              <span className="score-percentage">{results.percentage.toFixed(0)}%</span>
            </div>
            <h2>{passed ? '✅ Bestanden!' : '❌ Nicht bestanden'}</h2>
            <p className="score-details">
              Sie haben {results.correct} von {results.total} Fragen richtig beantwortet.
            </p>
            {!passed && (
              <p className="hint">Sie benötigen mindestens 60% um zu bestehen.</p>
            )}
          </div>

          <div className="question-review">
            <h3>Fragen-Übersicht</h3>
            {testData[selectedTest].map((question, index) => {
              const userAnswer = userAnswers[index]
              let isCorrect, score, foundKeywords
              
              if (question.type === 'context') {
                score = calculateContextScore(userAnswer, question.keywords, question.minKeywords)
                isCorrect = score >= 0.6
                foundKeywords = getFoundKeywords(userAnswer, question.keywords)
              } else {
                isCorrect = userAnswer === question.correctAnswer
              }
              
              return (
                <div key={question.id} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="review-header">
                    <span className="review-number">Frage {index + 1}</span>
                    <span className="review-icon">
                      {question.type === 'context' ? 
                        `${Math.round(score * 100)}%` : 
                        (isCorrect ? '✅' : '❌')
                      }
                    </span>
                  </div>
                  {question.category && (
                    <span className="category-badge small">{question.category}</span>
                  )}
                  <p className="review-question">{question.question}</p>
                  <div className="review-answers">
                    {question.type === 'context' ? (
                      <>
                        {userAnswer ? (
                          <>
                            <div className="context-user-answer">
                              <strong>Ihre Antwort:</strong>
                              <p className="context-text">{userAnswer}</p>
                            </div>
                            <div className="context-feedback">
                              <p>
                                <strong>Gefundene Schlüsselbegriffe ({foundKeywords.length}/{question.keywords.length}):</strong>{' '}
                                {foundKeywords.length > 0 ? foundKeywords.join(', ') : 'Keine'}
                              </p>
                            </div>
                            <div className="context-suggested">
                              <strong>Musterantwort:</strong>
                              <p className="context-text">{question.suggestedAnswer}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="no-answer">Nicht beantwortet</p>
                            <div className="context-suggested">
                              <strong>Musterantwort:</strong>
                              <p className="context-text">{question.suggestedAnswer}</p>
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {userAnswer !== undefined ? (
                          <>
                            <p className="user-answer">
                              <strong>Ihre Antwort:</strong> {question.options[userAnswer]}
                            </p>
                            {!isCorrect && (
                              <p className="correct-answer">
                                <strong>Richtige Antwort:</strong> {question.options[question.correctAnswer]}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="no-answer">Nicht beantwortet</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="button-group">
            <button className="button button-secondary" onClick={resetTest}>
              Neuer Test
            </button>
            <button className="button button-primary" onClick={retryTest}>
              Test wiederholen
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Question Screen
  const currentQuestion = testData[selectedTest][currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / testData[selectedTest].length) * 100

  return (
    <div className="app">
      <div className="container">
        <div className="test-header">
          <h1 className="test-name">{selectedTest}</h1>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="progress-text">
            Frage {currentQuestionIndex + 1} von {testData[selectedTest].length}
          </p>
        </div>

        <div className="question-card">
          {currentQuestion.category && (
            <div className="question-category">
              <span className="category-badge">{currentQuestion.category}</span>
            </div>
          )}
          <h2 className="question-text">{currentQuestion.question}</h2>
          
          {currentQuestion.type === 'context' ? (
            <div className="context-answer">
              <p className="context-hint">
                ✍️ Bitte beantworten Sie die Frage in eigenen Worten. Ihre Antwort wird anhand wichtiger Schlüsselbegriffe bewertet.
              </p>
              <textarea
                className="context-textarea"
                value={userAnswers[currentQuestionIndex] || ''}
                onChange={(e) => handleTextAnswer(e.target.value)}
                placeholder="Geben Sie hier Ihre Antwort ein..."
                rows={8}
              />
              <p className="context-char-count">
                {(userAnswers[currentQuestionIndex] || '').length} Zeichen
              </p>
            </div>
          ) : (
            <div className="options">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className={`option-button ${userAnswers[currentQuestionIndex] === index ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">{option}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="navigation">
          <button
            className="button button-secondary"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            ← Zurück
          </button>
          
          {currentQuestionIndex === testData[selectedTest].length - 1 ? (
            <button
              className="button button-success"
              onClick={handleSubmit}
              disabled={userAnswers.filter(a => a !== undefined).length === 0}
            >
              Test abschließen
            </button>
          ) : (
            <button
              className="button button-primary"
              onClick={handleNext}
            >
              Weiter →
            </button>
          )}
        </div>

        <div className="question-indicator">
          {testData[selectedTest].map((_, index) => (
            <span
              key={index}
              className={`indicator-dot ${
                userAnswers[index] !== undefined ? 'answered' : ''
              } ${index === currentQuestionIndex ? 'current' : ''}`}
            ></span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
