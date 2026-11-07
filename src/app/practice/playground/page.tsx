import { CodePlayground } from "@/components/playground/CodePlayground"
import { RetroBadge } from "@/components/retro/retro-badge"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PlaygroundPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl space-y-6">
      {/* Top Breadcrumb & Title */}
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
                In-Browser Sandbox
              </RetroBadge>
              <RetroBadge variant="outline" className="text-xs">
                Zero Setup • Instant Execution
              </RetroBadge>
            </div>
            <h1 className="text-3xl md:text-4xl font-black">Interactive Code Playground</h1>
          </div>
        </div>
      </div>

      {/* Main Interactive Playground Component */}
      <CodePlayground />
    </div>
  )
}
