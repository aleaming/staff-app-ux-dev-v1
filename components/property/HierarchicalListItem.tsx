"use client"

import { ChevronRight, Info, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { IssueBadge } from "./IssueBadge"
import { cn } from "@/lib/utils"
import type { PropertyHierarchyNode, PropertyIssuePriority } from "@/lib/test-data"
import * as Icons from "lucide-react"

interface HierarchicalListItemProps {
  item: PropertyHierarchyNode
  onNavigate: () => void
  onInfoClick: () => void
  issueCount?: number
  issuePriority?: PropertyIssuePriority
  hasDetails?: boolean
}

export function HierarchicalListItem({
  item,
  onNavigate,
  onInfoClick,
  issueCount = 0,
  issuePriority = "medium",
  hasDetails = false
}: HierarchicalListItemProps) {
  const hasChildren = item.children && item.children.length > 0
  const showInfoButton = hasDetails || item.instructions || item.photos || item.details
  const hasPhotos = item.photos && item.photos.length > 0
  
  // Safely get icon component
  let IconComponent: React.ComponentType<{ className?: string }> | null = null
  if (item.icon) {
    try {
      const Icon = Icons[item.icon as keyof typeof Icons]
      if (Icon && typeof Icon === "function") {
        IconComponent = Icon as React.ComponentType<{ className?: string }>
      }
    } catch (e) {
      // Icon not found, will render without icon
      console.warn(`Icon "${item.icon}" not found in lucide-react`)
    }
  }

  // Build accessibility label
  const accessibilityLabel = [
    item.label,
    item.metadata && `has ${item.metadata}`,
    hasPhotos && "has reference photos",
    issueCount > 0 && `${issueCount} issue${issueCount !== 1 ? "s" : ""} reported`,
    "button"
  ].filter(Boolean).join(", ")

  return (
    <div className="flex items-center gap-3 min-h-[44px] py-2 px-1">
      {/* Left Icon */}
      {IconComponent && (
        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-muted-foreground">
          <IconComponent className="h-5 w-5" />
        </div>
      )}

      {/* Main Content Area - Navigate */}
      <button
        onClick={onNavigate}
        className={cn(
          "flex-1 flex items-center justify-between min-h-[44px] text-left",
          "hover:bg-muted/50 px-2 -mx-2 transition-colors border-b border-border",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        )}
        aria-label={accessibilityLabel}
        aria-expanded={hasChildren ? "false" : undefined}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-base truncate">{item.label}</span>
            {hasPhotos && (
              <Camera className="h-4 w-4 text-muted-foreground flex-shrink-0" aria-label="Has reference photos" />
            )}
            {issueCount > 0 && (
              <IssueBadge count={issueCount} priority={issuePriority} />
            )}
          </div>
          {item.metadata && (
            <p className="text-sm text-muted-foreground mt-0.5">{item.metadata}</p>
          )}
        </div>

        {/* Right Accessories */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {hasChildren && (
            <ChevronRight className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          )}
        </div>
      </button>

      {/* Info Button - Separate Hit Area */}
      {showInfoButton && (
        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation()
            onInfoClick()
          }}
          aria-label={`View details for ${item.label}`}
        >
          <Info className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}

