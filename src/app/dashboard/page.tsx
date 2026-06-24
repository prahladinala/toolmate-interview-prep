"use client"

import React from "react"
import { useUserStore } from "@/store/useUserStore"
import { RetroCard, RetroCardHeader, RetroCardTitle, RetroCardContent } from "@/components/retro/retro-card"
import { Flame, Star, Award, CheckCircle2 } from "lucide-react"

export default function DashboardPage() {
  const { xp, streak, completedTopics, unlockedBadges } = useUserStore()

  // Wait for client hydration to avoid hydration mismatch
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="container mx-auto p-8 animate-pulse flex space-x-4">Loading dashboard...</div>
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <h1 className="text-4xl font-black mb-8">Your Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <RetroCard className="bg-yellow-50 border-yellow-500 text-yellow-900">
          <RetroCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <RetroCardTitle className="text-xl">Total XP</RetroCardTitle>
            <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
          </RetroCardHeader>
          <RetroCardContent>
            <div className="text-4xl font-black">{xp}</div>
          </RetroCardContent>
        </RetroCard>
        
        <RetroCard className="bg-orange-50 border-orange-500 text-orange-900">
          <RetroCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <RetroCardTitle className="text-xl">Day Streak</RetroCardTitle>
            <Flame className="h-6 w-6 text-orange-500 fill-orange-500" />
          </RetroCardHeader>
          <RetroCardContent>
            <div className="text-4xl font-black">{streak}</div>
          </RetroCardContent>
        </RetroCard>

        <RetroCard className="bg-green-50 border-green-500 text-green-900">
          <RetroCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <RetroCardTitle className="text-xl">Completed</RetroCardTitle>
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          </RetroCardHeader>
          <RetroCardContent>
            <div className="text-4xl font-black">{completedTopics.length} <span className="text-lg">Topics</span></div>
          </RetroCardContent>
        </RetroCard>

        <RetroCard className="bg-purple-50 border-purple-500 text-purple-900">
          <RetroCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <RetroCardTitle className="text-xl">Badges</RetroCardTitle>
            <Award className="h-6 w-6 text-purple-500" />
          </RetroCardHeader>
          <RetroCardContent>
            <div className="text-4xl font-black">{unlockedBadges.length}</div>
          </RetroCardContent>
        </RetroCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mt-12">
        <RetroCard>
          <RetroCardHeader>
            <RetroCardTitle>Recent Activity</RetroCardTitle>
          </RetroCardHeader>
          <RetroCardContent>
            {completedTopics.length > 0 ? (
              <ul className="space-y-4">
                {completedTopics.slice(-5).reverse().map((topicId, i) => (
                  <li key={i} className="flex items-center space-x-3 p-3 bg-muted rounded-md border-2 border-border retro-shadow-sm">
                    <CheckCircle2 className="text-green-500 h-5 w-5 shrink-0" />
                    <span className="font-bold">Completed topic: {topicId}</span>
                    <span className="ml-auto text-yellow-600 font-bold text-sm">+10 XP</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-muted-foreground font-medium">
                No activity yet. Start learning to earn XP!
              </div>
            )}
          </RetroCardContent>
        </RetroCard>

        <RetroCard>
          <RetroCardHeader>
            <RetroCardTitle>Unlocked Badges</RetroCardTitle>
          </RetroCardHeader>
          <RetroCardContent>
            {unlockedBadges.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {unlockedBadges.map((badge, i) => (
                  <div key={i} className="border-2 border-border bg-card p-4 rounded-full retro-shadow-sm font-bold flex items-center space-x-2">
                    <Award className="h-5 w-5 text-purple-500" />
                    <span>{badge}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground font-medium">
                Complete modules to unlock badges!
              </div>
            )}
          </RetroCardContent>
        </RetroCard>
      </div>
    </div>
  )
}
