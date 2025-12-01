"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import { MapSheet } from "@/components/map/MapSheet"
import Link from "next/link"
import type { Home } from "@/lib/test-data"

interface HomeInformationCardProps {
  home: Home
}

export function HomeInformationCard({ home }: HomeInformationCardProps) {
  const [mapSheetOpen, setMapSheetOpen] = useState(false)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Home Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold">{home.code}</h3>
              {home.name && <p className="text-sm text-muted-foreground">{home.name}</p>}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Address</p>
              <button
                onClick={() => setMapSheetOpen(true)}
                className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors"
              >
                <MapPin className="h-3 w-3" />
                <span className="underline">{home.address}, {home.city}</span>
              </button>
            </div>
            {home.distance !== undefined && (
              <div>
                <p className="text-sm text-muted-foreground">Distance</p>
                <p className="text-sm font-medium">{home.distance.toFixed(1)} km away</p>
              </div>
            )}
            <Button variant="outline" asChild className="w-full">
              <Link href={`/homes/${home.id}`}>View Home Details</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <MapSheet
        open={mapSheetOpen}
        onOpenChange={setMapSheetOpen}
        homeCode={home.code}
        homeName={home.name}
        address={home.address}
        city={home.city}
        coordinates={home.coordinates}
      />
    </>
  )
}

