"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { useData } from "@/lib/data/DataProvider"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HomeInfoSheet } from "@/components/homes/HomeInfoSheet"
import { MapPin, Navigation, Home, Calendar, User } from "lucide-react"
import { MapSheet } from "@/components/map/MapSheet"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

const homeStatusConfig = {
  "occupied": { label: "Occupied", variant: "default" as const, color: "bg-primary" },
  "available": { label: "Available", variant: "secondary" as const, color: "bg-primary" },
  "maintenance": { label: "Maintenance", variant: "destructive" as const, color: "bg-primary" },
}

const bookingStatusConfig = {
  "upcoming": { label: "Pre-Stay", className: "bg-[#E2F0D9] text-green-900 border-[#E2F0D9] hover:bg-[#E2F0D9]" },
  "current": { label: "In-Stay", className: "bg-[#A7C58E] text-green-900 border-[#A7C58E] hover:bg-[#A7C58E]" },
  "departure": { label: "Post-Stay", className: "bg-[#AFABAB] text-gray-900 border-[#AFABAB] hover:bg-[#AFABAB]" },
  "completed": { label: "Completed", className: "bg-[#AFABAB] text-gray-900 border-[#AFABAB] hover:bg-[#AFABAB]" },
}

function CatalogSkeleton() {
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="space-y-4">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function CatalogContent() {
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') || 'homes'
  const { homes, bookings, isLoading } = useData()
  
  const [mapSheetOpen, setMapSheetOpen] = useState(false)
  const [selectedHome, setSelectedHome] = useState<{
    code: string
    name?: string
    address: string
    city?: string
    coordinates?: { lat: number, lng: number }
  } | null>(null)

  const handleShowMap = (e: React.MouseEvent, homeCode: string) => {
    e.preventDefault()
    e.stopPropagation()
    const home = homes.find(h => h.code === homeCode)
    if (home) {
      setSelectedHome({
        code: home.code,
        name: home.name,
        address: home.address,
        city: home.city,
        coordinates: home.coordinates
      })
      setMapSheetOpen(true)
    }
  }

  if (isLoading) {
    return <CatalogSkeleton />
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="space-y-4">
        <div>
          <h1 className="text-lg font-bold mb-0">Catalog</h1>
          <p className="text-muted-foreground text-sm">Browse homes and bookings</p>
        </div>

        <Tabs defaultValue={tab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="homes">
              Homes ({homes.length})
            </TabsTrigger>
            <TabsTrigger value="bookings">
              Bookings ({bookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="homes" className="mt-4">
            <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 lg:grid-cols-3">
              {homes.map((home) => {
                const statusInfo = homeStatusConfig[home.status]
                
                return (
                  <Link key={home.id} href={`/homes/${home.id}`}>
                    <Card className="hover:bg-white dark:hover:bg-neutral-900 hover:border-muted-foreground dark:border-primary/20 transition-colors">
                      <CardContent className="px-3 py-2">
                        <div className="flex items-start justify-between min-w-0">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold mb-1 flex items-center">
                              <span className="text-primary">{home.code}</span>
                              {home.name && (
                                <span className="text-sm text-muted-foreground ml-2">{home.name}</span>
                              )}
                            </h3>
                            <button
                              onClick={(e) => handleShowMap(e, home.code)}
                              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mb-1 text-left max-w-full"
                            >
                              <MapPin className="h-3 w-3 flex-shrink-0" />
                              <span className="underline truncate">{home.address}, {home.city}</span>
                            </button>
                            {home.distance !== undefined && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Navigation className="h-3 w-3" />
                                <span>{home.distance.toFixed(1)} km away</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="mt-4">
            <div className="flex flex-col gap-2">
              {bookings.map((booking) => {
                const statusInfo = bookingStatusConfig[booking.status]
                const home = homes.find(h => h.code === booking.homeCode)

                return (
                  <Link key={booking.id} href={`/bookings/${booking.id}`}>
                    <Card className="hover:bg-white dark:hover:bg-neutral-900 transition-colors">
                      <CardContent className="px-3 py-2">
                        <div className="flex items-start justify-between min-w-0">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-semibold">
                                <span className="text-primary">{booking.bookingId}</span>
                              </h3>
                              <Badge className={statusInfo.className}>
                                {statusInfo.label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                              <User className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{booking.guestName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1 min-w-0">
                              <Home className="h-3 w-3 flex-shrink-0" />
                              {home ? (
                                <span onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="flex items-center gap-1.5 min-w-0">
                                  <HomeInfoSheet
                                    homeId={home.id}
                                    homeCode={home.code}
                                    homeName={home.name}
                                  >
                                    <button
                                      type="button"
                                      className="text-primary underline hover:text-primary/80 transition-colors flex-shrink-0"
                                    >
                                      {booking.homeCode}
                                    </button>
                                  </HomeInfoSheet>
                                  {home.name && (
                                    <>
                                      <span className="flex-shrink-0">•</span>
                                      <span className="truncate">{home.name}</span>
                                    </>
                                  )}
                                </span>
                              ) : (
                                <span>{booking.homeCode}</span>
                              )}
                            </div>
                            {home && (
                              <button
                                onClick={(e) => handleShowMap(e, booking.homeCode)}
                                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mb-1 text-left max-w-full"
                              >
                                <MapPin className="h-3 w-3 flex-shrink-0" />
                                <span className="underline truncate">{home.address}, {home.city}</span>
                              </button>
                            )}
                            <div className="flex items-center gap-4 text-xs">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {booking.checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {booking.checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                              {booking.numberOfGuests && (
                                <span className="text-muted-foreground">
                                  {booking.numberOfGuests} guest{booking.numberOfGuests !== 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Map Sheet */}
      {selectedHome && (
        <MapSheet
          open={mapSheetOpen}
          onOpenChange={setMapSheetOpen}
          homeCode={selectedHome.code}
          homeName={selectedHome.name}
          address={selectedHome.address}
          city={selectedHome.city}
          coordinates={selectedHome.coordinates}
        />
      )}
    </div>
  )
}


