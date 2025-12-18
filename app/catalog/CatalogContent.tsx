"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { useData } from "@/lib/data/DataProvider"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HomeInfoSheet } from "@/components/homes/HomeInfoSheet"
import { MapPin, Navigation, Home, Calendar, User, Bed, Bath } from "lucide-react"
import { MapSheet } from "@/components/map/MapSheet"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

const homeStatusConfig = {
  "occupied": { label: "Occupied", variant: "default" as const, color: "bg-primary" },
  "available": { label: "Available", variant: "secondary" as const, color: "bg-primary" },
  "maintenance": { label: "Maintenance", variant: "destructive" as const, color: "bg-primary" },
}

const bookingStatusConfig = {
  "upcoming": { label: "Pre-Stay", className: "bg-booking-pre-stay text-neutral-900 border-booking-pre-stay hover:bg-booking-pre-stay" },
  "current": { label: "In-Stay", className: "bg-booking-in-stay text-neutral-900 border-booking-in-stay hover:bg-booking-in-stay" },
  "departure": { label: "Post-Stay", className: "bg-booking-post-stay text-neutral-900 border-booking-post-stay hover:bg-booking-post-stay" },
  "completed": { label: "Completed", className: "bg-booking-completed text-neutral-900 border-booking-completed hover:bg-booking-completed" },
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
    location?: string
    market?: string
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
        location: home.location,
        market: home.market,
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
          <h1 className="text-2xl font-bold mb-0">Catalog</h1>
          <p className="text-muted-foreground">Browse homes and bookings</p>
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

          <TabsContent value="homes" className="mt-6">
            <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 lg:grid-cols-3">
              {homes.map((home) => {
                const statusInfo = homeStatusConfig[home.status]
                
                return (
                  <Link key={home.id} href={`/homes/${home.id}`}>
                    <Card className="hover:bg-white dark:hover:bg-neutral-900 transition-colors overflow-hidden">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h3 className="text-base font-semibold truncate min-w-0">
                                <span className="text-primary">{home.code}</span>
                                {home.name && (
                                  <span className="text-base font-normal text-muted-foreground ml-2">{home.name}</span>
                                )}
                              </h3>
                              {(home.location || home.market) && (
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  {home.location && (
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-normal">
                                      {home.location}
                                    </Badge>
                                  )}
                                  {home.market && home.market !== home.location && (
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-normal">
                                      {home.market}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={(e) => handleShowMap(e, home.code)}
                              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mb-1 text-left w-full overflow-hidden"
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
                            {(home.bedrooms || home.bathrooms) && (
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                {home.bedrooms && (
                                  <div className="flex items-center gap-1">
                                    <Bed className="h-3 w-3" />
                                    <span>{home.bedrooms} bed{home.bedrooms !== 1 ? 's' : ''}</span>
                                  </div>
                                )}
                                {home.bathrooms && (
                                  <div className="flex items-center gap-1">
                                    <Bath className="h-3 w-3" />
                                    <span>{home.bathrooms} bath{home.bathrooms !== 1 ? 's' : ''}</span>
                                  </div>
                                )}
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

          <TabsContent value="bookings" className="mt-6">
            <div className="flex flex-col gap-2">
              {bookings.map((booking) => {
                const statusInfo = bookingStatusConfig[booking.status]
                const home = homes.find(h => h.code === booking.homeCode)

                return (
                  <Link key={booking.id} href={`/bookings/${booking.id}`}>
                    <Card className="hover:bg-white dark:hover:bg-neutral-900 transition-colors">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between min-w-0">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                              <h3 className="text-base font-semibold">
                                <span className="text-primary">{booking.bookingId}</span>
                              </h3>
                              <div className="flex items-center justify-end gap-2">
                              <div className="flex gap-1 text-muted-foreground text-xs">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {booking.checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {booking.checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                              <Badge className={statusInfo.className}>
                                {statusInfo.label}
                              </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                              <User className="h-3 w-3" />
                              <span>{booking.guestName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                              <Home className="h-3 w-3" />
                              {home ? (
                                <span onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="flex items-center gap-1.5">
                                  <HomeInfoSheet
                                    homeId={home.id}
                                    homeCode={home.code}
                                    homeName={home.name}
                                    location={home.location}
                                    market={home.market}
                                  >
                                    <button
                                      type="button"
                                      className="text-primary underline hover:text-primary/80 transition-colors"
                                    >
                                      {booking.homeCode}
                                    </button>
                                  </HomeInfoSheet>
                                  {home.name && (
                                    <>
                                      <span>•</span>
                                      <span>{home.name}</span>
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
                                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mb-1 text-left w-full overflow-hidden"
                              >
                                <MapPin className="h-3 w-3 flex-shrink-0" />
                                <span className="underline truncate">{home.address}, {home.city}</span>
                              </button>
                            )}
                            <div className="flex items-center gap-4 text-xs">
                              
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
          location={selectedHome.location}
          market={selectedHome.market}
          coordinates={selectedHome.coordinates}
        />
      )}
    </div>
  )
}


