"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { GoogleMap, Marker, InfoWindow, Polyline } from "@react-google-maps/api"
import { useGoogleMaps } from "./GoogleMapsProvider"
import { Home as HomeIcon, Target, MapPin } from "lucide-react"
import Link from "next/link"

// Map container style
const containerStyle = {
  width: "100%",
  height: "100%",
}

// Default map options
const defaultMapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  gestureHandling: "greedy",
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ],
}

// Marker types
export interface HomeMarker {
  id: string
  type: "home"
  lat: number
  lng: number
  code: string
  name?: string
  status?: "available" | "occupied" | "maintenance"
  address?: string
}

export interface ActivityMarker {
  id: string
  type: "activity"
  lat: number
  lng: number
  title: string
  homeCode: string
  homeName?: string
  status?: "pending" | "in-progress" | "completed" | "cancelled"
  activityType?: string
  label?: string // For numbered markers
}

export type MapMarker = HomeMarker | ActivityMarker

interface GoogleMapViewProps {
  markers?: MapMarker[]
  center?: { lat: number; lng: number }
  zoom?: number
  className?: string
  onMarkerClick?: (marker: MapMarker) => void
  showInfoWindows?: boolean
  fitBoundsToMarkers?: boolean
  singleMarkerMode?: boolean // For MapSheet - just show a pin
  routeWaypoints?: { lat: number; lng: number }[] // For drawing route polyline
}

// Get the computed CSS variable value for use in SVG strings
// Colors are defined in globals.css under --map-marker-* variables
function getCssVariableValue(varName: string): string {
  if (typeof window === "undefined") {
    // Fallback values for SSR
    const fallbacks: Record<string, string> = {
      "--map-marker-red": "#ef4444",
      "--map-marker-green": "#22c55e",
      "--map-marker-yellow": "#eab308",
      "--map-marker-blue": "#3b82f6",
      "--map-marker-orange": "#f97316",
      "--map-stroke": "#9a7c5c",
    }
    return fallbacks[varName] || "#3b82f6"
  }
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || "#3b82f6"
}

// Get marker color based on type and status
function getMarkerColor(marker: MapMarker): string {
  if (marker.type === "home") {
    switch (marker.status) {
      case "occupied":
        return getCssVariableValue("--map-marker-red")
      case "available":
        return getCssVariableValue("--map-marker-green")
      case "maintenance":
        return getCssVariableValue("--map-marker-yellow")
      default:
        return getCssVariableValue("--map-marker-blue")
    }
  } else {
    switch (marker.status) {
      case "pending":
        return getCssVariableValue("--map-marker-blue")
      case "in-progress":
        return getCssVariableValue("--map-marker-orange")
      case "completed":
        return getCssVariableValue("--map-marker-green")
      case "cancelled":
        return getCssVariableValue("--map-marker-red")
      default:
        return getCssVariableValue("--map-marker-blue")
    }
  }
}

// Create SVG marker icon with optional number label
function createMarkerIcon(marker: MapMarker): google.maps.Icon {
  const color = getMarkerColor(marker)
  const isHome = marker.type === "home"
  const label = marker.type === "activity" ? (marker as ActivityMarker).label : undefined
  
  // If we have a label, create a numbered marker
  if (label) {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
        <path fill="${color}" stroke="#ffffff" stroke-width="2" d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 24 16 24s16-15.163 16-24C32 7.163 24.837 0 16 0z"/>
        <circle fill="#ffffff" cx="16" cy="14" r="10"/>
        <text x="16" y="18" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="12" font-weight="bold">${label}</text>
      </svg>
    `
    
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
      scaledSize: new google.maps.Size(32, 40),
      anchor: new google.maps.Point(16, 40),
    }
  }
  
  // SVG path for marker pin (default)
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
      <path fill="${color}" stroke="#ffffff" stroke-width="2" d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 24 16 24s16-15.163 16-24C32 7.163 24.837 0 16 0z"/>
      <circle fill="#ffffff" cx="16" cy="14" r="6"/>
      ${isHome 
        ? '<path fill="' + color + '" d="M16 10l-4 4h2v3h4v-3h2l-4-4z"/>'
        : '<circle fill="' + color + '" cx="16" cy="14" r="3"/>'
      }
    </svg>
  `
  
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(32, 40),
    anchor: new google.maps.Point(16, 40),
  }
}

// Get polyline options for route display (needs to be a function to resolve CSS variable)
function getPolylineOptions(): google.maps.PolylineOptions {
  return {
    strokeColor: getCssVariableValue("--map-stroke"),
    strokeOpacity: 0.8,
    strokeWeight: 3,
    geodesic: true,
  }
}

export function GoogleMapView({
  markers = [],
  center = { lat: 51.5074, lng: -0.1278 }, // London default
  zoom = 13,
  className = "",
  onMarkerClick,
  showInfoWindows = true,
  fitBoundsToMarkers = false,
  singleMarkerMode = false,
  routeWaypoints = [],
}: GoogleMapViewProps) {
  const { isLoaded, loadError } = useGoogleMaps()
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  const mapRef = useRef<google.maps.Map | null>(null)

  // Fit bounds to markers when they change
  useEffect(() => {
    if (mapRef.current && fitBoundsToMarkers && markers.length > 1) {
      const bounds = new google.maps.LatLngBounds()
      markers.forEach((marker) => {
        bounds.extend({ lat: marker.lat, lng: marker.lng })
      })
      mapRef.current.fitBounds(bounds, 50) // 50px padding
    }
  }, [markers, fitBoundsToMarkers])

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
    
    // Fit bounds on initial load if needed
    if (fitBoundsToMarkers && markers.length > 1) {
      const bounds = new google.maps.LatLngBounds()
      markers.forEach((marker) => {
        bounds.extend({ lat: marker.lat, lng: marker.lng })
      })
      map.fitBounds(bounds, 50)
    }
  }, [markers, fitBoundsToMarkers])

  const onUnmount = useCallback(() => {
    mapRef.current = null
  }, [])

  const handleMarkerClick = useCallback((marker: MapMarker) => {
    if (showInfoWindows) {
      setSelectedMarker(marker)
    }
    onMarkerClick?.(marker)
  }, [showInfoWindows, onMarkerClick])

  // Loading state
  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <MapPin className="h-8 w-8 animate-pulse" />
          <span className="text-sm">Loading map...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (loadError) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <MapPin className="h-8 w-8 text-destructive" />
          <span className="text-sm">Failed to load map</span>
        </div>
      </div>
    )
  }

  // Calculate center from markers if not provided
  const effectiveCenter = markers.length === 1 
    ? { lat: markers[0].lat, lng: markers[0].lng }
    : markers.length > 1 && !center
    ? {
        lat: markers.reduce((sum, m) => sum + m.lat, 0) / markers.length,
        lng: markers.reduce((sum, m) => sum + m.lng, 0) / markers.length,
      }
    : center

  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={effectiveCenter}
        zoom={singleMarkerMode ? 16 : zoom}
        options={defaultMapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={() => setSelectedMarker(null)}
      >
        {/* Route Polyline */}
        {routeWaypoints.length > 1 && (
          <Polyline
            path={routeWaypoints}
            options={getPolylineOptions()}
          />
        )}

        {/* Markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            icon={createMarkerIcon(marker)}
            onClick={() => handleMarkerClick(marker)}
            title={marker.type === "home" ? marker.code : marker.title}
          />
        ))}

        {/* Info Window */}
        {selectedMarker && showInfoWindows && (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={() => setSelectedMarker(null)}
            options={{
              pixelOffset: new google.maps.Size(0, -40),
            }}
          >
            <div className="p-1 min-w-[150px]">
              {selectedMarker.type === "home" ? (
                <Link href={`/homes/${selectedMarker.id.replace("home-", "")}`} className="block">
                  <div className="font-semibold text-sm text-gray-900">
                    {(selectedMarker as HomeMarker).code}
                  </div>
                  {(selectedMarker as HomeMarker).name && (
                    <div className="text-xs text-gray-600">
                      {(selectedMarker as HomeMarker).name}
                    </div>
                  )}
                  {(selectedMarker as HomeMarker).address && (
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {(selectedMarker as HomeMarker).address}
                    </div>
                  )}
                  <div className="text-xs text-blue-600 mt-1 hover:underline">
                    View Home →
                  </div>
                </Link>
              ) : (
                <Link href={`/activities/${selectedMarker.id.replace("activity-", "")}`} className="block">
                  <div className="font-semibold text-sm text-gray-900">
                    {(selectedMarker as ActivityMarker).title}
                  </div>
                  <div className="text-xs text-gray-600">
                    {(selectedMarker as ActivityMarker).homeCode}
                    {(selectedMarker as ActivityMarker).homeName && 
                      ` • ${(selectedMarker as ActivityMarker).homeName}`
                    }
                  </div>
                  <div className="text-xs text-blue-600 mt-1 hover:underline">
                    View Activity →
                  </div>
                </Link>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  )
}
