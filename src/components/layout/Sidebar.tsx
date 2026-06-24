"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { TechStack } from "@/types/content"
import { useUserStore } from "@/store/useUserStore"
import { CheckCircle2, Circle, ChevronDown, ChevronRight, Menu, X } from "lucide-react"

export function Sidebar({ techStack }: { techStack: TechStack }) {
  const { completedTopics } = useUserStore()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>(
    techStack.categories.reduce((acc, cat) => ({ ...acc, [cat.id]: true }), {})
  )

  const toggleCat = (catId: string) => {
    setExpandedCats(prev => ({ ...prev, [catId]: !prev[catId] }))
  }

  // Mobile menu handling
  React.useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      {/* Mobile Hamburger */}
      <div className="md:hidden p-4 border-b-2 border-border bg-card flex items-center justify-between sticky top-16 z-40">
        <span className="font-bold text-lg">{techStack.title} Course</span>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 border-2 border-border retro-shadow-sm rounded-md bg-primary text-primary-foreground">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <aside className={`
        fixed md:sticky top-16 md:top-16 z-30 h-[calc(100vh-4rem)] bg-card border-r-2 border-border overflow-y-auto transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        w-64 shrink-0
      `}>
        <div className="p-6">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2">
            <span>{techStack.icon === 'javascript' ? '💛' : techStack.icon === 'react' ? '⚛️' : '💻'}</span>
            {techStack.title}
          </h2>

          <div className="space-y-4">
            {techStack.categories.map((category) => (
              <div key={category.id} className="space-y-2">
                <button 
                  onClick={() => toggleCat(category.id)}
                  className="flex items-center justify-between w-full font-bold text-left py-2 px-2 hover:bg-muted rounded-md transition-colors"
                >
                  <span>{category.title}</span>
                  {expandedCats[category.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>
                
                {expandedCats[category.id] && (
                  <ul className="space-y-1 pl-4 border-l-2 border-border/20 ml-2">
                    {category.topics.map((topic) => {
                      const isCompleted = completedTopics.includes(topic.id)
                      const isActive = pathname.includes(`/learn/${techStack.id}/${topic.id}`)
                      
                      return (
                        <li key={topic.id}>
                          <Link 
                            href={`/learn/${techStack.id}/${topic.id}`}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              isActive 
                                ? "bg-primary text-primary-foreground retro-shadow-sm border-2 border-border font-bold" 
                                : "hover:bg-muted text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 size={16} className={isActive ? "text-primary-foreground" : "text-green-500"} />
                            ) : (
                              <Circle size={16} className={isActive ? "text-primary-foreground" : "text-muted-foreground"} />
                            )}
                            {topic.title}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
