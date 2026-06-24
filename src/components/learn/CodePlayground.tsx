"use client"

import React, { useState, useMemo } from "react"
import Editor from "@monaco-editor/react"
import { RetroButton } from "@/components/retro/retro-button"
import { Play, RotateCcw } from "lucide-react"
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole
} from "@codesandbox/sandpack-react";

export function CodePlayground({ initialCode }: { initialCode: string }) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState<string[]>([])

  // Heuristic to detect if code is React
  const isReact = useMemo(() => {
    return initialCode.includes('import React') || 
           initialCode.includes("from 'react") ||
           initialCode.includes('from "react') ||
           initialCode.includes('export default') ||
           initialCode.includes('useState(') ||
           initialCode.includes('return (');
  }, [initialCode]);

  // Heuristic to detect TypeScript
  const isTypeScript = useMemo(() => {
    return initialCode.includes('interface ') ||
           initialCode.includes('type ') ||
           initialCode.includes(': string') ||
           initialCode.includes(': number') ||
           initialCode.includes(': boolean') ||
           initialCode.includes(': any') ||
           initialCode.includes(' as ') ||
           initialCode.includes('enum ') ||
           initialCode.includes('<T>') ||
           initialCode.includes('<T,') ||
           initialCode.includes('Promise<') ||
           initialCode.includes('Array<');
  }, [initialCode]);

  const isHtml = useMemo(() => {
    const trimmed = initialCode.trim();
    return trimmed.includes('<!DOCTYPE html>') || 
           trimmed.includes('<html') || 
           (trimmed.startsWith('<') && trimmed.includes('>')) ||
           trimmed.includes('<style>');
  }, [initialCode]);

  const hasImports = initialCode.includes('import ');
  const needsSandpack = isReact || isTypeScript || hasImports || isHtml;

  if (needsSandpack) {
    let template: "react" | "react-ts" | "vanilla" | "vanilla-ts" = "vanilla";
    let filename = "/index.js";

    if (isHtml) {
      template = "vanilla";
      filename = "/index.html";
    } else if (isReact) {
      template = isTypeScript ? "react-ts" : "react";
      filename = isTypeScript ? "/App.tsx" : "/App.js";
    } else if (isTypeScript) {
      template = "vanilla-ts";
      filename = "/index.ts";
    }

    return (
      <div className="border-2 border-border rounded-xl overflow-hidden retro-shadow-sm bg-card">
        <SandpackProvider
          template={template}
          theme="dark"
          files={{
            [filename]: initialCode,
            ...(isHtml ? { "/index.js": "" } : {})
          }}
          customSetup={{
            dependencies: {
              "react-router-dom": "latest",
              "zustand": "latest",
              "zod": "latest",
              "axios": "latest"
            }
          }}
        >
          <SandpackLayout>
            <SandpackCodeEditor style={{ height: 400 }} showLineNumbers />
            {isReact || isHtml ? (
              <SandpackPreview style={{ height: 400 }} showOpenInCodeSandbox={false} />
            ) : (
              <SandpackConsole style={{ height: 400 }} />
            )}
          </SandpackLayout>
        </SandpackProvider>
      </div>
    );
  }

  const runCode = () => {
    setOutput([])
    // Simple sandbox implementation for frontend code
    const originalConsoleLog = console.log
    const logs: string[] = []
    console.log = (...args) => {
      logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '))
    }
    
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(code)
      fn()
      if (logs.length === 0) logs.push("Code executed successfully with no output.")
    } catch (err: any) {
      logs.push(`Error: ${err.message}`)
    } finally {
      console.log = originalConsoleLog
      setOutput(logs)
    }
  }

  const resetCode = () => {
    setCode(initialCode)
    setOutput([])
  }

  return (
    <div className="border-2 border-border rounded-xl overflow-hidden retro-shadow-sm bg-card">
      <div className="bg-muted border-b-2 border-border p-3 flex items-center justify-between">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-destructive border border-border"></div>
          <div className="w-3 h-3 rounded-full bg-accent border border-border"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 border border-border"></div>
        </div>
        <div className="flex space-x-2">
          <RetroButton size="sm" variant="outline" onClick={resetCode} className="h-8">
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </RetroButton>
          <RetroButton size="sm" variant="default" onClick={runCode} className="h-8">
            <Play className="w-4 h-4 mr-1" /> Run
          </RetroButton>
        </div>
      </div>
      <div className="grid md:grid-cols-2 divide-y-2 md:divide-y-0 md:divide-x-2 divide-border">
        <div className="h-[300px]">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={code}
            onChange={(val) => setCode(val || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              padding: { top: 16, bottom: 16 },
              scrollBeyondLastLine: false,
            }}
          />
        </div>
        <div className="h-[300px] bg-black text-green-400 p-4 font-mono text-sm overflow-y-auto">
          {output.length > 0 ? (
            output.map((line, i) => <div key={i}>{line}</div>)
          ) : (
            <div className="text-gray-600 italic">Console output will appear here...</div>
          )}
        </div>
      </div>
    </div>
  )
}
