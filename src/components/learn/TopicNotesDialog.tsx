"use client"

import React, { useState, useEffect } from "react"
import { useUserStore } from "@/store/useUserStore"
import { RetroButton } from "@/components/retro/retro-button"
import { FileEdit, X, Check, Trash2 } from "lucide-react"

export function TopicNotesDialog({
  topicId,
  techId,
  topicTitle,
  isOpen,
  onClose,
}: {
  topicId: string
  techId: string
  topicTitle: string
  isOpen: boolean
  onClose: () => void
}) {
  const { notes, saveNote, deleteNote } = useUserStore()
  const currentNote = notes[topicId]?.text || ""
  const [text, setText] = useState(currentNote)
  const [savedStatus, setSavedStatus] = useState(false)

  useEffect(() => {
    setText(currentNote)
  }, [currentNote, isOpen])

  if (!isOpen) return null

  const handleSave = () => {
    saveNote(topicId, techId, text)
    setSavedStatus(true)
    setTimeout(() => {
      setSavedStatus(false)
      onClose()
    }, 600)
  }

  const handleDelete = () => {
    deleteNote(topicId)
    setText("")
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Topic Notes"
    >
      <div
        className="w-full max-w-lg bg-card border-4 border-border rounded-2xl retro-shadow overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b-4 border-border bg-accent/20">
          <div className="flex items-center space-x-2">
            <FileEdit className="w-5 h-5 text-primary" />
            <h3 className="font-black text-lg">Notes: {topicTitle}</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Jot down key mnemonics, interview nuances, or personal mistakes to avoid..."
            rows={7}
            className="w-full p-3 bg-muted/30 border-2 border-border rounded-xl font-medium text-sm leading-relaxed outline-none focus:border-primary resize-y"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>{text.length} characters</span>
            {notes[topicId]?.updatedAt && (
              <span>Last updated: {new Date(notes[topicId].updatedAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-t-2 border-border bg-muted/40">
          {currentNote ? (
            <button
              onClick={handleDelete}
              className="text-xs font-bold text-destructive hover:underline flex items-center gap-1"
            >
              <Trash2 size={14} /> Delete
            </button>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <RetroButton variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </RetroButton>
            <RetroButton size="sm" onClick={handleSave} className="flex items-center gap-1">
              {savedStatus ? (
                <>
                  <Check size={14} /> Saved!
                </>
              ) : (
                "Save Note"
              )}
            </RetroButton>
          </div>
        </div>
      </div>
    </div>
  )
}
