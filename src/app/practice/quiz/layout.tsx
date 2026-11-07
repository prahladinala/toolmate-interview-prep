import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Technical Interview Quiz Mode | ToolMate Interview Prep",
  description: "Test your skills with interactive multiple-choice assessments across JavaScript, React, Next.js, TypeScript, DSA, and System Design.",
  alternates: {
    canonical: "/practice/quiz",
  },
  openGraph: {
    title: "Technical Interview Quiz Mode | ToolMate Interview Prep",
    description: "Test your skills with interactive multiple-choice assessments across 17 technologies.",
    url: "https://interview.toolmate.co.in/practice/quiz",
  },
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
