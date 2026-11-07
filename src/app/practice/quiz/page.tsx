"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useUserStore, QuizAttempt } from "@/store/useUserStore"
import { RetroCard, RetroCardHeader, RetroCardTitle, RetroCardContent } from "@/components/retro/retro-card"
import { RetroButton } from "@/components/retro/retro-button"
import { RetroBadge } from "@/components/retro/retro-badge"
import { QuizComparisonChart } from "@/components/quiz/QuizComparisonChart"
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Brain,
  ShieldCheck,
  TrendingUp,
  Clock,
  Award,
  Layers,
  ChevronRight,
} from "lucide-react"

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  techTitle: string
}

export default function QuizPracticePage() {
  const { quizAttempts, recordQuizAttempt, addXp } = useUserStore()
  const [mounted, setMounted] = useState(false)
  const [selectedTech, setSelectedTech] = useState("javascript")
  const [questionCount, setQuestionCount] = useState(5)
  const [inQuiz, setInQuiz] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(false)
  const [lastAttempt, setLastAttempt] = useState<QuizAttempt | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const startQuiz = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/search")
      const allTopics = await res.json()

      const filtered = Array.isArray(allTopics)
        ? allTopics.filter((t: any) => selectedTech === "all" || t.techId === selectedTech)
        : []

      const shuffled = [...filtered].sort(() => 0.5 - Math.random()).slice(0, questionCount)

      const generatedQuestions: QuizQuestion[] = shuffled.map((item: any, idx: number) => {
        const correctAnswer = `Understanding ${item.topicTitle} is essential for ${item.categoryTitle} in ${item.techTitle}.`
        const distractor1 = `It is deprecated in modern ${item.techTitle} applications.`
        const distractor2 = `It only runs during development mode and is stripped in production.`
        const distractor3 = `It requires external third-party polyfills to operate.`

        const options = [correctAnswer, distractor1, distractor2, distractor3].sort(
          () => 0.5 - Math.random()
        )
        const correctIndex = options.indexOf(correctAnswer)

        return {
          id: `q_${idx}`,
          question: `Which statement best describes the primary architectural purpose of "${item.topicTitle}" in ${item.techTitle}?`,
          options,
          correctIndex,
          explanation: `In ${item.techTitle}, ${item.topicTitle} is a core concept under ${item.categoryTitle}.`,
          techTitle: item.techTitle,
        }
      })

      setQuestions(generatedQuestions)
      setCurrentIndex(0)
      setSelectedAnswer(null)
      setIsAnswerSubmitted(false)
      setScore(0)
      setIsCompleted(false)
      setInQuiz(true)
      setLastAttempt(null)
    } catch (err) {
      console.error("Failed to generate quiz:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return
    setSelectedAnswer(index)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || isAnswerSubmitted) return
    setIsAnswerSubmitted(true)
    if (selectedAnswer === questions[currentIndex].correctIndex) {
      setScore((prev) => prev + 1)
      addXp(10)
    }
  }

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setIsAnswerSubmitted(false)
    } else {
      setIsCompleted(true)
      const finalScore = score + (selectedAnswer === questions[currentIndex].correctIndex && !isAnswerSubmitted ? 1 : 0)
      const attemptData = {
        techId: selectedTech,
        quizType: "general" as const,
        quizTitle: `${techOptions.find((t) => t.id === selectedTech)?.label || selectedTech} Quiz`,
        score: finalScore,
        totalQuestions: questions.length,
        timeSpentSeconds: questions.length * 30,
        tabViolations: 0,
        stoppedDueToTabChange: false,
      }
      recordQuizAttempt(attemptData)
      setLastAttempt({
        id: `gen-${Date.now()}`,
        ...attemptData,
        date: new Date().toISOString(),
      })
    }
  }

  if (!mounted) {
    return <div className="container mx-auto p-8 animate-pulse font-mono">Loading Assessment Hub...</div>
  }

  const techOptions = [
    { id: "all", label: "Mixed / All Technologies" },
    { id: "javascript", label: "JavaScript Core & Runtime" },
    { id: "react", label: "React Architecture" },
    { id: "nextjs", label: "Next.js App Router" },
    { id: "typescript", label: "TypeScript Type System" },
    { id: "dsa-javascript", label: "Data Structures & Algorithms" },
    { id: "frontend-system-design", label: "Frontend System Design" },
  ]

  // Filter history to display
  const pastAttempts = [...quizAttempts].reverse()

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl space-y-10">
      {/* Quiz Hub Setup */}
      {!inQuiz && (
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2">
              <RetroBadge variant="accent" className="text-xs px-3 py-1 font-black">
                Interactive Examination Center
              </RetroBadge>
              <RetroBadge variant="outline" className="text-xs px-2.5 py-0.5 font-bold">
                Proctoring & Analytics Enabled
              </RetroBadge>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Assessments & Quizzes
            </h1>
            <p className="text-muted-foreground font-medium text-lg max-w-2xl">
              Sharpen your technical edge with timed quizzes, anti-cheat proctoring, authentic
              industry certification questions, and historical performance tracking.
            </p>
          </div>

          {/* FLAGSHIP FEATURED CARD: Jutro Certification Exam */}
          <div className="relative overflow-hidden rounded-2xl border-4 border-black dark:border-white/20 bg-gradient-to-br from-amber-500/15 via-yellow-500/10 to-orange-500/15 p-6 md:p-8 retro-shadow-lg">
            <div className="absolute top-3 right-3 md:top-4 md:right-4">
              <span className="bg-amber-400 text-black font-black text-xs px-3 py-1 rounded-full border-2 border-black flex items-center gap-1.5 shadow-sm">
                <Sparkles size={13} className="fill-black" /> OFFICIAL EXAM BANK
              </span>
            </div>

            <div className="max-w-2xl space-y-4">
              <div className="flex items-center gap-2">
                <RetroBadge variant="secondary" className="font-black text-xs uppercase bg-black text-white dark:bg-white dark:text-black">
                  Guidewire Certified
                </RetroBadge>
                <span className="text-xs font-mono font-bold text-muted-foreground flex items-center gap-1">
                  <Clock size={12} /> 117 Questions • 70% Pass Mark
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-foreground">
                Guidewire Jutro Developer Complete Certification Exam
              </h2>

              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Complete, authentic 117-question certification quiz engine covering Jutro Floorplans,
                Design Tokens, Metadata & Micro-frontends. Includes <strong>strict tab-change detection</strong>,
                audio effects, question palette grid, and historical improvement delta graphs.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-bold">
                <div className="bg-background/80 border-2 border-border rounded-lg p-2.5 text-center">
                  <div className="font-mono text-base font-black text-primary">117</div>
                  <div className="text-[11px] text-muted-foreground">Exam Questions</div>
                </div>
                <div className="bg-background/80 border-2 border-border rounded-lg p-2.5 text-center">
                  <div className="font-mono text-base font-black text-green-600">70%</div>
                  <div className="text-[11px] text-muted-foreground">Passing Threshold</div>
                </div>
                <div className="bg-background/80 border-2 border-border rounded-lg p-2.5 text-center">
                  <div className="font-mono text-base font-black text-amber-600">Strict</div>
                  <div className="text-[11px] text-muted-foreground">Tab Proctoring</div>
                </div>
                <div className="bg-background/80 border-2 border-border rounded-lg p-2.5 text-center">
                  <div className="font-mono text-base font-black text-indigo-600">Delta</div>
                  <div className="text-[11px] text-muted-foreground">Improvement Chart</div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link href="/practice/quiz/jutro" className="w-full sm:w-auto">
                  <RetroButton size="lg" className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-black border-2 border-black font-black flex items-center justify-center gap-2">
                    <Award size={18} /> Launch Jutro Certification Exam <ArrowRight size={16} />
                  </RetroButton>
                </Link>
              </div>
            </div>
          </div>

          {/* GENERAL TECH QUICK QUIZ BUILDER */}
          <RetroCard>
            <RetroCardHeader>
              <RetroCardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                <Brain className="text-primary" /> Technical Knowledge Assessment
              </RetroCardTitle>
              <p className="text-sm text-muted-foreground">
                Generate tailored multiple-choice tests from 1,600+ vetted interview questions across web platforms.
              </p>
            </RetroCardHeader>
            <RetroCardContent className="space-y-6">
              {/* Tech selector */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-muted-foreground tracking-wider">
                  Technology Stack
                </label>
                <select
                  value={selectedTech}
                  onChange={(e) => setSelectedTech(e.target.value)}
                  className="w-full p-3 bg-card border-2 border-border rounded-xl font-bold text-sm outline-none cursor-pointer"
                >
                  {techOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Question Count */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-muted-foreground tracking-wider">
                  Number of Questions
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[5, 10, 15].map((cnt) => (
                    <button
                      key={cnt}
                      onClick={() => setQuestionCount(cnt)}
                      className={`p-3 rounded-xl border-2 font-black transition-all ${
                        questionCount === cnt
                          ? "bg-primary text-primary-foreground border-primary retro-shadow-sm"
                          : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                      }`}
                    >
                      {cnt} Questions
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <RetroButton
                  size="lg"
                  className="w-full text-base font-black"
                  onClick={startQuiz}
                  disabled={loading}
                >
                  {loading ? "Generating Quiz..." : `Start ${questionCount}-Question Quick Quiz`}
                </RetroButton>
              </div>
            </RetroCardContent>
          </RetroCard>

          {/* HISTORICAL ATTEMPTS */}
          {pastAttempts.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black flex items-center gap-2">
                  <TrendingUp size={20} className="text-primary" /> Recent Assessment History
                </h3>
                <span className="text-xs font-bold text-muted-foreground">
                  {pastAttempts.length} total recorded
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pastAttempts.slice(0, 4).map((att) => {
                  const pct = Math.round((att.score / att.totalQuestions) * 100)
                  const passed = pct >= 70
                  return (
                    <div
                      key={att.id}
                      className="p-4 rounded-xl border-2 border-border bg-card hover:bg-muted/30 transition-all flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm">
                            {att.quizTitle || att.techId?.toUpperCase() || "ASSESSMENT"}
                          </span>
                          {att.stoppedDueToTabChange && (
                            <RetroBadge variant="destructive" className="text-[10px] px-1.5 py-0 font-bold">
                              Stopped
                            </RetroBadge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <span>{new Date(att.date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>
                            {att.score}/{att.totalQuestions} ({pct}%)
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`text-sm font-black px-2.5 py-1 rounded-lg border-2 ${
                            passed
                              ? "bg-green-100 dark:bg-green-950 border-green-600 text-green-700 dark:text-green-300"
                              : "bg-red-100 dark:bg-red-950 border-red-600 text-red-700 dark:text-red-300"
                          }`}
                        >
                          {pct}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ACTIVE QUIZ QUESTION */}
      {inQuiz && !isCompleted && questions[currentIndex] && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-sm font-black">
            <span className="text-muted-foreground">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-primary">Current Score: {score}</span>
          </div>

          <div className="w-full h-3 bg-muted border-2 border-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          <RetroCard>
            <RetroCardHeader>
              <div className="flex items-center justify-between mb-2">
                <RetroBadge variant="secondary" className="text-xs">
                  {questions[currentIndex].techTitle}
                </RetroBadge>
              </div>
              <RetroCardTitle className="text-xl md:text-2xl leading-relaxed">
                {questions[currentIndex].question}
              </RetroCardTitle>
            </RetroCardHeader>

            <RetroCardContent className="space-y-4">
              <div className="space-y-2.5">
                {questions[currentIndex].options.map((opt, i) => {
                  let buttonStyle = "bg-card border-border hover:bg-muted/60"

                  if (isAnswerSubmitted) {
                    if (i === questions[currentIndex].correctIndex) {
                      buttonStyle =
                        "bg-green-100 dark:bg-green-950 border-green-600 text-green-900 dark:text-green-200 font-black"
                    } else if (i === selectedAnswer) {
                      buttonStyle =
                        "bg-red-100 dark:bg-red-950 border-red-600 text-red-900 dark:text-red-200"
                    }
                  } else if (selectedAnswer === i) {
                    buttonStyle =
                      "bg-primary text-primary-foreground border-primary retro-shadow-sm font-bold"
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(i)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${buttonStyle}`}
                    >
                      <span className="font-mono text-xs font-black px-2 py-0.5 rounded border border-current shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-sm md:text-base font-medium">{opt}</span>
                    </button>
                  )
                })}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-4">
                {!isAnswerSubmitted ? (
                  <RetroButton
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    className="ml-auto"
                  >
                    Submit Answer
                  </RetroButton>
                ) : (
                  <div className="w-full flex items-center justify-between">
                    <span className="text-sm font-bold flex items-center gap-1.5">
                      {selectedAnswer === questions[currentIndex].correctIndex ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle2 size={16} /> Correct! +10 XP
                        </span>
                      ) : (
                        <span className="text-destructive flex items-center gap-1">
                          <XCircle size={16} /> Incorrect
                        </span>
                      )}
                    </span>
                    <RetroButton onClick={handleNextQuestion} className="flex items-center gap-1">
                      {currentIndex < questions.length - 1 ? (
                        <>
                          Next Question <ArrowRight size={14} />
                        </>
                      ) : (
                        "View Results & Delta"
                      )}
                    </RetroButton>
                  </div>
                )}
              </div>
            </RetroCardContent>
          </RetroCard>
        </div>
      )}

      {/* QUIZ COMPLETION SCREEN */}
      {inQuiz && isCompleted && (
        <div className="space-y-6">
          <RetroCard className="text-center p-8 space-y-6">
            <div className="w-16 h-16 bg-yellow-100 border-2 border-border rounded-full flex items-center justify-center mx-auto retro-shadow-sm">
              <Trophy className="w-8 h-8 text-yellow-600" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-black">Assessment Complete!</h2>
              <p className="text-muted-foreground font-medium text-lg">
                You scored {score} out of {questions.length} (
                {Math.round((score / questions.length) * 100)}%)
              </p>
            </div>

            <div className="p-4 bg-muted border-2 border-border rounded-xl max-w-sm mx-auto font-bold text-sm">
              Earned <span className="text-yellow-600 font-black">+{score * 10} XP</span> toward your rank!
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <RetroButton onClick={startQuiz} className="flex items-center gap-1 justify-center">
                <RotateCcw size={16} /> Retake Assessment
              </RetroButton>
              <RetroButton
                variant="outline"
                onClick={() => setInQuiz(false)}
                className="w-full sm:w-auto"
              >
                Back to Quiz Hub
              </RetroButton>
            </div>
          </RetroCard>

          {/* SVG Score Improvement Trajectory Graph */}
          {lastAttempt && (
            <QuizComparisonChart
              currentAttempt={lastAttempt}
              allAttempts={quizAttempts}
            />
          )}
        </div>
      )}
    </div>
  )
}
