import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Mock Interview Room (Timed Screen) | ToolMate Interview Prep",
  description: "Simulated 15-minute technical interview screens with AI-assisted rubric evaluation and sample answers.",
  alternates: {
    canonical: "/practice/mock",
  },
  openGraph: {
    title: "Mock Interview Room (Timed Screen) | ToolMate Interview Prep",
    description: "Simulated 15-minute technical interview screens with AI-assisted rubric evaluation.",
    url: "https://interview.toolmate.co.in/practice/mock",
  },
};

export default function MockLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
