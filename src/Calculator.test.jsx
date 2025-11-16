import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Calculator from './Calculator'

describe('Calculator', () => {
  it('should not render when isOpen is false', () => {
    const { container } = render(<Calculator isOpen={false} onClose={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('should render when isOpen is true', () => {
    render(<Calculator isOpen={true} onClose={vi.fn()} />)
    expect(screen.getByText('🔢 Taschenrechner')).toBeInTheDocument()
  })

  it('should display initial value of 0', () => {
    const { container } = render(<Calculator isOpen={true} onClose={vi.fn()} />)
    const display = container.querySelector('.calculator-display')
    expect(display.textContent).toBe('0')
  })

  it('should input digit when number button is clicked', () => {
    const { container } = render(<Calculator isOpen={true} onClose={vi.fn()} />)
    fireEvent.click(screen.getByText('5'))
    const display = container.querySelector('.calculator-display')
    expect(display.textContent).toBe('5')
  })

  it('should perform addition correctly', () => {
    const { container } = render(<Calculator isOpen={true} onClose={vi.fn()} />)
    fireEvent.click(screen.getByText('2'))
    fireEvent.click(screen.getByText('+'))
    fireEvent.click(screen.getByText('3'))
    fireEvent.click(screen.getByText('='))
    const display = container.querySelector('.calculator-display')
    expect(display.textContent).toBe('5')
  })

  it('should perform subtraction correctly', () => {
    const { container } = render(<Calculator isOpen={true} onClose={vi.fn()} />)
    fireEvent.click(screen.getByText('5'))
    fireEvent.click(screen.getByText('−'))
    fireEvent.click(screen.getByText('3'))
    fireEvent.click(screen.getByText('='))
    const display = container.querySelector('.calculator-display')
    expect(display.textContent).toBe('2')
  })

  it('should perform multiplication correctly', () => {
    const { container } = render(<Calculator isOpen={true} onClose={vi.fn()} />)
    const buttons = screen.getAllByText('4')
    const fourButton = buttons.find(btn => btn.classList.contains('calc-btn') && !btn.classList.contains('calc-btn-operator'))
    fireEvent.click(fourButton)
    const multiplyButtons = screen.getAllByText('×')
    const multiplyButton = multiplyButtons.find(btn => btn.classList.contains('calc-btn-operator'))
    fireEvent.click(multiplyButton)
    fireEvent.click(screen.getByText('5'))
    fireEvent.click(screen.getByText('='))
    const display = container.querySelector('.calculator-display')
    expect(display.textContent).toBe('20')
  })

  it('should perform division correctly', () => {
    const { container } = render(<Calculator isOpen={true} onClose={vi.fn()} />)
    fireEvent.click(screen.getByText('8'))
    fireEvent.click(screen.getByText('÷'))
    fireEvent.click(screen.getByText('2'))
    fireEvent.click(screen.getByText('='))
    const display = container.querySelector('.calculator-display')
    expect(display.textContent).toBe('4')
  })

  it('should handle decimal point', () => {
    const { container } = render(<Calculator isOpen={true} onClose={vi.fn()} />)
    fireEvent.click(screen.getByText('3'))
    fireEvent.click(screen.getByText('.'))
    fireEvent.click(screen.getByText('5'))
    const display = container.querySelector('.calculator-display')
    expect(display.textContent).toBe('3.5')
  })

  it('should calculate percentage', () => {
    const { container } = render(<Calculator isOpen={true} onClose={vi.fn()} />)
    fireEvent.click(screen.getByText('5'))
    const buttons = screen.getAllByText('0')
    const zeroButton = buttons.find(btn => btn.classList.contains('calc-btn-zero'))
    fireEvent.click(zeroButton)
    fireEvent.click(screen.getByText('%'))
    const display = container.querySelector('.calculator-display')
    expect(display.textContent).toBe('0.5')
  })

  it('should clear display when C button is clicked', () => {
    const { container } = render(<Calculator isOpen={true} onClose={vi.fn()} />)
    fireEvent.click(screen.getByText('9'))
    fireEvent.click(screen.getByText('8'))
    fireEvent.click(screen.getByText('C'))
    const display = container.querySelector('.calculator-display')
    expect(display.textContent).toBe('0')
  })

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn()
    const { container } = render(<Calculator isOpen={true} onClose={onClose} />)
    const closeButton = container.querySelector('.calculator-close')
    fireEvent.click(closeButton)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when overlay is clicked', () => {
    const onClose = vi.fn()
    const { container } = render(<Calculator isOpen={true} onClose={onClose} />)
    const overlay = container.querySelector('.calculator-overlay')
    fireEvent.click(overlay)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should not close when calculator body is clicked', () => {
    const onClose = vi.fn()
    const { container } = render(<Calculator isOpen={true} onClose={onClose} />)
    const calculatorBody = container.querySelector('.calculator')
    fireEvent.click(calculatorBody)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('should handle multiple digit input', () => {
    const { container } = render(<Calculator isOpen={true} onClose={vi.fn()} />)
    fireEvent.click(screen.getByText('1'))
    fireEvent.click(screen.getByText('2'))
    fireEvent.click(screen.getByText('3'))
    const display = container.querySelector('.calculator-display')
    expect(display.textContent).toBe('123')
  })

  it('should handle complex calculation', () => {
    const { container } = render(<Calculator isOpen={true} onClose={vi.fn()} />)
    // (15 + 10) * 2 = 50
    fireEvent.click(screen.getByText('1'))
    fireEvent.click(screen.getByText('5'))
    fireEvent.click(screen.getByText('+'))
    fireEvent.click(screen.getByText('1'))
    const buttons = screen.getAllByText('0')
    const zeroButton = buttons.find(btn => btn.classList.contains('calc-btn-zero'))
    fireEvent.click(zeroButton)
    const multiplyButtons = screen.getAllByText('×')
    const multiplyButton = multiplyButtons.find(btn => btn.classList.contains('calc-btn-operator'))
    fireEvent.click(multiplyButton)
    fireEvent.click(screen.getByText('2'))
    fireEvent.click(screen.getByText('='))
    const display = container.querySelector('.calculator-display')
    expect(display.textContent).toBe('50')
  })

  it('should prevent division by zero', () => {
    const { container } = render(<Calculator isOpen={true} onClose={vi.fn()} />)
    fireEvent.click(screen.getByText('5'))
    fireEvent.click(screen.getByText('÷'))
    const buttons = screen.getAllByText('0')
    const zeroButton = buttons.find(btn => btn.classList.contains('calc-btn-zero'))
    fireEvent.click(zeroButton)
    fireEvent.click(screen.getByText('='))
    const display = container.querySelector('.calculator-display')
    expect(display.textContent).toBe('0')
  })
})
