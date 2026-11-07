"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useUserStore } from "@/store/useUserStore"
import { ReviewItem, ReviewGrade, isItemDue } from "@/lib/spacedRepetition"
import { RetroCard, RetroCardHeader, RetroCardTitle, RetroCardContent } from "@/components/retro/retro-card"
import { RetroButton } from "@/components/retro/retro-button"
import { RetroBadge } from "@/components/retro/retro-badge"
import { Clock, CheckCircle2, RotateCcw, BookOpen, Brain, Sparkles, ArrowRight } from "lucide-react"

export function ReviewCard({
  item,
  onRate,
}: {
  item: ReviewItem
  onRate: (grade: ReviewGrade) => void
}) {
  const [isRevealed, setIsRevealed] = useState(false)

  return (
    <RetroCard className="w-full max-w-xl mx-auto space-y-6">
      <RetroCardHeader>
        <div className="flex items-center justify-between">
          <RetroBadge variant="secondary" className="text-xs">
            {item.techId.toUpperCase()}
          </RetroBadge>
          <span className="text-xs font-bold text-muted-foreground">
            Repetition #{item.repetitions} • Ease {item.easeFactor}
          </span>
        </div>
        <RetroCardTitle className="text-2xl md:text-3xl font-black mt-2">
          {item.topicTitle}
        </RetroCardTitle>
      </RetroCardHeader>

      <RetroCardContent className="space-y-6">
        {!isRevealed ? (
          <div className="text-center py-8 space-y-4">
            <p className="text-muted-foreground font-medium text-base">
              Test your recall: How does this concept work, and when should you apply it in an interview?
            </p>
            <RetroButton
              onClick={() => setIsRevealed(true)}
              className="mx-auto"
            >
              Show Answer & Key Takeaways
            </RetroButton>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-4 bg-accent/20 border-l-4 border-accent rounded-r-xl space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-accent-foreground">
                Recall Prompt
              </span>
              <p className="text-sm font-medium">
                Review this concept carefully before rating your recall difficulty.
              </p>
            </div>

            <div className="flex justify-center">
              <Link
                href={`/learn/${item.techId}/${item.id}`}
                target="_blank"
                className="text-xs font-black text-primary hover:underline flex items-center gap-1"
              >
                Open Full Topic Lesson in New Tab <ArrowRight size={12} />
              </Link>
            </div>

            {/* Rating Buttons */}
            <div className="space-y-2 pt-4 border-t-2 border-border">
              <span className="text-xs font-black uppercase text-muted-foreground tracking-wider block text-center">
                Rate Your Recall (SM-2 Algorithm)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => onRate(0)}
                  className="p-3 bg-red-100 hover:bg-red-200 border-2 border-border rounded-xl text-xs font-black text-red-900 transition-all retro-shadow-sm"
                >
                  Forgot (Again)
                  <span className="block text-[10px] font-normal mt-0.5">1 day</span>
                </button>
                <button
                  onClick={() => onRate(3)}
                  className="p-3 bg-amber-100 hover:bg-amber-200 border-2 border-border rounded-xl text-xs font-black text-amber-900 transition-all retro-shadow-sm"
                >
                  Hard
                  <span className="block text-[10px] font-normal mt-0.5">Difficult</span>
                </button>
                <button
                  onClick={() => onRate(4)}
                  className="p-3 bg-blue-100 hover:bg-blue-200 border-2 border-border rounded-xl text-xs font-black text-blue-900 transition-all retro-shadow-sm"
                >
                  Good
                  <span className="block text-[10px] font-normal mt-0.5">Optimal</span>
                </button>
                <button
                  onClick={() => onRate(5)}
                  className="p-3 bg-green-100 hover:bg-green-200 border-2 border-border rounded-xl text-xs font-black text-green-900 transition-all retro-shadow-sm"
                >
                  Easy
                  <span className="block text-[10px] font-normal mt-0.5">Accelerate</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </RetroCardContent>
    </RetroCard>
  )
}

export default function SpacedReviewPage() {
  const { reviewQueue, recordSpacedReview } = useUserStore()
  const [mounted, setMounted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="container mx-auto p-8 animate-pulse">Loading Spaced Review...</div>
  }

  const todayStr = new Date().toISOString().split("T")[0]
  const queueList = Object.values(reviewQueue || {})
  const dueItems = queueList.filter((item) => isItemDue(item.dueDate, todayStr))

  const handleRate = (grade: ReviewGrade) => {
    if (!dueItems[currentIndex]) return
    const current = dueItems[currentIndex]
    recordSpacedReview(current.id, current.techId, current.topicTitle, grade)

    if (currentIndex < dueItems.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl space-y-8">
      <div className="space-y-2 text-center md:text-left">
        <RetroBadge variant="secondary" className="text-xs px-3 py-1">
          SuperMemo SM-2 Engine
        </RetroBadge>
        <h1 className="text-4xl md:text-5xl font-black">Spaced Repetition Review</h1>
        <p className="text-muted-foreground font-medium text-lg">
          Reinforce technical concepts right before you forget them for maximum interview retention.
        </p>
      </div>

      {dueItems.length > 0 && currentIndex < dueItems.length ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm font-black">
            <span className="text-muted-foreground">
              Item {currentIndex + 1} of {dueItems.length} Due Today
            </span>
            <span className="text-primary font-bold">
              {queueList.length} Total Topics in Memory Queue
            </span>
          </div>

          <ReviewCard
            key={dueItems[currentIndex].id}
            item={dueItems[currentIndex]}
            onRate={handleRate}
          />
        </div>
      ) : (
        /* Empty state */
        <RetroCard className="text-center p-8 md:p-12 space-y-6">
          <div className="w-16 h-16 bg-green-100 border-2 border-border rounded-full flex items-center justify-center mx-auto retro-shadow-sm">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black">You are all caught up!</h2>
            <p className="text-muted-foreground font-medium max-w-md mx-auto">
              {queueList.length === 0
                ? "You haven't scheduled any topics for review yet. Click 'Add to Review' at the top of any topic lesson to schedule it for spaced repetition."
                : `Great job! None of your ${queueList.length} tracked topics are due for review today.`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link href="/#explore">
              <RetroButton size="lg">Explore Topics</RetroButton>
            </Link>
            <Link href="/dashboard">
              <RetroButton variant="secondary" size="lg">
                View Progress
              </RetroButton>
            </Link>
          </div>
        </RetroCard>
      )}
    </div>
  )
}
