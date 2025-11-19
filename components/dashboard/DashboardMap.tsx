"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { MapPin, Home as HomeIcon, Target, Layers, ChevronDown } from "lucide-react"
import type { Home, Activity } from "@/lib/test-data"
import Link from "next/link"

interface DashboardMapProps {
  homes: Home[]
  activities: Activity[]
}

export function DashboardMap({ homes, activities }: DashboardMapProps) {
  const [showHomes, setShowHomes] = useState(true)
  const [showActivities, setShowActivities] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  // Get coordinates for activities from their associated homes
  const activitiesWithCoords = activities
    .map(activity => {
      const home = homes.find(h => h.code === activity.homeCode)
      return home && home.coordinates
        ? { ...activity, coordinates: home.coordinates, homeName: home.name }
        : null
    })
    .filter(Boolean) as (Activity & { coordinates: { lat: number; lng: number }; homeName?: string })[]

  // Calculate center point (average of all visible locations)
  const visibleLocations = [
    ...(showHomes ? homes.filter(h => h.coordinates) : []),
    ...(showActivities ? activitiesWithCoords : [])
  ]

  const centerLat = visibleLocations.length > 0
    ? visibleLocations.reduce((sum, loc) => sum + (loc.coordinates?.lat || 0), 0) / visibleLocations.length
    : 51.5074 // Default to London center
  const centerLng = visibleLocations.length > 0
    ? visibleLocations.reduce((sum, loc) => sum + (loc.coordinates?.lng || 0), 0) / visibleLocations.length
    : -0.1278

  // Create map markers
  const homeMarkers = showHomes
    ? homes.filter(h => h.coordinates).map(home => ({
        id: `home-${home.id}`,
        markerType: "home" as const,
        type: "home" as const, // Keep for backward compatibility
        lat: home.coordinates!.lat,
        lng: home.coordinates!.lng,
        code: home.code,
        name: home.name,
        status: home.status,
        address: home.address
      }))
    : []

  const activityMarkers = showActivities
    ? activitiesWithCoords.map(activity => ({
        id: `activity-${activity.id}`,
        markerType: "activity" as const,
        lat: activity.coordinates.lat,
        lng: activity.coordinates.lng,
        title: activity.title,
        homeCode: activity.homeCode,
        homeName: activity.homeName,
        status: activity.status,
        activityType: activity.type
      }))
    : []

  const allMarkers = [...homeMarkers, ...activityMarkers]

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="w-full hover:bg-white/80 dark:hover:bg-black/50 transition-colors">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <Layers className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="break-words">Activites Map</span>
            </CardTitle>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-3 sm:space-y-4">
              {/* Toggle Controls */}
              <div className="flex flex-row items-center gap-2 sm:gap-4 pb-2">
                <div className="flex items-center gap-2">
                  <Switch
                    id="show-homes"
                    checked={showHomes}
                    onCheckedChange={setShowHomes}
                  />
                  <Label htmlFor="show-homes" className="flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm">
                    <HomeIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="break-words">Homes ({homes.filter(h => h.coordinates).length})</span>
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="show-activities"
                    checked={showActivities}
                    onCheckedChange={setShowActivities}
                  />
                  <Label htmlFor="show-activities" className="flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm">
                    <Target className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="break-words">Activities ({activitiesWithCoords.length})</span>
                  </Label>
                </div>
              </div>
              {/* Map Container */}
          <div className="relative w-full h-[250px] sm:h-[350px] md:h-[400px] bg-muted rounded-lg overflow-hidden border">
            {/* Map using OpenStreetMap */}
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${centerLng - 0.05}%2C${centerLat - 0.03}%2C${centerLng + 0.05}%2C${centerLat + 0.03}&layer=mapnik&marker=${centerLat}%2C${centerLng}`}
              className="border-0"
            />
            
            {/* Custom Markers Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {allMarkers.map((marker, index) => {
                // Calculate position as percentage (simplified - would need proper projection in production)
                const latOffset = marker.lat - centerLat
                const lngOffset = marker.lng - centerLng
                const x = 50 + (lngOffset / 0.05) * 50 // Rough approximation
                const y = 50 - (latOffset / 0.03) * 50

                return (
                  <div
                    key={marker.id}
                    className="absolute pointer-events-auto"
                    style={{
                      left: `${Math.max(5, Math.min(95, x))}%`,
                      top: `${Math.max(5, Math.min(95, y))}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {marker.markerType === "home" ? (
                      <Link href={`/homes/${marker.id.replace("home-", "")}`}>
                        <div className="relative group">
                          <div className={`w-6 h-6 rounded-full border-2 border-background shadow-lg flex items-center justify-center ${
                            (marker as any).status === "occupied" ? "bg-destructive" :
                            (marker as any).status === "available" ? "bg-green-500 dark:bg-green-600" :
                            "bg-yellow-500 dark:bg-yellow-600"
                          }`}>
                            <HomeIcon className="h-3 w-3 text-background" />
                          </div>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <div className="bg-background border rounded-lg px-2 py-1 text-xs whitespace-nowrap shadow-lg">
                              <div className="font-semibold">{(marker as any).code}</div>
                              {(marker as any).name && <div className="text-muted-foreground">{(marker as any).name}</div>}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <Link href={`/activities/${marker.id.replace("activity-", "")}`}>
                        <div className="relative group">
                          <div className={`w-6 h-6 rounded-full border-2 border-background shadow-lg flex items-center justify-center ${
                            (marker as any).status === "pending" ? "bg-blue-500 dark:bg-blue-600" :
                            (marker as any).status === "in-progress" ? "bg-orange-500 dark:bg-orange-600" :
                            (marker as any).status === "completed" ? "bg-green-500 dark:bg-green-600" :
                            "bg-destructive"
                          }`}>
                            <Target className="h-3 w-3 text-background" />
                          </div>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <div className="bg-background border rounded-lg px-2 py-1 text-xs whitespace-nowrap shadow-lg">
                              <div className="font-semibold">{(marker as any).title}</div>
                              <div className="text-muted-foreground">{(marker as any).homeCode}</div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-destructive border-2 border-background"></div>
              <span>Occupied Homes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500 dark:bg-green-600 border-2 border-background"></div>
              <span>Available Homes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500 dark:bg-yellow-600 border-2 border-background"></div>
              <span>Maintenance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500 dark:bg-blue-600 border-2 border-background"></div>
              <span>Pending Activities</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500 dark:bg-orange-600 border-2 border-background"></div>
              <span>In Progress</span>
            </div>
            </div>
          </div>
        </CardContent>
      </CollapsibleContent>
    </Card>
    </Collapsible>
  )
}

