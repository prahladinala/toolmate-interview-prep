"use client"

import React, { useState, useEffect, useRef } from "react"
import { PLAYGROUND_PRESETS, CodingChallenge } from "./playgroundPresets"
import { RetroCard, RetroCardHeader, RetroCardTitle, RetroCardContent } from "@/components/retro/retro-card"
import { RetroButton } from "@/components/retro/retro-button"
import { RetroBadge } from "@/components/retro/retro-badge"
import {
  Play,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Terminal,
  Code2,
  HelpCircle,
  Clock,
  Layers,
  ChevronDown,
} from "lucide-react"

interface ConsoleEntry {
  type: "log" | "error" | "warn" | "info" | "result"
  content: string
  time: string
}

interface TestResult {
  name: string
  passed: boolean
}

export function CodePlayground({ initialPresetId }: { initialPresetId?: string }) {
  const [selectedChallenge, setSelectedChallenge] = useState<CodingChallenge>(() => {
    return (
      PLAYGROUND_PRESETS.find((p) => p.id === initialPresetId) ||
      PLAYGROUND_PRESETS[0]
    )
  })

  const [code, setCode] = useState(selectedChallenge.initialCode)
  const [showSolution, setShowSolution] = useState(false)
  const [logs, setLogs] = useState<ConsoleEntry[]>([])
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [activeTab, setActiveTab] = useState<"console" | "tests">("console")
  const [isRunning, setIsRunning] = useState(false)
  const [executionTime, setExecutionTime] = useState<number | null>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Update code when preset changes
  useEffect(() => {
    setCode(selectedChallenge.initialCode)
    setShowSolution(false)
    setLogs([])
    setTestResults([])
    setExecutionTime(null)
  }, [selectedChallenge])

  // Execute general code and capture console output
  const handleRunCode = async () => {
    setIsRunning(true)
    setActiveTab("console")
    const newLogs: ConsoleEntry[] = []
    const now = () => new Date().toLocaleTimeString().split(" ")[0]

    // Save real console methods
    const originalLog = console.log
    const originalError = console.error
    const originalWarn = console.warn
    const originalInfo = console.info

    const formatArg = (arg: any): string => {
      if (typeof arg === "undefined") return "undefined"
      if (arg === null) return "null"
      if (typeof arg === "object") {
        try {
          return JSON.stringify(arg, null, 2)
        } catch {
          return String(arg)
        }
      }
      return String(arg)
    }

    console.log = (...args: any[]) => {
      newLogs.push({
        type: "log",
        content: args.map(formatArg).join(" "),
        time: now(),
      })
      originalLog(...args)
    }
    console.error = (...args: any[]) => {
      newLogs.push({
        type: "error",
        content: args.map(formatArg).join(" "),
        time: now(),
      })
      originalError(...args)
    }
    console.warn = (...args: any[]) => {
      newLogs.push({
        type: "warn",
        content: args.map(formatArg).join(" "),
        time: now(),
      })
      originalWarn(...args)
    }
    console.info = (...args: any[]) => {
      newLogs.push({
        type: "info",
        content: args.map(formatArg).join(" "),
        time: now(),
      })
      originalInfo(...args)
    }

    const startTime = performance.now()

    try {
      // Execute within async function context
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
      const fn = new AsyncFunction(code)
      const returnValue = await fn()

      if (typeof returnValue !== "undefined") {
        newLogs.push({
          type: "result",
          content: `Return Value: ${formatArg(returnValue)}`,
          time: now(),
        })
      }
    } catch (err: any) {
      newLogs.push({
        type: "error",
        content: `Runtime Error: ${err.message || String(err)}`,
        time: now(),
      })
    } finally {
      const duration = Math.round((performance.now() - startTime) * 10) / 10
      setExecutionTime(duration)
      // Restore console methods
      console.log = originalLog
      console.error = originalError
      console.warn = originalWarn
      console.info = originalInfo
      setLogs(newLogs)
      setIsRunning(false)
    }
  }

  // Execute code against test suite
  const handleRunTests = async () => {
    setIsRunning(true)
    setActiveTab("tests")
    const startTime = performance.now()

    try {
      const fullScript = `
        ${code}
        return await ${selectedChallenge.testRunnerScript}
      `
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
      const runner = new AsyncFunction(fullScript)
      const results: TestResult[] = await runner()

      setTestResults(Array.isArray(results) ? results : [])
    } catch (err: any) {
      setTestResults([
        {
          name: `Compilation/Execution Error: ${err.message}`,
          passed: false,
        },
      ])
    } finally {
      const duration = Math.round((performance.now() - startTime) * 10) / 10
      setExecutionTime(duration)
      setIsRunning(false)
    }
  }

  // Keyboard shortcut Ctrl/Cmd + Enter to run
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault()
      handleRunCode()
    }
    // Allow Tab key indentation
    if (e.key === "Tab") {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const newCode = code.substring(0, start) + "  " + code.substring(end)
      setCode(newCode)
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2
        }
      }, 0)
    }
  }

  const passedTestsCount = testResults.filter((t) => t.passed).length
  const totalTests = testResults.length

  return (
    <div className="space-y-6">
      {/* Top Header / Challenge Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-4 rounded-xl border-2 border-border retro-shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary text-primary-foreground border-2 border-border rounded-lg">
            <Code2 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black">{selectedChallenge.title}</h2>
              <RetroBadge
                variant={
                  selectedChallenge.difficulty === "Easy"
                    ? "secondary"
                    : selectedChallenge.difficulty === "Medium"
                    ? "accent"
                    : "destructive"
                }
                className="text-[11px]"
              >
                {selectedChallenge.difficulty}
              </RetroBadge>
            </div>
            <p className="text-xs text-muted-foreground font-bold">
              Category: {selectedChallenge.category}
            </p>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-black uppercase text-muted-foreground whitespace-nowrap">
            Select Problem:
          </label>
          <select
            value={selectedChallenge.id}
            onChange={(e) => {
              const found = PLAYGROUND_PRESETS.find((p) => p.id === e.target.value)
              if (found) setSelectedChallenge(found)
            }}
            className="p-2 bg-background border-2 border-border rounded-lg font-bold text-sm outline-none cursor-pointer"
          >
            {PLAYGROUND_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.difficulty})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Problem Description Card */}
      <RetroCard>
        <RetroCardHeader className="py-3 px-4 border-b-2 border-border">
          <RetroCardTitle className="text-sm font-black flex items-center gap-1.5">
            <HelpCircle size={15} className="text-primary" /> Problem Specification
          </RetroCardTitle>
        </RetroCardHeader>
        <RetroCardContent className="p-4 text-sm leading-relaxed whitespace-pre-wrap font-medium">
          {selectedChallenge.description}
        </RetroCardContent>
      </RetroCard>

      {/* Editor & Console Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Code Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                JavaScript / ES6 Editor
              </span>
              <kbd className="text-[10px] bg-muted px-1.5 py-0.5 border border-border rounded font-mono font-bold">
                ⌘ / Ctrl + Enter to run
              </kbd>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCode(selectedChallenge.initialCode)}
                className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 p-1"
                title="Reset code to original"
              >
                <RotateCcw size={13} /> Reset
              </button>
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 p-1"
              >
                <Sparkles size={13} /> {showSolution ? "Hide Solution" : "View Solution"}
              </button>
            </div>
          </div>

          {/* Solution Modal / Banner if toggled */}
          {showSolution && (
            <div className="p-3 bg-muted border-2 border-primary rounded-xl text-xs space-y-2">
              <div className="font-black text-primary flex items-center justify-between">
                <span>Reference Solution:</span>
                <button
                  onClick={() => setCode(selectedChallenge.solutionCode)}
                  className="text-[11px] underline font-bold"
                >
                  Load into Editor
                </button>
              </div>
              <pre className="font-mono bg-card p-2 rounded border border-border overflow-x-auto text-xs">
                {selectedChallenge.solutionCode}
              </pre>
            </div>
          )}

          {/* Code Textarea with line numbers simulated */}
          <div className="relative border-2 border-border rounded-xl overflow-hidden bg-card retro-shadow-sm focus-within:border-primary transition-all">
            <div className="bg-muted px-3 py-1.5 border-b-2 border-border flex items-center justify-between text-xs font-mono font-bold text-muted-foreground">
              <span>solution.js</span>
              <span>UTF-8 • JavaScript</span>
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={16}
              spellCheck={false}
              className="w-full p-4 font-mono text-sm bg-card text-foreground resize-y outline-none leading-relaxed"
              placeholder="// Write your solution here..."
            />
          </div>

          {/* Action Execution Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <RetroButton
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex items-center gap-2 bg-primary text-primary-foreground font-black"
              >
                <Play size={16} /> Run Code
              </RetroButton>
              <RetroButton
                onClick={handleRunTests}
                disabled={isRunning}
                variant="secondary"
                className="flex items-center gap-2 font-black"
              >
                <CheckCircle2 size={16} /> Run Test Suite
              </RetroButton>
            </div>

            {executionTime !== null && (
              <span className="text-xs font-mono font-bold text-muted-foreground flex items-center gap-1">
                <Clock size={12} /> {executionTime}ms
              </span>
            )}
          </div>
        </div>

        {/* Terminal / Test Output Console (5 cols) */}
        <div className="lg:col-span-5 space-y-3 flex flex-col">
          {/* Output Tabs */}
          <div className="flex items-center justify-between border-b-2 border-border pb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("console")}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                  activeTab === "console"
                    ? "bg-primary text-primary-foreground border-2 border-border retro-shadow-sm"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <Terminal size={13} /> Console ({logs.length})
              </button>
              <button
                onClick={() => setActiveTab("tests")}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                  activeTab === "tests"
                    ? "bg-primary text-primary-foreground border-2 border-border retro-shadow-sm"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <CheckCircle2 size={13} /> Test Suite
                {totalTests > 0 && ` (${passedTestsCount}/${totalTests})`}
              </button>
            </div>

            {activeTab === "console" && logs.length > 0 && (
              <button
                onClick={() => setLogs([])}
                className="text-[11px] font-bold text-muted-foreground hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          {/* Console Window */}
          <div className="flex-1 min-h-[360px] bg-card border-2 border-border rounded-xl p-3 font-mono text-xs overflow-y-auto retro-shadow-sm">
            {activeTab === "console" && (
              <div className="space-y-1.5">
                {logs.length === 0 ? (
                  <div className="text-muted-foreground italic p-4 text-center">
                    No output yet. Click <strong>Run Code</strong> or press <strong>⌘ + Enter</strong>.
                  </div>
                ) : (
                  logs.map((log, idx) => (
                    <div
                      key={idx}
                      className={`p-1.5 rounded flex items-start gap-2 border ${
                        log.type === "error"
                          ? "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
                          : log.type === "warn"
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                          : log.type === "result"
                          ? "bg-primary/10 border-primary/30 text-primary font-bold"
                          : "bg-muted/40 border-border text-foreground"
                      }`}
                    >
                      <span className="text-[10px] text-muted-foreground shrink-0 select-none">
                        {log.time}
                      </span>
                      <pre className="whitespace-pre-wrap break-all flex-1 font-mono">
                        {log.content}
                      </pre>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "tests" && (
              <div className="space-y-3">
                {testResults.length === 0 ? (
                  <div className="text-muted-foreground italic p-4 text-center">
                    Click <strong>Run Test Suite</strong> to evaluate your solution against test assertions.
                  </div>
                ) : (
                  <>
                    <div
                      className={`p-3 rounded-lg border-2 font-black text-sm flex items-center justify-between ${
                        passedTestsCount === totalTests
                          ? "bg-green-100 dark:bg-green-950/50 border-green-600 text-green-700 dark:text-green-300"
                          : "bg-red-100 dark:bg-red-950/50 border-red-600 text-red-700 dark:text-red-300"
                      }`}
                    >
                      <span>
                        {passedTestsCount === totalTests
                          ? "🎉 All Tests Passed!"
                          : `${passedTestsCount} of ${totalTests} Tests Passed`}
                      </span>
                      <span className="text-xs font-mono">
                        {Math.round((passedTestsCount / totalTests) * 100)}%
                      </span>
                    </div>

                    <div className="space-y-2">
                      {testResults.map((test, idx) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-lg border-2 flex items-start gap-2 ${
                            test.passed
                              ? "bg-green-500/10 border-green-500/40 text-green-700 dark:text-green-300"
                              : "bg-red-500/10 border-red-500/40 text-red-700 dark:text-red-300"
                          }`}
                        >
                          {test.passed ? (
                            <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                          )}
                          <div className="text-xs font-medium leading-relaxed">
                            {test.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
