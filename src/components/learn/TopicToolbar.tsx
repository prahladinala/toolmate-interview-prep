"use client"

import React, { useState } from "react"
import { TopicContent } from "@/types/content"
import { useUserStore, MasteryLevel } from "@/store/useUserStore"
import { AiExplanationModal } from "./AiExplanationModal"
import { AiAnswerEvaluatorModal } from "./AiAnswerEvaluatorModal"
import { TopicNotesDialog } from "./TopicNotesDialog"
import {
  Bookmark,
  BookmarkCheck,
  BrainCircuit,
  Sparkles,
  FileEdit,
  Clock,
  CheckCircle,
  AlertCircle,
  HelpCircle,
} from "lucide-react"

export function TopicToolbar({
  topic,
  techId,
}: {
  topic: TopicContent
  techId: string
}) {
  const {
    bookmarks,
    toggleBookmark,
    isBookmarked,
    notes,
    mastery,
    setTopicMastery,
    recordSpacedReview,
    reviewQueue,
  } = useUserStore()

  const [aiExplainOpen, setAiExplainOpen] = useState(false)
  const [aiEvalOpen, setAiEvalOpen] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)
  const [reviewScheduled, setReviewScheduled] = useState(false)

  const bookmarked = isBookmarked(topic.id)
  const hasNote = !!notes[topic.id]?.text
  const currentMastery = mastery[topic.id]?.level || "learning"
  const inReviewQueue = !!reviewQueue[topic.id]

  const handleToggleBookmark = () => {
    toggleBookmark(topic.id, techId, topic.title)
  }

  const handleScheduleReview = () => {
    recordSpacedReview(topic.id, techId, topic.title, 4) // Default positive recall
    setReviewScheduled(true)
    setTimeout(() => setReviewScheduled(false), 2000)
  }

  const handleMasteryChange = (level: MasteryLevel) => {
    const confidenceMap: Record<MasteryLevel, 1 | 2 | 3 | 4 | 5> = {
      learning: 2,
      "needs-revision": 1,
      mastered: 5,
    }
    setTopicMastery(topic.id, techId, level, confidenceMap[level])
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-card border-2 border-border rounded-xl retro-shadow-sm">
        {/* Left Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* AI Explanations */}
          <button
            onClick={() => setAiExplainOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground border-2 border-border rounded-lg text-xs font-black hover:opacity-90 retro-shadow-sm transition-all"
          >
            <Sparkles size={14} />
            <span>Explain with AI</span>
          </button>

          {/* AI Coach */}
          <button
            onClick={() => setAiEvalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-accent-foreground border-2 border-border rounded-lg text-xs font-black hover:opacity-90 retro-shadow-sm transition-all"
          >
            <BrainCircuit size={14} />
            <span>Interview Coach</span>
          </button>

          {/* Notes */}
          <button
            onClick={() => setNotesOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 border-2 border-border rounded-lg text-xs font-bold transition-all relative ${
              hasNote
                ? "bg-secondary text-secondary-foreground font-black"
                : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileEdit size={14} />
            <span>Notes</span>
            {hasNote && (
              <span className="w-2 h-2 rounded-full bg-primary absolute -top-1 -right-1" />
            )}
          </button>

          {/* Bookmark */}
          <button
            onClick={handleToggleBookmark}
            className={`flex items-center gap-1.5 px-3 py-1.5 border-2 border-border rounded-lg text-xs font-bold transition-all ${
              bookmarked
                ? "bg-yellow-100 border-yellow-500 text-yellow-900 font-black"
                : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
            }`}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark this topic"}
          >
            {bookmarked ? (
              <>
                <BookmarkCheck size={14} className="text-yellow-600 fill-yellow-500" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Bookmark size={14} />
                <span>Bookmark</span>
              </>
            )}
          </button>
        </div>

        {/* Right Status & Spaced Repetition */}
        <div className="flex items-center gap-2">
          {/* Spaced Repetition Button */}
          <button
            onClick={handleScheduleReview}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border-2 text-xs font-bold transition-all ${
              inReviewQueue || reviewScheduled
                ? "bg-green-100 text-green-900 border-green-500 font-black"
                : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
            }`}
            title="Add to Spaced Repetition (SM-2) review schedule"
          >
            <Clock size={13} />
            <span>{reviewScheduled ? "Scheduled!" : inReviewQueue ? "In Review Queue" : "Add to Review"}</span>
          </button>

          {/* Mastery selector */}
          <select
            value={currentMastery}
            onChange={(e) => handleMasteryChange(e.target.value as MasteryLevel)}
            aria-label="Mastery Status"
            className="p-1.5 bg-muted border-2 border-border rounded-lg font-bold text-xs outline-none cursor-pointer"
          >
            <option value="learning">📖 Learning</option>
            <option value="needs-revision">⚠️ Needs Revision</option>
            <option value="mastered">🏆 Mastered</option>
          </select>
        </div>
      </div>

      {/* Modals */}
      <AiExplanationModal
        topic={topic}
        isOpen={aiExplainOpen}
        onClose={() => setAiExplainOpen(false)}
      />
      <AiAnswerEvaluatorModal
        topic={topic}
        isOpen={aiEvalOpen}
        onClose={() => setAiEvalOpen(false)}
      />
      <TopicNotesDialog
        topicId={topic.id}
        techId={techId}
        topicTitle={topic.title}
        isOpen={notesOpen}
        onClose={() => setNotesOpen(false)}
      />
    </>
  )
}
