import { getTechStackMeta } from "@/lib/content";
import { Sidebar } from "@/components/layout/Sidebar";
import { notFound } from "next/navigation";

export default async function LearnLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tech: string }>;
}) {
  const { tech } = await params;
  const techStack = await getTechStackMeta(tech);

  if (!techStack) {
    notFound();
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar techStack={techStack} />
      <main className="flex-1 w-full max-w-full overflow-hidden bg-background">
        {children}
      </main>
    </div>
  );
}
