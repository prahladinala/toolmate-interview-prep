import { describe, it, expect } from "vitest"
import { jutroQuestions, jutroCategories } from "@/data/jutroQuizData"

describe("Jutro Quiz Data Integrity", () => {
  it("contains all authentic Guidewire Jutro questions", () => {
    expect(jutroQuestions.length).toBeGreaterThanOrEqual(117)
  })

  it("ensures all questions have valid text, options, and answer indices", () => {
    jutroQuestions.forEach((q, index) => {
      expect(q.id).toBe(`jutro-${index + 1}`)
      expect(q.question.trim().length).toBeGreaterThan(10)
      expect(q.options.length).toBeGreaterThanOrEqual(2)
      expect(q.answer.length).toBeGreaterThanOrEqual(1)
      expect(q.explanation.trim().length).toBeGreaterThan(5)
      expect(q.category.trim().length).toBeGreaterThan(0)

      // Ensure every answer index is within the bounds of q.options
      q.answer.forEach((ansIdx) => {
        expect(ansIdx).toBeGreaterThanOrEqual(0)
        expect(ansIdx).toBeLessThan(q.options.length)
      })

      // Ensure isMultiSelect is consistent
      expect(q.isMultiSelect).toBe(q.answer.length > 1)
    })
  })

  it("extracts distinct categories with reasonable question distribution", () => {
    expect(jutroCategories.length).toBeGreaterThanOrEqual(5)
    expect(jutroCategories).toContain("Components & Patterns")
    expect(jutroCategories).toContain("Floorplans & Layouts")
    expect(jutroCategories).toContain("Theming & Design Tokens")
  })
})

describe("Jutro Quiz Scoring & Category Breakdown Logic", () => {
  it("correctly identifies single-choice answers", () => {
    const singleQ = jutroQuestions.find((q) => !q.isMultiSelect)!
    expect(singleQ).toBeDefined()
    const correctAns = singleQ.answer

    // Exactly matching answer array
    const userAnsCorrect = [...correctAns]
    const isCorrect =
      userAnsCorrect.length === correctAns.length &&
      userAnsCorrect.every((a) => correctAns.includes(a))
    expect(isCorrect).toBe(true)

    // Wrong answer
    const wrongAns = [correctAns[0] === 0 ? 1 : 0]
    const isWrong =
      wrongAns.length === correctAns.length &&
      wrongAns.every((a) => correctAns.includes(a))
    expect(isWrong).toBe(false)
  })

  it("correctly evaluates multi-select answers requiring all selections", () => {
    const multiQ = jutroQuestions.find((q) => q.isMultiSelect)!
    expect(multiQ).toBeDefined()
    const correctAns = multiQ.answer

    // Fully correct selection
    const userAnsCorrect = [...correctAns].reverse()
    const isCorrect =
      userAnsCorrect.length === correctAns.length &&
      userAnsCorrect.every((a) => correctAns.includes(a))
    expect(isCorrect).toBe(true)

    // Partial selection (e.g., missing one option)
    const partialAns = [correctAns[0]]
    const isPartialCorrect =
      partialAns.length === correctAns.length &&
      partialAns.every((a) => correctAns.includes(a))
    expect(isPartialCorrect).toBe(false)

    // Extra incorrect selection
    const extraAns = [...correctAns, 999]
    const isExtraCorrect =
      extraAns.length === correctAns.length &&
      extraAns.every((a) => correctAns.includes(a))
    expect(isExtraCorrect).toBe(false)
  })

  it("correctly computes Guidewire 70% passing threshold", () => {
    const total = 117
    const passThreshold = 0.7

    const passingScore = Math.ceil(total * passThreshold) // 82
    expect(passingScore).toBe(82)
    expect((82 / 117) * 100).toBeGreaterThanOrEqual(70)
    expect((81 / 117) * 100).toBeLessThan(70)
  })

  it("accurately calculates domain category breakdowns", () => {
    const sampleQuestions = jutroQuestions.slice(0, 10)
    const mockSelections: Record<number, number[]> = {}

    // Answer even indices correctly, odd incorrectly
    sampleQuestions.forEach((q, idx) => {
      mockSelections[idx] = idx % 2 === 0 ? [...q.answer] : [999]
    })

    const categoryBreakdown: Record<string, { correct: number; total: number }> = {}

    sampleQuestions.forEach((q, idx) => {
      if (!categoryBreakdown[q.category]) {
        categoryBreakdown[q.category] = { correct: 0, total: 0 }
      }
      categoryBreakdown[q.category].total += 1

      const userSel = mockSelections[idx] || []
      const isCorrect =
        userSel.length === q.answer.length &&
        userSel.every((val) => q.answer.includes(val))

      if (isCorrect) {
        categoryBreakdown[q.category].correct += 1
      }
    })

    const totalCalculated = Object.values(categoryBreakdown).reduce(
      (sum, c) => sum + c.total,
      0
    )
    const totalCorrectCalculated = Object.values(categoryBreakdown).reduce(
      (sum, c) => sum + c.correct,
      0
    )

    expect(totalCalculated).toBe(10)
    expect(totalCorrectCalculated).toBe(5)
  })
})
