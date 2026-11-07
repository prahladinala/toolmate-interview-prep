import { describe, it, expect } from 'vitest';
import { calculateStreak } from '../streak';

describe('Streak Calculation', () => {
  it('returns 1 if lastVisitDate is null (first visit)', () => {
    expect(calculateStreak(null, '2026-10-15', 0)).toBe(1);
  });

  it('keeps streak identical if visited today', () => {
    expect(calculateStreak('2026-10-15', '2026-10-15', 5)).toBe(5);
  });

  it('increments streak if visited yesterday', () => {
    expect(calculateStreak('2026-10-14', '2026-10-15', 5)).toBe(6);
  });

  it('resets streak to 1 if more than 1 day was missed', () => {
    expect(calculateStreak('2026-10-10', '2026-10-15', 5)).toBe(1);
  });
});
