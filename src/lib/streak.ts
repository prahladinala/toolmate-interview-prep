/**
 * Calculates the new streak based on the last visit date and current date.
 * If the user visited yesterday, streak increments.
 * If the user visited today, streak stays the same.
 * If the user visited before yesterday, streak resets to 1.
 * 
 * @param lastVisitDateStr YYYY-MM-DD string of last visit
 * @param todayStr YYYY-MM-DD string of today
 * @param currentStreak The user's current streak count
 * @returns The new streak count
 */
export function calculateStreak(
  lastVisitDateStr: string | null,
  todayStr: string,
  currentStreak: number
): number {
  if (!lastVisitDateStr) return 1;

  const lastVisit = new Date(lastVisitDateStr);
  const today = new Date(todayStr);
  
  // Set time to 00:00:00 to only compare dates
  lastVisit.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(today.getTime() - lastVisit.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Already visited today
    return currentStreak;
  } else if (diffDays === 1) {
    // Visited yesterday, increment streak
    return currentStreak + 1;
  } else {
    // Missed a day or more, reset streak
    return 1;
  }
}
