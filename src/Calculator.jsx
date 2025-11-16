import { useState } from 'react'
import './Calculator.css'

function Calculator({ isOpen, onClose }) {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  if (!isOpen) return null

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit))
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }

  const clear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue
      case '-':
        return firstValue - secondValue
      case '×':
        return firstValue * secondValue
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0
      case '%':
        return firstValue / 100
      default:
        return secondValue
    }
  }

  const handleEquals = () => {
    const inputValue = parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  const handlePercentage = () => {
    const value = parseFloat(display)
    setDisplay(String(value / 100))
  }

  return (
    <div className="calculator-overlay" onClick={onClose}>
      <div className="calculator" onClick={(e) => e.stopPropagation()}>
        <div className="calculator-header">
          <h3>🔢 Taschenrechner</h3>
          <button className="calculator-close" onClick={onClose}>×</button>
        </div>
        
        <div className="calculator-display">{display}</div>
        
        <div className="calculator-buttons">
          <button className="calc-btn calc-btn-clear" onClick={clear}>C</button>
          <button className="calc-btn calc-btn-operator" onClick={handlePercentage}>%</button>
          <button className="calc-btn calc-btn-operator" onClick={() => performOperation('÷')}>÷</button>
          <button className="calc-btn calc-btn-operator" onClick={() => performOperation('×')}>×</button>
          
          <button className="calc-btn" onClick={() => inputDigit(7)}>7</button>
          <button className="calc-btn" onClick={() => inputDigit(8)}>8</button>
          <button className="calc-btn" onClick={() => inputDigit(9)}>9</button>
          <button className="calc-btn calc-btn-operator" onClick={() => performOperation('-')}>−</button>
          
          <button className="calc-btn" onClick={() => inputDigit(4)}>4</button>
          <button className="calc-btn" onClick={() => inputDigit(5)}>5</button>
          <button className="calc-btn" onClick={() => inputDigit(6)}>6</button>
          <button className="calc-btn calc-btn-operator" onClick={() => performOperation('+')}>+</button>
          
          <button className="calc-btn" onClick={() => inputDigit(1)}>1</button>
          <button className="calc-btn" onClick={() => inputDigit(2)}>2</button>
          <button className="calc-btn" onClick={() => inputDigit(3)}>3</button>
          <button className="calc-btn calc-btn-equals" onClick={handleEquals}>=</button>
          
          <button className="calc-btn calc-btn-zero" onClick={() => inputDigit(0)}>0</button>
          <button className="calc-btn" onClick={inputDecimal}>.</button>
        </div>
      </div>
    </div>
  )
}

export default Calculator
