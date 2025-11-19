"use client"

import { cn } from "@/lib/utils"
import type { PropertyIssuePriority } from "@/lib/test-data"

interface IssueBadgeProps {
  count: number
  priority?: PropertyIssuePriority
  className?: string
}

export function IssueBadge({ count, priority = "medium", className }: IssueBadgeProps) {
  if (count === 0) return null

  const variantClasses = {
    low: "bg-orange-500 text-white",
    medium: "bg-orange-500 text-white",
    high: "bg-red-500 text-white"
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold",
        variantClasses[priority],
        className
      )}
      aria-label={`${count} issue${count !== 1 ? "s" : ""} reported`}
      role="status"
    >
      {count > 9 ? "!" : count}
    </div>
  )
}

