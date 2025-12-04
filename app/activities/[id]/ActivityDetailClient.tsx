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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 px-1">
            
            Home Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-1">
              <HomeInfoSheet
                homeId={home.id}
                homeCode={home.code}
                homeName={home.name}
              >
                <button className="text-sm font-semibold text-primary underline hover:text-primary/80 transition-colors text-left">
                  {home.code}
                </button>
              </HomeInfoSheet>
              {home.name && (
                <>
                  <span className="text-sm text-muted-foreground">•</span>
                  <HomeInfoSheet
                    homeId={home.id}
                    homeCode={home.code}
                    homeName={home.name}
                  >
                    <button className="text-sm text-muted-foreground underline hover:text-primary/80 transition-colors text-left">
                      {home.name}
                    </button>
                  </HomeInfoSheet>
                </>
              )}
            </div>
            <div>
       
              <button
                onClick={() => setMapSheetOpen(true)}
                className="flex items-start gap-1 text-sm font-medium hover:text-primary transition-colors text-left"
              >
                <MapPin className="h-5 w-5" />
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

