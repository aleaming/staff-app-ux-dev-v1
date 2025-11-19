"use client"

import Link from "next/link"
import { testHomes } from "@/lib/test-data"
import { Home, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { NearbyHome, HomeStatus } from "./NearbyHomes"

interface HomeStatusOverviewProps {
  homes?: NearbyHome[]
  isLoading?: boolean
}

export function HomeStatusOverview({ 
  homes = [], 
  isLoading = false 
}: HomeStatusOverviewProps) {
  // Use provided homes or fall back to test data
  const displayHomes: NearbyHome[] = homes.length > 0 ? homes : testHomes

  const statusCounts = {
    occupied: displayHomes.filter(h => h.status === "occupied").length,
    available: displayHomes.filter(h => h.status === "available").length,
    maintenance: displayHomes.filter(h => h.status === "maintenance").length,
  }

  // Homes needing attention = maintenance + homes with high pending activities
  const homesNeedingAttention = displayHomes.filter(
    h => h.status === "maintenance" || h.pendingActivities >= 3
  ).length

  const statusConfig = {
    occupied: { 
      label: "Occupied", 
      icon: Home, 
      color: "bg-green-500 dark:bg-green-600",
      variant: "default" as const
    },
    available: { 
      label: "Available", 
      icon: CheckCircle, 
      color: "bg-muted dark:bg-muted",
      variant: "secondary" as const
    },
    maintenance: { 
      label: "Maintenance", 
      icon: XCircle, 
      color: "bg-orange-500 dark:bg-orange-600",
      variant: "destructive" as const
    },
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Home Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base sm:text-lg">Home Status Overview</CardTitle>
          <Button variant="ghost" size="sm" asChild className="text-xs sm:text-sm">
            <Link href="/homes">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
          {Object.entries(statusCounts).map(([status, count]) => {
            const config = statusConfig[status as HomeStatus]
            const Icon = config.icon

            return (
              <Link 
                key={status} 
                href={`/homes?status=${status}`}
                className="block"
              >
                <Card className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                      <div className={`p-2 sm:p-3 rounded-lg ${config.color} ${config.color.includes('muted') ? 'text-foreground' : 'text-background'}`}>
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div className="text-center">
                        <p className="text-xl sm:text-2xl font-bold">{count}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">{config.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
          
          {/* Homes Needing Attention */}
          <Link 
            href="/homes?attention=true"
            className="block"
          >
            <Card className="hover:bg-muted/50 transition-colors border-orange-200 dark:border-orange-800">
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                  <div className="p-2 sm:p-3 rounded-lg bg-orange-500 dark:bg-orange-600 text-background">
                    <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-xl sm:text-2xl font-bold">{homesNeedingAttention}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground break-words">Need Attention</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

