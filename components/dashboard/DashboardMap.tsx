"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { MapPin, ChevronDown, Cloud, Sun, CloudRain, CloudSnow, RefreshCw, Route, Clock } from "lucide-react"
import type { Home, Activity } from "@/lib/test-data"
import { GoogleMapView, ActivityMarker, MapMarker } from "@/components/map/GoogleMapView"
import Link from "next/link"

interface WeatherData {
  temperature: number
  condition: string
  icon: string
}

interface ActivityWithWeather extends Activity {
  coordinates?: { lat: number; lng: number }
  homeName?: string
  weather?: WeatherData
}

interface DashboardMapProps {
  homes: Home[]
  activities: Activity[]
  latitude?: number
  longitude?: number
  city?: string
}

export function DashboardMap({ homes, activities, latitude = 51.5074, longitude = -0.1278, city = "London" }: DashboardMapProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [plannedActivities, setPlannedActivities] = useState<ActivityWithWeather[]>([])
  const [weatherCache, setWeatherCache] = useState<Record<string, WeatherData>>({})

  // Get first 5 activities for today, sorted by scheduled time
  const todaysActivities = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return activities
      .filter(activity => {
        const activityDate = new Date(activity.scheduledTime)
        return activityDate >= today && activityDate < tomorrow && 
               activity.status !== 'completed' && activity.status !== 'cancelled'
      })
      .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
      .slice(0, 5)
      .map(activity => {
        const home = homes.find(h => h.code === activity.homeCode)
        return {
          ...activity,
          coordinates: home?.coordinates,
          homeName: home?.name
        }
      })
      .filter(a => a.coordinates) as ActivityWithWeather[]
  }, [activities, homes])

  // Fetch weather for each unique location
  const fetchWeatherForLocations = useCallback(async (activitiesWithCoords: ActivityWithWeather[]) => {
    const uniqueLocations = new Map<string, { lat: number; lng: number }>()
    
    activitiesWithCoords.forEach(activity => {
      if (activity.coordinates) {
        const key = `${activity.coordinates.lat.toFixed(2)},${activity.coordinates.lng.toFixed(2)}`
        if (!uniqueLocations.has(key)) {
          uniqueLocations.set(key, activity.coordinates)
        }
      }
    })

    const newCache: Record<string, WeatherData> = { ...weatherCache }
    
    for (const [key, coords] of uniqueLocations) {
      if (!newCache[key]) {
        try {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m,weather_code&timezone=auto`
          )
          const data = await response.json()
          
          if (data.current) {
            const weatherCode = data.current.weather_code
            newCache[key] = {
              temperature: Math.round(data.current.temperature_2m),
              condition: getWeatherCondition(weatherCode),
              icon: getWeatherIcon(weatherCode)
            }
          }
        } catch (error) {
          console.error("Error fetching weather for location:", key, error)
          newCache[key] = {
            temperature: 15,
            condition: "Unknown",
            icon: "cloud"
          }
        }
      }
    }

    setWeatherCache(newCache)

    // Attach weather to activities
    return activitiesWithCoords.map(activity => {
      if (activity.coordinates) {
        const key = `${activity.coordinates.lat.toFixed(2)},${activity.coordinates.lng.toFixed(2)}`
        return { ...activity, weather: newCache[key] }
      }
      return activity
    })
  }, [weatherCache])

  // Initial load and refresh
  const loadPlan = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const activitiesWithWeather = await fetchWeatherForLocations(todaysActivities)
      setPlannedActivities(activitiesWithWeather)
    } finally {
      setIsRefreshing(false)
    }
  }, [todaysActivities, fetchWeatherForLocations])

  useEffect(() => {
    if (todaysActivities.length > 0) {
      loadPlan()
    } else {
      setPlannedActivities([])
    }
  }, [todaysActivities])

  const handleRefresh = () => {
    // Clear cache to force refetch
    setWeatherCache({})
    loadPlan()
  }

  const getWeatherIcon = (code: number): string => {
    if (code === 0) return "sun"
    if (code <= 3) return "cloud"
    if (code <= 49) return "cloud"
    if (code <= 69) return "rain"
    if (code <= 86) return "snow"
    return "cloud"
  }

  const getWeatherCondition = (code: number): string => {
    if (code === 0) return "Clear"
    if (code === 1) return "Clear"
    if (code === 2) return "Cloudy"
    if (code === 3) return "Overcast"
    if (code <= 49) return "Foggy"
    if (code <= 59) return "Drizzle"
    if (code <= 69) return "Rainy"
    if (code <= 86) return "Snowy"
    if (code <= 99) return "Stormy"
    return "Unknown"
  }

  const WeatherIcon = ({ icon, className = "h-4 w-4" }: { icon: string; className?: string }) => {
    switch (icon) {
      case "sun":
        return <Sun className={`${className} text-yellow-500`} />
      case "rain":
        return <CloudRain className={`${className} text-blue-500`} />
      case "snow":
        return <CloudSnow className={`${className} text-blue-300`} />
      default:
        return <Cloud className={`${className} text-gray-500`} />
    }
  }

  const formatTime = (startDate: Date, endDate?: Date) => {
    const startStr = new Date(startDate).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
    if (endDate) {
      const endStr = new Date(endDate).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
      return `${startStr} – ${endStr}`
    }
    return startStr
  }

  const getStatusColor = (status: Activity["status"]) => {
    switch (status) {
      case "to-start":
        return "bg-blue-500"
      case "in-progress":
        return "bg-orange-500"
      case "paused":
        return "bg-yellow-500"
      default:
        return "bg-gray-400"
    }
  }

  // Create map markers with numbered labels
  const mapMarkers = useMemo((): MapMarker[] => {
    return plannedActivities.map((activity, index) => ({
      id: `activity-${activity.id}`,
      type: "activity" as const,
      lat: activity.coordinates!.lat,
      lng: activity.coordinates!.lng,
      title: activity.title,
      homeCode: activity.homeCode,
      homeName: activity.homeName,
      status: activity.status as "pending" | "in-progress" | "completed" | "cancelled",
      activityType: activity.type,
      label: String(index + 1)
    }))
  }, [plannedActivities])

  // Create route waypoints for the polyline
  const routeWaypoints = useMemo(() => {
    return plannedActivities
      .filter(a => a.coordinates)
      .map(a => ({ lat: a.coordinates!.lat, lng: a.coordinates!.lng }))
  }, [plannedActivities])

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="w-full hover:bg-white/80 dark:hover:bg-black/50 transition-colors">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <Route className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="break-words">Plan my day</span>
              {plannedActivities.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {plannedActivities.length} activities
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRefresh()
                }}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="sr-only">Refresh</span>
              </Button>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-4 sm:space-y-6">
              {/* Activity List with Weather */}
              {plannedActivities.length > 0 ? (
                <div className="space-y-1">
                  {plannedActivities.map((activity, index) => {
                    const isLast = index === plannedActivities.length - 1
                    const home = homes.find(h => h.code === activity.homeCode)

                    return (
                      <div key={activity.id} className="relative">
                        {/* Timeline connector */}
                        {!isLast && (
                          <div className="absolute left-[18px] top-[44px] bottom-0 w-0.5 bg-border" />
                        )}

                        <div className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          {/* Step number */}
                          <div className="flex-shrink-0">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ${getStatusColor(activity.status)}`}>
                              {index + 1}
                            </div>
                          </div>

                          {/* Activity details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <Link
                                  href={`/activities/${activity.id}`}
                                  className="font-medium text-sm hover:underline block truncate"
                                >
                                  {activity.title}
                                </Link>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                  <MapPin className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">
                                    {activity.homeCode}
                                    {home?.address && ` • ${home.address}`}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Time and Weather */}
                              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatTime(activity.scheduledTime, activity.endTime)}</span>
                                </div>
                                {activity.weather && (
                                  <div className="flex items-center gap-1">
                                    <WeatherIcon icon={activity.weather.icon} className="h-3.5 w-3.5" />
                                    <span className="text-xs font-medium">{activity.weather.temperature}°C</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Route className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No activities scheduled for today</p>
                </div>
              )}

              {/* Map with Route */}
              {plannedActivities.length > 0 && (
                <div className="space-y-3 pt-2 border-t">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Route Map
                  </h3>
                  
                  {/* Google Map Container */}
                  <div className="relative w-full h-[250px] sm:h-[300px] bg-muted rounded-lg overflow-hidden border">
                    <GoogleMapView
                      markers={mapMarkers}
                      center={{ lat: latitude, lng: longitude }}
                      zoom={12}
                      fitBoundsToMarkers={mapMarkers.length > 1}
                      showInfoWindows={true}
                      routeWaypoints={routeWaypoints}
                      className="absolute inset-0"
                    />
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>To Start</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span>In Progress</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span>Paused</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-0.5 bg-primary"></div>
                      <span>Route</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
