"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { useUserStore, QuizAttempt } from "@/store/useUserStore"
import { JutroQuestion } from "@/data/jutroQuizData"
import { QuizComparisonChart } from "@/components/quiz/QuizComparisonChart"
import { quizAudio } from "@/lib/quizAudio"
import { RetroCard, RetroCardHeader, RetroCardTitle, RetroCardContent } from "@/components/retro/retro-card"
import { RetroButton } from "@/components/retro/retro-button"
import { RetroBadge } from "@/components/retro/retro-badge"
import {
  Brain,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Flag,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ShieldAlert,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  Award,
  Layers,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Trophy,
} from "lucide-react"

interface ProctoredExamEngineProps {
  examTitle: string
  examSlug: string
  badgeText: string
  passingThresholdPercent?: number
  questions: JutroQuestion[]
  categories: string[]
  defaultDurationMinutes?: number
  icon?: React.ReactNode
}

type QuizMode = "sprint" | "full" | "all"
type ReviewFilter = "all" | "wrong" | "flagged"

export function ProctoredExamEngine({
  examTitle,
  examSlug,
  badgeText,
  passingThresholdPercent = 70,
  questions,
  categories,
  defaultDurationMinutes = 20,
  icon,
}: ProctoredExamEngineProps) {
  const { quizAttempts, recordQuizAttempt, addXp } = useUserStore()
  const [mounted, setMounted] = useState(false)

  // Config
  const [quizMode, setQuizMode] = useState<QuizMode>("sprint")
  const [strictProctoring, setStrictProctoring] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // State
  const [inQuiz, setInQuiz] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [activeQuestions, setActiveQuestions] = useState<JutroQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userSelections, setUserSelections] = useState<Record<number, number[]>>({})
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({})
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<number, boolean>>({})

  // Timer & Proctoring
  const [secondsRemaining, setSecondsRemaining] = useState<number>(defaultDurationMinutes * 60)
  const [initialTimeSeconds, setInitialTimeSeconds] = useState<number>(defaultDurationMinutes * 60)
  const [tabViolations, setTabViolations] = useState(0)
  const [stoppedDueToTabChange, setStoppedDueToTabChange] = useState(false)
  const [showPalette, setShowPalette] = useState(false)

  // Result
  const [currentAttempt, setCurrentAttempt] = useState<QuizAttempt | null>(null)
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("all")

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    quizAudio.setMuted(!soundEnabled)
  }, [soundEnabled])

  const handleFinishQuiz = useCallback(
    (wasStoppedByTab = false) => {
      if (timerRef.current) clearInterval(timerRef.current)

      let score = 0
      const categoryBreakdown: Record<string, { correct: number; total: number }> = {}

      activeQuestions.forEach((q, idx) => {
        if (!categoryBreakdown[q.category]) {
          categoryBreakdown[q.category] = { correct: 0, total: 0 }
        }
        categoryBreakdown[q.category].total += 1

        const selected = userSelections[idx] || []
        const isCorrect =
          selected.length === q.answer.length &&
          selected.every((val) => q.answer.includes(val))

        if (isCorrect) {
          score += 1
          categoryBreakdown[q.category].correct += 1
        }
      })

      const timeSpent = initialTimeSeconds - secondsRemaining
      const attemptRecord: QuizAttempt = {
        id: `${examSlug}_${Date.now()}`,
        date: new Date().toISOString(),
        techId: examSlug,
        quizType: "general",
        quizTitle: examTitle,
        score,
        totalQuestions: activeQuestions.length,
        timeSpentSeconds: Math.max(5, timeSpent),
        tabViolations,
        stoppedDueToTabChange: wasStoppedByTab,
        categoryBreakdown,
      }

      recordQuizAttempt(attemptRecord)
      setCurrentAttempt(attemptRecord)
      setIsCompleted(true)

      if (wasStoppedByTab) {
        setStoppedDueToTabChange(true)
        quizAudio.playWarning()
      } else {
        const pct = Math.round((score / activeQuestions.length) * 100)
        if (pct >= passingThresholdPercent) {
          quizAudio.playFanfare()
          addXp(score * 15)
        } else {
          quizAudio.playCorrect()
          addXp(score * 5)
        }
      }
    },
    [
      activeQuestions,
      userSelections,
      initialTimeSeconds,
      secondsRemaining,
      tabViolations,
      examSlug,
      examTitle,
      passingThresholdPercent,
      recordQuizAttempt,
      addXp,
    ]
  )

  // Anti-cheating: Tab switch detection
  useEffect(() => {
    if (!inQuiz || isCompleted) return

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabViolations((prev) => {
          const nextCount = prev + 1
          if (strictProctoring) {
            handleFinishQuiz(true)
          } else {
            quizAudio.playWarning()
          }
          return nextCount
        })
      }
    }

    const handleWindowBlur = () => {
      if (strictProctoring && !document.hasFocus()) {
        handleVisibilityChange()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("blur", handleWindowBlur)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("blur", handleWindowBlur)
    }
  }, [inQuiz, isCompleted, strictProctoring, handleFinishQuiz])

  // Timer countdown
  useEffect(() => {
    if (inQuiz && !isCompleted && secondsRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            handleFinishQuiz(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [inQuiz, isCompleted, secondsRemaining, handleFinishQuiz])

  const startQuiz = () => {
    let pool = [...questions].sort(() => 0.5 - Math.random())
    let finalQuestions: JutroQuestion[] = []
    let durationSeconds = 600

    if (quizMode === "sprint") {
      finalQuestions = pool.slice(0, Math.min(10, pool.length))
      durationSeconds = finalQuestions.length * 90
    } else if (quizMode === "full") {
      finalQuestions = pool.slice(0, Math.min(25, pool.length))
      durationSeconds = finalQuestions.length * 90
    } else {
      finalQuestions = pool
      durationSeconds = pool.length * 90
    }

    setActiveQuestions(finalQuestions)
    setCurrentIndex(0)
    setUserSelections({})
    setFlaggedQuestions({})
    setSubmittedAnswers({})
    setSecondsRemaining(durationSeconds)
    setInitialTimeSeconds(durationSeconds)
    setTabViolations(0)
    setStoppedDueToTabChange(false)
    setIsCompleted(false)
    setCurrentAttempt(null)
    setInQuiz(true)
    setShowPalette(false)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {})
        setIsFullscreen(false)
      }
    }
  }

  const currentQ = activeQuestions[currentIndex]

  const handleSelectOption = (optionIndex: number) => {
    if (submittedAnswers[currentIndex]) return

    const currentSelected = userSelections[currentIndex] || []
    if (currentQ.isMultiSelect) {
      if (currentSelected.includes(optionIndex)) {
        setUserSelections({
          ...userSelections,
          [currentIndex]: currentSelected.filter((i) => i !== optionIndex),
        })
      } else {
        setUserSelections({
          ...userSelections,
          [currentIndex]: [...currentSelected, optionIndex],
        })
      }
    } else {
      setUserSelections({
        ...userSelections,
        [currentIndex]: [optionIndex],
      })
    }
  }

  const handleSubmitAnswer = () => {
    const selected = userSelections[currentIndex] || []
    if (selected.length === 0) return

    setSubmittedAnswers({ ...submittedAnswers, [currentIndex]: true })
    const isCorrect =
      selected.length === currentQ.answer.length &&
      selected.every((val) => currentQ.answer.includes(val))

    if (isCorrect) {
      quizAudio.playCorrect()
      addXp(10)
    } else {
      quizAudio.playWrong()
    }
  }

  const toggleFlag = (index: number) => {
    setFlaggedQuestions((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s < 10 ? "0" : ""}${s}`
  }

  if (!mounted) {
    return <div className="container mx-auto p-8 animate-pulse font-mono">Loading Examination Engine...</div>
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl space-y-6">
      {/* Quiz Setup Screen */}
      {!inQuiz && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2">
                <RetroBadge variant="accent" className="text-xs">
                  {badgeText}
                </RetroBadge>
                <RetroBadge variant="outline" className="text-xs">
                  Pass Mark: {passingThresholdPercent}%
                </RetroBadge>
              </div>
              <h1 className="text-3xl md:text-4xl font-black">{examTitle}</h1>
            </div>
            <Link href="/practice/quiz">
              <RetroButton variant="secondary" size="sm" className="flex items-center gap-1">
                <Layers size={14} /> Back to Quiz Hub
              </RetroButton>
            </Link>
          </div>

          <RetroCard>
            <RetroCardHeader>
              <RetroCardTitle className="flex items-center gap-2 text-xl">
                <Brain className="text-primary" /> Exam Configuration
              </RetroCardTitle>
            </RetroCardHeader>
            <RetroCardContent className="space-y-6">
              {/* Mode Selection */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-muted-foreground">
                  Select Exam Format
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setQuizMode("sprint")}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      quizMode === "sprint"
                        ? "bg-primary text-primary-foreground border-primary retro-shadow-sm font-black"
                        : "bg-muted text-muted-foreground border-border hover:bg-muted/80 font-bold"
                    }`}
                  >
                    <div className="text-base font-black">Quick Sprint</div>
                    <div className="text-xs opacity-80">
                      {Math.min(10, questions.length)} Questions • 15 Mins
                    </div>
                  </button>

                  <button
                    onClick={() => setQuizMode("full")}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      quizMode === "full"
                        ? "bg-primary text-primary-foreground border-primary retro-shadow-sm font-black"
                        : "bg-muted text-muted-foreground border-border hover:bg-muted/80 font-bold"
                    }`}
                  >
                    <div className="text-base font-black">Standard Exam</div>
                    <div className="text-xs opacity-80">
                      {Math.min(25, questions.length)} Questions • 35 Mins
                    </div>
                  </button>

                  <button
                    onClick={() => setQuizMode("all")}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      quizMode === "all"
                        ? "bg-primary text-primary-foreground border-primary retro-shadow-sm font-black"
                        : "bg-muted text-muted-foreground border-border hover:bg-muted/80 font-bold"
                    }`}
                  >
                    <div className="text-base font-black">Complete Bank</div>
                    <div className="text-xs opacity-80">
                      All {questions.length} Questions
                    </div>
                  </button>
                </div>
              </div>

              {/* Anti-cheat Proctoring Toggle */}
              <div className="flex items-center justify-between p-4 bg-muted border-2 border-border rounded-xl">
                <div className="space-y-0.5">
                  <div className="text-sm font-black flex items-center gap-2">
                    <ShieldAlert size={16} className="text-destructive" /> Anti-Cheat Strict Proctoring
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Automatically stops the exam and records results if you switch tabs or leave the window.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={strictProctoring}
                  onChange={(e) => setStrictProctoring(e.target.checked)}
                  className="w-5 h-5 accent-primary cursor-pointer"
                />
              </div>

              {/* Start Button */}
              <div className="pt-2">
                <RetroButton size="lg" className="w-full text-base font-black" onClick={startQuiz}>
                  Begin Examination
                </RetroButton>
              </div>
            </RetroCardContent>
          </RetroCard>
        </div>
      )}

      {/* In-Exam View */}
      {inQuiz && !isCompleted && currentQ && (
        <div className="space-y-4">
          {/* Header Bar */}
          <div className="flex items-center justify-between p-3 bg-card border-2 border-border rounded-xl retro-shadow-sm text-sm">
            <div className="flex items-center gap-3">
              <span className="font-mono font-black text-primary">
                Q {currentIndex + 1} / {activeQuestions.length}
              </span>
              <RetroBadge variant="secondary" className="text-xs hidden sm:inline">
                {currentQ.category}
              </RetroBadge>
            </div>

            <div className="flex items-center gap-3 font-mono font-bold">
              <div className="flex items-center gap-1 text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                <Clock size={15} /> {formatTime(secondsRemaining)}
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 border border-border rounded-lg hover:bg-muted"
                title={soundEnabled ? "Mute audio" : "Enable audio"}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-1.5 border border-border rounded-lg hover:bg-muted"
                title="Toggle fullscreen"
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </div>
          </div>

          {/* Question Card */}
          <RetroCard>
            <RetroCardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-muted-foreground">
                  {currentQ.isMultiSelect ? "Multi-Select (Choose All Correct)" : "Single Choice"}
                </span>
                <button
                  onClick={() => toggleFlag(currentIndex)}
                  className={`text-xs font-bold flex items-center gap-1 p-1 rounded ${
                    flaggedQuestions[currentIndex] ? "text-amber-500 font-black" : "text-muted-foreground"
                  }`}
                >
                  <Flag size={14} className={flaggedQuestions[currentIndex] ? "fill-amber-500" : ""} />
                  {flaggedQuestions[currentIndex] ? "Flagged" : "Flag"}
                </button>
              </div>

              <RetroCardTitle className="text-lg md:text-xl leading-relaxed">
                {currentQ.question}
              </RetroCardTitle>
            </RetroCardHeader>

            <RetroCardContent className="space-y-4">
              <div className="space-y-2.5">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = (userSelections[currentIndex] || []).includes(optIdx)
                  const isSubmitted = submittedAnswers[currentIndex]
                  const isCorrectAnswer = currentQ.answer.includes(optIdx)

                  let optionStyle = "bg-card border-border hover:bg-muted/60"
                  if (isSubmitted) {
                    if (isCorrectAnswer) {
                      optionStyle = "bg-green-100 dark:bg-green-950 border-green-600 text-green-900 dark:text-green-200 font-black"
                    } else if (isSelected) {
                      optionStyle = "bg-red-100 dark:bg-red-950 border-red-600 text-red-900 dark:text-red-200"
                    }
                  } else if (isSelected) {
                    optionStyle = "bg-primary text-primary-foreground border-primary retro-shadow-sm font-bold"
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-start gap-3 ${optionStyle}`}
                    >
                      <span className="font-mono text-xs font-black px-2 py-0.5 rounded border border-current shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="text-sm font-medium">{opt}</span>
                    </button>
                  )
                })}
              </div>

              {/* Answer submission & navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-3 py-1.5 border border-border rounded-lg text-xs font-bold disabled:opacity-30"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="flex items-center gap-2">
                  {!submittedAnswers[currentIndex] ? (
                    <RetroButton
                      onClick={handleSubmitAnswer}
                      disabled={!(userSelections[currentIndex] || []).length}
                      size="sm"
                    >
                      Check Answer
                    </RetroButton>
                  ) : (
                    <span className="text-xs font-bold text-muted-foreground">Answer Submitted</span>
                  )}

                  {currentIndex < activeQuestions.length - 1 ? (
                    <RetroButton
                      onClick={() => setCurrentIndex((prev) => prev + 1)}
                      size="sm"
                      variant="secondary"
                    >
                      Next <ChevronRight size={16} />
                    </RetroButton>
                  ) : (
                    <RetroButton onClick={() => handleFinishQuiz(false)} size="sm" className="bg-green-600 text-white">
                      Finish Exam
                    </RetroButton>
                  )}
                </div>
              </div>
            </RetroCardContent>
          </RetroCard>
        </div>
      )}

      {/* Completed Results View */}
      {inQuiz && isCompleted && currentAttempt && (
        <div className="space-y-6">
          {stoppedDueToTabChange && (
            <div className="p-4 bg-destructive/15 border-2 border-destructive rounded-xl text-destructive font-bold text-sm flex items-center gap-2">
              <ShieldAlert size={18} />
              <span>Exam stopped due to a detected tab switch / focus loss violation ({tabViolations} violation).</span>
            </div>
          )}

          <RetroCard className="text-center p-8 space-y-6">
            <div className="w-16 h-16 bg-yellow-100 border-2 border-border rounded-full flex items-center justify-center mx-auto retro-shadow-sm">
              <Trophy className="w-8 h-8 text-yellow-600" />
            </div>

            <div className="space-y-1">
              <h2 className="text-3xl font-black">{examTitle} Results</h2>
              <p className="text-lg text-muted-foreground font-medium">
                Score: {currentAttempt.score} / {currentAttempt.totalQuestions} (
                {Math.round((currentAttempt.score / currentAttempt.totalQuestions) * 100)}%)
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <RetroButton onClick={startQuiz} className="flex items-center gap-1">
                <RotateCcw size={16} /> Retake Exam
              </RetroButton>
              <Link href="/practice/quiz">
                <RetroButton variant="secondary">Back to Quiz Hub</RetroButton>
              </Link>
            </div>
          </RetroCard>

          {/* Performance Comparison Chart */}
          <QuizComparisonChart
            currentAttempt={currentAttempt}
            allAttempts={quizAttempts}
          />
        </div>
      )}
    </div>
  )
}
