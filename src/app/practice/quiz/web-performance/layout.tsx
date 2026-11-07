import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Web Performance & Core Web Vitals Specialist Exam | ToolMate",
  description:
    "Proctored certification exam covering LCP, INP, CLS optimization, resource hints, Critical Rendering Path, and AVIF asset compression.",
  alternates: {
    canonical: "/practice/quiz/web-performance",
  },
}

export default function WebPerfQuizLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
