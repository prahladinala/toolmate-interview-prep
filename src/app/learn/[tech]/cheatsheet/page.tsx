import { getTechStackMeta } from "@/lib/content"
import { notFound } from "next/navigation"
import { CURATED_CHEATSHEETS, TechCheatSheet } from "@/data/cheatsheets"
import { PrintableCheatSheet } from "@/components/cheatsheet/PrintableCheatSheet"

export default async function TechCheatSheetPage({
  params,
}: {
  params: Promise<{ tech: string }>
}) {
  const { tech } = await params
  const meta = await getTechStackMeta(tech)

  if (!meta) {
    notFound()
  }

  // Get curated or generate from meta
  const curated = CURATED_CHEATSHEETS[tech]
  const sheet: TechCheatSheet = curated || {
    techId: meta.id,
    title: `${meta.title} Interview Revision Sheet`,
    tagline: meta.description,
    goldenRules: [
      `Master the core architectural mental model of ${meta.title} before diving into syntax.`,
      `Always be prepared to explain tradeoffs: memory vs time, complexity vs readability.`,
      `Understand how ${meta.title} handles errors, edge cases, and runtime lifecycle states.`,
      `Be ready to debug common failure modes and explain production monitoring approaches.`
    ],
    sections: meta.categories.map((cat) => ({
      title: cat.title,
      items: cat.topics.slice(0, 4).map((top) => ({
        name: top.title,
        notes: `Core concept in ${meta.title}. Essential for understanding ${cat.title} and real-world system architecture.`,
        gotcha: `Pay attention to edge cases and asynchronous boundary conditions.`
      }))
    }))
  }

  return <PrintableCheatSheet sheet={sheet} meta={meta} />
}
