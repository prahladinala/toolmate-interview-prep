"use client"

import React from "react"
import { QuizAttempt } from "@/store/useUserStore"
import { RetroBadge } from "@/components/retro/retro-badge"
import { TrendingUp, TrendingDown, Minus, Award, AlertTriangle, Clock, Zap, Target } from "lucide-react"

interface QuizComparisonChartProps {
  currentAttempt: QuizAttempt
  allAttempts: QuizAttempt[]
}

export function QuizComparisonChart({ currentAttempt, allAttempts }: QuizComparisonChartProps) {
  // Filter attempts for this specific quiz/tech
  const relevantAttempts = allAttempts
    .filter(
      (a) =>
        (currentAttempt.quizType && a.quizType === currentAttempt.quizType) ||
        (currentAttempt.techId && a.techId === currentAttempt.techId)
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Find previous attempt (if any)
  const currentIndex = relevantAttempts.findIndex((a) => a.id === currentAttempt.id)
  const previousAttempt = currentIndex > 0 ? relevantAttempts[currentIndex - 1] : null

  const currentPercent = Math.round((currentAttempt.score / currentAttempt.totalQuestions) * 100)
  const previousPercent = previousAttempt
    ? Math.round((previousAttempt.score / previousAttempt.totalQuestions) * 100)
    : null

  const percentDelta = previousPercent !== null ? currentPercent - previousPercent : null

  // Time per question comparison
  const currentTimePerQ = Math.round(currentAttempt.timeSpentSeconds / currentAttempt.totalQuestions)
  const prevTimePerQ = previousAttempt
    ? Math.round(previousAttempt.timeSpentSeconds / previousAttempt.totalQuestions)
    : null

  // Chart dimensions
  const svgWidth = 600
  const svgHeight = 220
  const paddingX = 45
  const paddingY = 30
  const innerWidth = svgWidth - paddingX * 2
  const innerHeight = svgHeight - paddingY * 2

  // Prepare points for line graph
  const chartAttempts = relevantAttempts.slice(-8) // Show up to last 8 attempts
  const points = chartAttempts.map((attempt, index) => {
    const x =
      chartAttempts.length === 1
        ? svgWidth / 2
        : paddingX + (index / (chartAttempts.length - 1)) * innerWidth
    const pct = Math.round((attempt.score / attempt.totalQuestions) * 100)
    const y = paddingY + innerHeight - (pct / 100) * innerHeight
    return { x, y, pct, attempt, isCurrent: attempt.id === currentAttempt.id }
  })

  // SVG path line
  const linePath =
    points.length > 1
      ? points.reduce(
          (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
          ""
        )
      : ""

  const areaPath =
    points.length > 1
      ? `${linePath} L ${points[points.length - 1].x} ${paddingY + innerHeight} L ${points[0].x} ${paddingY + innerHeight} Z`
      : ""

  // Category breakdown
  const categoryBreakdown = currentAttempt.categoryBreakdown || {}
  const categoryEntries = Object.entries(categoryBreakdown).map(([category, stats]) => {
    const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
    return { category, ...stats, pct }
  })

  const strongestCategory = [...categoryEntries].sort((a, b) => b.pct - a.pct)[0]
  const weakestCategory = [...categoryEntries].sort((a, b) => a.pct - b.pct)[0]

  return (
    <div className="space-y-6">
      {/* 1. Delta & Trend Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Score Improvement */}
        <div className="p-4 bg-card border-2 border-border rounded-xl retro-shadow-sm flex flex-col justify-between">
          <span className="text-xs font-black uppercase text-muted-foreground tracking-wider flex items-center justify-between">
            <span>Score Comparison</span>
            {percentDelta !== null && (
              <span
                className={`flex items-center text-xs font-black px-2 py-0.5 rounded-full border ${
                  percentDelta > 0
                    ? "bg-green-100 text-green-800 border-green-600"
                    : percentDelta < 0
                    ? "bg-red-100 text-red-800 border-red-600"
                    : "bg-muted text-foreground border-border"
                }`}
              >
                {percentDelta > 0 ? (
                  <>
                    <TrendingUp size={12} className="mr-1" /> +{percentDelta}%
                  </>
                ) : percentDelta < 0 ? (
                  <>
                    <TrendingDown size={12} className="mr-1" /> {percentDelta}%
                  </>
                ) : (
                  <>
                    <Minus size={12} className="mr-1" /> 0%
                  </>
                )}
              </span>
            )}
          </span>
          <div className="mt-2">
            <div className="text-3xl font-black flex items-baseline gap-2">
              <span>{currentPercent}%</span>
              {previousPercent !== null && (
                <span className="text-xs text-muted-foreground line-through font-bold">
                  prev {previousPercent}%
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-muted-foreground mt-1">
              {percentDelta === null
                ? "First recorded exam attempt"
                : percentDelta > 0
                ? "Awesome! Significant score improvement."
                : percentDelta < 0
                ? "Score dipped below previous attempt. Keep practicing!"
                : "Consistent score maintained."}
            </p>
          </div>
        </div>

        {/* Speed / Pace */}
        <div className="p-4 bg-card border-2 border-border rounded-xl retro-shadow-sm flex flex-col justify-between">
          <span className="text-xs font-black uppercase text-muted-foreground tracking-wider flex items-center justify-between">
            <span>Pace per Question</span>
            <Clock size={14} className="text-primary" />
          </span>
          <div className="mt-2">
            <div className="text-3xl font-black">{currentTimePerQ}s</div>
            <p className="text-xs font-semibold text-muted-foreground mt-1">
              {prevTimePerQ !== null
                ? currentTimePerQ <= prevTimePerQ
                  ? `${prevTimePerQ - currentTimePerQ}s faster per question`
                  : `${currentTimePerQ - prevTimePerQ}s more deliberate pace`
                : "Baseline pace established"}
            </p>
          </div>
        </div>

        {/* Pass / Certification Threshold */}
        <div className="p-4 bg-card border-2 border-border rounded-xl retro-shadow-sm flex flex-col justify-between">
          <span className="text-xs font-black uppercase text-muted-foreground tracking-wider flex items-center justify-between">
            <span>Certification Status</span>
            <Target size={14} className="text-yellow-500" />
          </span>
          <div className="mt-2">
            <div className="text-2xl font-black flex items-center gap-2">
              {currentPercent >= 70 ? (
                <span className="text-green-600 flex items-center gap-1.5">
                  <Award className="h-6 w-6" /> CERTIFIED (PASS)
                </span>
              ) : (
                <span className="text-amber-600 flex items-center gap-1.5">
                  <AlertTriangle className="h-6 w-6" /> NEEDS 70% TO PASS
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-muted-foreground mt-1">
              Guidewire official pass mark: 70%
            </p>
          </div>
        </div>
      </div>

      {/* 2. Visual Progress Graph Over Time */}
      <div className="p-5 bg-card border-2 border-border rounded-xl retro-shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-black text-base flex items-center gap-2">
              <TrendingUp className="text-primary" size={18} /> Performance Trajectory Over Attempts
            </h4>
            <p className="text-xs text-muted-foreground font-medium">
              Tracking your retention across {relevantAttempts.length} recorded exam attempts
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1 text-muted-foreground">
              <span className="w-3 h-0.5 bg-border border-b border-dashed" /> 70% Pass Line
            </span>
            <span className="flex items-center gap-1 text-primary">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Current Attempt
            </span>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto min-w-[500px]">
            {/* Background Grid Lines */}
            {[0, 25, 50, 70, 100].map((pct) => {
              const y = paddingY + innerHeight - (pct / 100) * innerHeight
              const isPassLine = pct === 70
              return (
                <g key={pct}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={svgWidth - paddingX}
                    y2={y}
                    stroke={isPassLine ? "#eab308" : "var(--color-border)"}
                    strokeDasharray={isPassLine ? "4 4" : "2 2"}
                    strokeWidth={isPassLine ? 2 : 1}
                    opacity={isPassLine ? 0.9 : 0.25}
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill={isPassLine ? "#eab308" : "currentColor"}
                    fontWeight={isPassLine ? "bold" : "normal"}
                    opacity={0.8}
                  >
                    {pct}%
                  </text>
                </g>
              )
            })}

            {/* Area Fill */}
            {areaPath && (
              <path
                d={areaPath}
                fill="var(--color-primary)"
                opacity="0.12"
              />
            )}

            {/* Main Trend Line */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Point Markers */}
            {points.map((p, idx) => (
              <g key={idx}>
                {p.isCurrent && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="9"
                    fill="var(--color-primary)"
                    opacity="0.25"
                    className="animate-pulse"
                  />
                )}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={p.isCurrent ? "6" : "4.5"}
                  fill={p.isCurrent ? "var(--color-primary)" : "var(--color-card)"}
                  stroke="var(--color-foreground)"
                  strokeWidth="2"
                />
                <text
                  x={p.x}
                  y={p.y - 10}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="black"
                  fill="currentColor"
                >
                  {p.pct}%
                </text>
                <text
                  x={p.x}
                  y={svgHeight - 10}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="bold"
                  fill="currentColor"
                  opacity="0.6"
                >
                  #{idx + 1}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* 3. Category & Domain Mastery Breakdown */}
      {categoryEntries.length > 0 && (
        <div className="p-5 bg-card border-2 border-border rounded-xl retro-shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-base flex items-center gap-2">
              <Zap className="text-secondary" size={18} /> Domain Knowledge Mastery Breakdown
            </h4>
            <div className="flex items-center gap-2 text-xs font-bold">
              {strongestCategory && (
                <span className="text-green-700 bg-green-50 border border-green-300 px-2 py-0.5 rounded">
                  Best: {strongestCategory.category} ({strongestCategory.pct}%)
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {categoryEntries.map((cat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="truncate pr-2">{cat.category}</span>
                  <span className="shrink-0 font-mono">
                    {cat.correct}/{cat.total} ({cat.pct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-muted rounded-full border border-border overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      cat.pct >= 75
                        ? "bg-green-500"
                        : cat.pct >= 50
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {weakestCategory && weakestCategory.pct < 70 && (
            <div className="p-3 bg-accent/20 border-l-4 border-accent rounded-r-xl text-xs font-medium space-y-1">
              <span className="font-black text-accent-foreground uppercase tracking-wider block">
                Recommended Study Focus
              </span>
              <span>
                To guarantee your certification, review questions in <strong>{weakestCategory.category}</strong> (currently at {weakestCategory.pct}% accuracy).
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
