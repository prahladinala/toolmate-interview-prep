"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { useUserStore, QuizAttempt } from "@/store/useUserStore"
import { jutroQuestions, jutroCategories, JutroQuestion } from "@/data/jutroQuizData"
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

type QuizMode = "full" | "all" | "sprint" | "category"
type ReviewFilter = "all" | "wrong" | "flagged"

export function JutroQuizApp() {
  const { quizAttempts, recordQuizAttempt, addXp } = useUserStore()
  const [mounted, setMounted] = useState(false)

  // Quiz setup configuration
  const [quizMode, setQuizMode] = useState<QuizMode>("sprint")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [strictProctoring, setStrictProctoring] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // In-Quiz State
  const [inQuiz, setInQuiz] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [activeQuestions, setActiveQuestions] = useState<JutroQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userSelections, setUserSelections] = useState<Record<number, number[]>>({})
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({})
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<number, boolean>>({})
  
  // Timer & Proctoring
  const [secondsRemaining, setSecondsRemaining] = useState<number>(900)
  const [initialTimeSeconds, setInitialTimeSeconds] = useState<number>(900)
  const [tabViolations, setTabViolations] = useState(0)
  const [stoppedDueToTabChange, setStoppedDueToTabChange] = useState(false)
  const [showPalette, setShowPalette] = useState(false)

  // Post-quiz result
  const [currentAttempt, setCurrentAttempt] = useState<QuizAttempt | null>(null)
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("all")

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Sync audio mute
  useEffect(() => {
    quizAudio.setMuted(!soundEnabled)
  }, [soundEnabled])

  // Finish / Submit Quiz handler
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
        id: `jutro_${Date.now()}`,
        date: new Date().toISOString(),
        techId: "jutro",
        quizType: "jutro",
        quizTitle: "Jutro Developer Certification Quiz",
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
        if (pct >= 70) {
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
      recordQuizAttempt,
      addXp,
    ]
  )

  // Anti-cheating: Tab switch / Window blur proctoring detection
  useEffect(() => {
    if (!inQuiz || isCompleted) return

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabViolations((prev) => {
          const nextCount = prev + 1
          if (strictProctoring) {
            // Immediate quiz termination and submission on tab change
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

  // Timer tick
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

  // Start Quiz setup
  const startQuiz = () => {
    let pool = [...jutroQuestions]

    if (quizMode === "category" && selectedCategory !== "all") {
      pool = pool.filter((q) => q.category === selectedCategory)
    }

    // Shuffle pool
    pool = pool.sort(() => 0.5 - Math.random())

    let finalQuestions: JutroQuestion[] = []
    let durationSeconds = 900 // 15 mins default

    if (quizMode === "sprint") {
      finalQuestions = pool.slice(0, 15)
      durationSeconds = 15 * 60 // 15 mins
    } else if (quizMode === "full") {
      finalQuestions = pool.slice(0, 60)
      durationSeconds = 90 * 60 // 90 mins (official exam duration)
    } else if (quizMode === "all") {
      finalQuestions = pool
      durationSeconds = pool.length * 90 // 1.5 mins per question
    } else if (quizMode === "category") {
      finalQuestions = pool.slice(0, Math.min(25, pool.length))
      durationSeconds = finalQuestions.length * 90
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

  // Toggle fullscreen
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

  // Current question data
  const currentQ = activeQuestions[currentIndex]
  const currentSelections = userSelections[currentIndex] || []
  const isAnswered = currentSelections.length > 0
  const isFlagged = !!flaggedQuestions[currentIndex]

  // Option selection
  const handleSelectOption = (optIdx: number) => {
    if (!currentQ) return

    if (currentQ.isMultiSelect) {
      let updated = [...currentSelections]
      if (updated.includes(optIdx)) {
        updated = updated.filter((i) => i !== optIdx)
      } else {
        updated.push(optIdx)
      }
      setUserSelections((prev) => ({ ...prev, [currentIndex]: updated }))
    } else {
      setUserSelections((prev) => ({ ...prev, [currentIndex]: [optIdx] }))
    }
  }

  // Toggle flag
  const toggleFlag = (idx: number) => {
    setFlaggedQuestions((prev) => ({ ...prev, [idx]: !prev[idx] }))
  }

  // Format MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const rem = secs % 60
    return `${mins.toString().padStart(2, "0")}:${rem.toString().padStart(2, "0")}`
  }

  if (!mounted) {
    return (
      <div className="container mx-auto p-8 animate-pulse text-muted-foreground font-bold">
        Loading Jutro Developer Certification System...
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 1. SETUP SCREEN */}
      {!inQuiz && (
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Header */}
          <div className="space-y-3 text-center md:text-left">
            <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
              <RetroBadge variant="default" className="text-xs px-3 py-1 font-black">
                Guidewire Jutro Digital Platform
              </RetroBadge>
              <RetroBadge variant="secondary" className="text-xs px-3 py-1 font-bold">
                117 Real Certification Questions
              </RetroBadge>
              <RetroBadge variant="accent" className="text-xs px-3 py-1 font-bold">
                Anti-Cheat Proctoring Enabled
              </RetroBadge>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Jutro Developer <br />
              <span className="text-primary underline decoration-8 decoration-accent underline-offset-8">
                Certification Exam
              </span>
            </h1>
            <p className="text-lg md:text-xl font-medium text-muted-foreground max-w-2xl">
              Official certification preparation for Jutro Design System (JDS), Floorplans, Theming & Tokens, Digital SDK, Composite Requests, JWA, and Micro Frontends.
            </p>
          </div>

          {/* Configuration Card */}
          <RetroCard>
            <RetroCardHeader>
              <RetroCardTitle className="flex items-center gap-2 text-2xl">
                <Brain className="text-primary" /> Exam Configuration
              </RetroCardTitle>
            </RetroCardHeader>

            <RetroCardContent className="space-y-6">
              {/* Exam Mode Selector */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-muted-foreground tracking-wider block">
                  Select Practice Format
                </label>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    {
                      id: "sprint",
                      title: "Quick Sprint",
                      desc: "15 questions • 15 mins",
                      badge: "Fast Practice",
                    },
                    {
                      id: "full",
                      title: "Official Mock Exam",
                      desc: "60 questions • 90 mins",
                      badge: "Real Exam Simulation",
                    },
                    {
                      id: "all",
                      title: "Complete Bank",
                      desc: "All 117 questions",
                      badge: "Mastery Mode",
                    },
                    {
                      id: "category",
                      title: "Domain Deep-Dive",
                      desc: "Filtered by category",
                      badge: "Topic Focused",
                    },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setQuizMode(mode.id as QuizMode)}
                      className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col justify-between ${
                        quizMode === mode.id
                          ? "bg-accent/30 border-primary retro-shadow-sm font-black scale-[1.02]"
                          : "bg-card border-border hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      <div>
                        <div className="text-xs font-black text-primary uppercase tracking-wider mb-1">
                          {mode.badge}
                        </div>
                        <div className="font-black text-base text-foreground">{mode.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{mode.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Picker (if Domain Deep-Dive selected) */}
              {quizMode === "category" && (
                <div className="space-y-2 animate-in fade-in duration-150">
                  <label className="text-xs font-black uppercase text-muted-foreground tracking-wider block">
                    Choose Jutro Domain
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-3 bg-muted/40 border-2 border-border rounded-xl font-bold text-sm outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="all">All Domains ({jutroQuestions.length} Questions)</option>
                    {jutroCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat} ({jutroQuestions.filter((q) => q.category === cat).length} Questions)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Advanced Exam Toggles */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t-2 border-border">
                {/* Strict Tab Proctoring */}
                <div className="p-4 bg-muted/30 border-2 border-border rounded-xl flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="font-black text-sm flex items-center gap-1.5">
                      <ShieldAlert size={16} className="text-destructive" />
                      Tab-Switch Auto-Stop (Exam Proctoring)
                    </span>
                    <p className="text-xs text-muted-foreground font-medium">
                      Simulates strict exam conditions: if you switch browser tabs, the quiz immediately locks and submits your answers.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={strictProctoring}
                    onChange={(e) => setStrictProctoring(e.target.checked)}
                    className="w-5 h-5 accent-primary cursor-pointer mt-1"
                  />
                </div>

                {/* Sound Effects */}
                <div className="p-4 bg-muted/30 border-2 border-border rounded-xl flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="font-black text-sm flex items-center gap-1.5">
                      {soundEnabled ? <Volume2 size={16} className="text-primary" /> : <VolumeX size={16} className="text-muted-foreground" />}
                      Audio Chimes & Cues
                    </span>
                    <p className="text-xs text-muted-foreground font-medium">
                      Pleasant synthesized audio feedback for correct answers, tab switch warnings, and pass fanfare.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                    className="w-5 h-5 accent-primary cursor-pointer mt-1"
                  />
                </div>
              </div>

              {/* Start Button */}
              <div className="pt-2">
                <RetroButton
                  size="lg"
                  className="w-full text-lg flex items-center justify-center gap-2 py-4"
                  onClick={startQuiz}
                >
                  <Sparkles size={20} /> Begin Jutro Certification Exam
                </RetroButton>
              </div>
            </RetroCardContent>
          </RetroCard>
        </div>
      )}

      {/* 2. IN-EXAM ACTIVE SCREEN */}
      {inQuiz && !isCompleted && currentQ && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Top Control Bar */}
          <div className="p-4 bg-card border-2 border-border rounded-xl retro-shadow-sm flex flex-wrap items-center justify-between gap-3 sticky top-20 z-30">
            {/* Question progress and category */}
            <div className="flex items-center gap-2">
              <RetroBadge variant="secondary" className="text-xs">
                {currentQ.category}
              </RetroBadge>
              <span className="font-black text-sm text-foreground">
                Question {currentIndex + 1} of {activeQuestions.length}
              </span>
            </div>

            {/* Timer and Controls */}
            <div className="flex items-center gap-3">
              {/* Flag button */}
              <button
                onClick={() => toggleFlag(currentIndex)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border-2 text-xs font-black transition-all ${
                  isFlagged
                    ? "bg-amber-100 text-amber-900 border-amber-500 font-black"
                    : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                }`}
                title="Flag this question to review later"
              >
                <Flag size={13} className={isFlagged ? "fill-amber-500 text-amber-600" : ""} />
                <span>{isFlagged ? "Flagged" : "Flag"}</span>
              </button>

              {/* Question Palette Drawer Trigger */}
              <button
                onClick={() => setShowPalette(!showPalette)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border-2 border-border bg-muted hover:bg-muted/80 text-xs font-black"
              >
                <Layers size={13} />
                <span>Grid ({Object.keys(userSelections).filter((k) => userSelections[Number(k)]?.length > 0).length}/{activeQuestions.length})</span>
              </button>

              {/* Timer */}
              <div
                className={`flex items-center gap-1.5 font-mono font-black text-base px-3 py-1 rounded-lg border-2 ${
                  secondsRemaining < 120
                    ? "bg-destructive text-destructive-foreground border-destructive animate-pulse"
                    : "bg-muted border-border text-primary"
                }`}
              >
                <Clock size={16} />
                <span>{formatTime(secondsRemaining)}</span>
              </div>

              {/* Fullscreen & Mute */}
              <button
                onClick={toggleFullscreen}
                className="p-1.5 border-2 border-border rounded-lg bg-card hover:bg-muted"
                aria-label="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </div>
          </div>

          {/* Question Grid / Palette Drawer (Togglable) */}
          {showPalette && (
            <div className="p-4 bg-card border-2 border-border rounded-xl retro-shadow-sm space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-xs font-black uppercase text-muted-foreground">
                <span>Jump to Question</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Answered
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Flagged
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-muted border border-border" /> Unanswered
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-1.5 max-h-48 overflow-y-auto p-1">
                {activeQuestions.map((_, i) => {
                  const answered = (userSelections[i] || []).length > 0
                  const flagged = !!flaggedQuestions[i]
                  const isCurrent = i === currentIndex

                  let bg = "bg-muted text-muted-foreground border-border"
                  if (answered) bg = "bg-green-100 text-green-900 border-green-600 font-black"
                  if (flagged) bg = "bg-amber-100 text-amber-900 border-amber-500 font-black"

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentIndex(i)
                        setShowPalette(false)
                      }}
                      className={`h-8 rounded-lg border-2 text-xs font-black transition-all flex items-center justify-center relative ${bg} ${
                        isCurrent ? "ring-2 ring-primary scale-110 z-10" : ""
                      }`}
                    >
                      {i + 1}
                      {flagged && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute top-0.5 right-0.5" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Question Card */}
          <RetroCard>
            <RetroCardHeader>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Question ID: {currentQ.id}
                </span>
                {currentQ.isMultiSelect ? (
                  <RetroBadge variant="accent" className="text-xs font-black">
                    Multi-Select: Select {currentQ.answer.length} Options
                  </RetroBadge>
                ) : (
                  <RetroBadge variant="outline" className="text-xs font-black">
                    Single Choice
                  </RetroBadge>
                )}
              </div>

              <RetroCardTitle className="text-xl md:text-2xl leading-relaxed mt-2">
                {currentQ.question}
              </RetroCardTitle>
            </RetroCardHeader>

            <RetroCardContent className="space-y-4">
              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = currentSelections.includes(optIdx)

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? "bg-accent/40 border-primary retro-shadow-sm font-bold scale-[1.005]"
                          : "bg-card border-border hover:bg-muted/60 text-foreground"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border bg-card"
                        }`}
                      >
                        {currentQ.isMultiSelect ? (
                          isSelected ? "✓" : ""
                        ) : (
                          <span className="text-xs font-mono font-black">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                        )}
                      </div>
                      <span className="text-sm md:text-base font-medium leading-relaxed">
                        {opt}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-6 border-t-2 border-border">
                <RetroButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft size={16} /> Previous
                </RetroButton>

                <div className="flex items-center gap-3">
                  {currentIndex < activeQuestions.length - 1 ? (
                    <RetroButton
                      size="sm"
                      onClick={() => setCurrentIndex((prev) => Math.min(activeQuestions.length - 1, prev + 1))}
                      className="flex items-center gap-1"
                    >
                      Next <ChevronRight size={16} />
                    </RetroButton>
                  ) : (
                    <RetroButton
                      size="sm"
                      onClick={() => handleFinishQuiz(false)}
                      className="bg-green-600 hover:bg-green-700 text-white font-black"
                    >
                      Submit Exam
                    </RetroButton>
                  )}
                </div>
              </div>
            </RetroCardContent>
          </RetroCard>
        </div>
      )}

      {/* 3. EXAM RESULTS & PERFORMANCE COMPARISON */}
      {inQuiz && isCompleted && currentAttempt && (
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Violation Banner if tab switch stopped exam */}
          {stoppedDueToTabChange && (
            <div className="p-5 bg-red-100 border-4 border-destructive rounded-2xl retro-shadow space-y-2 text-destructive-foreground">
              <div className="flex items-center gap-2 font-black text-lg text-red-950">
                <ShieldAlert size={24} className="text-destructive shrink-0" />
                <span>EXAM STOPPED: Tab Change / Window Blur Detected</span>
              </div>
              <p className="text-sm font-semibold text-red-900 leading-relaxed">
                Anti-cheating exam proctoring was active on this session. Because you navigated away or switched browser tabs, the exam was automatically stopped and submitted based on the questions you completed up to that point.
              </p>
            </div>
          )}

          {/* Primary Result Card */}
          <RetroCard className="text-center p-8 space-y-6">
            <div className="w-20 h-20 bg-yellow-100 border-4 border-border rounded-full flex items-center justify-center mx-auto retro-shadow-sm">
              <Trophy className="w-10 h-10 text-yellow-600" />
            </div>

            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-black">
                {currentAttempt.score / currentAttempt.totalQuestions >= 0.7
                  ? "Congratulations! You Passed!"
                  : "Certification Exam Completed"}
              </h2>
              <p className="text-muted-foreground font-medium text-lg">
                You scored <strong>{currentAttempt.score}</strong> out of{" "}
                <strong>{currentAttempt.totalQuestions}</strong> (
                {Math.round((currentAttempt.score / currentAttempt.totalQuestions) * 100)}%)
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <RetroBadge
                variant={
                  currentAttempt.score / currentAttempt.totalQuestions >= 0.7
                    ? "default"
                    : "destructive"
                }
                className="text-base px-4 py-1.5 font-black"
              >
                {currentAttempt.score / currentAttempt.totalQuestions >= 0.7
                  ? "✓ CERTIFICATION READY (PASS)"
                  : "⚠ RETEST RECOMMENDED (<70%)"}
              </RetroBadge>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <RetroButton onClick={startQuiz} className="flex items-center gap-1.5 justify-center">
                <RotateCcw size={16} /> Retake Exam
              </RetroButton>
              <Link href="/dashboard">
                <RetroButton variant="secondary" className="w-full sm:w-auto">
                  View in Dashboard
                </RetroButton>
              </Link>
            </div>
          </RetroCard>

          {/* Visual Performance Graph & Last Attempt Improvement */}
          <QuizComparisonChart
            currentAttempt={currentAttempt}
            allAttempts={quizAttempts}
          />

          {/* Question Review Section */}
          <div className="space-y-4 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-2xl font-black flex items-center gap-2">
                <CheckCircle2 className="text-primary" /> Question Review & Detailed Explanations
              </h3>

              {/* Review Filter Pills */}
              <div className="flex items-center gap-1.5 bg-muted p-1 rounded-xl border border-border text-xs font-bold">
                <button
                  onClick={() => setReviewFilter("all")}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    reviewFilter === "all" ? "bg-card border border-border font-black" : "text-muted-foreground"
                  }`}
                >
                  All ({activeQuestions.length})
                </button>
                <button
                  onClick={() => setReviewFilter("wrong")}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    reviewFilter === "wrong" ? "bg-destructive text-white font-black" : "text-muted-foreground"
                  }`}
                >
                  Incorrect Only
                </button>
                <button
                  onClick={() => setReviewFilter("flagged")}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    reviewFilter === "flagged" ? "bg-amber-400 text-black font-black" : "text-muted-foreground"
                  }`}
                >
                  Flagged Only
                </button>
              </div>
            </div>

            {/* List of reviewed questions */}
            <div className="space-y-4">
              {activeQuestions
                .filter((q, idx) => {
                  const selected = userSelections[idx] || []
                  const isCorrect =
                    selected.length === q.answer.length &&
                    selected.every((val) => q.answer.includes(val))

                  if (reviewFilter === "wrong") return !isCorrect
                  if (reviewFilter === "flagged") return !!flaggedQuestions[idx]
                  return true
                })
                .map((q, idx) => {
                  const origIdx = activeQuestions.indexOf(q)
                  const selected = userSelections[origIdx] || []
                  const isCorrect =
                    selected.length === q.answer.length &&
                    selected.every((val) => q.answer.includes(val))

                  return (
                    <RetroCard key={origIdx} className="border-2">
                      <RetroCardHeader className="pb-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <RetroBadge variant="secondary" className="text-xs">
                              {q.category}
                            </RetroBadge>
                            <span className="font-bold text-xs text-muted-foreground">
                              Question #{origIdx + 1}
                            </span>
                          </div>
                          {isCorrect ? (
                            <span className="text-xs font-black text-green-700 bg-green-100 border border-green-600 px-2 py-0.5 rounded flex items-center gap-1">
                              <CheckCircle2 size={12} /> Correct
                            </span>
                          ) : (
                            <span className="text-xs font-black text-red-700 bg-red-100 border border-red-600 px-2 py-0.5 rounded flex items-center gap-1">
                              <XCircle size={12} /> Incorrect
                            </span>
                          )}
                        </div>

                        <RetroCardTitle className="text-base font-black mt-2 leading-relaxed">
                          {q.question}
                        </RetroCardTitle>
                      </RetroCardHeader>

                      <RetroCardContent className="space-y-3 pt-0">
                        {/* Option states */}
                        <div className="space-y-1.5 text-xs font-medium">
                          {q.options.map((opt, optIdx) => {
                            const isCorrectOpt = q.answer.includes(optIdx)
                            const isSelectedOpt = selected.includes(optIdx)

                            let style = "bg-muted/40 border-border"
                            if (isCorrectOpt) {
                              style = "bg-green-100 text-green-900 border-green-600 font-bold"
                            } else if (isSelectedOpt) {
                              style = "bg-red-100 text-red-900 border-red-600 line-through"
                            }

                            return (
                              <div
                                key={optIdx}
                                className={`p-2.5 rounded-lg border flex items-center justify-between ${style}`}
                              >
                                <span>{opt}</span>
                                {isCorrectOpt && <span className="font-black text-green-800">✓ Correct Answer</span>}
                                {!isCorrectOpt && isSelectedOpt && (
                                  <span className="font-black text-red-800">✗ Your Choice</span>
                                )}
                              </div>
                            )
                          })}
                        </div>

                        {/* Explanation */}
                        {q.explanation && (
                          <div className="p-3 bg-card border-l-4 border-primary rounded-r-lg text-xs font-semibold text-muted-foreground leading-relaxed mt-2">
                            <strong className="text-foreground">Official Jutro Explanation:</strong>{" "}
                            {q.explanation}
                          </div>
                        )}
                      </RetroCardContent>
                    </RetroCard>
                  )
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
