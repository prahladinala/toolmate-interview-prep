import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { calculateStreak } from '@/lib/streak'

export interface UserState {
  xp: number
  streak: number
  lastVisitDate: string | null
  completedTopics: string[]
  unlockedBadges: string[]
  
  // Actions
  addXp: (amount: number) => void
  completeTopic: (topicId: string, topicXp?: number) => void
  unlockBadge: (badgeId: string) => void
  recordVisit: () => void
  resetProgress: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      xp: 0,
      streak: 0,
      lastVisitDate: null,
      completedTopics: [],
      unlockedBadges: [],

      addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
      
      completeTopic: (topicId, topicXp = 10) => {
        const state = get()
        if (!state.completedTopics.includes(topicId)) {
          set({ 
            completedTopics: [...state.completedTopics, topicId],
            xp: state.xp + topicXp
          })
        }
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
        const todayStr = now.toISOString().split('T')[0] // YYYY-MM-DD
        
        if (state.lastVisitDate !== todayStr) {
          const newStreak = calculateStreak(state.lastVisitDate, todayStr, state.streak)
          set({
            lastVisitDate: todayStr,
            streak: newStreak
          })
        }
      },

      resetProgress: () => set({
        xp: 0,
        streak: 0,
        lastVisitDate: null,
        completedTopics: [],
        unlockedBadges: []
      })
    }),
    {
      name: 'toolmate-interview-storage', // name of the item in the storage (must be unique)
    }
  )
)
