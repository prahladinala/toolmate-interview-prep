import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Spaced Repetition Review Queue | ToolMate Interview Prep",
  description: "Personalized SM-2 review queue.",
  robots: {
    index: false,
  },
};

export default function ReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
