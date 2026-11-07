"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useUserStore } from "@/store/useUserStore"
import { isItemDue } from "@/lib/spacedRepetition"
import { RetroCard, RetroCardHeader, RetroCardTitle, RetroCardContent } from "@/components/retro/retro-card"
import { RetroButton } from "@/components/retro/retro-button"
import { RetroBadge } from "@/components/retro/retro-badge"
import {
  Flame,
  Star,
  Award,
  CheckCircle2,
  Clock,
  Bookmark,
  FileEdit,
  BrainCircuit,
  Download,
  Upload,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
} from "lucide-react"

export default function DashboardPage() {
  const {
    xp,
    streak,
    completedTopics,
    unlockedBadges,
    bookmarks,
    notes,
    mastery,
    reviewQueue,
    studyTimeSeconds,
    dailyActivity,
    quizAttempts,
    mockSessions,
    exportUserData,
    importUserData,
  } = useUserStore()

  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "bookmarks" | "notes" | "history">("overview")
  const [importMessage, setImportMessage] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="container mx-auto p-8 animate-pulse font-bold text-muted-foreground">
        Loading personalized learning analytics...
      </div>
    )
  }

  const totalCurriculumTopics = 1604
  const completionPercentage = Math.round((completedTopics.length / totalCurriculumTopics) * 100)

  // Mastered topics
  const masteredCount = Object.values(mastery || {}).filter((m) => m.level === "mastered").length

  // Due reviews today
  const todayStr = new Date().toISOString().split("T")[0]
  const dueReviewsCount = Object.values(reviewQueue || {}).filter((item) =>
    isItemDue(item.dueDate, todayStr)
  ).length

  // Calculate average quiz accuracy
  const totalQuizScore = quizAttempts.reduce((acc, q) => acc + q.score, 0)
  const totalQuizQuestions = quizAttempts.reduce((acc, q) => acc + q.totalQuestions, 0)
  const accuracyRate =
    totalQuizQuestions > 0 ? Math.round((totalQuizScore / totalQuizQuestions) * 100) : 0

  // Format study time
  const hours = Math.floor(studyTimeSeconds / 3600)
  const minutes = Math.floor((studyTimeSeconds % 3600) / 60)

  // Generate last 28 days for activity heatmap
  const days: Array<{ date: string; completed: number; seconds: number }> = []
  for (let i = 27; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split("T")[0]
    const activity = dailyActivity[dateStr] || { topicsCompleted: 0, seconds: 0 }
    days.push({
      date: dateStr,
      completed: activity.topicsCompleted,
      seconds: activity.seconds,
    })
  }

  const handleExport = () => {
    const dataStr = exportUserData()
    const blob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `interview-prep-backup-${todayStr}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (content) {
        const success = importUserData(content)
        setImportMessage(success ? "Data imported successfully!" : "Failed to import file. Invalid format.")
        setTimeout(() => setImportMessage(null), 3000)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 max-w-6xl">
      {/* Title & Data Sovereignty Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black">Personalized Dashboard</h1>
          <p className="text-muted-foreground font-medium text-base mt-1">
            Real activity metrics, mastery tracking, and spaced retention schedule.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RetroButton variant="secondary" size="sm" onClick={handleExport} className="flex items-center gap-1.5">
            <Download size={14} /> Export Backup
          </RetroButton>
          <label className="cursor-pointer">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-border rounded-lg text-xs font-bold bg-muted hover:bg-muted/80 text-foreground transition-all">
              <Upload size={14} /> Import Backup
            </span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </div>

      {importMessage && (
        <div className="p-3 bg-accent/20 border-2 border-accent rounded-xl text-xs font-black text-foreground">
          {importMessage}
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Total XP */}
        <RetroCard className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-500">
          <RetroCardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-black uppercase text-yellow-800 dark:text-yellow-400">Total XP</span>
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          </RetroCardHeader>
          <RetroCardContent>
            <div className="text-3xl md:text-4xl font-black text-yellow-950 dark:text-yellow-100">{xp}</div>
            <div className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 mt-1">
              Level {Math.floor(xp / 100) + 1} Candidate
            </div>
          </RetroCardContent>
        </RetroCard>

        {/* Day Streak */}
        <RetroCard className="bg-orange-50 dark:bg-orange-950/20 border-orange-500">
          <RetroCardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-black uppercase text-orange-800 dark:text-orange-400">Streak</span>
            <Flame className="h-5 w-5 text-orange-500 fill-orange-500" />
          </RetroCardHeader>
          <RetroCardContent>
            <div className="text-3xl md:text-4xl font-black text-orange-950 dark:text-orange-100">{streak} Days</div>
            <div className="text-xs font-semibold text-orange-700 dark:text-orange-400 mt-1">
              {streak > 0 ? "Habit active today" : "Start your streak today!"}
            </div>
          </RetroCardContent>
        </RetroCard>

        {/* Completed Topics */}
        <RetroCard className="bg-green-50 dark:bg-green-950/20 border-green-500">
          <RetroCardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-black uppercase text-green-800 dark:text-green-400">Completed</span>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </RetroCardHeader>
          <RetroCardContent>
            <div className="text-3xl md:text-4xl font-black text-green-950 dark:text-green-100">
              {completedTopics.length} <span className="text-lg font-bold">/ {totalCurriculumTopics}</span>
            </div>
            <div className="text-xs font-semibold text-green-700 dark:text-green-400 mt-1">
              {completionPercentage}% of platform
            </div>
          </RetroCardContent>
        </RetroCard>

        {/* Spaced Review Due */}
        <RetroCard className="bg-purple-50 dark:bg-purple-950/20 border-purple-500">
          <RetroCardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-black uppercase text-purple-800 dark:text-purple-400">Due Today</span>
            <Clock className="h-5 w-5 text-purple-500" />
          </RetroCardHeader>
          <RetroCardContent>
            <div className="text-3xl md:text-4xl font-black text-purple-950 dark:text-purple-100">
              {dueReviewsCount} <span className="text-lg font-bold">Topics</span>
            </div>
            <div className="text-xs font-semibold text-purple-700 dark:text-purple-400 mt-1">
              <Link href="/practice/review" className="underline font-bold">
                Review queue ({Object.keys(reviewQueue || {}).length} tracked)
              </Link>
            </div>
          </RetroCardContent>
        </RetroCard>
      </div>

      {/* Secondary Metric Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-card border-2 border-border rounded-xl retro-shadow-sm font-bold text-center">
        <div>
          <div className="text-xs text-muted-foreground uppercase">Topics Mastered</div>
          <div className="text-2xl font-black text-primary">{masteredCount}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase">Quiz Accuracy</div>
          <div className="text-2xl font-black">{totalQuizQuestions > 0 ? `${accuracyRate}%` : "—"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase">Saved Bookmarks</div>
          <div className="text-2xl font-black">{bookmarks.length}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase">Personal Notes</div>
          <div className="text-2xl font-black">{Object.keys(notes).length}</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b-2 border-border gap-2">
        {[
          { id: "overview", label: "Overview & Activity" },
          { id: "bookmarks", label: `Saved Bookmarks (${bookmarks.length})` },
          { id: "notes", label: `Study Notes (${Object.keys(notes).length})` },
          { id: "history", label: `Practice History (${quizAttempts.length + mockSessions.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 font-bold text-sm border-b-4 transition-all -mb-[2px] ${
              activeTab === tab.id
                ? "border-primary text-foreground font-black"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* 28-Day Study Heatmap */}
          <RetroCard>
            <RetroCardHeader>
              <RetroCardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" /> 28-Day Activity Consistency
              </RetroCardTitle>
            </RetroCardHeader>
            <RetroCardContent className="space-y-3">
              <div className="grid grid-cols-7 sm:grid-cols-14 md:grid-cols-28 gap-1.5">
                {days.map((day, idx) => {
                  let bg = "bg-muted/60"
                  if (day.completed >= 3) bg = "bg-green-600"
                  else if (day.completed >= 1) bg = "bg-green-400"
                  else if (day.seconds > 0) bg = "bg-green-200"

                  return (
                    <div
                      key={idx}
                      title={`${day.date}: ${day.completed} topics completed`}
                      className={`h-7 rounded border border-border/40 transition-transform hover:scale-110 ${bg}`}
                    />
                  )
                })}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold pt-1">
                <span>28 days ago</span>
                <div className="flex items-center gap-1.5">
                  <span>Less</span>
                  <div className="w-3 h-3 bg-muted border border-border/40 rounded" />
                  <div className="w-3 h-3 bg-green-200 border border-border/40 rounded" />
                  <div className="w-3 h-3 bg-green-400 border border-border/40 rounded" />
                  <div className="w-3 h-3 bg-green-600 border border-border/40 rounded" />
                  <span>More</span>
                </div>
                <span>Today</span>
              </div>
            </RetroCardContent>
          </RetroCard>

          {/* Practice Modes Quick Launch */}
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/practice/quiz" className="block group">
              <RetroCard className="h-full group-hover:-translate-y-1 transition-transform">
                <RetroCardHeader>
                  <RetroBadge variant="secondary" className="text-xs mb-2">
                    Assessment
                  </RetroBadge>
                  <RetroCardTitle className="text-xl">Quiz Mode</RetroCardTitle>
                </RetroCardHeader>
                <RetroCardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Fast multiple-choice assessments across any stack with instant answers.
                  </p>
                  <span className="text-xs font-black text-primary flex items-center gap-1 group-hover:underline">
                    Start Quiz <ArrowRight size={14} />
                  </span>
                </RetroCardContent>
              </RetroCard>
            </Link>

            <Link href="/practice/review" className="block group">
              <RetroCard className="h-full group-hover:-translate-y-1 transition-transform">
                <RetroCardHeader>
                  <RetroBadge variant="default" className="text-xs mb-2">
                    SM-2 Engine
                  </RetroBadge>
                  <RetroCardTitle className="text-xl">Spaced Review</RetroCardTitle>
                </RetroCardHeader>
                <RetroCardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Review fragile memories scheduled right before your forgetting curve drops.
                  </p>
                  <span className="text-xs font-black text-primary flex items-center gap-1 group-hover:underline">
                    Review {dueReviewsCount} Due <ArrowRight size={14} />
                  </span>
                </RetroCardContent>
              </RetroCard>
            </Link>

            <Link href="/practice/mock" className="block group">
              <RetroCard className="h-full group-hover:-translate-y-1 transition-transform">
                <RetroCardHeader>
                  <RetroBadge variant="accent" className="text-xs mb-2">
                    Simulated Screen
                  </RetroBadge>
                  <RetroCardTitle className="text-xl">Mock Interview Room</RetroCardTitle>
                </RetroCardHeader>
                <RetroCardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    15-minute timed interview simulation with comprehensive AI rubric scoring.
                  </p>
                  <span className="text-xs font-black text-primary flex items-center gap-1 group-hover:underline">
                    Launch Room <ArrowRight size={14} />
                  </span>
                </RetroCardContent>
              </RetroCard>
            </Link>
          </div>

          {/* Badges Section */}
          <RetroCard>
            <RetroCardHeader>
              <RetroCardTitle className="flex items-center gap-2">
                <Award className="text-purple-500" /> Career Badges & Achievements
              </RetroCardTitle>
            </RetroCardHeader>
            <RetroCardContent>
              <div className="flex flex-wrap gap-3">
                {[
                  { name: "First Step", desc: "Completed your first topic" },
                  { name: "Topic Explorer", desc: "Completed 10 topics" },
                  { name: "Knowledge Seeker", desc: "Completed 50 topics" },
                  { name: "Century Club", desc: "Completed 100 topics" },
                  { name: "3-Day Streak", desc: "Consistent learning for 3 days" },
                  { name: "7-Day Habit", desc: "A full week of interview prep" },
                  { name: "Monthly Master", desc: "30-day streak achieved" },
                ].map((b, i) => {
                  const unlocked = unlockedBadges.includes(b.name)
                  return (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border-2 font-bold flex items-center gap-2.5 transition-all ${
                        unlocked
                          ? "bg-purple-50 dark:bg-purple-950/30 border-purple-500 text-purple-900 dark:text-purple-200 retro-shadow-sm"
                          : "bg-muted/40 border-border/40 text-muted-foreground/60 opacity-60"
                      }`}
                    >
                      <Award className={`h-4 w-4 ${unlocked ? "text-purple-600" : "text-muted-foreground"}`} />
                      <div>
                        <div className="text-xs font-black">{b.name}</div>
                        <div className="text-[10px] font-normal">{b.desc}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </RetroCardContent>
          </RetroCard>
        </div>
      )}

      {/* Tab: Bookmarks */}
      {activeTab === "bookmarks" && (
        <RetroCard>
          <RetroCardHeader>
            <RetroCardTitle className="flex items-center gap-2">
              <Bookmark className="text-yellow-500" /> Saved Bookmarks
            </RetroCardTitle>
          </RetroCardHeader>
          <RetroCardContent>
            {bookmarks.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {bookmarks.map((bm, i) => (
                  <Link
                    key={i}
                    href={`/learn/${bm.techId}/${bm.topicId}`}
                    className="p-4 bg-muted/40 hover:bg-accent/20 border-2 border-border rounded-xl transition-all retro-shadow-sm flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs px-2 py-0.5 rounded border border-border bg-card font-black text-muted-foreground">
                        {bm.techId.toUpperCase()}
                      </span>
                      <h4 className="font-black text-base mt-2">{bm.title}</h4>
                      <div className="text-xs text-muted-foreground mt-1">Collection: {bm.collection}</div>
                    </div>
                    <ArrowRight size={16} className="text-muted-foreground" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground font-medium">
                No bookmarks saved yet. Click the "Bookmark" button on any topic to save it for quick revision!
              </div>
            )}
          </RetroCardContent>
        </RetroCard>
      )}

      {/* Tab: Notes */}
      {activeTab === "notes" && (
        <RetroCard>
          <RetroCardHeader>
            <RetroCardTitle className="flex items-center gap-2">
              <FileEdit className="text-primary" /> Personal Study Notes
            </RetroCardTitle>
          </RetroCardHeader>
          <RetroCardContent>
            {Object.keys(notes).length > 0 ? (
              <div className="space-y-4">
                {Object.values(notes).map((note, i) => (
                  <div key={i} className="p-4 bg-card border-2 border-border rounded-xl retro-shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/learn/${note.techId}/${note.topicId}`}
                        className="font-black text-base text-primary hover:underline"
                      >
                        {note.topicId} ({note.techId})
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium whitespace-pre-wrap text-muted-foreground">
                      {note.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground font-medium">
                No personal notes taken yet. Use the "Notes" button on any topic page to record mental models and edge cases!
              </div>
            )}
          </RetroCardContent>
        </RetroCard>
      )}

      {/* Tab: Practice History */}
      {activeTab === "history" && (
        <div className="space-y-6">
          {/* Quizzes */}
          <RetroCard>
            <RetroCardHeader>
              <RetroCardTitle>Quiz History</RetroCardTitle>
            </RetroCardHeader>
            <RetroCardContent>
              {quizAttempts.length > 0 ? (
                <ul className="space-y-3">
                  {quizAttempts.map((q) => (
                    <li
                      key={q.id}
                      className="p-3 bg-muted rounded-xl border border-border flex items-center justify-between text-sm font-bold"
                    >
                      <div>
                        <span>Quiz: {q.techId || "All Technologies"}</span>
                        <span className="block text-xs text-muted-foreground">
                          {new Date(q.date).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-primary">
                          {q.score} / {q.totalQuestions} ({Math.round((q.score / q.totalQuestions) * 100)}%)
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6 text-muted-foreground font-medium">
                  No quizzes completed yet. Launch Quiz Mode to test your skills!
                </div>
              )}
            </RetroCardContent>
          </RetroCard>

          {/* Mock Interviews */}
          <RetroCard>
            <RetroCardHeader>
              <RetroCardTitle>Mock Interview Sessions</RetroCardTitle>
            </RetroCardHeader>
            <RetroCardContent>
              {mockSessions.length > 0 ? (
                <ul className="space-y-3">
                  {mockSessions.map((m) => (
                    <li
                      key={m.id}
                      className="p-3 bg-muted rounded-xl border border-border flex items-center justify-between text-sm font-bold"
                    >
                      <div>
                        <span>{m.topic}</span>
                        <span className="block text-xs text-muted-foreground">
                          {new Date(m.date).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-green-600 font-black">{m.score}% Score</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6 text-muted-foreground font-medium">
                  No mock interviews conducted yet. Try a 15-minute simulated screen in Mock Room!
                </div>
              )}
            </RetroCardContent>
          </RetroCard>
        </div>
      )}
    </div>
  )
}
