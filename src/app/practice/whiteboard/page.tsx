import { SystemDesignCanvas } from "@/components/whiteboard/SystemDesignCanvas"
import { RetroBadge } from "@/components/retro/retro-badge"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function WhiteboardPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl space-y-6">
      <div className="space-y-2">
        <Link
          href="/dashboard"
          className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 w-fit"
        >
          <ArrowLeft size={13} /> Back to Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-2 mb-1">
              <RetroBadge variant="accent" className="text-xs">
                System Design Tool
              </RetroBadge>
              <RetroBadge variant="outline" className="text-xs">
                Whiteboard Architecture Simulator
              </RetroBadge>
            </div>
            <h1 className="text-3xl md:text-4xl font-black">Architecture Whiteboard Canvas</h1>
          </div>
        </div>
      </div>

      <SystemDesignCanvas />
    </div>
  )
}
