"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import { MapSheet } from "@/components/map/MapSheet"
import { HomeInfoSheet } from "@/components/homes/HomeInfoSheet"
import Link from "next/link"
import type { Home } from "@/lib/test-data"

interface HomeInformationCardProps {
  home: Home
}

export function HomeInformationCard({ home }: HomeInformationCardProps) {
  const [mapSheetOpen, setMapSheetOpen] = useState(false)

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 px-1">
            
            Home Information
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-hidden">
          <div className="space-y-3 min-w-0">
            <div className="flex items-center gap-1 flex-wrap min-w-0">
              <HomeInfoSheet
                homeId={home.id}
                homeCode={home.code}
                homeName={home.name}
                location={home.location}
                market={home.market}
              >
                <button className="text-xs font-normal text-primary underline hover:text-primary/80 transition-colors text-left">
                  {home.code}
                </button>
              </HomeInfoSheet>
              {home.name && (
                <>
                  <span className="text-xs font-normal text-muted-foreground">•</span>
                  <HomeInfoSheet
                    homeId={home.id}
                    homeCode={home.code}
                    homeName={home.name}
                    location={home.location}
                    market={home.market}
                  >
                    <button className="text-xs font-normal text-muted-foreground underline hover:text-primary/80 transition-colors text-left truncate max-w-[180px]">
                      {home.name}
                    </button>
                  </HomeInfoSheet>
                </>
              )}
            </div>
            <div className="min-w-0">
       
              <button
                onClick={() => setMapSheetOpen(true)}
                className="flex items-start gap-1 text-sm font-medium hover:text-primary transition-colors text-left min-w-0 max-w-full"
              >
                <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                <span className="underline font-normal text-xs break-words">{home.address}, {home.city}</span>
              </button>
            </div>
            {home.distance !== undefined && (
              <div>
                <p className="text-sm text-muted-foreground">Distance</p>
                <p className="text-sm font-medium">{home.distance.toFixed(1)} km away</p>
              </div>
            )}
            <Button variant="outline" asChild className="w-full text-sm">
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
        location={home.location}
        market={home.market}
        coordinates={home.coordinates}
      />
    </>
  )
}

