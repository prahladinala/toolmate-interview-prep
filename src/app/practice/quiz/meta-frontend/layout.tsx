import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Meta Certified Front-End Developer Architecture Exam | ToolMate",
  description:
    "Proctored Meta Front-End Developer practice exam covering React 19 concurrent features, WCAG accessibility, INP performance, closures, and web security.",
  alternates: {
    canonical: "/practice/quiz/meta-frontend",
  },
}

export default function MetaQuizLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
