"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { PropertyIssueReportSheet } from "./PropertyIssueReportSheet"
import type { BreadcrumbItem } from "@/components/navigation/Breadcrumbs"

interface ReportIssueButtonProps {
  homeId: string
  homeCode: string
  homeName?: string
  activityId?: string
  breadcrumbs: BreadcrumbItem[]
  variant?: "default" | "destructive" | "outline"
  className?: string
}

export function ReportIssueButton({
  homeId,
  homeCode,
  homeName,
  activityId,
  breadcrumbs,
  variant = "outline",
  className
}: ReportIssueButtonProps) {
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <>
      <Button
        variant={variant}
        className={className || "w-full gap-2 text-sm"}
        onClick={() => setSheetOpen(true)}
      >
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span className="truncate">Report Issue</span>
      </Button>

      {sheetOpen && (
        <PropertyIssueReportSheet
          breadcrumbs={breadcrumbs}
          homeId={homeId}
          homeCode={homeCode}
          homeName={homeName}
          activityId={activityId}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </>
  )
}

