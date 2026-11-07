import { Metadata } from "next"
import { getTechStackMeta } from "@/lib/content"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tech: string }>
}): Promise<Metadata> {
  const { tech } = await params
  const meta = await getTechStackMeta(tech)

  const title = meta
    ? `${meta.title} Interview Cheat Sheet & Quick Revision PDF | ToolMate`
    : "Technical Interview Cheat Sheet & Revision Deck | ToolMate"

  const description = meta
    ? `Printable 1-page condensed interview revision sheet for ${meta.title}. Includes core architecture, gotchas, complexity matrices, and interview golden rules.`
    : "Condensed printable interview cheat sheet with time complexity and core architecture rules."

  return {
    title,
    description,
    alternates: {
      canonical: `/learn/${tech}/cheatsheet`,
    },
    openGraph: {
      title,
      description,
      url: `https://interview.toolmate.co.in/learn/${tech}/cheatsheet`,
    },
  }
}

export default function CheatSheetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
