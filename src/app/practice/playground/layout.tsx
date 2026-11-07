import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Interactive Code Playground & Test Runner | ToolMate Interview Prep",
  description:
    "Live in-browser coding sandbox for technical interviews. Solve algorithms, JavaScript polyfills, and data structure challenges with instant test assertion validation.",
  alternates: {
    canonical: "/practice/playground",
  },
  openGraph: {
    title: "Interactive Code Playground & Test Runner | ToolMate Interview Prep",
    description:
      "Execute JavaScript & TypeScript interview solutions with in-browser test assertion suites and real-time console feedback.",
    url: "https://interview.toolmate.co.in/practice/playground",
  },
}

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
