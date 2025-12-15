"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { CLOSE_ALL_SHEETS_EVENT } from "@/lib/sheet-utils"
import { Cloud, Sun, CloudRain, CloudSnow, Loader2, Droplets, Wind, Sunrise, Sunset, Thermometer, ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

type TemperatureUnit = "C" | "F"

// Enhanced hourly forecast with new data points
interface HourlyForecast {
  time: string
  temperature: number
  apparentTemperature: number
  weatherCode: number
  precipitationProbability: number
  windGusts: number
}

// Daily summary data
interface DailySummary {
  temperatureMax: number
  temperatureMin: number
  sunrise: string
  sunset: string
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
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [tempUnit, setTempUnit] = useState<TemperatureUnit>("C")

  // Load temperature unit preference from localStorage
  useEffect(() => {
    const savedUnit = localStorage.getItem("weather-temp-unit") as TemperatureUnit | null
    if (savedUnit === "C" || savedUnit === "F") {
      setTempUnit(savedUnit)
    }
  }, [])

  // Save temperature unit preference to localStorage
  const handleUnitChange = (useFahrenheit: boolean) => {
    const newUnit: TemperatureUnit = useFahrenheit ? "F" : "C"
    setTempUnit(newUnit)
    localStorage.setItem("weather-temp-unit", newUnit)
  }

  // Convert Celsius to Fahrenheit
  const convertTemp = (celsius: number): number => {
    if (tempUnit === "F") {
      return Math.round((celsius * 9/5) + 32)
    }
    return celsius
  }

  // Close on navigation
  useEffect(() => {
    const handleClose = () => setOpen(false)
    window.addEventListener(CLOSE_ALL_SHEETS_EVENT, handleClose)
    return () => window.removeEventListener(CLOSE_ALL_SHEETS_EVENT, handleClose)
  }, [])

  // Fetch weather when sheet opens
  useEffect(() => {
    if (!open) return
    
    const fetchWeather = async () => {
      setLoading(true)
      try {
        // Updated API call with new parameters
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weather_code,precipitation_probability,apparent_temperature,wind_gusts_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto&forecast_days=2`
        )
        const data = await response.json()
        
        // Parse daily summary
        if (data.daily) {
          setDailySummary({
            temperatureMax: Math.round(data.daily.temperature_2m_max[0]),
            temperatureMin: Math.round(data.daily.temperature_2m_min[0]),
            sunrise: data.daily.sunrise[0],
            sunset: data.daily.sunset[0]
          })
        }
        
        // Parse hourly data
        if (data.hourly) {
          const now = new Date()
          const forecasts: HourlyForecast[] = []
          
          for (let i = 0; i < data.hourly.time.length && forecasts.length < 24; i++) {
            const time = new Date(data.hourly.time[i])
            if (time >= now) {
              forecasts.push({
                time: data.hourly.time[i],
                temperature: Math.round(data.hourly.temperature_2m[i]),
                apparentTemperature: Math.round(data.hourly.apparent_temperature[i]),
                weatherCode: data.hourly.weather_code[i],
                precipitationProbability: data.hourly.precipitation_probability[i] || 0,
                windGusts: Math.round(data.hourly.wind_gusts_10m[i] || 0)
              })
            }
          }
          setHourlyData(forecasts)
        }
      } catch (error) {
        console.error("Error fetching weather:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchWeather()
  }, [open, latitude, longitude])

  const getWeatherIcon = (code: number): string => {
    if (code === 0) return "sun"
    if (code <= 3) return "cloud"
    if (code <= 49) return "cloud"
    if (code <= 69) return "rain"
    if (code <= 86) return "snow"
    return "cloud"
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

  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  const isCurrentHour = (timeStr: string) => {
    const now = new Date()
    const time = new Date(timeStr)
    return now.getHours() === time.getHours() && now.toDateString() === time.toDateString()
  }

  // Check if max wind gusts in next few hours exceed threshold
  const hasHighWinds = hourlyData.slice(0, 6).some(h => h.windGusts >= 40)
  const maxWindGust = Math.max(...hourlyData.slice(0, 6).map(h => h.windGusts), 0)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[65vh] max-h-[500px]">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Weather Forecast — {city}
          </SheetTitle>
        </SheetHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4 overflow-y-auto pb-48 md:pb-6">
            {/* Daily Summary Section */}
            {dailySummary && (
              <div className="grid grid-cols-2 gap-3">
                {/* Temperature Range */}
                <div className="p-3 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Thermometer className="h-3.5 w-3.5" />
                    <span>Today&apos;s Range</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <ArrowUp className="h-4 w-4 text-orange-500" />
                      <span className="text-lg font-bold">{convertTemp(dailySummary.temperatureMax)}°</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ArrowDown className="h-4 w-4 text-blue-500" />
                      <span className="text-lg font-bold">{convertTemp(dailySummary.temperatureMin)}°</span>
                    </div>
                  </div>
                </div>

                {/* Sunrise/Sunset */}
                <div className="p-3 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Sun className="h-3.5 w-3.5" />
                    <span>Daylight</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Sunrise className="h-4 w-4 text-orange-400" />
                      <span className="font-medium">{formatTime(dailySummary.sunrise)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Sunset className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">{formatTime(dailySummary.sunset)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Wind Warning */}
            {hasHighWinds && (
              <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-sm">
                <Wind className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-amber-800 dark:text-amber-300">
                  High wind gusts expected (up to {maxWindGust} km/h)
                </span>
              </div>
            )}

            {/* Hourly Forecast */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Hourly Forecast</h3>
              <div className="overflow-x-auto -mx-4 px-4">
                {hourlyData.length > 0 ? (
                  <div className="flex gap-2">
                    {hourlyData.map((hour, i) => {
                      const icon = getWeatherIcon(hour.weatherCode)
                      const isCurrent = isCurrentHour(hour.time)
                      const hasRainChance = hour.precipitationProbability > 0
                      const highRainChance = hour.precipitationProbability >= 50
                      const feelsLikeDiff = Math.abs(hour.temperature - hour.apparentTemperature)
                      const showFeelsLike = feelsLikeDiff >= 3
                      const highWinds = hour.windGusts >= 40
                      
                      return (
                        <div 
                          key={i} 
                          className={cn(
                            "flex flex-col items-center min-w-[72px] py-3 px-2 rounded-xl transition-colors relative",
                            isCurrent 
                              ? "bg-primary/10 border border-primary/20" 
                              : highRainChance
                              ? "bg-blue-50 dark:bg-blue-950/30"
                              : "bg-muted/50"
                          )}
                        >
                          {/* High wind indicator */}
                          {highWinds && (
                            <div className="absolute -top-1 -right-1">
                              <Wind className="h-3 w-3 text-amber-500" />
                            </div>
                          )}
                          
                          {/* Time */}
                          <span className={cn(
                            "text-xs font-medium",
                            isCurrent ? "text-primary" : "text-muted-foreground"
                          )}>
                            {isCurrent ? "Now" : formatHour(hour.time)}
                          </span>
                          
                          {/* Weather Icon */}
                          <div className="my-1.5">
                            <WeatherIcon icon={icon} className="h-6 w-6" />
                          </div>
                          
                          {/* Temperature */}
                          <span className={cn(
                            "text-sm font-semibold",
                            isCurrent && "text-primary"
                          )}>
                            {convertTemp(hour.temperature)}°
                          </span>
                          
                          {/* Feels Like (if significantly different) */}
                          {showFeelsLike && (
                            <span className="text-[10px] text-muted-foreground">
                              Feels {convertTemp(hour.apparentTemperature)}°
                            </span>
                          )}
                          
                          {/* Precipitation Probability */}
                          {hasRainChance && (
                            <div className={cn(
                              "flex items-center gap-0.5 mt-1",
                              highRainChance ? "text-blue-600 dark:text-blue-400" : "text-blue-400 dark:text-blue-500"
                            )}>
                              <Droplets className="h-3 w-3" />
                              <span className="text-[10px] font-medium">{hour.precipitationProbability}%</span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Cloud className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Unable to load forecast</p>
                  </div>
                )}
              </div>
            </div>

            {/* Legend and Settings */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Droplets className="h-3 w-3 text-blue-500" />
                  <span>Rain chance</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wind className="h-3 w-3 text-amber-500" />
                  <span>High gusts</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800" />
                  <span>50%+ rain</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="temp-unit" className="text-xs text-muted-foreground">°C</Label>
                <Switch
                  id="temp-unit"
                  checked={tempUnit === "F"}
                  onCheckedChange={handleUnitChange}
                />
                <Label htmlFor="temp-unit" className="text-xs text-muted-foreground">°F</Label>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
