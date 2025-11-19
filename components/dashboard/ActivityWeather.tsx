"use client"

import { useEffect, useState } from "react"
import { Cloud, Sun, CloudRain, CloudSnow, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActivityWeatherProps {
  latitude: number
  longitude: number
  scheduledTime: Date
  className?: string
  temperatureOnly?: boolean
}

interface WeatherForecast {
  temperature: number
  condition: string
  icon: string
}

export function ActivityWeather({ 
  latitude, 
  longitude, 
  scheduledTime,
  className,
  temperatureOnly = false
}: ActivityWeatherProps) {
  const [weather, setWeather] = useState<WeatherForecast | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true)
        
        // Fetch hourly forecast from Open-Meteo (next 7 days)
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weather_code&timezone=auto&forecast_days=7`
        )
        const data = await response.json()

        if (data.hourly && data.hourly.time && data.hourly.temperature_2m) {
          // Find the closest hour to scheduled time
          const scheduledDate = new Date(scheduledTime)
          const scheduledHour = scheduledDate.getHours()
          
          // Find the index of the scheduled time in the hourly array
          let hourIndex = -1
          for (let i = 0; i < data.hourly.time.length; i++) {
            const timeStr = data.hourly.time[i]
            const timeDate = new Date(timeStr)
            if (timeDate.getHours() === scheduledHour && 
                timeDate.toDateString() === scheduledDate.toDateString()) {
              hourIndex = i
              break
            }
          }
          
          // If exact match not found, find closest hour
          if (hourIndex === -1) {
            for (let i = 0; i < data.hourly.time.length; i++) {
              const timeStr = data.hourly.time[i]
              const timeDate = new Date(timeStr)
              if (timeDate >= scheduledDate) {
                hourIndex = i
                break
              }
            }
          }
          
          if (hourIndex >= 0 && hourIndex < data.hourly.temperature_2m.length) {
            const temperature = Math.round(data.hourly.temperature_2m[hourIndex])
            const weatherCode = data.hourly.weather_code[hourIndex]
            
            const condition = getWeatherCondition(weatherCode)
            const icon = getWeatherIcon(weatherCode)
            
            setWeather({
              temperature,
              condition,
              icon
            })
          }
        }
      } catch (error) {
        console.error("Error fetching weather forecast:", error)
        // Don't show error, just don't display weather
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [latitude, longitude, scheduledTime])

  const getWeatherIcon = (code: number): string => {
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
    if (code === 0) return "Clear"
    if (code === 1) return "Mainly clear"
    if (code === 2) return "Partly cloudy"
    if (code === 3) return "Overcast"
    if (code <= 49) return "Fog"
    if (code <= 59) return "Drizzle"
    if (code <= 69) return "Rain"
    if (code <= 79) return "Snow"
    if (code <= 84) return "Snow"
    if (code <= 86) return "Snow"
    if (code <= 99) return "Thunderstorm"
    return "Unknown"
  }

  const getWeatherIconComponent = (icon: string) => {
    const iconClass = "h-3.5 w-3.5"
    switch (icon) {
      case "sun":
        return <Sun className={cn(iconClass, "text-yellow-500")} />
      case "cloud":
        return <Cloud className={cn(iconClass, "text-gray-500")} />
      case "rain":
        return <CloudRain className={cn(iconClass, "text-blue-500")} />
      case "snow":
        return <CloudSnow className={cn(iconClass, "text-blue-300")} />
      default:
        return <Cloud className={cn(iconClass, "text-gray-500")} />
    }
  }

  if (loading) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!weather) {
    return null
  }

  if (temperatureOnly) {
    return (
      <div className={cn("text-sm text-muted-foreground", className)} title={weather.condition}>
        {weather.temperature}°C
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-1.5 text-xs text-muted-foreground", className)} title={weather.condition}>
      {getWeatherIconComponent(weather.icon)}
      <span className="font-medium">{weather.temperature}°C</span>
    </div>
  )
}

