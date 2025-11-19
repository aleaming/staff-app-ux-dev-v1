import { testHomes } from "@/lib/test-data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Home } from "lucide-react"
import Link from "next/link"

const statusConfig = {
  "occupied": { label: "Occupied", variant: "default" as const, color: "bg-green-500" },
  "available": { label: "Available", variant: "secondary" as const, color: "bg-gray-500" },
  "maintenance": { label: "Maintenance", variant: "destructive" as const, color: "bg-orange-500" },
}

export default function HomesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Homes</h1>
          <p className="text-muted-foreground">Browse all homes</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testHomes.map((home) => {
            const statusInfo = statusConfig[home.status]
            
            return (
              <Link key={home.id} href={`/homes/${home.id}`}>
                <Card className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
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
                          <Badge variant={statusInfo.variant}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="text-sm text-muted-foreground">
                            {home.activeBookings} booking{home.activeBookings !== 1 ? 's' : ''}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {home.pendingActivities} activit{home.pendingActivities !== 1 ? 'ies' : 'y'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

