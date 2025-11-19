"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { testHomes } from "@/lib/test-data"
import { MapPin, Navigation, RefreshCw, Home, Calendar, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

export type HomeStatus = "occupied" | "available" | "maintenance"

export interface NearbyHome {
  id: string
  code: string
  name?: string
  address: string
  distance?: number // in km
  activeBookings: number
  pendingActivities: number
  status: HomeStatus
}

interface NearbyHomesProps {
  homes?: NearbyHome[]
  isLoading?: boolean
}

const statusConfig = {
  "occupied": { label: "Occupied", variant: "default" as const, color: "bg-green-500" },
  "available": { label: "Available", variant: "secondary" as const, color: "bg-gray-500" },
  "maintenance": { label: "Maintenance", variant: "destructive" as const, color: "bg-orange-500" },
}

export function NearbyHomes({ homes = [], isLoading = false }: NearbyHomesProps) {
  const [distanceFilter, setDistanceFilter] = useState<"1km" | "5km" | "10km" | "all">("all")
  const [locationEnabled, setLocationEnabled] = useState(false)

  // Use provided homes or fall back to test data
  const displayHomes: NearbyHome[] = homes.length > 0 ? homes : testHomes

  const filteredHomes = displayHomes.filter(home => {
    if (distanceFilter === "all") return true
    const maxDistance = parseFloat(distanceFilter)
    return home.distance !== undefined && home.distance <= maxDistance
  })

  const handleRefreshLocation = () => {
    // TODO: Implement location refresh
    console.log("Refreshing location...")
  }

  useEffect(() => {
    // Check if location is enabled
    if (navigator.geolocation) {
      setLocationEnabled(true)
    }
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <span className="break-words">Nearby Homes</span>
            <Badge variant="secondary" className="text-xs">{filteredHomes.length}</Badge>
          </CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <Tabs value={distanceFilter} onValueChange={(v) => setDistanceFilter(v as typeof distanceFilter)}>
              <TabsList>
                <TabsTrigger value="1km">1km</TabsTrigger>
                <TabsTrigger value="5km">5km</TabsTrigger>
                <TabsTrigger value="10km">10km</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleRefreshLocation}
              title="Refresh location"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        {!locationEnabled ? (
          <div className="text-center py-8">
            <Navigation className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Enable location services</p>
            <p className="text-sm text-muted-foreground mt-1">
              To see nearby homes, please enable location services
            </p>
            <Button className="mt-4" onClick={() => setLocationEnabled(true)}>
              Enable Location
            </Button>
          </div>
        ) : filteredHomes.length === 0 ? (
          <div className="text-center py-8">
            <Home className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No homes nearby</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting the distance filter
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHomes.map((home) => {
              const statusInfo = statusConfig[home.status]

              return (
                <Link 
                  key={home.id} 
                  href={`/homes/${home.id}`}
                  className="block"
                >
                  <Card className="hover:bg-muted/50 transition-colors">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${statusInfo.color} text-background`}>
                          <Home className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold">{home.code}</h3>
                              {home.name && (
                                <p className="text-sm text-muted-foreground">{home.name}</p>
                              )}
                              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate">{home.address}</span>
                              </div>
                              {home.distance !== undefined && (
                                <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                                  <Navigation className="h-3 w-3" />
                                  <span>{home.distance.toFixed(1)} km away</span>
                                </div>
                              )}
                            </div>
                            <Badge variant={statusInfo.variant}>
                              {statusInfo.label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {home.activeBookings} booking{home.activeBookings !== 1 ? 's' : ''}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Target className="h-3 w-3" />
                              {home.pendingActivities} activit{home.pendingActivities !== 1 ? 'ies' : 'y'}
                            </div>
                            <Button size="sm" variant="outline" className="ml-auto h-7">
                              View Home
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

