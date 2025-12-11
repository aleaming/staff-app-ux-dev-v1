"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { CLOSE_ALL_SHEETS_EVENT } from "@/lib/sheet-utils"
import { Cloud, Sun, CloudRain, CloudSnow, Loader2, Droplets, Wind } from "lucide-react"
import { cn } from "@/lib/utils"

interface HourlyForecast {
  time: string
  temperature: number
  weatherCode: number
}

interface WeatherDetailsSheetProps {
  latitude: number
  longitude: number
  city?: string
  children: React.ReactNode
}

export function WeatherDetailsSheet({ 
  latitude, 
  longitude, 
  city = "London", 
  children 
}: WeatherDetailsSheetProps) {
  const [open, setOpen] = useState(false)
  const [hourlyData, setHourlyData] = useState<HourlyForecast[]>([])
  const [loading, setLoading] = useState(false)

  // Close on navigation
  useEffect(() => {
    const handleClose = () => setOpen(false)
    window.addEventListener(CLOSE_ALL_SHEETS_EVENT, handleClose)
    return () => window.removeEventListener(CLOSE_ALL_SHEETS_EVENT, handleClose)
  }, [])

  // Fetch hourly weather when sheet opens
  useEffect(() => {
    if (!open) return
    
    const fetchHourly = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weather_code&timezone=auto&forecast_days=2`
        )
        const data = await response.json()
        
        if (data.hourly) {
          // Get next 24 hours from current time
          const now = new Date()
          const forecasts: HourlyForecast[] = []
          
          for (let i = 0; i < data.hourly.time.length && forecasts.length < 24; i++) {
            const time = new Date(data.hourly.time[i])
            if (time >= now) {
              forecasts.push({
                time: data.hourly.time[i],
                temperature: Math.round(data.hourly.temperature_2m[i]),
                weatherCode: data.hourly.weather_code[i]
              })
            }
          }
          setHourlyData(forecasts)
        }
      } catch (error) {
        console.error("Error fetching hourly weather:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchHourly()
  }, [open, latitude, longitude])

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

  const WeatherIcon = ({ icon, className = "h-5 w-5" }: { icon: string; className?: string }) => {
    switch (icon) {
      case "sun":
        return <Sun className={cn(className, "text-yellow-500")} />
      case "rain":
        return <CloudRain className={cn(className, "text-blue-500")} />
      case "snow":
        return <CloudSnow className={cn(className, "text-blue-300")} />
      default:
        return <Cloud className={cn(className, "text-gray-500")} />
    }
  }

  const formatHour = (timeStr: string) => {
    const date = new Date(timeStr)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
  }

  const isCurrentHour = (timeStr: string) => {
    const now = new Date()
    const time = new Date(timeStr)
    return now.getHours() === time.getHours() && now.toDateString() === time.toDateString()
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[50vh] max-h-[400px]">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Hourly Forecast — {city}
          </SheetTitle>
        </SheetHeader>
        
        <div className="overflow-x-auto pb-4 -mx-4 px-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : hourlyData.length > 0 ? (
            <div className="flex gap-2">
              {hourlyData.map((hour, i) => {
                const icon = getWeatherIcon(hour.weatherCode)
                const isCurrent = isCurrentHour(hour.time)
                
                return (
                  <div 
                    key={i} 
                    className={cn(
                      "flex flex-col items-center min-w-[64px] py-3 px-2 rounded-xl transition-colors",
                      isCurrent 
                        ? "bg-primary/10 border border-primary/20" 
                        : "bg-muted/50"
                    )}
                  >
                    <span className={cn(
                      "text-xs font-medium",
                      isCurrent ? "text-primary" : "text-muted-foreground"
                    )}>
                      {isCurrent ? "Now" : formatHour(hour.time)}
                    </span>
                    <div className="my-2">
                      <WeatherIcon icon={icon} className="h-6 w-6" />
                    </div>
                    <span className={cn(
                      "text-sm font-semibold",
                      isCurrent && "text-primary"
                    )}>
                      {hour.temperature}°
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Cloud className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Unable to load forecast</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

