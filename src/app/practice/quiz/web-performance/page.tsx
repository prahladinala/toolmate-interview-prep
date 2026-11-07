import { ProctoredExamEngine } from "@/components/quiz/ProctoredExamEngine"
import { webPerfQuestions, webPerfCategories } from "@/data/certifications/webPerfQuizData"

export default function WebPerfQuizPage() {
  return (
    <ProctoredExamEngine
      examTitle="Web Performance & Core Web Vitals Specialist Exam"
      examSlug="web-performance-exam"
      badgeText="Google Core Web Vitals"
      passingThresholdPercent={70}
      questions={webPerfQuestions}
      categories={webPerfCategories}
      defaultDurationMinutes={20}
    />
  )
}
