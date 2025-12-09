"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { MapPin, Home as HomeIcon, Target, Layers, ChevronDown, Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets, Thermometer } from "lucide-react"
import type { Home, Activity } from "@/lib/test-data"
import { GoogleMapView, HomeMarker, ActivityMarker, MapMarker } from "@/components/map/GoogleMapView"
import { useRouter } from "next/navigation"

interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  description: string
  icon?: string
}

interface DashboardMapProps {
  homes: Home[]
  activities: Activity[]
  latitude?: number
  longitude?: number
  city?: string
}

export function DashboardMap({ homes, activities, latitude = 51.5074, longitude = -0.1278, city = "London" }: DashboardMapProps) {
  const [showHomes, setShowHomes] = useState(false)
  const [showActivities, setShowActivities] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(true)
  const router = useRouter()

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setWeatherLoading(true)
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
        )
        const data = await response.json()

        if (data.current) {
          const weatherCode = data.current.weather_code
          const condition = getWeatherCondition(weatherCode)
          
          setWeather({
            temperature: Math.round(data.current.temperature_2m),
            condition,
            humidity: data.current.relative_humidity_2m,
            windSpeed: Math.round(data.current.wind_speed_10m),
            description: condition,
            icon: getWeatherIcon(weatherCode)
          })
        }
      } catch (error) {
        console.error("Error fetching weather:", error)
        setWeather({
          temperature: 15,
          condition: "Partly Cloudy",
          humidity: 65,
          windSpeed: 12,
          description: "Partly cloudy with light winds"
        })
      } finally {
        setWeatherLoading(false)
      }
    }

    fetchWeather()
  }, [latitude, longitude])

  const getWeatherIcon = (code: number) => {
    if (code === 0) return "sun"
    if (code <= 3) return "cloud"
    if (code <= 49) return "cloud"
    if (code <= 59) return "rain"
    if (code <= 69) return "rain"
    if (code <= 79) return "snow"
    if (code <= 84) return "snow"
    if (code <= 86) return "snow"
    return "cloud"
  }

  const getWeatherCondition = (code: number): string => {
    if (code === 0) return "Clear sky"
    if (code === 1) return "Mainly clear"
    if (code === 2) return "Partly cloudy"
    if (code === 3) return "Overcast"
    if (code <= 49) return "Fog"
    if (code <= 59) return "Drizzle"
    if (code <= 69) return "Rain"
    if (code <= 79) return "Snow"
    if (code <= 84) return "Snow showers"
    if (code <= 86) return "Snow"
    if (code <= 99) return "Thunderstorm"
    return "Unknown"
  }

  const getWeatherIconComponent = (icon: string) => {
    switch (icon) {
      case "sun":
        return <Sun className="h-8 w-8 text-yellow-500" />
      case "cloud":
        return <Cloud className="h-8 w-8 text-gray-500" />
      case "rain":
        return <CloudRain className="h-8 w-8 text-blue-500" />
      case "snow":
        return <CloudSnow className="h-8 w-8 text-blue-300" />
      default:
        return <Cloud className="h-8 w-8 text-gray-500" />
    }
  }

  // Get coordinates for activities from their associated homes
  const activitiesWithCoords = useMemo(() => {
    return activities
      .map(activity => {
        const home = homes.find(h => h.code === activity.homeCode)
        return home && home.coordinates
          ? { ...activity, coordinates: home.coordinates, homeName: home.name }
          : null
      })
      .filter(Boolean) as (Activity & { coordinates: { lat: number; lng: number }; homeName?: string })[]
  }, [activities, homes])

  // Create Google Maps markers
  const mapMarkers = useMemo((): MapMarker[] => {
    const homeMarkers: HomeMarker[] = showHomes
      ? homes.filter(h => h.coordinates).map(home => ({
          id: `home-${home.id}`,
          type: "home" as const,
          lat: home.coordinates!.lat,
          lng: home.coordinates!.lng,
          code: home.code,
          name: home.name,
          status: home.status as "available" | "occupied" | "maintenance",
          address: home.address
        }))
      : []

    const activityMarkersList: ActivityMarker[] = showActivities
      ? activitiesWithCoords.map(activity => ({
          id: `activity-${activity.id}`,
          type: "activity" as const,
          lat: activity.coordinates.lat,
          lng: activity.coordinates.lng,
          title: activity.title,
          homeCode: activity.homeCode,
          homeName: activity.homeName,
          status: activity.status as "pending" | "in-progress" | "completed" | "cancelled",
          activityType: activity.type
        }))
      : []

    return [...homeMarkers, ...activityMarkersList]
  }, [homes, activitiesWithCoords, showHomes, showActivities])

  // Handle marker click - navigate to the appropriate page
  const handleMarkerClick = (marker: MapMarker) => {
    if (marker.type === "home") {
      router.push(`/homes/${marker.id.replace("home-", "")}`)
    } else {
      router.push(`/activities/${marker.id.replace("activity-", "")}`)
    }
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="w-full hover:bg-white/80 dark:hover:bg-black/50 transition-colors">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <Layers className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="break-words">Weather & Map</span>
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
            <div className="space-y-4 sm:space-y-6">
              {/* Weather Section */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Cloud className="h-4 w-4" />
                  Weather - {city}
                </h3>
                {weatherLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Cloud className="h-4 w-4 animate-pulse" />
                    <span className="text-sm">Loading weather...</span>
                  </div>
                ) : weather ? (
                  <>
                    {/* Main Weather Display */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10">
                          {getWeatherIconComponent(weather.icon || "cloud")}
                        </div>
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl sm:text-3xl font-bold">{weather.temperature}</span>
                            <span className="text-muted-foreground text-base sm:text-lg">°C</span>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground break-words">{weather.condition}</p>
                        </div>
                      </div>
                    </div>

                    {/* Weather Details */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3 border-t">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Droplets className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground truncate">Humidity</p>
                          <p className="text-xs sm:text-sm font-semibold">{weather.humidity}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Wind className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground truncate">Wind</p>
                          <p className="text-xs sm:text-sm font-semibold">{weather.windSpeed} km/h</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Thermometer className="h-5 w-5 text-orange-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground truncate">Feels like</p>
                          <p className="text-xs sm:text-sm font-semibold">{weather.temperature}°C</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>

              {/* Map Section */}
              <div className="space-y-3 sm:space-y-4 pt-2 border-t">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Activity Map
                </h3>
                
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

                {/* Google Map Container */}
                <div className="relative w-full h-[250px] sm:h-[350px] md:h-[400px] bg-muted rounded-lg overflow-hidden border">
                  <GoogleMapView
                    markers={mapMarkers}
                    center={{ lat: latitude, lng: longitude }}
                    zoom={12}
                    fitBoundsToMarkers={mapMarkers.length > 1}
                    showInfoWindows={true}
                    className="absolute inset-0"
                  />
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
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
