"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUserStore } from "@/store/useUserStore"
import { SearchDialog } from "@/components/search/SearchDialog"
import { Flame, Star, Trophy, Search, Sparkles, BookOpen, Clock, BrainCircuit, Layers, Award, Code2 } from "lucide-react"

export function Navbar() {
  const { xp, streak, recordVisit, reviewQueue } = useUserStore()
  const [searchOpen, setSearchOpen] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    recordVisit()
  }, [recordVisit])

  // Global Cmd+K / Ctrl+K listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Count due reviews today
  const todayStr = new Date().toISOString().split("T")[0]
  const dueReviewCount = Object.values(reviewQueue || {}).filter(
    (item) => item.dueDate <= todayStr
  ).length

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          {/* Logo */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-black tracking-tight border-2 border-border px-2 py-1 bg-primary text-primary-foreground retro-shadow-sm rotate-[-2deg]">
                ToolMate
              </span>
              <span className="hidden sm:inline-block font-bold">Interview Prep</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1 font-bold text-sm">
              <Link
                href="/practice/quiz"
                className={`px-3 py-1.5 rounded-lg border-2 transition-all flex items-center gap-1.5 ${
                  pathname === "/practice/quiz"
                    ? "bg-accent/40 border-border retro-shadow-sm text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Layers size={14} className="text-primary" />
                <span>Quiz Hub</span>
              </Link>
              <Link
                href="/practice/quiz/jutro"
                className={`px-3 py-1.5 rounded-lg border-2 transition-all flex items-center gap-1.5 ${
                  pathname.startsWith("/practice/quiz/jutro")
                    ? "bg-amber-400 text-black border-black retro-shadow-sm font-black"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Award size={14} className="text-amber-500" />
                <span>Jutro Exam</span>
              </Link>
              <Link
                href="/practice/playground"
                className={`px-3 py-1.5 rounded-lg border-2 transition-all flex items-center gap-1.5 ${
                  pathname.startsWith("/practice/playground")
                    ? "bg-accent/40 border-border retro-shadow-sm text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Code2 size={14} className="text-primary" />
                <span>Playground</span>
              </Link>
              <Link
                href="/practice/review"
                className={`px-3 py-1.5 rounded-lg border-2 transition-all flex items-center gap-1.5 ${
                  pathname.startsWith("/practice/review")
                    ? "bg-accent/40 border-border retro-shadow-sm text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span>Spaced Review</span>
                {dueReviewCount > 0 && (
                  <span className="bg-destructive text-white text-[10px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
                    {dueReviewCount}
                  </span>
                )}
              </Link>
              <Link
                href="/practice/mock"
                className={`px-3 py-1.5 rounded-lg border-2 transition-all flex items-center gap-1 ${
                  pathname.startsWith("/practice/mock")
                    ? "bg-accent/40 border-border retro-shadow-sm text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <BrainCircuit size={15} className="text-primary" />
                <span>Mock Room</span>
              </Link>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-3">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center space-x-2 border-2 border-border bg-card hover:bg-muted px-3 py-1.5 rounded-xl retro-shadow-sm text-xs font-bold transition-all text-muted-foreground"
              aria-label="Open search dialog"
            >
              <Search className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline">Search 1.6k+ topics</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] uppercase bg-muted border border-border rounded font-black">
                ⌘K
              </kbd>
            </button>

            {/* Streak & XP Badges */}
            <div className="hidden sm:flex items-center space-x-3 border-2 border-border bg-card px-3 py-1 rounded-full retro-shadow-sm font-bold text-xs md:text-sm">
              <div className="flex items-center text-orange-500">
                <Flame className="mr-1 h-4 w-4 fill-orange-500" />
                {streak} {streak === 1 ? "Day" : "Days"}
              </div>
              <div className="w-0.5 h-4 bg-border"></div>
              <div className="flex items-center text-yellow-500">
                <Star className="mr-1 h-4 w-4 fill-yellow-500" />
                {xp} XP
              </div>
            </div>

            {/* Dashboard Link */}
            <Link
              href="/dashboard"
              aria-label="View Dashboard"
              className={`border-2 border-border p-2 rounded-xl transition-all retro-shadow-sm ${
                pathname === "/dashboard"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card hover:bg-muted"
              }`}
            >
              <Trophy className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Global Search Dialog Modal */}
      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
