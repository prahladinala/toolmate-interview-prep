"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X, BookOpen, ArrowRight, CornerDownLeft } from "lucide-react"

export interface SearchItem {
  techId: string
  techTitle: string
  topicId: string
  topicTitle: string
  categoryTitle: string
  url: string
}

export function SearchDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [items, setItems] = useState<SearchItem[]>([])
  const [selectedTech, setSelectedTech] = useState<string>("all")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch search index on open
  useEffect(() => {
    if (isOpen && items.length === 0) {
      setLoading(true)
      fetch("/api/search")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setItems(data)
          }
        })
        .catch((err) => console.error("Search fetch failed:", err))
        .finally(() => setLoading(false))
    }
  }, [isOpen, items.length])

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery("")
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Filter items
  const filteredItems = React.useMemo(() => {
    let result = items

    if (selectedTech !== "all") {
      result = result.filter((item) => item.techId === selectedTech)
    }

    if (!query.trim()) {
      return result.slice(0, 8)
    }

    const q = query.toLowerCase().trim()
    return result
      .filter((item) => {
        return (
          item.topicTitle.toLowerCase().includes(q) ||
          item.techTitle.toLowerCase().includes(q) ||
          item.categoryTitle.toLowerCase().includes(q)
        )
      })
      .slice(0, 15)
  }, [items, query, selectedTech])

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [filteredItems])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length))
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault()
      handleSelect(filteredItems[selectedIndex])
    } else if (e.key === "Escape") {
      onClose()
    }
  }

  const handleSelect = (item: SearchItem) => {
    onClose()
    router.push(item.url)
  }

  if (!isOpen) return null

  // Extract unique tech stacks for filter tabs
  const availableTechs = [
    { id: "all", title: "All Stacks" },
    { id: "javascript", title: "JavaScript" },
    { id: "react", title: "React" },
    { id: "nextjs", title: "Next.js" },
    { id: "typescript", title: "TypeScript" },
    { id: "dsa-javascript", title: "DSA" },
    { id: "frontend-system-design", title: "System Design" },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 md:pt-24 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search topics and interview questions"
    >
      <div
        className="w-full max-w-2xl bg-card border-4 border-border rounded-2xl retro-shadow overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b-4 border-border bg-muted/40">
          <Search className="w-5 h-5 text-muted-foreground mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 1,600+ topics, questions, architectures..."
            className="w-full bg-transparent border-none outline-none font-bold text-lg placeholder:text-muted-foreground/60 text-foreground"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 hover:bg-muted rounded text-muted-foreground mr-2"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-black uppercase bg-muted border-2 border-border rounded retro-shadow-sm">
            ESC
          </kbd>
        </div>

        {/* Tech Filter Pills */}
        <div className="flex items-center gap-1.5 p-2.5 border-b-2 border-border overflow-x-auto bg-muted/20 text-xs font-bold scrollbar-none">
          {availableTechs.map((tech) => (
            <button
              key={tech.id}
              onClick={() => setSelectedTech(tech.id)}
              className={`px-2.5 py-1 rounded-full border border-border transition-colors whitespace-nowrap ${
                selectedTech === tech.id
                  ? "bg-primary text-primary-foreground border-border font-black"
                  : "bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {tech.title}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="overflow-y-auto p-2 space-y-1.5 flex-1 max-h-[420px]">
          {loading && (
            <div className="text-center py-12 font-bold text-muted-foreground animate-pulse">
              Loading 1,600+ interview topics...
            </div>
          )}

          {!loading && filteredItems.length === 0 && (
            <div className="text-center py-12 space-y-2">
              <p className="font-black text-lg">No matching topics found</p>
              <p className="text-sm text-muted-foreground">Try a different keyword or tech stack filter.</p>
            </div>
          )}

          {!loading &&
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex
              return (
                <div
                  key={`${item.techId}-${item.topicId}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? "bg-accent/30 border-border retro-shadow-sm translate-x-1"
                      : "border-transparent hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="p-2 bg-muted border border-border rounded-lg shrink-0">
                      <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-base truncate flex items-center gap-2">
                        <span>{item.topicTitle}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full border border-border bg-card text-muted-foreground font-semibold">
                          {item.techTitle}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground font-medium truncate">
                        {item.categoryTitle}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground font-bold shrink-0 ml-2">
                    {isSelected ? (
                      <span className="flex items-center gap-1 text-primary">
                        Jump <CornerDownLeft size={12} />
                      </span>
                    ) : (
                      <ArrowRight size={14} />
                    )}
                  </div>
                </div>
              )
            })}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t-2 border-border bg-muted/40 text-xs font-bold text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              Navigate <kbd className="px-1.5 py-0.5 border border-border rounded bg-card">↑</kbd>{" "}
              <kbd className="px-1.5 py-0.5 border border-border rounded bg-card">↓</kbd>
            </span>
            <span>
              Select <kbd className="px-1.5 py-0.5 border border-border rounded bg-card">↵</kbd>
            </span>
          </div>
          <div>Total Indexed: {items.length > 0 ? items.length : "1,600+"} Topics</div>
        </div>
      </div>
    </div>
  )
}
