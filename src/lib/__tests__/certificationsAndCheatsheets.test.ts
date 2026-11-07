import { describe, it, expect } from "vitest"
import { awsCertificationQuestions, awsCategories } from "@/data/certifications/awsQuizData"
import { metaFrontendQuestions, metaCategories } from "@/data/certifications/metaFrontendQuizData"
import { systemDesignQuestions, systemDesignCategories } from "@/data/certifications/systemDesignQuizData"
import { webPerfQuestions, webPerfCategories } from "@/data/certifications/webPerfQuizData"
import { CURATED_CHEATSHEETS } from "@/data/cheatsheets"

describe("Certification Quiz Banks Integrity", () => {
  const suites = [
    { name: "AWS Cloud", questions: awsCertificationQuestions, categories: awsCategories },
    { name: "Meta Frontend", questions: metaFrontendQuestions, categories: metaCategories },
    { name: "System Design", questions: systemDesignQuestions, categories: systemDesignCategories },
    { name: "Web Performance", questions: webPerfQuestions, categories: webPerfCategories },
  ]

  suites.forEach(({ name, questions, categories }) => {
    describe(`${name} Exam Pack`, () => {
      it(`has valid questions and options in ${name}`, () => {
        expect(questions.length).toBeGreaterThanOrEqual(5)
        expect(categories.length).toBeGreaterThanOrEqual(3)

        questions.forEach((q) => {
          expect(q.id).toBeDefined()
          expect(q.question.trim().length).toBeGreaterThan(10)
          expect(q.options.length).toBeGreaterThanOrEqual(2)
          expect(q.answer.length).toBeGreaterThanOrEqual(1)
          expect(q.explanation.trim().length).toBeGreaterThan(10)
          expect(q.category.trim().length).toBeGreaterThan(0)

          // Answer indices bounds check
          q.answer.forEach((idx) => {
            expect(idx).toBeGreaterThanOrEqual(0)
            expect(idx).toBeLessThan(q.options.length)
          })

          expect(q.isMultiSelect).toBe(q.answer.length > 1)
        })
      })
    })
  })
})

describe("Printable Cheat Sheets Integrity", () => {
  it("contains curated sheets for key interview technologies", () => {
    const keys = Object.keys(CURATED_CHEATSHEETS)
    expect(keys).toContain("javascript")
    expect(keys).toContain("react")
    expect(keys).toContain("dsa-javascript")
    expect(keys).toContain("frontend-system-design")
    expect(keys).toContain("nextjs")
    expect(keys).toContain("typescript")
  })

  it("ensures every curated sheet has golden rules and structured sections", () => {
    Object.values(CURATED_CHEATSHEETS).forEach((sheet) => {
      expect(sheet.title.trim().length).toBeGreaterThan(5)
      expect(sheet.tagline.trim().length).toBeGreaterThan(5)
      expect(sheet.goldenRules.length).toBeGreaterThanOrEqual(3)
      expect(sheet.sections.length).toBeGreaterThanOrEqual(1)

      sheet.sections.forEach((section) => {
        expect(section.title.trim().length).toBeGreaterThan(2)
        expect(section.items.length).toBeGreaterThanOrEqual(1)
        section.items.forEach((item) => {
          expect(item.name.trim().length).toBeGreaterThan(0)
          expect(item.notes.trim().length).toBeGreaterThan(5)
        })
      })
    })
  })
})
