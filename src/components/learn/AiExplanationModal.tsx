"use client"

import React, { useState } from "react"
import { TopicContent } from "@/types/content"
import { getAiExplanation, ExplanationLevel, AiExplanationResult } from "@/lib/ai"
import { RetroButton } from "@/components/retro/retro-button"
import { RetroBadge } from "@/components/retro/retro-badge"
import { Sparkles, X, BrainCircuit, Lightbulb, BookmarkCheck, ShieldCheck } from "lucide-react"

export function AiExplanationModal({
  topic,
  isOpen,
  onClose,
}: {
  topic: TopicContent
  isOpen: boolean
  onClose: () => void
}) {
  const [level, setLevel] = useState<ExplanationLevel>("beginner")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AiExplanationResult | null>(null)

  const fetchExplanation = React.useCallback(
    async (selectedLevel: ExplanationLevel) => {
      setLoading(true)
      try {
        const res = await getAiExplanation(topic, selectedLevel)
        setResult(res)
      } catch (err) {
        console.error("AI explanation error:", err)
      } finally {
        setLoading(false)
      }
    },
    [topic]
  )

  React.useEffect(() => {
    if (isOpen) {
      fetchExplanation(level)
    }
  }, [isOpen, level, fetchExplanation])

  if (!isOpen) return null

  const levels: Array<{ id: ExplanationLevel; label: string; icon: string }> = [
    { id: "beginner", label: "ELI5 / Beginner", icon: "👶" },
    { id: "intermediate", label: "Intermediate", icon: "🚀" },
    { id: "advanced", label: "Senior / Architecture", icon: "🏛️" },
    { id: "interview-ready", label: "60s Elevator Pitch", icon: "⏱️" },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="AI Topic Explanations"
    >
      <div
        className="w-full max-w-2xl bg-card border-4 border-border rounded-2xl retro-shadow overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b-4 border-border bg-accent/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary text-primary-foreground border-2 border-border rounded-xl retro-shadow-sm">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black">{topic.title}</h3>
              <p className="text-xs text-muted-foreground font-semibold">
                Multi-Depth AI Explanations & Mental Models
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 border-2 border-border rounded-xl hover:bg-muted retro-shadow-sm"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Level Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 border-b-2 border-border bg-muted/30">
          {levels.map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => setLevel(lvl.id)}
              className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border-2 text-xs font-bold transition-all ${
                level === lvl.id
                  ? "bg-primary text-primary-foreground border-primary retro-shadow-sm scale-[1.02]"
                  : "bg-card border-border hover:bg-muted text-muted-foreground"
              }`}
            >
              <span>{lvl.icon}</span>
              <span>{lvl.label}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {loading ? (
            <div className="py-16 text-center space-y-3 animate-pulse">
              <Sparkles className="w-8 h-8 text-primary mx-auto animate-spin" />
              <p className="font-bold text-muted-foreground">Synthesizing {level} explanation...</p>
            </div>
          ) : result ? (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Provider Badge */}
              <div className="flex items-center justify-between">
                <RetroBadge variant="secondary" className="text-xs px-3 py-1">
                  {result.badge}
                </RetroBadge>
                <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1">
                  <ShieldCheck size={14} className="text-green-600" />
                  {result.provider === "chrome-gemini-nano"
                    ? "Chrome Gemini Nano (On-Device)"
                    : "Curriculum Engine (Offline Private)"}
                </span>
              </div>

              {/* Summary Box */}
              <div className="p-5 bg-card border-2 border-border rounded-xl retro-shadow-sm space-y-2">
                <h4 className="text-sm uppercase tracking-wider font-black text-muted-foreground flex items-center gap-1.5">
                  <Lightbulb size={16} className="text-primary" /> Key Concept
                </h4>
                <p className="text-base md:text-lg leading-relaxed font-semibold">
                  {result.summary}
                </p>
              </div>

              {/* Analogy if available */}
              {result.analogy && (
                <div className="p-4 bg-accent/20 border-l-4 border-accent rounded-r-xl space-y-1">
                  <span className="text-xs font-black uppercase text-accent-foreground tracking-wider">
                    Real-World Analogy
                  </span>
                  <p className="text-sm font-medium text-foreground/90 leading-relaxed">
                    {result.analogy}
                  </p>
                </div>
              )}

              {/* Details Bullet Points */}
              {result.details && result.details.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-black text-muted-foreground uppercase tracking-wider">
                    Core Architectural Takeaways
                  </h4>
                  <ul className="space-y-2">
                    {result.details.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm md:text-base font-medium">
                        <span className="text-primary font-black mt-0.5">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Memory Aid */}
              {result.memoryAid && (
                <div className="p-4 bg-muted border-2 border-border rounded-xl retro-shadow-sm text-xs md:text-sm font-bold flex items-center gap-2">
                  <BookmarkCheck className="w-5 h-5 text-secondary shrink-0" />
                  <span>{result.memoryAid}</span>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-border bg-muted/40 flex justify-end">
          <RetroButton size="sm" onClick={onClose}>
            Done
          </RetroButton>
        </div>
      </div>
    </div>
  )
}
