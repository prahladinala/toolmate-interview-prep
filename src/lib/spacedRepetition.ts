/**
 * SuperMemo SM-2 Spaced Repetition Algorithm Implementation
 * 
 * Provides an optimal review schedule for interview topics based on recall performance.
 */

export interface ReviewItem {
  id: string; // usually topicId or questionId
  techId: string;
  topicTitle: string;
  repetitions: number;
  interval: number; // in days
  easeFactor: number; // starts at 2.5, min 1.3
  dueDate: string; // YYYY-MM-DD
  lastReviewedDate?: string;
  consecutiveLapses: number;
}

export type ReviewGrade = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Calculates the next review date and updated SM-2 parameters for an item
 * 
 * @param item Current review item state
 * @param grade Score from 0 (total blackout) to 5 (perfect recall)
 * @param reviewDate Date of review in YYYY-MM-DD format (defaults to today)
 */
export function calculateNextReview(
  item: Partial<ReviewItem> & { id: string; techId: string; topicTitle: string },
  grade: ReviewGrade,
  reviewDate?: string
): ReviewItem {
  const today = reviewDate || new Date().toISOString().split('T')[0];
  
  let repetitions = item.repetitions ?? 0;
  let interval = item.interval ?? 0;
  let easeFactor = item.easeFactor ?? 2.5;
  let consecutiveLapses = item.consecutiveLapses ?? 0;

  // Grade < 3 represents a failed recall / lapse
  if (grade < 3) {
    repetitions = 0;
    interval = 1;
    consecutiveLapses += 1;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
    consecutiveLapses = 0;
  }

  // Update ease factor using SM-2 formula
  easeFactor = easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  // Calculate next due date
  const reviewDateTime = new Date(today);
  reviewDateTime.setDate(reviewDateTime.getDate() + interval);
  const dueDate = reviewDateTime.toISOString().split('T')[0];

  return {
    id: item.id,
    techId: item.techId,
    topicTitle: item.topicTitle,
    repetitions,
    interval,
    easeFactor: Math.round(easeFactor * 100) / 100,
    dueDate,
    lastReviewedDate: today,
    consecutiveLapses,
  };
}

/**
 * Checks if a review item is due on or before the specified date
 */
export function isItemDue(dueDate: string, checkDate?: string): boolean {
  const targetDate = checkDate || new Date().toISOString().split('T')[0];
  return dueDate <= targetDate;
}

/**
 * Sorts items by urgency: overdue items first, then by least repetitions
 */
export function sortReviewQueue(items: ReviewItem[], currentDate?: string): ReviewItem[] {
  const today = currentDate || new Date().toISOString().split('T')[0];
  return [...items].sort((a, b) => {
    // Both due or both not due
    const aDue = isItemDue(a.dueDate, today);
    const bDue = isItemDue(b.dueDate, today);

    if (aDue && !bDue) return -1;
    if (!aDue && bDue) return 1;

    // Earlier due date comes first
    if (a.dueDate !== b.dueDate) {
      return a.dueDate.localeCompare(b.dueDate);
    }

    // Fewer repetitions comes first (more fragile memory)
    return a.repetitions - b.repetitions;
  });
}
