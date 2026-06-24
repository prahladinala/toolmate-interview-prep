"use client"

import * as React from "react"
import Link from "next/link"
import { useUserStore } from "@/store/useUserStore"
import { Flame, Star, Trophy } from "lucide-react"

export function Navbar() {
  const { xp, streak, recordVisit } = useUserStore()

  React.useEffect(() => {
    recordVisit()
  }, [recordVisit])

  return (
    <nav className="sticky top-0 z-50 w-full border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-black tracking-tight border-2 border-border px-2 py-1 bg-primary text-primary-foreground retro-shadow-sm rotate-[-2deg]">
            ToolMate
          </span>
          <span className="hidden sm:inline-block font-bold">Interview Prep</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="flex items-center space-x-4 border-2 border-border bg-card px-3 py-1 rounded-full retro-shadow-sm font-bold text-sm">
            <div className="flex items-center text-orange-500">
              <Flame className="mr-1 h-4 w-4 fill-orange-500" />
              {streak} Day{streak !== 1 ? 's' : ''}
            </div>
            <div className="w-0.5 h-4 bg-border"></div>
            <div className="flex items-center text-yellow-500">
              <Star className="mr-1 h-4 w-4 fill-yellow-500" />
              {xp} XP
            </div>
          </div>
          <Link href="/dashboard" className="border-2 border-border p-2 rounded-full hover:bg-muted transition-colors">
            <Trophy className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </nav>
  )
}
