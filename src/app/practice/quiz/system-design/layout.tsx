import { Metadata } from "next"

export const metadata: Metadata = {
  title: "System Design & Microservices Architecture Exam | ToolMate",
  description:
    "Proctored System Design interview examination covering CAP theorem, Consistent Hashing, Saga pattern, Cache Stampede mitigation, and Reverse Proxies.",
  alternates: {
    canonical: "/practice/quiz/system-design",
  },
}

export default function SystemDesignQuizLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
