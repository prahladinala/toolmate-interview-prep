/**
 * Unified AI Assistant Coordinator
 * 
 * Routes requests to on-device Chrome Built-in AI (Gemini Nano) when available,
 * or seamlessly falls back to the deterministic educational heuristic engine.
 * Completely private — ZERO remote server uploads.
 */

import { checkChromeAiSupport, promptChromeAi, AiCapabilityInfo } from './chromeAi';
import {
  ExplanationLevel,
  generateCurriculumExplanation,
  evaluateUserAnswerOffline,
  generateProgressiveHints,
  EvaluatedAnswer,
  ProgressiveHint,
} from './aiFallbacks';
import { TopicContent } from '@/types/content';

export type AiProvider = 'chrome-gemini-nano' | 'local-curriculum-fallback';

export interface AiExplanationResult {
  provider: AiProvider;
  level: ExplanationLevel;
  title: string;
  badge: string;
  summary: string;
  details: string[];
  analogy?: string;
  memoryAid: string;
}

export interface AiEvaluationResult extends EvaluatedAnswer {
  provider: AiProvider;
}

/**
 * Explains a topic at the selected depth level using Chrome AI or Local Fallback
 */
export async function getAiExplanation(
  topic: TopicContent,
  level: ExplanationLevel,
  signal?: AbortSignal
): Promise<AiExplanationResult> {
  const capability = await checkChromeAiSupport();

  // If Chrome Built-in AI is readily available, attempt on-device inference
  if (capability.status === 'available') {
    try {
      const promptText = `You are an expert technical interviewer explaining "${topic.title}".
Topic Context:
Definition: ${topic.definition}
Simple Explanation: ${topic.simpleExplanation}
Use cases: ${topic.useCases?.join(', ') || 'N/A'}

Target Level: ${level.toUpperCase()}
Provide an explanation tailored specifically for this level. Format with:
- Summary (2 sentences)
- 3 key bullet points
- A memorable analogy or memory aid. Keep your answer professional, clear, and concise.`;

      const aiText = await promptChromeAi(promptText, undefined, signal);

      if (aiText && aiText.trim().length > 30) {
        const lines = aiText.split('\n').filter((l) => l.trim().length > 0);
        return {
          provider: 'chrome-gemini-nano',
          level,
          badge: `Gemini Nano (${level.toUpperCase()})`,
          title: `AI Explanation: ${topic.title}`,
          summary: lines[0] || topic.definition,
          details: lines.slice(1, 4),
          memoryAid: lines[lines.length - 1] || 'Remember the core concept and its real-world trade-off.',
        };
      }
    } catch (e: any) {
      if (signal?.aborted) throw e;
      console.warn('Chrome Built-in AI prompt failed; falling back to local curriculum engine:', e);
    }
  }

  // Local curriculum fallback
  const fallback = generateCurriculumExplanation(topic, level);
  return {
    ...fallback,
    provider: 'local-curriculum-fallback',
  };
}

/**
 * Evaluates candidate answer using Chrome AI or Local Fallback
 */
export async function evaluateCandidateAnswer(
  topic: TopicContent,
  question: string,
  userAnswer: string,
  signal?: AbortSignal
): Promise<AiEvaluationResult> {
  const capability = await checkChromeAiSupport();

  if (capability.status === 'available') {
    try {
      const promptText = `Evaluate this technical interview answer:
Question: "${question}"
Candidate Answer: "${userAnswer}"
Canonical Subject: "${topic.title}" (${topic.definition})

Evaluate on:
1. Technical correctness (score 0-100)
2. What was correct
3. What was missing
4. Interviewer recommendation
5. An improved sample answer

Respond in valid JSON format:
{
  "score": 85,
  "rating": "Good",
  "whatWasCorrect": ["item 1"],
  "whatWasMissing": ["item 1"],
  "whatWasIncorrect": [],
  "interviewerExpectation": "brief note",
  "improvedSampleAnswer": "concise model answer",
  "followUpQuestion": "follow up question",
  "recommendedRevision": "revision advice"
}`;

      const aiResponse = await promptChromeAi(promptText, undefined, signal);
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          provider: 'chrome-gemini-nano',
          score: typeof parsed.score === 'number' ? parsed.score : 75,
          rating: parsed.rating || 'Good',
          whatWasCorrect: Array.isArray(parsed.whatWasCorrect) ? parsed.whatWasCorrect : ['Addressed question'],
          whatWasMissing: Array.isArray(parsed.whatWasMissing) ? parsed.whatWasMissing : [],
          whatWasIncorrect: Array.isArray(parsed.whatWasIncorrect) ? parsed.whatWasIncorrect : [],
          interviewerExpectation: parsed.interviewerExpectation || 'Be precise with syntax and edge cases.',
          improvedSampleAnswer: parsed.improvedSampleAnswer || topic.definition,
          followUpQuestion: parsed.followUpQuestion || topic.questions?.intermediate?.[0] || 'How would you optimize this?',
          recommendedRevision: parsed.recommendedRevision || `Review ${topic.title} concepts.`,
        };
      }
    } catch (e: any) {
      if (signal?.aborted) throw e;
      console.warn('Chrome AI evaluation failed, falling back to offline evaluator:', e);
    }
  }

  // Local curriculum evaluator
  const offlineEval = evaluateUserAnswerOffline(topic, question, userAnswer);
  return {
    ...offlineEval,
    provider: 'local-curriculum-fallback',
  };
}

export { checkChromeAiSupport, generateProgressiveHints };
export type { AiCapabilityInfo, ProgressiveHint, ExplanationLevel };
