import { describe, it, expect } from 'vitest'
import { testData } from './testData'

describe('testData', () => {
  describe('Structure validation', () => {
    it('should have exactly 3 test types', () => {
      expect(Object.keys(testData)).toHaveLength(3)
      expect(Object.keys(testData)).toEqual(['Test A', 'Test B', 'Test C'])
    })

    it('should have 30 questions per test', () => {
      Object.entries(testData).forEach(([testName, questions]) => {
        expect(questions).toHaveLength(30)
      })
    })
  })

  describe('Question validation', () => {
    Object.entries(testData).forEach(([testName, questions]) => {
      describe(`${testName}`, () => {
        it('should have valid question structure', () => {
          questions.forEach((question, index) => {
            expect(question).toHaveProperty('id')
            expect(question).toHaveProperty('category')
            expect(question).toHaveProperty('question')
            expect(question).toHaveProperty('options')
            expect(question).toHaveProperty('correctAnswer')
            
            // ID should match index + 1
            expect(question.id).toBe(index + 1)
            
            // Question text should not be empty
            expect(question.question).toBeTruthy()
            expect(question.question.length).toBeGreaterThan(10)
            
            // Category should not be empty
            expect(question.category).toBeTruthy()
            
            // Should have exactly 4 options
            expect(question.options).toHaveLength(4)
            
            // All options should be non-empty strings
            question.options.forEach(option => {
              expect(typeof option).toBe('string')
              expect(option.length).toBeGreaterThan(0)
            })
            
            // Correct answer should be between 0-3
            expect(question.correctAnswer).toBeGreaterThanOrEqual(0)
            expect(question.correctAnswer).toBeLessThanOrEqual(3)
          })
        })

        it('should have diverse categories', () => {
          const categories = [...new Set(questions.map(q => q.category))]
          expect(categories.length).toBeGreaterThan(5)
        })

        it('should include new category types', () => {
          const categories = questions.map(q => q.category)
          const newCategories = ['Mathematik', 'Logik', 'Kontextfrage', 'Logistik']
          const hasNewCategories = newCategories.some(cat => categories.includes(cat))
          expect(hasNewCategories).toBe(true)
        })
      })
    })
  })

  describe('Category distribution', () => {
    it('should have math questions in all tests', () => {
      Object.values(testData).forEach(questions => {
        const mathQuestions = questions.filter(q => q.category === 'Mathematik')
        expect(mathQuestions.length).toBeGreaterThan(0)
      })
    })

    it('should have logic questions in all tests', () => {
      Object.values(testData).forEach(questions => {
        const logicQuestions = questions.filter(q => q.category === 'Logik')
        expect(logicQuestions.length).toBeGreaterThan(0)
      })
    })

    it('should have context questions in all tests', () => {
      Object.values(testData).forEach(questions => {
        const contextQuestions = questions.filter(q => q.category === 'Kontextfrage')
        expect(contextQuestions.length).toBeGreaterThan(0)
      })
    })

    it('should have logistics questions in all tests', () => {
      Object.values(testData).forEach(questions => {
        const logisticsQuestions = questions.filter(q => q.category === 'Logistik')
        expect(logisticsQuestions.length).toBeGreaterThan(0)
      })
    })
  })
})
