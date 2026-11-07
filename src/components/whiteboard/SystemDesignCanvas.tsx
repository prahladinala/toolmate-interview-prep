"use client"

import React, { useState, useRef, useEffect } from "react"
import { RetroButton } from "@/components/retro/retro-button"
import { RetroBadge } from "@/components/retro/retro-badge"
import {
  Layers,
  Plus,
  Trash2,
  Download,
  Share2,
  RotateCcw,
  Move,
  Link as LinkIcon,
  Server,
  Database,
  Globe,
  Radio,
  HardDrive,
  Workflow,
  Sparkles,
} from "lucide-react"

export interface CanvasNode {
  id: string
  type: string
  label: string
  sublabel?: string
  icon: string
  x: number
  y: number
}

export interface CanvasConnection {
  id: string
  fromId: string
  toId: string
  protocol: string
}

const ARCHITECTURE_BLOCKS = [
  { type: "client", label: "Client Apps", sublabel: "Web / iOS / Android", icon: "🌐" },
  { type: "cdn", label: "CDN Edge", sublabel: "Cloudflare / CloudFront", icon: "⚡" },
  { type: "lb", label: "Load Balancer", sublabel: "Nginx / AWS ALB", icon: "⚖️" },
  { type: "gateway", label: "API Gateway", sublabel: "Routing & Rate Limiting", icon: "🚪" },
  { type: "service", label: "Core Service", sublabel: "Node / Go / Java", icon: "⚙️" },
  { type: "cache", label: "Distributed Cache", sublabel: "Redis / Memcached", icon: "🚀" },
  { type: "queue", label: "Message Queue", sublabel: "Kafka / RabbitMQ", icon: "📨" },
  { type: "db_primary", label: "Primary DB (Write)", sublabel: "PostgreSQL / MySQL", icon: "🗄️" },
  { type: "db_replica", label: "Read Replicas", sublabel: "Replicated Followers", icon: "📑" },
  { type: "storage", label: "Blob Storage", sublabel: "AWS S3 / GCS", icon: "📦" },
]

const PROTOCOLS = ["HTTPS / REST", "gRPC", "WebSocket", "Async Event", "SQL Query", "Cache Hit/Miss"]

export function SystemDesignCanvas() {
  const [nodes, setNodes] = useState<CanvasNode[]>([
    { id: "node-1", type: "client", label: "Web / Mobile Clients", sublabel: "Browser & Apps", icon: "🌐", x: 60, y: 160 },
    { id: "node-2", type: "lb", label: "Load Balancer", sublabel: "Round-Robin / SSL", icon: "⚖️", x: 280, y: 160 },
    { id: "node-3", type: "service", label: "API Services", sublabel: "Stateless Microservices", icon: "⚙️", x: 500, y: 160 },
    { id: "node-4", type: "cache", label: "Redis Cluster", sublabel: "Sub-ms In-Memory", icon: "🚀", x: 740, y: 70 },
    { id: "node-5", type: "db_primary", label: "Primary Database", sublabel: "PostgreSQL (ACID)", icon: "🗄️", x: 740, y: 250 },
  ])

  const [connections, setConnections] = useState<CanvasConnection[]>([
    { id: "conn-1", fromId: "node-1", toId: "node-2", protocol: "HTTPS / REST" },
    { id: "conn-2", fromId: "node-2", toId: "node-3", protocol: "gRPC" },
    { id: "conn-3", fromId: "node-3", toId: "node-4", protocol: "Cache Hit/Miss" },
    { id: "conn-4", fromId: "node-3", toId: "node-5", protocol: "SQL Query" },
  ])

  const [activeTool, setActiveTool] = useState<"select" | "connect">("select")
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null)
  const [selectedProtocol, setSelectedProtocol] = useState(PROTOCOLS[0])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  // Dragging state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null)
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement | null>(null)

  const handleAddBlock = (block: typeof ARCHITECTURE_BLOCKS[0]) => {
    const newNode: CanvasNode = {
      id: `node-${Date.now()}`,
      type: block.type,
      label: block.label,
      sublabel: block.sublabel,
      icon: block.icon,
      x: 100 + Math.random() * 300,
      y: 100 + Math.random() * 200,
    }
    setNodes((prev) => [...prev, newNode])
  }

  const handleMouseDownNode = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (activeTool === "connect") {
      if (!connectingFromId) {
        setConnectingFromId(id)
      } else if (connectingFromId !== id) {
        // Create connection
        const newConn: CanvasConnection = {
          id: `conn-${Date.now()}`,
          fromId: connectingFromId,
          toId: id,
          protocol: selectedProtocol,
        }
        setConnections((prev) => [...prev, newConn])
        setConnectingFromId(null)
      }
      return
    }

    setSelectedNodeId(id)
    setDraggingNodeId(id)
    const node = nodes.find((n) => n.id === id)
    if (node) {
      dragOffsetRef.current = {
        x: e.clientX - node.x,
        y: e.clientY - node.y,
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeId) return
    const newX = Math.max(20, Math.min(950, e.clientX - dragOffsetRef.current.x))
    const newY = Math.max(20, Math.min(500, e.clientY - dragOffsetRef.current.y))

    setNodes((prev) =>
      prev.map((n) => (n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n))
    )
  }

  const handleMouseUp = () => {
    setDraggingNodeId(null)
  }

  const handleDeleteSelected = () => {
    if (!selectedNodeId) return
    setNodes((prev) => prev.filter((n) => n.id !== selectedNodeId))
    setConnections((prev) =>
      prev.filter((c) => c.fromId !== selectedNodeId && c.toId !== selectedNodeId)
    )
    setSelectedNodeId(null)
  }

  const handleClear = () => {
    if (confirm("Clear the entire canvas?")) {
      setNodes([])
      setConnections([])
      setSelectedNodeId(null)
      setConnectingFromId(null)
    }
  }

  const handleLoadTemplate = (type: "event_driven" | "three_tier") => {
    if (type === "event_driven") {
      setNodes([
        { id: "e1", type: "client", label: "Web & Mobile Clients", sublabel: "Browser / Apps", icon: "🌐", x: 50, y: 150 },
        { id: "e2", type: "gateway", label: "API Gateway", sublabel: "Auth & Rate Limit", icon: "🚪", x: 260, y: 150 },
        { id: "e3", type: "service", label: "Order Service", sublabel: "Producer Service", icon: "⚙️", x: 480, y: 80 },
        { id: "e4", type: "queue", label: "Apache Kafka", sublabel: "Event Streaming Bus", icon: "📨", x: 720, y: 150 },
        { id: "e5", type: "service", label: "Notification Worker", sublabel: "Consumer Service", icon: "⚙️", x: 480, y: 260 },
        { id: "e6", type: "db_primary", label: "Orders PostgreSQL", sublabel: "Write-Ahead Log", icon: "🗄️", x: 920, y: 150 },
      ])
      setConnections([
        { id: "c1", fromId: "e1", toId: "e2", protocol: "HTTPS / REST" },
        { id: "c2", fromId: "e2", toId: "e3", protocol: "gRPC" },
        { id: "c3", fromId: "e3", toId: "e4", protocol: "Async Event" },
        { id: "c4", fromId: "e4", toId: "e5", protocol: "Async Event" },
        { id: "c5", fromId: "e4", toId: "e6", protocol: "SQL Query" },
      ])
    } else {
      setNodes([
        { id: "node-1", type: "client", label: "Web / Mobile Clients", sublabel: "Browser & Apps", icon: "🌐", x: 60, y: 160 },
        { id: "node-2", type: "lb", label: "Load Balancer", sublabel: "Round-Robin / SSL", icon: "⚖️", x: 280, y: 160 },
        { id: "node-3", type: "service", label: "API Services", sublabel: "Stateless Microservices", icon: "⚙️", x: 500, y: 160 },
        { id: "node-4", type: "cache", label: "Redis Cluster", sublabel: "Sub-ms In-Memory", icon: "🚀", x: 740, y: 70 },
        { id: "node-5", type: "db_primary", label: "Primary Database", sublabel: "PostgreSQL (ACID)", icon: "🗄️", x: 740, y: 250 },
      ])
      setConnections([
        { id: "conn-1", fromId: "node-1", toId: "node-2", protocol: "HTTPS / REST" },
        { id: "conn-2", fromId: "node-2", toId: "node-3", protocol: "gRPC" },
        { id: "conn-3", fromId: "node-3", toId: "node-4", protocol: "Cache Hit/Miss" },
        { id: "conn-4", fromId: "node-3", toId: "node-5", protocol: "SQL Query" },
      ])
    }
  }

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-card border-2 border-border rounded-xl retro-shadow-sm">
        <div className="flex items-center gap-2">
          <RetroBadge variant="secondary" className="text-xs">
            Architecture Whiteboard
          </RetroBadge>
          <div className="flex items-center gap-1 border-2 border-border rounded-lg p-0.5 bg-muted">
            <button
              onClick={() => {
                setActiveTool("select")
                setConnectingFromId(null)
              }}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 ${
                activeTool === "select"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Move size={12} /> Move
            </button>
            <button
              onClick={() => setActiveTool("connect")}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 ${
                activeTool === "connect"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LinkIcon size={12} /> Connect
            </button>
          </div>

          {activeTool === "connect" && (
            <select
              value={selectedProtocol}
              onChange={(e) => setSelectedProtocol(e.target.value)}
              className="p-1 text-xs bg-background border border-border rounded font-bold cursor-pointer outline-none"
            >
              {PROTOCOLS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Templates and Actions */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-muted-foreground hidden sm:inline">
            Templates:
          </span>
          <button
            onClick={() => handleLoadTemplate("three_tier")}
            className="text-xs font-bold px-2 py-1 border border-border rounded bg-muted hover:bg-muted/80"
          >
            3-Tier App
          </button>
          <button
            onClick={() => handleLoadTemplate("event_driven")}
            className="text-xs font-bold px-2 py-1 border border-border rounded bg-muted hover:bg-muted/80"
          >
            Event-Driven / Kafka
          </button>

          {selectedNodeId && (
            <button
              onClick={handleDeleteSelected}
              className="text-xs font-bold px-2 py-1 border border-destructive text-destructive rounded hover:bg-destructive/10 flex items-center gap-1"
            >
              <Trash2 size={12} /> Delete
            </button>
          )}

          <button
            onClick={handleClear}
            className="text-xs font-bold px-2 py-1 border border-border rounded hover:bg-muted"
            title="Clear canvas"
          >
            Clear
          </button>
        </div>
      </div>

      {connectingFromId && (
        <div className="text-xs font-black p-2 bg-amber-400 text-black rounded-lg border-2 border-black flex items-center justify-between animate-pulse">
          <span>Click on target component to create a "{selectedProtocol}" connection.</span>
          <button
            onClick={() => setConnectingFromId(null)}
            className="underline text-[11px]"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Main Canvas Area */}
      <div
        className="relative w-full h-[540px] bg-card border-4 border-black dark:border-white/20 rounded-2xl overflow-hidden retro-shadow-lg select-none cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Subtle Background Grid Pattern */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#888 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* SVG Connections Layer */}
        <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="currentColor" className="text-foreground" />
            </marker>
          </defs>

          {connections.map((conn) => {
            const from = nodes.find((n) => n.id === conn.fromId)
            const to = nodes.find((n) => n.id === conn.toId)
            if (!from || !to) return null

            const fromCenterX = from.x + 85
            const fromCenterY = from.y + 40
            const toCenterX = to.x + 85
            const toCenterY = to.y + 40

            const midX = (fromCenterX + toCenterX) / 2
            const midY = (fromCenterY + toCenterY) / 2

            return (
              <g key={conn.id}>
                <line
                  x1={fromCenterX}
                  y1={fromCenterY}
                  x2={toCenterX}
                  y2={toCenterY}
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeDasharray="5,5"
                  className="text-foreground/70"
                  markerEnd="url(#arrowhead)"
                />
                <rect
                  x={midX - 42}
                  y={midY - 10}
                  width="84"
                  height="18"
                  rx="4"
                  fill="var(--background)"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-border"
                />
                <text
                  x={midX}
                  y={midY + 3}
                  textAnchor="middle"
                  className="fill-foreground text-[10px] font-mono font-bold"
                >
                  {conn.protocol}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Architecture Component Nodes */}
        {nodes.map((node) => {
          const isSelected = selectedNodeId === node.id
          const isConnectingFrom = connectingFromId === node.id

          return (
            <div
              key={node.id}
              onMouseDown={(e) => handleMouseDownNode(e, node.id)}
              style={{
                transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
              }}
              className={`absolute top-0 left-0 w-44 p-3 rounded-xl border-2 transition-shadow cursor-grab active:cursor-grabbing bg-card ${
                isSelected
                  ? "border-primary ring-2 ring-primary retro-shadow-sm font-black"
                  : isConnectingFrom
                  ? "border-amber-400 ring-2 ring-amber-400 bg-amber-50 dark:bg-amber-950/40"
                  : "border-border hover:border-foreground/60"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl shrink-0">{node.icon}</span>
                <div className="overflow-hidden">
                  <div className="text-xs font-black truncate text-foreground leading-tight">
                    {node.label}
                  </div>
                  {node.sublabel && (
                    <div className="text-[10px] text-muted-foreground truncate leading-tight">
                      {node.sublabel}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Component Palette Library Drawer */}
      <div className="space-y-2">
        <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
          Click to Add System Component:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {ARCHITECTURE_BLOCKS.map((block) => (
            <button
              key={block.type}
              onClick={() => handleAddBlock(block)}
              className="p-2.5 rounded-xl border-2 border-border bg-card hover:bg-muted/60 transition-all text-left flex items-center gap-2 group retro-shadow-sm"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">
                {block.icon}
              </span>
              <div className="overflow-hidden">
                <div className="text-xs font-black text-foreground truncate">{block.label}</div>
                <div className="text-[10px] text-muted-foreground truncate">{block.sublabel}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
