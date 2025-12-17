"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { FileText, ChevronDown } from "lucide-react"
import type { BookingNotes } from "@/lib/test-data"

interface BookingNotesCardProps {
  notes: BookingNotes
}

export function BookingNotesCard({ notes }: BookingNotesCardProps) {
  const [isOpen, setIsOpen] = useState(true)

  // Use rawNotes if available, otherwise concatenate available note fields
  const displayText = notes.rawNotes || [
    notes.contextOfStay,
    notes.groupMakeup,
    notes.concerns,
    notes.checkInOutNotes,
    notes.homeownerNotes,
    notes.welcomeMessage
  ].filter(Boolean).join('\n\n') || 'No notes available.'

  return (
    <Card className="overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <CardTitle className="text-base flex items-center gap-2 min-w-0">
              <FileText className="h-4 w-4 shrink-0" />
              <span className="truncate">Field Staff Notes</span>
            </CardTitle>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                <span className="sr-only">Toggle notes</span>
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="pt-0 overflow-hidden">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
              {displayText}
            </p>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
