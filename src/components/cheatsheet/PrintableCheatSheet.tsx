"use client"

import React from "react"
import Link from "next/link"
import { TechCheatSheet } from "@/data/cheatsheets"
import { TechStack } from "@/types/content"
import { RetroBadge } from "@/components/retro/retro-badge"
import { RetroButton } from "@/components/retro/retro-button"
import { Printer, ArrowLeft, AlertTriangle, ShieldCheck, Zap, Sparkles, BookOpen } from "lucide-react"

interface PrintableCheatSheetProps {
  sheet: TechCheatSheet
  meta: TechStack
}

export function PrintableCheatSheet({ sheet, meta }: PrintableCheatSheetProps) {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  return (
    <>
      {/* Print-specific style rules */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          nav, header, footer, .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            color: #111827 !important;
            font-size: 11pt !important;
          }
          .print-container {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .break-inside-avoid {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .border-print {
            border: 1pt solid #000 !important;
            box-shadow: none !important;
          }
          a {
            text-decoration: none !important;
            color: inherit !important;
          }
        }
      `}</style>

      <div className="container mx-auto p-4 md:p-8 max-w-5xl space-y-8 print-container">
        {/* Navigation & Print Action Toolbar (Hidden during print) */}
        <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-card border-2 border-border rounded-xl retro-shadow-sm">
          <div className="flex items-center gap-3">
            <Link
              href={`/learn/${meta.id}`}
              className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 border-2 border-border px-3 py-1.5 rounded-lg bg-background"
            >
              <ArrowLeft size={14} /> Back to Course
            </Link>
            <RetroBadge variant="accent" className="text-xs">
              Printable Cheat Sheet
            </RetroBadge>
          </div>

          <div className="flex items-center gap-2">
            <RetroButton
              onClick={handlePrint}
              size="sm"
              className="flex items-center gap-1.5 bg-primary text-primary-foreground font-black retro-shadow-sm"
            >
              <Printer size={15} /> Print / Save as PDF
            </RetroButton>
          </div>
        </div>

        {/* Cheat Sheet Document Header */}
        <div className="border-b-4 border-black dark:border-white/40 pb-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-black tracking-wider uppercase text-muted-foreground">
              ToolMate Technical Interview Revision Deck • {meta.title}
            </span>
            <span className="text-xs font-mono font-bold text-muted-foreground">
              Updated 2026
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
            {sheet.title}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed">
            {sheet.tagline}
          </p>
        </div>

        {/* Golden Rules Box (Break inside avoid) */}
        <div className="break-inside-avoid rounded-xl border-2 border-black dark:border-border bg-amber-500/10 p-4 md:p-5 space-y-2 border-print">
          <h2 className="text-sm md:text-base font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-2">
            <ShieldCheck size={18} /> Top Interview Golden Rules & Senior Principles
          </h2>
          <ul className="space-y-1.5 pl-5 list-disc text-xs md:text-sm font-medium leading-relaxed text-foreground">
            {sheet.goldenRules.map((rule, idx) => (
              <li key={idx} className="marker:text-amber-600">
                {rule}
              </li>
            ))}
          </ul>
        </div>

        {/* Complexity Table (if available) */}
        {sheet.complexityTable && sheet.complexityTable.length > 0 && (
          <div className="break-inside-avoid space-y-2">
            <h2 className="text-sm md:text-base font-black uppercase tracking-wider flex items-center gap-2 text-foreground">
              <Zap size={16} className="text-primary" /> Time & Space Complexity Reference Matrix
            </h2>
            <div className="overflow-x-auto border-2 border-border rounded-xl border-print">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="bg-muted border-b-2 border-border">
                    <th className="p-2.5 font-black">Data Structure / Algorithm</th>
                    <th className="p-2.5 font-black">Best Time</th>
                    <th className="p-2.5 font-black">Average Time</th>
                    <th className="p-2.5 font-black">Worst Time</th>
                    <th className="p-2.5 font-black">Space</th>
                  </tr>
                </thead>
                <tbody>
                  {sheet.complexityTable.map((row, i) => (
                    <tr
                      key={i}
                      className={`border-b border-border/40 ${
                        i % 2 === 0 ? "bg-card" : "bg-muted/30"
                      }`}
                    >
                      <td className="p-2.5 font-bold font-sans">{row.operation}</td>
                      <td className="p-2.5 text-green-600 font-bold">{row.best}</td>
                      <td className="p-2.5 text-amber-600 font-bold">{row.average}</td>
                      <td className="p-2.5 text-red-600 font-bold">{row.worst}</td>
                      <td className="p-2.5 text-indigo-600 font-bold">{row.space}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Core Architectural Sections */}
        <div className="space-y-6">
          {sheet.sections.map((section, sIdx) => (
            <div key={sIdx} className="break-inside-avoid space-y-3">
              <h2 className="text-base md:text-lg font-black border-b-2 border-border pb-1 flex items-center gap-2 text-foreground">
                <BookOpen size={16} className="text-primary" /> {section.title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {section.items.map((item, iIdx) => (
                  <div
                    key={iIdx}
                    className="p-3.5 rounded-xl border-2 border-border bg-card space-y-2 border-print break-inside-avoid"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-black text-sm text-foreground">
                        {item.name}
                      </span>
                    </div>

                    {item.codeOrFormula && (
                      <pre className="p-2 rounded bg-muted font-mono text-xs overflow-x-auto text-primary font-bold border border-border">
                        {item.codeOrFormula}
                      </pre>
                    )}

                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      {item.notes}
                    </p>

                    {item.gotcha && (
                      <div className="text-[11px] font-bold p-2 bg-red-500/10 border-l-2 border-red-500 text-red-700 dark:text-red-300 rounded-r flex items-start gap-1.5">
                        <AlertTriangle size={13} className="shrink-0 mt-0.5 text-red-500" />
                        <span>Gotcha: {item.gotcha}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Print Footer Watermark */}
        <div className="text-center pt-8 border-t border-border text-[10px] font-mono text-muted-foreground">
          ToolMate Interview Prep • https://interview.toolmate.co.in • Free for personal study & interview preparation
        </div>
      </div>
    </>
  )
}
