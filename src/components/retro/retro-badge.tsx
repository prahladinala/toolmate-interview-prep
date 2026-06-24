import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const retroBadgeVariants = cva(
  "inline-flex items-center rounded-full border-2 border-border px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 retro-shadow-sm",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        accent:
          "bg-accent text-accent-foreground hover:bg-accent/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface RetroBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof retroBadgeVariants> {}

function RetroBadge({ className, variant, ...props }: RetroBadgeProps) {
  return (
    <div className={cn(retroBadgeVariants({ variant }), className)} {...props} />
  )
}

export { RetroBadge, retroBadgeVariants }
