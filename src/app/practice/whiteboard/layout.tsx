import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Interactive System Design Whiteboard & Architecture Canvas | ToolMate",
  description:
    "Interactive system design diagramming canvas for technical mock interviews. Sketch microservices, load balancers, caching layers, and database sharding architectures.",
  alternates: {
    canonical: "/practice/whiteboard",
  },
  openGraph: {
    title: "System Design Architecture Whiteboard | ToolMate Interview Prep",
    description:
      "Interactive diagramming canvas with pre-built architectural components, drag-and-drop connectors, and senior interview templates.",
    url: "https://interview.toolmate.co.in/practice/whiteboard",
  },
}

export default function WhiteboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
