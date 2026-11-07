import { ProctoredExamEngine } from "@/components/quiz/ProctoredExamEngine"
import { awsCertificationQuestions, awsCategories } from "@/data/certifications/awsQuizData"

export default function AwsQuizPage() {
  return (
    <ProctoredExamEngine
      examTitle="AWS Certified Solutions Architect & Cloud Practitioner Exam"
      examSlug="aws-cloud"
      badgeText="Amazon Web Services"
      passingThresholdPercent={72}
      questions={awsCertificationQuestions}
      categories={awsCategories}
      defaultDurationMinutes={25}
    />
  )
}
