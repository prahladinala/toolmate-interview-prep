"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"

export function FlashCard({ question, answer }: { question: string, answer: string }) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div 
      className="relative w-full h-[200px] cursor-pointer perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div 
          className="absolute w-full h-full backface-hidden bg-card border-2 border-border retro-shadow rounded-xl flex flex-col items-center justify-center p-6 text-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="absolute top-4 left-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Question</div>
          <h4 className="font-bold text-lg md:text-xl text-primary">{question}</h4>
          <div className="absolute bottom-4 text-xs font-bold text-muted-foreground">Click to reveal answer</div>
        </div>

        {/* Back */}
        <div 
          className="absolute w-full h-full backface-hidden bg-accent border-2 border-border retro-shadow rounded-xl flex flex-col items-center justify-center p-6 text-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="absolute top-4 left-4 text-xs font-bold text-foreground/60 uppercase tracking-widest">Answer</div>
          <p className="text-foreground font-bold text-md md:text-lg">{answer}</p>
        </div>
      </motion.div>
    </div>
  )
}
