"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/store/useUserStore"
import { RetroButton } from "@/components/retro/retro-button"
import { CheckCircle2, ArrowRight } from "lucide-react"

export function CompleteTopicButton({ 
  topicId, 
  techId,
  nextTopicId 
}: { 
  topicId: string;
  techId: string;
  nextTopicId?: string;
}) {
  const { completedTopics, completeTopic } = useUserStore()
  const router = useRouter()
  const [showCelebration, setShowCelebration] = useState(false)
  
  const isCompleted = completedTopics.includes(topicId)

  const handleComplete = () => {
    if (!isCompleted) {
      completeTopic(topicId, 10)
      setShowCelebration(true)
      
      // Auto dismiss celebration and nav
      setTimeout(() => {
        setShowCelebration(false)
        if (nextTopicId) {
          router.push(`/learn/${techId}/${nextTopicId}`)
        }
      }, 2500)
    } else if (nextTopicId) {
      router.push(`/learn/${techId}/${nextTopicId}`)
    }
  }

  return (
    <>
      <RetroButton 
        size="lg" 
        onClick={handleComplete}
        variant={isCompleted ? "secondary" : "default"}
        className="w-full sm:w-auto text-lg"
      >
        {isCompleted ? (
          <>
            <CheckCircle2 className="w-5 h-5 mr-2" /> 
            {nextTopicId ? "Next Topic" : "Completed!"}
          </>
        ) : (
          <>
            Complete Topic (+10 XP) <ArrowRight className="w-5 h-5 ml-2" />
          </>
        )}
      </RetroButton>

      {/* Gamification Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border-4 border-border retro-shadow p-8 rounded-2xl max-w-sm w-full text-center animate-in zoom-in duration-300">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-black mb-2">Amazing work!</h2>
            <p className="text-muted-foreground font-medium mb-6">
              You completed <span className="text-foreground font-bold">{topicId}</span>.<br/>
              You earned +10 XP!
            </p>
            {nextTopicId && (
              <p className="text-primary font-bold animate-pulse">Continuing to next topic...</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
