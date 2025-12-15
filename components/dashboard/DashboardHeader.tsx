"use client"

import { useEffect, useState } from "react"
import { Calendar, Cloud, Sun, CloudRain, CloudSnow } from "lucide-react"
import { WeatherDetailsSheet } from "./WeatherDetailsSheet"

interface WeatherData {
  temperature: number
  condition: string
  icon: string
}

interface DashboardHeaderProps {
  userName?: string
  latitude?: number
  longitude?: number
}

export function DashboardHeader({ 
  userName = "User",
  latitude = 51.5074,
  longitude = -0.1278
}: DashboardHeaderProps) {
  const [greeting, setGreeting] = useState("")
  const [currentDate, setCurrentDate] = useState("")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(true)

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

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setWeatherLoading(true)
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`
        )
        const data = await response.json()

        if (data.current) {
          const weatherCode = data.current.weather_code
          setWeather({
            temperature: Math.round(data.current.temperature_2m),
            condition: getWeatherCondition(weatherCode),
            icon: getWeatherIcon(weatherCode)
          })
        }
      } catch (error) {
        console.error("Error fetching weather:", error)
        setWeather({
          temperature: 15,
          condition: "Partly Cloudy",
          icon: "cloud"
        })
      } finally {
        setWeatherLoading(false)
      }
    }

    fetchWeather()
  }, [latitude, longitude])

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
    if (code === 1) return "Mostly Clear"
    if (code === 2) return "Partly Cloudy"
    if (code === 3) return "Overcast"
    if (code <= 49) return "Foggy"
    if (code <= 59) return "Drizzle"
    if (code <= 69) return "Rainy"
    if (code <= 86) return "Snowy"
    if (code <= 99) return "Stormy"
    return "Unknown"
  }

  const WeatherIcon = ({ icon }: { icon: string }) => {
    const iconClass = "h-4 w-4 flex-shrink-0"
    switch (icon) {
      case "sun":
        return <Sun className={`${iconClass} text-yellow-500`} />
      case "rain":
        return <CloudRain className={`${iconClass} text-blue-500`} />
      case "snow":
        return <CloudSnow className={`${iconClass} text-blue-300`} />
      default:
        return <Cloud className={`${iconClass} text-gray-500`} />
    }
  }

  return (
    <div>
      {/* Welcome Section */}
      <h1 className="text-2xl sm:text-3xl font-bold break-words">
        {greeting}, {userName}
      </h1>
      <div className="text-sm sm:text-base text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 flex-shrink-0" />
          <span className="break-words">{currentDate}</span>
        </div>
        
        {/* Weather Info */}
        {!weatherLoading && weather && (
          <>
            <span className="text-muted-foreground/50">•</span>
            <WeatherDetailsSheet latitude={latitude} longitude={longitude} city="London">
              <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <WeatherIcon icon={weather.icon} />
                <span className="font-medium">{weather.temperature}°C</span>
                <span className="hidden sm:inline text-muted-foreground/80">{weather.condition}</span>
              </button>
            </WeatherDetailsSheet>
          </>
        )}
        
        {weatherLoading && (
          <>
            <span className="text-muted-foreground/50">•</span>
            <div className="flex items-center gap-1.5">
              <Cloud className="h-4 w-4 animate-pulse text-gray-400" />
              <span className="text-muted-foreground/60">...</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
