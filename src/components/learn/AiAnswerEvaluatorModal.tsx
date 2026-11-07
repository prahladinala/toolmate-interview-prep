"use client"

import React, { useState } from "react"
import { TopicContent } from "@/types/content"
import { evaluateCandidateAnswer, AiEvaluationResult } from "@/lib/ai"
import { useUserStore } from "@/store/useUserStore"
import { RetroButton } from "@/components/retro/retro-button"
import { RetroBadge } from "@/components/retro/retro-badge"
import { BrainCircuit, X, CheckCircle2, AlertCircle, Sparkles, Star, HelpCircle, ArrowRight } from "lucide-react"

export function AiAnswerEvaluatorModal({
  topic,
  isOpen,
  onClose,
}: {
  topic: TopicContent
  isOpen: boolean
  onClose: () => void
}) {
  const { addXp } = useUserStore()
  
  // Flatten available questions
  const availableQuestions = React.useMemo(() => {
    const list: string[] = []
    if (topic.questions) {
      Object.values(topic.questions).forEach((arr) => {
        if (Array.isArray(arr)) list.push(...arr)
      })
    }
    if (topic.answers) {
      topic.answers.forEach((a) => {
        if (!list.includes(a.question)) list.push(a.question)
      })
    }
    return list.length > 0 ? list : [`What is ${topic.title} and why is it used?`]
  }, [topic])

  const [selectedQuestion, setSelectedQuestion] = useState(availableQuestions[0] || "")
  const [userAnswer, setUserAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AiEvaluationResult | null>(null)

  const handleEvaluate = async () => {
    if (!userAnswer.trim()) return
    setLoading(true)
    try {
      const evaluation = await evaluateCandidateAnswer(topic, selectedQuestion, userAnswer)
      setResult(evaluation)
      // Award XP for deliberate practice
      addXp(Math.max(10, Math.round(evaluation.score / 5)))
    } catch (err) {
      console.error("Evaluation failed:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setUserAnswer("")
    setResult(null)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="AI Answer Evaluator"
    >
      <div
        className="w-full max-w-2xl bg-card border-4 border-border rounded-2xl retro-shadow overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b-4 border-border bg-accent/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-secondary border-2 border-border rounded-xl retro-shadow-sm">
              <BrainCircuit className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black">AI Interview Coach</h3>
              <p className="text-xs text-muted-foreground font-semibold">
                Practice your technical response with instant rubric feedback
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Question Selector */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
              <HelpCircle size={14} className="text-primary" /> Interview Question
            </label>
            <select
              value={selectedQuestion}
              onChange={(e) => {
                setSelectedQuestion(e.target.value)
                setResult(null)
              }}
              className="w-full p-3 bg-muted/40 border-2 border-border rounded-xl font-bold text-sm outline-none focus:border-primary"
            >
              {availableQuestions.map((q, i) => (
                <option key={i} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>

          {!result ? (
            /* Input Section */
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-muted-foreground tracking-wider">
                  Your Answer (simulate answering an interviewer)
                </label>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Explain the concept clearly, mention real-world trade-offs, and describe how you would use it in production..."
                  rows={6}
                  className="w-full p-4 bg-card border-2 border-border rounded-xl font-medium text-sm leading-relaxed outline-none focus:border-primary resize-y retro-shadow-sm"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-muted-foreground">
                  {userAnswer.trim().split(/\s+/).filter(Boolean).length} words
                </span>
                <RetroButton
                  onClick={handleEvaluate}
                  disabled={loading || userAnswer.trim().length < 10}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" /> Evaluating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Evaluate My Answer
                    </>
                  )}
                </RetroButton>
              </div>
            </div>
          ) : (
            /* Evaluation Results */
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Score Header */}
              <div className="p-4 bg-muted border-2 border-border rounded-xl retro-shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase">Readiness Score</div>
                  <div className="text-3xl font-black flex items-center gap-2">
                    <span>{result.score}%</span>
                    <RetroBadge
                      variant={
                        result.score >= 80 ? "default" : result.score >= 60 ? "secondary" : "destructive"
                      }
                      className="text-xs"
                    >
                      {result.rating}
                    </RetroBadge>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-yellow-600 flex items-center gap-1 justify-end">
                    <Star size={14} className="fill-yellow-500" /> +{Math.max(10, Math.round(result.score / 5))} XP Earned
                  </span>
                  <span className="text-[11px] text-muted-foreground font-semibold">
                    {result.provider === "chrome-gemini-nano" ? "Evaluated with Gemini Nano" : "Evaluated with Curriculum Engine"}
                  </span>
                </div>
              </div>

              {/* What was correct */}
              {result.whatWasCorrect.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase text-green-700 dark:text-green-400 tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 size={16} /> What You Got Right
                  </h4>
                  <ul className="space-y-1.5">
                    {result.whatWasCorrect.map((item, i) => (
                      <li key={i} className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-300 dark:border-green-800 rounded-lg text-sm font-medium text-green-900 dark:text-green-200">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What was missing */}
              {result.whatWasMissing.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider flex items-center gap-1.5">
                    <AlertCircle size={16} /> What You Can Improve / Add
                  </h4>
                  <ul className="space-y-1.5">
                    {result.whatWasMissing.map((item, i) => (
                      <li key={i} className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded-lg text-sm font-medium text-amber-900 dark:text-amber-200">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improved Sample Answer */}
              {result.improvedSampleAnswer && (
                <div className="p-4 bg-card border-2 border-border rounded-xl retro-shadow-sm space-y-2">
                  <h4 className="text-xs font-black uppercase text-primary tracking-wider">
                    Model Interview-Ready Answer
                  </h4>
                  <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                    {result.improvedSampleAnswer}
                  </p>
                </div>
              )}

              {/* Follow-up Question */}
              {result.followUpQuestion && (
                <div className="p-4 bg-accent/20 border-l-4 border-accent rounded-r-xl space-y-1">
                  <span className="text-xs font-black uppercase text-accent-foreground tracking-wider">
                    Next Follow-Up Question To Prepare
                  </span>
                  <p className="text-sm font-bold text-foreground">
                    "{result.followUpQuestion}"
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <RetroButton variant="secondary" size="sm" onClick={handleReset}>
                  Try Another Question
                </RetroButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
