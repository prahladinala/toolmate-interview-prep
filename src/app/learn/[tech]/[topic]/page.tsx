import { getTechStackMeta, getTopicContent } from "@/lib/content";
import { notFound } from "next/navigation";
import { RetroBadge } from "@/components/retro/retro-badge";
import { CodePlayground } from "@/components/learn/CodePlayground";
import { CompleteTopicButton } from "@/components/learn/CompleteTopicButton";
import { FlashCard } from "@/components/learn/FlashCard";
import { MermaidDiagram } from "@/components/learn/MermaidDiagram";
import { HelpCircle, BookOpen, Briefcase, Lightbulb, Code2, Network, Table } from "lucide-react";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ tech: string; topic: string }>;
}) {
  const { tech, topic } = await params;
  const [techStack, topicContent] = await Promise.all([
    getTechStackMeta(tech),
    getTopicContent(tech, topic),
  ]);

  if (!techStack || !topicContent) {
    notFound();
  }

  // Find next topic ID
  let nextTopicId: string | undefined;
  const allTopics = techStack.categories.flatMap((cat) => cat.topics);
  const currentIndex = allTopics.findIndex((t) => t.id === topic);
  if (currentIndex !== -1 && currentIndex < allTopics.length - 1) {
    nextTopicId = allTopics[currentIndex + 1].id;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-12 pb-32">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <RetroBadge variant="outline" className="text-muted-foreground bg-muted">
            {techStack.title}
          </RetroBadge>
          <span className="text-muted-foreground">/</span>
          <RetroBadge variant="secondary">{topicContent.difficulty}</RetroBadge>
        </div>
        <h1 className="text-4xl md:text-5xl font-black">{topicContent.title}</h1>
      </header>

      {/* Definition & Explanation */}
      <section className="space-y-8">
        <div className="p-6 bg-card border-2 border-border retro-shadow-sm rounded-xl">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="text-primary" /> Definition
          </h2>
          <p className="text-lg leading-relaxed">{topicContent.definition}</p>
        </div>

        <div className="p-6 bg-accent/20 border-2 border-accent retro-shadow-sm rounded-xl">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Lightbulb className="text-accent-foreground" /> Explain Like I'm New
          </h2>
          <p className="text-lg leading-relaxed font-medium text-muted-foreground">
            {topicContent.simpleExplanation}
          </p>
        </div>
      </section>

      {/* Real World & Use Cases */}
      <section className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Briefcase className="text-secondary" /> Real World Example
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {topicContent.realWorldExample}
          </p>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Common Use Cases</h2>
          <ul className="space-y-2">
            {topicContent.useCases.map((useCase, i) => (
              <li key={i} className="flex items-start gap-2 text-muted-foreground">
                <span className="text-primary font-bold mt-1">•</span>
                <span>{useCase}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Visual Data / Tables */}
      {topicContent.tableData && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Table className="text-primary" /> {topicContent.tableData.title || "Parameter Breakdown"}
          </h2>
          <div className="overflow-x-auto rounded-xl border-2 border-border retro-shadow-sm bg-card">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted border-b-2 border-border">
                  {topicContent.tableData.headers.map((header, i) => (
                    <th key={i} className="p-4 font-black text-muted-foreground whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-border">
                {topicContent.tableData.rows.map((row, i) => (
                  <tr key={i} className="hover:bg-muted/50 transition-colors">
                    {row.map((cell, j) => (
                      <td key={j} className="p-4 align-top">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Visual Aids / Flowcharts */}
      {topicContent.diagramContent && topicContent.diagramType === "mermaid" && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Network className="text-secondary" /> Architecture & Flow
          </h2>
          <MermaidDiagram chart={topicContent.diagramContent} />
        </section>
      )}

      {/* Code Example (if any) */}
      {topicContent.codeExample && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Code2 className="text-primary" /> Interactive Example
          </h2>
          <CodePlayground initialCode={topicContent.codeExample} />
        </section>
      )}

      {/* Interview Questions */}
      <section className="space-y-6 pt-8 border-t-2 border-border">
        <h2 className="text-3xl font-black mb-6 flex items-center gap-2">
          <HelpCircle className="text-destructive" /> Interview Questions
        </h2>
        
        <div className="space-y-8">
          {Object.entries(topicContent.questions).map(([level, questions]) => {
            if (!questions || questions.length === 0) return null;
            return (
              <div key={level}>
                <h3 className="text-lg font-bold capitalize mb-3 text-muted-foreground">{level}</h3>
                <ul className="space-y-3">
                  {questions.map((q, i) => (
                    <li key={i} className="p-4 bg-muted border-2 border-border rounded-lg font-medium">
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      {/* Quick Answers / Flash Cards Section */}
      <section className="space-y-6 pt-8 border-t-2 border-border">
        <h2 className="text-3xl font-black mb-6">Flash Cards</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {topicContent.answers.map((item, i) => (
            <FlashCard key={i} question={item.question} answer={item.answer} />
          ))}
        </div>
      </section>

      {/* Action Footer */}
      <div className="pt-12 flex justify-center">
        <CompleteTopicButton 
          topicId={topic} 
          techId={tech} 
          nextTopicId={nextTopicId} 
        />
      </div>
    </div>
  );
}
