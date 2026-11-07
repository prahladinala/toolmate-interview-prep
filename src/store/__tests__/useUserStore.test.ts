import { describe, it, expect, beforeEach } from 'vitest'
import { useUserStore } from '../useUserStore'

describe('useUserStore Enhanced Store Actions', () => {
  beforeEach(() => {
    useUserStore.getState().resetProgress()
  })

  it('completes topic, awards XP, and unlocks First Step badge', () => {
    const store = useUserStore.getState()
    expect(store.completedTopics).toHaveLength(0)
    expect(store.xp).toBe(0)

    store.completeTopic('closures', 10)
    const updated = useUserStore.getState()
    expect(updated.completedTopics).toContain('closures')
    expect(updated.xp).toBe(10)
    expect(updated.unlockedBadges).toContain('First Step')

    // Calling again does not award duplicate XP
    store.completeTopic('closures', 10)
    expect(useUserStore.getState().xp).toBe(10)
  })

  it('toggles bookmarks into collections correctly', () => {
    const store = useUserStore.getState()
    expect(store.isBookmarked('closures')).toBe(false)

    store.toggleBookmark('closures', 'javascript', 'Closures', 'Must Revise')
    expect(useUserStore.getState().isBookmarked('closures')).toBe(true)
    expect(useUserStore.getState().bookmarks[0].collection).toBe('Must Revise')

    // Toggle off
    store.toggleBookmark('closures', 'javascript', 'Closures')
    expect(useUserStore.getState().isBookmarked('closures')).toBe(false)
  })

  it('saves and deletes personal notes', () => {
    const store = useUserStore.getState()
    store.saveNote('closures', 'javascript', 'Remember lexical environment binding.')
    
    let state = useUserStore.getState()
    expect(state.notes['closures']?.text).toBe('Remember lexical environment binding.')

    store.deleteNote('closures')
    state = useUserStore.getState()
    expect(state.notes['closures']).toBeUndefined()
  })

  it('records spaced repetition reviews and schedules next due date', () => {
    const store = useUserStore.getState()
    store.recordSpacedReview('closures', 'javascript', 'Closures', 5)

    const state = useUserStore.getState()
    const item = state.reviewQueue['closures']
    expect(item).toBeDefined()
    expect(item.repetitions).toBe(1)
    expect(item.interval).toBe(1)
    expect(item.easeFactor).toBe(2.6)
    expect(state.xp).toBeGreaterThan(0)
  })

  it('records study time correctly', () => {
    const store = useUserStore.getState()
    store.recordStudyTime(120) // 2 minutes

    const state = useUserStore.getState()
    expect(state.studyTimeSeconds).toBe(120)
  })

  it('exports and imports user data safely', () => {
    const store = useUserStore.getState()
    store.completeTopic('closures', 20)
    store.toggleBookmark('closures', 'javascript', 'Closures')

    const exported = store.exportUserData()
    expect(typeof exported).toBe('string')
    const parsed = JSON.parse(exported)
    expect(parsed.xp).toBe(20)

    // Reset and re-import
    store.resetProgress()
    expect(useUserStore.getState().xp).toBe(0)

    const success = useUserStore.getState().importUserData(exported)
    expect(success).toBe(true)
    expect(useUserStore.getState().xp).toBe(20)
    expect(useUserStore.getState().completedTopics).toContain('closures')
  })
})
