import { describe, it, expect } from 'vitest'
import { testData } from './testData'

describe('testData', () => {
  describe('Structure validation', () => {
    it('should have exactly 5 test types', () => {
      expect(Object.keys(testData)).toHaveLength(5)
      expect(Object.keys(testData)).toEqual(['Test A', 'Test B', 'Test C', 'Test D', 'Test E'])
    })

    it('should have 43 questions per test', () => {
      Object.entries(testData).forEach(([testName, questions]) => {
        expect(questions).toHaveLength(43)
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
    const mainCategories = [
      'Grundlagen',
      'Kette der Beweissicherung',
      'Lagerung & Kennzeichnung',
      'Gefahrstoffe & Waffen',
      'Protokollierung',
      'Recht & Verwaltung'
    ]

    const supplementaryCategories = [
      'Mathematik',
      'Logik',
      'Logistik',
      'Kontextfrage',
      'Deutschkenntnisse'
    ]

    mainCategories.forEach(category => {
      it(`should have ${category} questions in all tests`, () => {
        Object.values(testData).forEach(questions => {
          const categoryQuestions = questions.filter(q => q.category === category)
          expect(categoryQuestions.length).toBeGreaterThan(0)
        })
      })
    })

    supplementaryCategories.forEach(category => {
      it(`should have ${category} questions in all tests`, () => {
        Object.values(testData).forEach(questions => {
          const categoryQuestions = questions.filter(q => q.category === category)
          expect(categoryQuestions.length).toBeGreaterThan(0)
        })
      })
    })

    it('should have balanced category distribution', () => {
      Object.entries(testData).forEach(([testName, questions]) => {
        const categoryCounts = {}
        questions.forEach(q => {
          categoryCounts[q.category] = (categoryCounts[q.category] || 0) + 1
        })
        
        // Each main category should have at least 1 question
        mainCategories.forEach(category => {
          expect(categoryCounts[category] || 0).toBeGreaterThanOrEqual(1)
        })
        
        // Each supplementary category should have at least 2 questions
        supplementaryCategories.forEach(category => {
          expect(categoryCounts[category] || 0).toBeGreaterThanOrEqual(2)
        })
      })
    })
  })

  describe('German language validation', () => {
    // Common German words/characters/patterns that should appear in text
    const germanIndicators = [
      'ä', 'ö', 'ü', 'ß',  // German umlauts and eszett
      'der', 'die', 'das', 'ein', 'eine',  // Articles
      'und', 'oder', 'ist', 'sind', 'werden',  // Common verbs/conjunctions
      'bei', 'mit', 'von', 'zu', 'nach',  // Prepositions
      'nicht', 'nur', 'alle', 'keine',  // Common words
      'man', 'unter', 'wenn', 'wie', 'was', 'sich',  // More common words
      'gibt', 'werden', 'haben', 'können', 'müssen',  // Verbs
      'welche', 'welcher', 'welches', 'wer', 'wo'  // Question words
    ]

    // German category names that don't necessarily contain common indicators
    const germanCategories = [
      'grundlagen', 'kette der beweissicherung', 'lagerung & kennzeichnung',
      'gefahrstoffe & waffen', 'protokollierung', 'recht & verwaltung',
      'mathematik', 'logik', 'logistik', 'kontextfrage', 
      'aufbewahrung', 'dokumentation', 'sicherheit',
      'kennzeichnung', 'lagerung', 'ausgabe', 'verpackung',
      'transport', 'vernichtung', 'waffen', 'hygiene', 'rückgabe',
      'zugriffskontrolle', 'rechtsgrundlagen', 'spurensicherung',
      'betäubungsmittel', 'integrität', 'brandschutz', 'wertsachen',
      'fotodokumentation', 'chemikalien', 'zustandsbericht', 'elektronik',
      'lebensmittel', 'klimatisierung', 'versiegelung', 'notfallplan',
      'schutzmaßnahmen', 'digitale beweismittel', 'digitale asservate', 'verzeichnis',
      'übernahme', 'waffen & munition', 'kontrolle', 'beschriftung',
      'rechtliche folgen', 'aufbewahrungsfristen', 'nummerierung',
      'herausgabe', 'kontamination', 'bargeld', 'biologische spuren',
      'datenschutz', 'qualitätssicherung', 'schulung', 'archivierung',
      'umweltschutz', 'zutrittskontrolle', 'sonderasservate', 'haftung',
      'digitalisierung', 'zusammenarbeit', 'arbeitssicherheit', 'beweismittelkette',
      'kriminaltechnik', 'verwaltungsvorschriften', 'rechtsprechung', 'spurenauswertung',
      'hygienemaßnahmen', 'fundsachen', 'verpackungsmaterial', 'schulungspflicht',
      'kennzeichnungssysteme', 'videoüberwachung', 'probenlagerung', 'anforderungsschein',
      'brandlasten', 'rückverfolgbarkeit', 'schimmelbefall', 'gerichtstermin',
      'vertraulichkeit', 'qualitätskontrolle', 'aktenzeichen', 'spurenschutz',
      'raumklima', 'beweiskraft', 'notfallmaßnahmen', 'übergabe', 'probenteilung',
      'wertermittlung', 'entsorgung', 'datensicherung', 'textilien', 'zugriffsrechte',
      'versicherung', 'spurenträger', 'altlasten', 'siegelbruch', 'fundunterschlagung',
      'gefahrstoffe', 'deutschkenntnisse'
    ]


    const hasGermanCharacteristics = (text) => {
      const lowerText = text.toLowerCase()
      return germanIndicators.some(indicator => lowerText.includes(indicator))
    }

    const isGermanCategory = (text) => {
      const lowerText = text.toLowerCase()
      return germanCategories.some(category => lowerText.includes(category)) ||
             hasGermanCharacteristics(lowerText)
    }

    Object.entries(testData).forEach(([testName, questions]) => {
      describe(`${testName}`, () => {
        it('questions should be in German', () => {
          questions.forEach((question, index) => {
            const questionText = question.question.toLowerCase()
            const hasGermanChars = hasGermanCharacteristics(questionText)
            
            expect(hasGermanChars).toBe(true)
          })
        })

        it('questions and options combined should be in German', () => {
          questions.forEach((question, index) => {
            // Check question + options together to allow for math questions with short answers
            const fullText = (question.question + ' ' + question.options.join(' ')).toLowerCase()
            const hasGermanChars = hasGermanCharacteristics(fullText)
            
            expect(hasGermanChars).toBe(true)
          })
        })

        it('categories should be in German', () => {
          questions.forEach((question, index) => {
            const categoryText = question.category.toLowerCase()
            const isGerman = isGermanCategory(categoryText)
            
            expect(isGerman).toBe(true)
          })
        })
      })
    })
  })
})
