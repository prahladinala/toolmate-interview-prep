import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Guidewire Jutro Developer Certification Exam & Practice Quiz | ToolMate",
  description:
    "Master Guidewire Jutro with all 117 authentic certification questions. Features strict anti-cheat tab-change proctoring, SVG performance comparison graphs, domain breakdown, and question palette.",
  keywords: [
    "Guidewire Jutro",
    "Jutro certification",
    "Guidewire Jutro exam questions",
    "Jutro developer test",
    "Jutro design tokens",
    "Jutro floorplans",
    "Jutro micro-frontends",
    "Jutro quiz",
  ],
  alternates: {
    canonical: "/practice/quiz/jutro",
  },
  openGraph: {
    title: "Guidewire Jutro Developer Certification Exam (117 Questions) | ToolMate",
    description:
      "Full interactive certification prep for Guidewire Jutro Developers. Anti-cheat proctoring, score delta charts, and full answer explanations.",
    url: "https://interview.toolmate.co.in/practice/quiz/jutro",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Guidewire Jutro Developer Certification Exam | ToolMate",
    description:
      "Interactive Guidewire Jutro Developer Certification Exam with 117 questions, proctoring, and visual progress tracking.",
  },
}

export default function JutroQuizLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: "Guidewire Jutro Developer Certification Practice Examination",
    description:
      "117-question comprehensive certification practice assessment covering Guidewire Jutro architecture, floorplans, metadata, design tokens, canvas, and digital APIs.",
    educationalLevel: "Professional Certification",
    assesses: "Guidewire Jutro Framework and Enterprise Frontend Architecture",
    provider: {
      "@type": "Organization",
      name: "ToolMate Interview Prep",
      url: "https://interview.toolmate.co.in",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}
