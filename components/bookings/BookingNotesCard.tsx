"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  FileText, 
  ChevronDown, 
  Key, 
  Copy, 
  Check, 
  AlertTriangle,
  Users,
  MessageSquare,
  ExternalLink,
  Building
} from "lucide-react"
import type { BookingNotes } from "@/lib/test-data"

interface BookingNotesCardProps {
  notes: BookingNotes
}

export function BookingNotesCard({ notes }: BookingNotesCardProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const hasEntryCodes = notes.entryCodes && (notes.entryCodes.streetLevel || notes.entryCodes.apartment)
  const hasActionRequired = !!notes.actionRequired
  const hasGuestInfo = notes.repeatGuest !== undefined || notes.contextOfStay || notes.groupMakeup
  const hasBookingDetails = notes.flexRate || notes.discountNote || notes.adminFeeNote || notes.homeownerNotes
  const hasWelcomeMessage = !!notes.welcomeMessage

  return (
    <Card className={hasActionRequired ? "border-amber-500 dark:border-amber-600" : ""}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Field Staff Notes
              {hasActionRequired && (
                <Badge variant="destructive" className="gap-1 ml-2">
                  <AlertTriangle className="h-3 w-3" />
                  Action Required
                </Badge>
              )}
              {hasEntryCodes && (
                <Badge variant="secondary" className="gap-1 ml-1">
                  <Key className="h-3 w-3" />
                  Entry Codes
                </Badge>
              )}
            </CardTitle>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                <span className="sr-only">Toggle notes</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          {notes.advisorInitials && (
            <p className="text-xs text-muted-foreground">
              Handled by: {notes.advisorInitials}
            </p>
          )}
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            {/* Action Required Alert */}
            {hasActionRequired && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-800 dark:text-amber-400 text-sm">
                      Action Required
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      {notes.actionRequired}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Entry Codes Section */}
            {hasEntryCodes && (
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Key className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">Entry Codes</span>
                  <span className="text-xs text-muted-foreground">(Test before guest arrives)</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {notes.entryCodes?.streetLevel && (
                    <div className="px-3 py-0 bg-background rounded border">
                      <span className="text-xs text-muted-foreground">Street Level</span>
                      <p className="font-mono font-bold text-lg">{notes.entryCodes.streetLevel}</p>
                    </div>
                  )}
                  {notes.entryCodes?.apartment && (
                    <div className="px-3 py-0 bg-background rounded border">
                      <span className="text-xs text-muted-foreground">Apartment</span>
                      <p className="font-mono font-bold text-lg">{notes.entryCodes.apartment}</p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Send codes to guest via TextMagic and ensure they practice using both entry points.
                </p>
              </div>
            )}

            {/* Guest Information */}
            {hasGuestInfo && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Users className="h-4 w-4" />
                  Guest Information
                </div>
                <div className="grid gap-1.5 text-sm">
                  {notes.repeatGuest !== undefined && (
                    <div className="flex items-center">
                      <span className="w-24 flex-shrink-0 text-muted-foreground">Repeat Guest</span>
                      <Badge variant={notes.repeatGuest ? "default" : "secondary"} className="text-xs">
                        {notes.repeatGuest ? "Yes" : "No"}
                      </Badge>
                    </div>
                  )}
                  {notes.contextOfStay && (
                    <div className="flex items-start">
                      <span className="w-24 flex-shrink-0 text-muted-foreground">Purpose:</span>
                      <span className="flex-1">{notes.contextOfStay}</span>
                    </div>
                  )}
                  {notes.groupMakeup && (
                    <div className="flex items-start">
                      <span className="w-24 flex-shrink-0 text-muted-foreground">Group:</span>
                      <span className="flex-1">{notes.groupMakeup}</span>
                    </div>
                  )}
                  {notes.concerns && (
                    <div className="flex items-start">
                      <span className="w-24 flex-shrink-0 text-muted-foreground">Requests:</span>
                      <span className="flex-1">{notes.concerns}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Check-in/Check-out Notes */}
            {notes.checkInOutNotes && (
              <div className="flex items-start text-sm">
                <span className="w-24 flex-shrink-0 text-muted-foreground">Check-in/out:</span>
                <span className="flex-1">{notes.checkInOutNotes}</span>
              </div>
            )}

            {/* Booking Details */}
            {hasBookingDetails && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Building className="h-4 w-4" />
                  Booking Details
                </div>
                <div className="grid gap-1.5 text-sm">
                  {notes.flexRate && (
                    <div className="flex items-center">
                      <span className="w-24 flex-shrink-0 text-muted-foreground">Flex Rate:</span>
                      <span>{notes.flexRate}</span>
                    </div>
                  )}
                  {notes.discountNote && notes.discountNote !== "N/A" && (
                    <div className="flex items-center">
                      <span className="w-24 flex-shrink-0 text-muted-foreground">Discount:</span>
                      <span>{notes.discountNote}</span>
                    </div>
                  )}
                  {notes.homeownerNotes && notes.homeownerNotes !== "N/A" && (
                    <div className="flex items-start">
                      <span className="w-24 flex-shrink-0 text-muted-foreground">Homeowner:</span>
                      <span className="flex-1">{notes.homeownerNotes}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Welcome Message */}
            {hasWelcomeMessage && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MessageSquare className="h-4 w-4" />
                    Welcome Message
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => copyToClipboard(notes.welcomeMessage!, 'welcome')}
                  >
                    {copiedField === 'welcome' ? (
                      <>
                        <Check className="h-3 w-3 text-green-600" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm italic text-muted-foreground">
                  &ldquo;{notes.welcomeMessage}&rdquo;
                </p>
              </div>
            )}

            {/* JIRA Link */}
            {notes.jiraLink && (
              <div className="pt-2 border-t">
                <a
                  href={notes.jiraLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View JIRA Ticket
                </a>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

