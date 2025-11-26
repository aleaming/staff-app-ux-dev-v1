"use client"

import { testHomes, testBookings } from "@/lib/test-data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HomeInfoSheet } from "@/components/homes/HomeInfoSheet"
import { MapPin, Navigation, Home, Calendar, User } from "lucide-react"
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

export default function CatalogPage() {
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold mb-0">Catalog</h1>
          <p className="text-muted-foreground">Browse homes and bookings</p>
        </div>

        <Tabs defaultValue="homes" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="homes">
              Homes ({testHomes.length})
            </TabsTrigger>
            <TabsTrigger value="bookings">
              Bookings ({testBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="homes" className="mt-6">
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {testHomes.map((home) => {
                const statusInfo = homeStatusConfig[home.status]
                
                return (
                  <Link key={home.id} href={`/homes/${home.id}`}>
                    <Card className="hover:bg-white dark:hover:bg-neutral-900 hover:border-muted-foreground dark:border-primary/20 transition-colors">
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${statusInfo.color} text-white`}>
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
                                  <span className="truncate">{home.address}, {home.city}</span>
                                </div>
                                {home.distance !== undefined && (
                                  <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                                    <Navigation className="h-3 w-3" />
                                    <span>{home.distance.toFixed(1)} km away</span>
                                  </div>
                                )}
                              </div>
                              {/*<Badge variant={statusInfo.variant}>
                                {statusInfo.label}
                              </Badge>*/}
                            </div>
                            {/* 
                            <div className="flex items-center gap-4 mt-3">
                              <div className="text-sm text-muted-foreground">
                                {home.activeBookings} booking{home.activeBookings !== 1 ? 's' : ''}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {home.pendingActivities} activit{home.pendingActivities !== 1 ? 'ies' : 'y'}
                              </div>
                            </div>
                            */}
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
              {testBookings.map((booking) => {
                const statusInfo = bookingStatusConfig[booking.status]
                const home = testHomes.find(h => h.code === booking.homeCode)

                return (
                  <Link key={booking.id} href={`/bookings/${booking.id}`}>
                    <Card className="hover:bg-muted/50 transition-colors">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{booking.bookingId}</h3>
                              <Badge className={statusInfo.className}>
                                {statusInfo.label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                              <User className="h-3 w-3" />
                              <span>{booking.guestName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                              <MapPin className="h-3 w-3" />
                              {home ? (
                                <span onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                                  <HomeInfoSheet
                                    homeId={home.id}
                                    homeCode={home.code}
                                    homeName={home.name}
                                  >
                                    <button
                                      type="button"
                                      className="underline hover:text-primary transition-colors"
                                    >
                                      {booking.homeCode}
                                    </button>
                                  </HomeInfoSheet>
                                </span>
                              ) : (
                                <span>{booking.homeCode}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm">
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
    </div>
  )
}

