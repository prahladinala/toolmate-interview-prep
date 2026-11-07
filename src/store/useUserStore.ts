import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { calculateStreak } from '@/lib/streak'
import { ReviewItem, ReviewGrade, calculateNextReview } from '@/lib/spacedRepetition'

// In-memory fallback for SSR and testing environments
const memoryStorage = (() => {
  const store = new Map<string, string>()
  return {
    getItem: (name: string): string | null => store.get(name) || null,
    setItem: (name: string, value: string): void => { store.set(name, value) },
    removeItem: (name: string): void => { store.delete(name) },
  }
})()


export interface Bookmark {
  topicId: string
  techId: string
  title: string
  collection: string
  addedAt: string
}

export interface TopicNote {
  topicId: string
  techId: string
  text: string
  updatedAt: string
}

export type MasteryLevel = 'learning' | 'needs-revision' | 'mastered'

export interface TopicMastery {
  topicId: string
  techId: string
  level: MasteryLevel
  confidence: 1 | 2 | 3 | 4 | 5
  updatedAt: string
}

export interface QuizAttempt {
  id: string
  date: string
  techId?: string
  quizTitle?: string
  quizType?: 'general' | 'jutro'
  score: number
  totalQuestions: number
  timeSpentSeconds: number
  tabViolations?: number
  stoppedDueToTabChange?: boolean
  categoryBreakdown?: Record<string, { correct: number; total: number }>
}

export interface MockInterviewSession {
  id: string
  date: string
  techId: string
  topic: string
  score: number // 0-100
  durationSeconds: number
  feedback: string
}

export interface DailyStudyActivity {
  date: string // YYYY-MM-DD
  seconds: number
  topicsCompleted: number
}

export interface UserState {
  // Legacy / Core stats
  xp: number
  streak: number
  lastVisitDate: string | null
  completedTopics: string[]
  unlockedBadges: string[]

  // Spaced Repetition
  reviewQueue: Record<string, ReviewItem> // keyed by topicId

  // Bookmarking & Notes
  bookmarks: Bookmark[]
  notes: Record<string, TopicNote> // keyed by topicId

  // Confidence & Mastery
  mastery: Record<string, TopicMastery> // keyed by topicId

  // Study Activity & Time Analytics
  studyTimeSeconds: number
  dailyActivity: Record<string, DailyStudyActivity> // keyed by YYYY-MM-DD
  quizAttempts: QuizAttempt[]
  mockSessions: MockInterviewSession[]

  // Actions
  addXp: (amount: number) => void
  completeTopic: (topicId: string, topicXp?: number) => void
  unlockBadge: (badgeId: string) => void
  recordVisit: () => void
  resetProgress: () => void

  // Enhanced Actions
  toggleBookmark: (topicId: string, techId: string, title: string, collection?: string) => void
  isBookmarked: (topicId: string) => boolean
  saveNote: (topicId: string, techId: string, text: string) => void
  deleteNote: (topicId: string) => void
  setTopicMastery: (topicId: string, techId: string, level: MasteryLevel, confidence: 1 | 2 | 3 | 4 | 5) => void
  recordSpacedReview: (topicId: string, techId: string, topicTitle: string, grade: ReviewGrade) => void
  recordStudyTime: (seconds: number) => void
  recordQuizAttempt: (attempt: Omit<QuizAttempt, 'id' | 'date'>) => void
  recordMockSession: (session: Omit<MockInterviewSession, 'id' | 'date'>) => void
  exportUserData: () => string
  importUserData: (jsonData: string) => boolean
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      xp: 0,
      streak: 0,
      lastVisitDate: null,
      completedTopics: [],
      unlockedBadges: [],
      reviewQueue: {},
      bookmarks: [],
      notes: {},
      mastery: {},
      studyTimeSeconds: 0,
      dailyActivity: {},
      quizAttempts: [],
      mockSessions: [],

      // Core actions
      addXp: (amount) => set((state) => ({ xp: state.xp + amount })),

      completeTopic: (topicId, topicXp = 10) => {
        const state = get()
        const now = new Date()
        const todayStr = now.toISOString().split('T')[0]

        const isNew = !state.completedTopics.includes(topicId)
        const updatedTopics = isNew ? [...state.completedTopics, topicId] : state.completedTopics

        // Update daily activity log
        const currentDaily = state.dailyActivity[todayStr] || {
          date: todayStr,
          seconds: 0,
          topicsCompleted: 0
        }

        const updatedDaily = {
          ...state.dailyActivity,
          [todayStr]: {
            ...currentDaily,
            topicsCompleted: isNew ? currentDaily.topicsCompleted + 1 : currentDaily.topicsCompleted
          }
        }

        // Automatic badge unlocks
        const newBadges = [...state.unlockedBadges]
        if (updatedTopics.length >= 1 && !newBadges.includes('First Step')) {
          newBadges.push('First Step')
        }
        if (updatedTopics.length >= 10 && !newBadges.includes('Topic Explorer')) {
          newBadges.push('Topic Explorer')
        }
        if (updatedTopics.length >= 50 && !newBadges.includes('Knowledge Seeker')) {
          newBadges.push('Knowledge Seeker')
        }
        if (updatedTopics.length >= 100 && !newBadges.includes('Century Club')) {
          newBadges.push('Century Club')
        }

        set({
          completedTopics: updatedTopics,
          xp: isNew ? state.xp + topicXp : state.xp,
          unlockedBadges: newBadges,
          dailyActivity: updatedDaily
        })
      },

      unlockBadge: (badgeId) => {
        const state = get()
        if (!state.unlockedBadges.includes(badgeId)) {
          set({ unlockedBadges: [...state.unlockedBadges, badgeId] })
        }
      },

      recordVisit: () => {
        const state = get()
        const now = new Date()
        const todayStr = now.toISOString().split('T')[0]

        if (state.lastVisitDate !== todayStr) {
          const newStreak = calculateStreak(state.lastVisitDate, todayStr, state.streak)
          const newBadges = [...state.unlockedBadges]

          if (newStreak >= 3 && !newBadges.includes('3-Day Streak')) {
            newBadges.push('3-Day Streak')
          }
          if (newStreak >= 7 && !newBadges.includes('7-Day Habit')) {
            newBadges.push('7-Day Habit')
          }
          if (newStreak >= 30 && !newBadges.includes('Monthly Master')) {
            newBadges.push('Monthly Master')
          }

          set({
            lastVisitDate: todayStr,
            streak: newStreak,
            unlockedBadges: newBadges
          })
        }
      },

      resetProgress: () => set({
        xp: 0,
        streak: 0,
        lastVisitDate: null,
        completedTopics: [],
        unlockedBadges: [],
        reviewQueue: {},
        bookmarks: [],
        notes: {},
        mastery: {},
        studyTimeSeconds: 0,
        dailyActivity: {},
        quizAttempts: [],
        mockSessions: []
      }),

      // Bookmarking actions
      toggleBookmark: (topicId, techId, title, collection = 'General') => {
        const state = get()
        const exists = state.bookmarks.some((b) => b.topicId === topicId)
        if (exists) {
          set({ bookmarks: state.bookmarks.filter((b) => b.topicId !== topicId) })
        } else {
          set({
            bookmarks: [
              ...state.bookmarks,
              {
                topicId,
                techId,
                title,
                collection,
                addedAt: new Date().toISOString()
              }
            ]
          })
        }
      },

      isBookmarked: (topicId) => {
        return get().bookmarks.some((b) => b.topicId === topicId)
      },

      // Notes actions
      saveNote: (topicId, techId, text) => {
        const state = get()
        set({
          notes: {
            ...state.notes,
            [topicId]: {
              topicId,
              techId,
              text,
              updatedAt: new Date().toISOString()
            }
          }
        })
      },

      deleteNote: (topicId) => {
        const state = get()
        const updated = { ...state.notes }
        delete updated[topicId]
        set({ notes: updated })
      },

      // Mastery actions
      setTopicMastery: (topicId, techId, level, confidence) => {
        const state = get()
        set({
          mastery: {
            ...state.mastery,
            [topicId]: {
              topicId,
              techId,
              level,
              confidence,
              updatedAt: new Date().toISOString()
            }
          }
        })
      },

      // Spaced Repetition action
      recordSpacedReview: (topicId, techId, topicTitle, grade) => {
        const state = get()
        const currentItem = state.reviewQueue[topicId] || {
          id: topicId,
          techId,
          topicTitle,
          repetitions: 0,
          interval: 0,
          easeFactor: 2.5,
          consecutiveLapses: 0
        }

        const updatedItem = calculateNextReview(currentItem, grade)
        set({
          reviewQueue: {
            ...state.reviewQueue,
            [topicId]: updatedItem
          },
          xp: state.xp + (grade >= 3 ? 15 : 5)
        })
      },

      // Study time tracking
      recordStudyTime: (seconds) => {
        if (seconds <= 0) return
        const state = get()
        const todayStr = new Date().toISOString().split('T')[0]
        const currentDaily = state.dailyActivity[todayStr] || {
          date: todayStr,
          seconds: 0,
          topicsCompleted: 0
        }

        set({
          studyTimeSeconds: state.studyTimeSeconds + seconds,
          dailyActivity: {
            ...state.dailyActivity,
            [todayStr]: {
              ...currentDaily,
              seconds: currentDaily.seconds + seconds
            }
          }
        })
      },

      // Quiz and Mock Interview
      recordQuizAttempt: (attempt) => {
        const state = get()
        const newRecord: QuizAttempt = {
          ...attempt,
          id: `quiz_${Date.now()}`,
          date: new Date().toISOString()
        }
        set({
          quizAttempts: [newRecord, ...state.quizAttempts],
          xp: state.xp + attempt.score * 5
        })
      },

      recordMockSession: (session) => {
        const state = get()
        const newRecord: MockInterviewSession = {
          ...session,
          id: `mock_${Date.now()}`,
          date: new Date().toISOString()
        }
        set({
          mockSessions: [newRecord, ...state.mockSessions],
          xp: state.xp + Math.round(session.score / 2)
        })
      },

      // Export / Import
      exportUserData: () => {
        const state = get()
        return JSON.stringify(
          {
            version: '2.0',
            exportedAt: new Date().toISOString(),
            xp: state.xp,
            streak: state.streak,
            lastVisitDate: state.lastVisitDate,
            completedTopics: state.completedTopics,
            unlockedBadges: state.unlockedBadges,
            reviewQueue: state.reviewQueue,
            bookmarks: state.bookmarks,
            notes: state.notes,
            mastery: state.mastery,
            studyTimeSeconds: state.studyTimeSeconds,
            dailyActivity: state.dailyActivity,
            quizAttempts: state.quizAttempts,
            mockSessions: state.mockSessions
          },
          null,
          2
        )
      },

      importUserData: (jsonData) => {
        try {
          const parsed = JSON.parse(jsonData)
          if (typeof parsed !== 'object' || parsed === null) return false

          set({
            xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
            streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
            lastVisitDate: parsed.lastVisitDate || null,
            completedTopics: Array.isArray(parsed.completedTopics) ? parsed.completedTopics : [],
            unlockedBadges: Array.isArray(parsed.unlockedBadges) ? parsed.unlockedBadges : [],
            reviewQueue: typeof parsed.reviewQueue === 'object' && parsed.reviewQueue !== null ? parsed.reviewQueue : {},
            bookmarks: Array.isArray(parsed.bookmarks) ? parsed.bookmarks : [],
            notes: typeof parsed.notes === 'object' && parsed.notes !== null ? parsed.notes : {},
            mastery: typeof parsed.mastery === 'object' && parsed.mastery !== null ? parsed.mastery : {},
            studyTimeSeconds: typeof parsed.studyTimeSeconds === 'number' ? parsed.studyTimeSeconds : 0,
            dailyActivity: typeof parsed.dailyActivity === 'object' && parsed.dailyActivity !== null ? parsed.dailyActivity : {},
            quizAttempts: Array.isArray(parsed.quizAttempts) ? parsed.quizAttempts : [],
            mockSessions: Array.isArray(parsed.mockSessions) ? parsed.mockSessions : []
          })
          return true
        } catch (e) {
          console.error('Failed to import user study data:', e)
          return false
        }
      }
    }),
    {
      name: 'toolmate-interview-storage',
      version: 2,
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? window.localStorage : memoryStorage)),
    }
  )
)
