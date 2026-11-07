"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useUserStore } from "@/store/useUserStore"
import { evaluateCandidateAnswer, AiEvaluationResult } from "@/lib/ai"
import { RetroCard, RetroCardHeader, RetroCardTitle, RetroCardContent } from "@/components/retro/retro-card"
import { RetroButton } from "@/components/retro/retro-button"
import { RetroBadge } from "@/components/retro/retro-badge"
import { BrainCircuit, Clock, Sparkles, CheckCircle2, Trophy, ArrowRight, Play, RotateCcw } from "lucide-react"

interface MockQuestion {
  techId: string
  topicTitle: string
  question: string
  canonicalDefinition: string
}

export default function MockInterviewRoomPage() {
  const { recordMockSession, addXp } = useUserStore()
  const [mounted, setMounted] = useState(false)
  const [track, setTrack] = useState("frontend")
  const [inSession, setInSession] = useState(false)
  const [secondsRemaining, setSecondsRemaining] = useState(900) // 15 mins
  const [questions, setQuestions] = useState<MockQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [evaluations, setEvaluations] = useState<AiEvaluationResult[]>([])
  const [loading, setLoading] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (inSession && !isCompleted && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            handleFinishInterview()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [inSession, isCompleted, secondsRemaining])

  const startMockInterview = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/search")
      const allTopics = await res.json()

      const trackMap: Record<string, string[]> = {
        frontend: ["javascript", "react", "html-css", "tailwindcss"],
        fullstack: ["javascript", "nodejs", "expressjs", "nextjs", "api-fundamentals"],
        dsa: ["dsa-javascript"],
        systemdesign: ["frontend-system-design"],
      }

      const validTechs = trackMap[track] || ["javascript", "react"]
      const filtered = Array.isArray(allTopics)
        ? allTopics.filter((t: any) => validTechs.includes(t.techId))
        : []

      const selected = [...filtered].sort(() => 0.5 - Math.random()).slice(0, 5)

      const mockQuestions: MockQuestion[] = selected.map((item: any) => ({
        techId: item.techId,
        topicTitle: item.topicTitle,
        question: `How would you explain and apply "${item.topicTitle}" in a real production environment? What trade-offs should be considered?`,
        canonicalDefinition: `Concept under ${item.categoryTitle} in ${item.techTitle}.`,
      }))

      setQuestions(mockQuestions)
      setUserAnswers(new Array(mockQuestions.length).fill(""))
      setEvaluations([])
      setCurrentIndex(0)
      setSecondsRemaining(900)
      setIsCompleted(false)
      setInSession(true)
    } catch (e) {
      console.error("Error setting up mock interview:", e)
    } finally {
      setLoading(false)
    }
  }

  const handleFinishInterview = async () => {
    setLoading(true)
    try {
      // Evaluate all answers
      const evalList: AiEvaluationResult[] = []
      let totalScore = 0

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i]
        const ans = userAnswers[i] || ""
        const mockTopicObj: any = {
          id: q.topicTitle.toLowerCase().replace(/\s+/g, "-"),
          title: q.topicTitle,
          definition: q.canonicalDefinition,
          simpleExplanation: q.canonicalDefinition,
          useCases: ["Production development"],
          questions: { intermediate: [q.question] },
          answers: [{ question: q.question, answer: q.canonicalDefinition }],
        }

        const ev = await evaluateCandidateAnswer(mockTopicObj, q.question, ans)
        evalList.push(ev)
        totalScore += ev.score
      }

      const averageScore = Math.round(totalScore / Math.max(1, questions.length))
      setEvaluations(evalList)
      setIsCompleted(true)

      // Save to store
      recordMockSession({
        techId: track,
        topic: `${track.toUpperCase()} Technical Screen`,
        score: averageScore,
        durationSeconds: 900 - secondsRemaining,
        feedback: `Completed with an overall average score of ${averageScore}%.`,
      })
      addXp(averageScore)
    } catch (err) {
      console.error("Mock interview scoring error:", err)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return <div className="container mx-auto p-8 animate-pulse">Loading Mock Interview Room...</div>
  }

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const remainingSecs = secs % 60
    return `${mins}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl space-y-8">
      {/* Setup screen */}
      {!inSession && (
        <div className="space-y-6">
          <div className="space-y-2 text-center md:text-left">
            <RetroBadge variant="accent" className="text-xs px-3 py-1">
              Simulated Technical Screen
            </RetroBadge>
            <h1 className="text-4xl md:text-5xl font-black">Mock Interview Room</h1>
            <p className="text-muted-foreground font-medium text-lg">
              Practice under timed conditions. Answer 5 questions in 15 minutes and receive comprehensive AI rubric evaluations.
            </p>
          </div>

          <RetroCard>
            <RetroCardHeader>
              <RetroCardTitle className="flex items-center gap-2">
                <BrainCircuit className="text-primary" /> Select Interview Track
              </RetroCardTitle>
            </RetroCardHeader>
            <RetroCardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { id: "frontend", title: "Frontend Specialist", desc: "React, JavaScript, CSS, Web Architecture" },
                  { id: "fullstack", title: "Full-Stack Engineer", desc: "Node.js, Express, Next.js, REST APIs" },
                  { id: "dsa", title: "Data Structures & Algorithms", desc: "Complexity analysis, arrays, trees, hashing" },
                  { id: "systemdesign", title: "Frontend System Design", desc: "State management, caching, offline UX" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTrack(item.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      track === item.id
                        ? "bg-accent/30 border-primary retro-shadow-sm font-black"
                        : "bg-card border-border hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <div className="font-black text-base text-foreground">{item.title}</div>
                    <div className="text-xs text-muted-foreground font-medium mt-1">{item.desc}</div>
                  </button>
                ))}
              </div>

              <div className="pt-4">
                <RetroButton
                  size="lg"
                  className="w-full text-lg flex items-center justify-center gap-2"
                  onClick={startMockInterview}
                  disabled={loading}
                >
                  <Play size={18} /> {loading ? "Setting up Room..." : "Begin 15-Minute Interview"}
                </RetroButton>
              </div>
            </RetroCardContent>
          </RetroCard>
        </div>
      )}

      {/* Active Session */}
      {inSession && !isCompleted && questions[currentIndex] && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex items-center justify-between p-4 bg-card border-2 border-border rounded-xl retro-shadow-sm">
            <span className="font-black text-sm">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-1.5 font-mono font-black text-lg text-primary">
              <Clock size={18} />
              <span>{formatTime(secondsRemaining)}</span>
            </div>
          </div>

          <RetroCard>
            <RetroCardHeader>
              <RetroBadge variant="secondary" className="text-xs mb-2">
                {questions[currentIndex].topicTitle}
              </RetroBadge>
              <RetroCardTitle className="text-xl md:text-2xl leading-relaxed">
                {questions[currentIndex].question}
              </RetroCardTitle>
            </RetroCardHeader>

            <RetroCardContent className="space-y-4">
              <textarea
                value={userAnswers[currentIndex] || ""}
                onChange={(e) => {
                  const updated = [...userAnswers]
                  updated[currentIndex] = e.target.value
                  setUserAnswers(updated)
                }}
                placeholder="Explain clearly: define the concept, cite practical implementation details, and discuss trade-offs..."
                rows={8}
                className="w-full p-4 bg-muted/30 border-2 border-border rounded-xl font-medium text-sm leading-relaxed outline-none focus:border-primary resize-y"
              />

              <div className="flex items-center justify-between pt-2">
                <RetroButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                >
                  Previous
                </RetroButton>

                {currentIndex < questions.length - 1 ? (
                  <RetroButton
                    size="sm"
                    onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  >
                    Next Question
                  </RetroButton>
                ) : (
                  <RetroButton
                    size="sm"
                    onClick={handleFinishInterview}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {loading ? "Grading Interview..." : "Finish Interview"}
                  </RetroButton>
                )}
              </div>
            </RetroCardContent>
          </RetroCard>
        </div>
      )}

      {/* Results screen */}
      {inSession && isCompleted && (
        <div className="space-y-6">
          <RetroCard className="text-center p-8 space-y-4">
            <div className="w-16 h-16 bg-yellow-100 border-2 border-border rounded-full flex items-center justify-center mx-auto retro-shadow-sm">
              <Trophy className="w-8 h-8 text-yellow-600" />
            </div>

            <h2 className="text-3xl font-black">Interview Debriefing</h2>
            <p className="text-muted-foreground font-medium text-base">
              Here is your structured AI performance evaluation across all 5 questions.
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-2">
              <div className="p-3 bg-muted border-2 border-border rounded-xl">
                <div className="text-xs font-bold text-muted-foreground uppercase">Average Score</div>
                <div className="text-2xl font-black">
                  {Math.round(
                    evaluations.reduce((acc, ev) => acc + ev.score, 0) / Math.max(1, evaluations.length)
                  )}
                  %
                </div>
              </div>
              <div className="p-3 bg-muted border-2 border-border rounded-xl">
                <div className="text-xs font-bold text-muted-foreground uppercase">Duration</div>
                <div className="text-2xl font-black">{formatTime(900 - secondsRemaining)}</div>
              </div>
            </div>
          </RetroCard>

          {/* Detailed Question Evaluations */}
          <div className="space-y-4">
            <h3 className="font-black text-xl">Question by Question Breakdown</h3>
            {evaluations.map((ev, i) => (
              <RetroCard key={i}>
                <RetroCardHeader>
                  <div className="flex items-center justify-between">
                    <RetroBadge variant="secondary" className="text-xs">
                      {questions[i]?.topicTitle}
                    </RetroBadge>
                    <span className="font-black text-sm text-primary">Score: {ev.score}%</span>
                  </div>
                  <RetroCardTitle className="text-base font-bold mt-2">
                    {questions[i]?.question}
                  </RetroCardTitle>
                </RetroCardHeader>
                <RetroCardContent className="space-y-3 text-sm">
                  {ev.whatWasCorrect.length > 0 && (
                    <div className="text-green-700 dark:text-green-400 font-medium">
                      ✓ {ev.whatWasCorrect[0]}
                    </div>
                  )}
                  {ev.whatWasMissing.length > 0 && (
                    <div className="text-amber-700 dark:text-amber-400 font-medium">
                      ⚠ Missing: {ev.whatWasMissing[0]}
                    </div>
                  )}
                  <div className="p-3 bg-muted rounded-lg font-medium text-xs leading-relaxed">
                    <strong className="text-foreground">Model Answer:</strong> {ev.improvedSampleAnswer}
                  </div>
                </RetroCardContent>
              </RetroCard>
            ))}
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <RetroButton onClick={startMockInterview} className="flex items-center gap-1.5">
              <RotateCcw size={16} /> Try Another Mock
            </RetroButton>
            <Link href="/dashboard">
              <RetroButton variant="secondary">View Dashboard</RetroButton>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
