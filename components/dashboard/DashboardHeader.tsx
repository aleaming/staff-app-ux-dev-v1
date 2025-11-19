"use client"

import { useEffect, useState } from "react"
import { Calendar, MessageSquare, Target, CalendarDays } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface QuickStats {
  activitiesToday?: number
  pendingMessages?: number
  upcomingBookings?: number
}

interface DashboardHeaderProps {
  userName?: string
  stats?: QuickStats
}

export function DashboardHeader({ 
  userName = "User",
  stats 
}: DashboardHeaderProps) {
  const [greeting, setGreeting] = useState("")
  const [currentDate, setCurrentDate] = useState("")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) {
      setGreeting("Good morning")
    } else if (hour < 18) {
      setGreeting("Good afternoon")
    } else {
      setGreeting("Good evening")
    }

    const date = new Date()
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
    setCurrentDate(date.toLocaleDateString('en-US', options))
  }, [])

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold break-words">
          {greeting}, {userName}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
          <Calendar className="h-4 w-4 flex-shrink-0" />
          <span className="break-words">{currentDate}</span>
        </p>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid gap-3 sm:gap-4 grid-cols-2">
          <Card>
            <CardContent className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
              <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Activities Today</p>
                <p className="text-xl sm:text-2xl font-bold">{stats.activitiesToday || 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
              <div className="p-2 rounded-lg bg-green-500/10 dark:bg-green-500/20 flex-shrink-0">
                <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Upcoming Bookings</p>
                <p className="text-xl sm:text-2xl font-bold">{stats.upcomingBookings || 0}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

