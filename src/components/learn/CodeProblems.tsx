"use client"

import React, { useState } from "react";
import { CodePlayground } from "./CodePlayground";
import { Code2, Terminal } from "lucide-react";

interface Problem {
  question: string;
  answer: string;
}

interface CodeProblemsProps {
  problems: Problem[];
}

export function CodeProblems({ problems }: CodeProblemsProps) {
  const [activeTab, setActiveTab] = useState(0);

  // Extract code and explanation from the answer string
  const parseAnswer = (answer: string) => {
    const codeMatch = answer.match(/```(?:javascript|js)\n([\s\S]*?)```/);
    const code = codeMatch ? codeMatch[1].trim() : "";
    const explanation = answer.replace(/```(?:javascript|js)\n[\s\S]*?```/, "").trim();
    return { code, explanation };
  };

  const currentProblem = problems[activeTab];
  const { code, explanation } = parseAnswer(currentProblem.answer);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black mb-6 flex items-center gap-2">
        <Terminal className="text-primary" /> Interactive Coding Challenges
      </h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {problems.map((problem, i) => {
          // Extract just the basic difficulty title like "**Basic:**" if present
          const titleMatch = problem.question.match(/\*\*(.*?):\*\*/);
          const tabLabel = titleMatch ? titleMatch[1] : `Problem ${i + 1}`;
          
          return (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 rounded-lg font-bold transition-all border-2 ${
                activeTab === i
                  ? "bg-primary text-primary-foreground border-primary retro-shadow"
                  : "bg-muted text-muted-foreground border-border hover:bg-accent/20 hover:text-accent-foreground"
              }`}
            >
              {tabLabel}
            </button>
          );
        })}
      </div>

      {/* Problem Content */}
      <div className="bg-card border-2 border-border retro-shadow-sm rounded-xl overflow-hidden">
        <div className="p-6 border-b-2 border-border bg-muted/30">
          <h3 className="text-xl font-bold leading-relaxed whitespace-pre-wrap">
            {/* Remove the bold prefix since it's now in the tab */}
            {currentProblem.question.replace(/\*\*(.*?):\*\*/, '').trim()}
          </h3>
        </div>
        
        <div className="p-6 space-y-6">
          {code && (
            <div className="space-y-3">
              <h4 className="font-black text-muted-foreground uppercase tracking-widest text-sm flex items-center gap-2">
                <Code2 className="w-4 h-4" /> Solution Code
              </h4>
              <CodePlayground key={code} initialCode={code} />
            </div>
          )}

          {explanation && (
            <div className="bg-accent/10 border-l-4 border-accent p-4 text-muted-foreground font-medium text-lg leading-relaxed">
              {explanation}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
