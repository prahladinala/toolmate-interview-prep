import { ProctoredExamEngine } from "@/components/quiz/ProctoredExamEngine"
import { systemDesignQuestions, systemDesignCategories } from "@/data/certifications/systemDesignQuizData"

export default function SystemDesignQuizPage() {
  return (
    <ProctoredExamEngine
      examTitle="System Design & Scalability Architect Exam"
      examSlug="system-design-exam"
      badgeText="High-Level Architecture"
      passingThresholdPercent={70}
      questions={systemDesignQuestions}
      categories={systemDesignCategories}
      defaultDurationMinutes={25}
    />
  )
}
