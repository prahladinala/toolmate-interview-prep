import { describe, it, expect } from 'vitest';
import { calculateNextReview, isItemDue, sortReviewQueue } from '../spacedRepetition';

describe('SM-2 Spaced Repetition Algorithm', () => {
  it('initializes a new item with interval 1 and easeFactor 2.5 on perfect score (grade 5)', () => {
    const result = calculateNextReview(
      { id: 'closures', techId: 'javascript', topicTitle: 'Closures' },
      5,
      '2026-10-15'
    );

    expect(result.repetitions).toBe(1);
    expect(result.interval).toBe(1);
    expect(result.easeFactor).toBe(2.6); // 2.5 + (0.1 - 0) = 2.6
    expect(result.dueDate).toBe('2026-10-16');
    expect(result.lastReviewedDate).toBe('2026-10-15');
    expect(result.consecutiveLapses).toBe(0);
  });

  it('sets interval to 6 on second consecutive successful review (grade 4)', () => {
    const item1 = calculateNextReview(
      { id: 'closures', techId: 'javascript', topicTitle: 'Closures' },
      4,
      '2026-10-15'
    );

    const item2 = calculateNextReview(item1, 4, '2026-10-16');
    expect(item2.repetitions).toBe(2);
    expect(item2.interval).toBe(6);
    expect(item2.dueDate).toBe('2026-10-22');
  });

  it('multiplies interval by ease factor on third successful review', () => {
    const item = {
      id: 'closures',
      techId: 'javascript',
      topicTitle: 'Closures',
      repetitions: 2,
      interval: 6,
      easeFactor: 2.5,
      dueDate: '2026-10-22',
      consecutiveLapses: 0,
    };

    const next = calculateNextReview(item, 5, '2026-10-22');
    expect(next.repetitions).toBe(3);
    expect(next.interval).toBe(15); // 6 * 2.5 = 15
    expect(next.dueDate).toBe('2026-11-06');
  });

  it('resets repetitions and sets interval to 1 on failure (grade < 3)', () => {
    const item = {
      id: 'closures',
      techId: 'javascript',
      topicTitle: 'Closures',
      repetitions: 4,
      interval: 30,
      easeFactor: 2.4,
      dueDate: '2026-10-22',
      consecutiveLapses: 0,
    };

    const next = calculateNextReview(item, 1, '2026-10-22');
    expect(next.repetitions).toBe(0);
    expect(next.interval).toBe(1);
    expect(next.consecutiveLapses).toBe(1);
    expect(next.dueDate).toBe('2026-10-23');
  });

  it('correctly detects overdue and future items with isItemDue', () => {
    expect(isItemDue('2026-10-14', '2026-10-15')).toBe(true);
    expect(isItemDue('2026-10-15', '2026-10-15')).toBe(true);
    expect(isItemDue('2026-10-16', '2026-10-15')).toBe(false);
  });

  it('sorts queue prioritizing overdue items and items with fewer repetitions', () => {
    const items = [
      { id: '3', techId: 'react', topicTitle: 'Context', repetitions: 3, interval: 10, easeFactor: 2.5, dueDate: '2026-10-20', consecutiveLapses: 0 },
      { id: '1', techId: 'js', topicTitle: 'Closures', repetitions: 2, interval: 6, easeFactor: 2.5, dueDate: '2026-10-10', consecutiveLapses: 0 },
      { id: '2', techId: 'ts', topicTitle: 'Generics', repetitions: 1, interval: 1, easeFactor: 2.5, dueDate: '2026-10-12', consecutiveLapses: 0 },
    ];

    const sorted = sortReviewQueue(items, '2026-10-15');
    // Overdue items come first (2026-10-10, then 2026-10-12)
    expect(sorted[0].id).toBe('1');
    expect(sorted[1].id).toBe('2');
    expect(sorted[2].id).toBe('3');
  });
});
