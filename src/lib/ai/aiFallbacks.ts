/**
 * Educational Heuristic Fallback Engine
 * 
 * Provides rich, deterministic, curriculum-grounded explanations, answer evaluations,
 * progressive hints, and follow-ups when Chrome Built-in AI is unsupported or downloading.
 */

import { TopicContent } from '@/types/content';

export type ExplanationLevel = 'beginner' | 'intermediate' | 'advanced' | 'interview-ready';

export interface EvaluatedAnswer {
  score: number; // 0 to 100
  rating: 'Excellent' | 'Good' | 'Needs Improvement' | 'Incomplete';
  whatWasCorrect: string[];
  whatWasMissing: string[];
  whatWasIncorrect: string[];
  interviewerExpectation: string;
  improvedSampleAnswer: string;
  followUpQuestion: string;
  recommendedRevision: string;
}

export interface ProgressiveHint {
  level: 1 | 2 | 3;
  title: string;
  content: string;
}

/**
 * Generates structured explanation across 4 customizable depth levels
 */
export function generateCurriculumExplanation(
  topic: TopicContent,
  level: ExplanationLevel
): {
  level: ExplanationLevel;
  badge: string;
  title: string;
  summary: string;
  details: string[];
  analogy?: string;
  codeBreakdown?: string;
  memoryAid: string;
} {
  switch (level) {
    case 'beginner':
      return {
        level,
        badge: "ELI5 / Beginner",
        title: `Simplifying ${topic.title}`,
        summary: topic.simpleExplanation || topic.definition,
        analogy: topic.realWorldExample || `Imagine ${topic.title} as a specialized everyday tool that handles a repetitive task for you automatically.`,
        details: [
          `Core Concept: ${topic.definition}`,
          `Why it matters: It prevents bugs and makes programs much easier to read and maintain.`,
          topic.useCases?.[0] ? `Typical scenario: ${topic.useCases[0]}` : 'Common in everyday programming.',
        ],
        memoryAid: `Mental Picture: ${topic.realWorldExample?.slice(0, 80) || topic.title + ' is your helper'}.`,
      };

    case 'intermediate':
      return {
        level,
        badge: "Intermediate",
        title: `Technical Deep-Dive: ${topic.title}`,
        summary: topic.definition,
        details: [
          `Definition: ${topic.definition}`,
          ...(topic.useCases?.map((u) => `Use Case: ${u}`) || []),
          topic.codeExample ? 'Supported by canonical code implementation.' : 'Key theoretical paradigm.',
        ],
        analogy: topic.realWorldExample,
        memoryAid: `Rule of Thumb: Apply ${topic.title} whenever you need ${topic.useCases?.[0] || 'clean architectural separation'}.`,
      };

    case 'advanced':
      return {
        level,
        badge: "Senior / Architecture",
        title: `Internal Mechanisms & Trade-offs: ${topic.title}`,
        summary: `Under the hood, ${topic.title} relies on foundational runtime semantics, memory layout, and engine optimization.`,
        details: [
          `Mechanics: How runtime engines process and execute this construct efficiently.`,
          `Edge Cases: Potential memory leaks, garbage collection overhead, or hydration mismatches.`,
          `Performance Trade-off: Balance between abstraction overhead and execution throughput.`,
          `Alternative Approaches: When to avoid this pattern in favor of simpler primitives.`,
        ],
        memoryAid: `Senior Checklist: Consider memory footprint, concurrency, garbage collection, and browser/engine support.`,
      };

    case 'interview-ready':
      return {
        level,
        badge: "60-Second Interview Pitch",
        title: `Interview Answer for: ${topic.title}`,
        summary: `"${topic.definition} Specifically, it enables us to ${topic.useCases?.[0] || 'build scalable solutions'} while avoiding common pitfalls."`,
        details: [
          `Definition Hook: 1 sentence explaining the 'what'.`,
          `Practical Value: 1 sentence demonstrating real-world experience (${topic.useCases?.[0] || 'production use'}).`,
          `Nuance/Trade-off: Acknowledge when to use it and when an alternative fits better.`,
        ],
        memoryAid: `Formula: What it is + Why we use it + Real-world trade-off.`,
      };
  }
}

/**
 * Deterministically evaluates a user's answer against canonical curriculum keywords and standards
 */
export function evaluateUserAnswerOffline(
  topic: TopicContent,
  question: string,
  userAnswer: string
): EvaluatedAnswer {
  const trimmed = userAnswer.trim().toLowerCase();
  
  if (trimmed.length < 20) {
    return {
      score: 25,
      rating: 'Incomplete',
      whatWasCorrect: ['Attempted a response.'],
      whatWasMissing: ['More technical depth and elaboration.', 'Specific terminology and concrete examples.'],
      whatWasIncorrect: ['Answer is too brief for a technical interview.'],
      interviewerExpectation: 'Interviewers expect a clear definition, the core purpose, and at least one practical example.',
      improvedSampleAnswer: topic.answers?.[0]?.answer || topic.definition,
      followUpQuestion: topic.questions?.intermediate?.[0] || 'Can you walk through a real-world code example?',
      recommendedRevision: `Review the definition and simple explanation for ${topic.title}.`,
    };
  }

  // Find matching answer in topic answers if available
  const canonicalAnswerObj = topic.answers?.find(
    (a) => a.question.toLowerCase().includes(question.toLowerCase()) || question.toLowerCase().includes(a.question.toLowerCase())
  ) || topic.answers?.[0];

  const canonicalText = (canonicalAnswerObj?.answer || topic.definition).toLowerCase();
  
  // Extract key terms (words > 4 chars)
  const keyTerms = Array.from(
    new Set(
      canonicalText
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 4 && !['about', 'their', 'which', 'there', 'would', 'could', 'should'].includes(w))
    )
  );

  const matchedTerms = keyTerms.filter((term) => trimmed.includes(term));
  const matchRatio = keyTerms.length > 0 ? matchedTerms.length / keyTerms.length : 0.5;

  let score = Math.min(95, Math.max(35, Math.round(40 + matchRatio * 55)));
  if (trimmed.length > 150) score = Math.min(100, score + 5);

  const rating =
    score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Needs Improvement' : 'Incomplete';

  const whatWasCorrect: string[] = [];
  const whatWasMissing: string[] = [];

  if (matchedTerms.length > 0) {
    whatWasCorrect.push(`Correctly referenced key terminology: ${matchedTerms.slice(0, 4).join(', ')}.`);
  } else {
    whatWasCorrect.push('Captured general topic intent.');
  }

  const missingTerms = keyTerms.filter((t) => !matchedTerms.includes(t)).slice(0, 3);
  if (missingTerms.length > 0) {
    whatWasMissing.push(`Could explicitly mention: ${missingTerms.join(', ')}.`);
  }
  if (!trimmed.includes('for example') && !trimmed.includes('such as') && !trimmed.includes('e.g.')) {
    whatWasMissing.push('A practical code or architecture example to reinforce your point.');
  }

  return {
    score,
    rating,
    whatWasCorrect,
    whatWasMissing,
    whatWasIncorrect: score < 60 ? ['Some statements may be ambiguous or lack technical precision.'] : [],
    interviewerExpectation: `Interviewers look for directness, correct technical terms, and awareness of trade-offs.`,
    improvedSampleAnswer: canonicalAnswerObj?.answer || topic.definition,
    followUpQuestion: topic.questions?.intermediate?.[0] || topic.questions?.advanced?.[0] || 'How would you test or optimize this in production?',
    recommendedRevision: `Revise common use cases and questions for ${topic.title}.`,
  };
}

/**
 * Generates a 3-tiered progressive hint system
 */
export function generateProgressiveHints(topic: TopicContent): ProgressiveHint[] {
  return [
    {
      level: 1,
      title: "Conceptual Clue",
      content: topic.simpleExplanation || `Focus on the primary goal of ${topic.title}: ${topic.definition.slice(0, 100)}...`,
    },
    {
      level: 2,
      title: "Pattern & Use Case Clue",
      content: topic.useCases?.[0] 
        ? `Consider this use case: ${topic.useCases[0]}. What data structures or mechanics enable this?`
        : `Think about how JavaScript handles scope, memory, or component lifecycles in this scenario.`,
    },
    {
      level: 3,
      title: "Solution Blueprint",
      content: topic.codeExample 
        ? `Here is the structural implementation pattern:\n\n${topic.codeExample.slice(0, 160)}...`
        : `Key formula: ${topic.definition}`,
    },
  ];
}
