"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets, Thermometer } from "lucide-react"

interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  description: string
  icon?: string
}

interface WeatherWidgetProps {
  latitude?: number
  longitude?: number
  city?: string
}

export function WeatherWidget({ latitude = 51.5074, longitude = -0.1278, city = "London" }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch weather data using Open-Meteo API (free, no key required)
    const fetchWeather = async () => {
      try {
        setLoading(true)
        // Using Open-Meteo API
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
        // Fallback data
        setWeather({
          temperature: 15,
          condition: "Partly Cloudy",
          humidity: 65,
          windSpeed: 12,
          description: "Partly cloudy with light winds"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [latitude, longitude])

  const getWeatherIcon = (code: number) => {
    // WMO Weather interpretation codes
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
    // WMO Weather interpretation codes
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

  if (loading) {
    return (
      <Card className="hover:bg-white/80 dark:hover:bg-black/50 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Cloud className="h-4 w-4 animate-pulse" />
            <span className="text-sm">Loading weather...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!weather) {
    return null
  }

  return (
    <Card className="hover:bg-white/80 dark:hover:bg-black/50 transition-colors">
      <CardHeader className="pb-3 p-4 sm:p-6">
        <CardTitle className="text-sm sm:text-base flex items-center gap-2">
          <Cloud className="h-4 w-4" />
          <span className="break-words">Weather - {city}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="space-y-3 sm:space-y-4">
          {/* Main Weather Display */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10">
                {getWeatherIconComponent(weather.icon || "cloud")}
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg sm:text-lg font-bold">{weather.temperature}</span>
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
        </div>
      </CardContent>
    </Card>
  )
}

