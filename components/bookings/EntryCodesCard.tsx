"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Key } from "lucide-react"

interface EntryCodes {
  streetLevel?: string
  apartment?: string
}

interface EntryCodesCardProps {
  entryCodes: EntryCodes
}

export function EntryCodesCard({ entryCodes }: EntryCodesCardProps) {
  const hasEntryCodes = entryCodes.streetLevel || entryCodes.apartment

  if (!hasEntryCodes) {
    return null
  }
  return (
    <Card className="border-primary/20" data-testid="entry-codes-card" role="region" aria-label="Entry Codes">
      <CardContent className="p-4 bg-primary/5">
        <div className="flex items-center gap-2 mb-3">
          <Key className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Entry Codes</span>
          <span className="text-xs text-muted-foreground">(Test before guest arrives)</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {entryCodes.streetLevel && (
            <div className="px-3 py-2 bg-background rounded border">
              <span className="text-xs text-muted-foreground">Street Level</span>
              <p className="font-mono font-bold text-lg">{entryCodes.streetLevel}</p>
            </div>
          )}
          {entryCodes.apartment && (
            <div className="px-3 py-2 bg-background rounded border">
              <span className="text-xs text-muted-foreground">Apartment</span>
              <p className="font-mono font-bold text-lg">{entryCodes.apartment}</p>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Send codes to guest via TextMagic and ensure they practice using both entry points.
        </p>
      </CardContent>
    </Card>
  )
}

