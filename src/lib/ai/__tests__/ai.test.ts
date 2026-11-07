import { describe, it, expect, vi } from 'vitest';
import { checkChromeAiSupport } from '../chromeAi';
import { generateCurriculumExplanation, evaluateUserAnswerOffline, generateProgressiveHints } from '../aiFallbacks';
import { getAiExplanation, evaluateCandidateAnswer } from '../index';
import { TopicContent } from '@/types/content';

const mockTopic: TopicContent = {
  id: 'closures',
  title: 'Closures',
  difficulty: 'Intermediate',
  definition: 'A closure is a function that remembers its outer lexical environment even when executed outside that scope.',
  simpleExplanation: 'Think of a closure like a backpack attached to a function that holds variables from where it was created.',
  realWorldExample: 'A bank account where the balance is private and only accessed via deposit/withdraw methods.',
  useCases: ['Data privacy', 'Currying and partial application', 'Event handlers'],
  questions: {
    basic: ['What is a closure?'],
    intermediate: ['How do closures help with data encapsulation?'],
    advanced: ['How do closures affect garbage collection?'],
    trick: ['Explain closures in a loop with var.'],
    hr: ['Describe a tricky bug you solved.'],
  },
  answers: [
    {
      question: 'What is a closure?',
      answer: 'A closure is formed when an inner function retains access to variables from its outer enclosing function after the outer function has returned.',
    },
  ],
  codeExample: 'function makeCounter() { let count = 0; return () => ++count; }',
};

describe('Chrome Built-in AI & Fallback System', () => {
  it('returns unsupported status safely in non-Chrome environment', async () => {
    const status = await checkChromeAiSupport();
    expect(status.status).toBe('unsupported');
    expect(status.hasPromptApi).toBe(false);
  });

  it('generates multi-level curriculum explanations offline', () => {
    const beginner = generateCurriculumExplanation(mockTopic, 'beginner');
    expect(beginner.badge).toContain('Beginner');
    expect(beginner.summary).toBe(mockTopic.simpleExplanation);

    const advanced = generateCurriculumExplanation(mockTopic, 'advanced');
    expect(advanced.badge).toContain('Senior');

    const pitch = generateCurriculumExplanation(mockTopic, 'interview-ready');
    expect(pitch.badge).toContain('60-Second');
  });

  it('evaluates candidate answers deterministically offline', () => {
    const result = evaluateUserAnswerOffline(
      mockTopic,
      'What is a closure?',
      'A closure is when an inner function keeps access to outer function variables even after execution.'
    );

    expect(result.score).toBeGreaterThanOrEqual(60);
    expect(result.whatWasCorrect.length).toBeGreaterThan(0);
    expect(result.improvedSampleAnswer.length).toBeGreaterThan(0);
  });

  it('flags incomplete answers with low scores and specific revision guidance', () => {
    const result = evaluateUserAnswerOffline(mockTopic, 'What is a closure?', 'it is a function');
    expect(result.score).toBeLessThan(50);
    expect(result.rating).toBe('Incomplete');
  });

  it('generates 3-tiered progressive hints', () => {
    const hints = generateProgressiveHints(mockTopic);
    expect(hints).toHaveLength(3);
    expect(hints[0].level).toBe(1);
    expect(hints[1].level).toBe(2);
    expect(hints[2].level).toBe(3);
  });

  it('unified getAiExplanation returns local fallback when window.ai is absent', async () => {
    const explanation = await getAiExplanation(mockTopic, 'beginner');
    expect(explanation.provider).toBe('local-curriculum-fallback');
    expect(explanation.summary).toBe(mockTopic.simpleExplanation);
  });

  it('unified evaluateCandidateAnswer evaluates offline safely', async () => {
    const evalResult = await evaluateCandidateAnswer(
      mockTopic,
      'What is a closure?',
      'An inner function retaining references to its parent scope.'
    );
    expect(evalResult.provider).toBe('local-curriculum-fallback');
    expect(evalResult.score).toBeGreaterThanOrEqual(50);
  });
});
