import { ProctoredExamEngine } from "@/components/quiz/ProctoredExamEngine"
import { metaFrontendQuestions, metaCategories } from "@/data/certifications/metaFrontendQuizData"

export default function MetaFrontendQuizPage() {
  return (
    <ProctoredExamEngine
      examTitle="Meta Certified Front-End Developer Architecture Exam"
      examSlug="meta-frontend"
      badgeText="Meta Certification"
      passingThresholdPercent={75}
      questions={metaFrontendQuestions}
      categories={metaCategories}
      defaultDurationMinutes={25}
    />
  )
}
