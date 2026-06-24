import { getTechStackMeta } from "@/lib/content";
import { notFound, redirect } from "next/navigation";

export default async function TechPage({ params }: { params: Promise<{ tech: string }> }) {
  const { tech } = await params;
  const techStack = await getTechStackMeta(tech);

  if (!techStack) {
    notFound();
  }

  // Redirect to the first topic automatically
  if (techStack.categories.length > 0 && techStack.categories[0].topics.length > 0) {
    const firstTopicId = techStack.categories[0].topics[0].id;
    redirect(`/learn/${tech}/${firstTopicId}`);
  }

  return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="text-center space-y-4 max-w-lg">
        <div className="text-6xl mb-6">
          {techStack.icon === 'javascript' ? '💛' : techStack.icon === 'react' ? '⚛️' : '💻'}
        </div>
        <h1 className="text-4xl font-black">{techStack.title} Course</h1>
        <p className="text-lg text-muted-foreground font-medium">
          {techStack.description}
        </p>
        <div className="pt-8">
          <p className="text-muted-foreground">More content coming soon!</p>
        </div>
      </div>
    </div>
  );
}
