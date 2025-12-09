"use client"

import { createContext, useContext, ReactNode } from "react"
import { useJsApiLoader, Libraries } from "@react-google-maps/api"

// Libraries to load with Google Maps
const libraries: Libraries = ["places", "geometry"]

interface GoogleMapsContextType {
  isLoaded: boolean
  loadError: Error | undefined
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  loadError: undefined,
})

export function useGoogleMaps() {
  return useContext(GoogleMapsContext)
}

interface GoogleMapsProviderProps {
  children: ReactNode
}

export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || "",
    libraries,
    // Prevent loading if no API key
    preventGoogleFontsLoading: false,
  })

  // If no API key, still render children but maps won't work
  if (!apiKey) {
    console.warn("Google Maps API key not found. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment.")
    return (
      <GoogleMapsContext.Provider value={{ isLoaded: false, loadError: new Error("No API key") }}>
        {children}
      </GoogleMapsContext.Provider>
    )
  }

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  )
}

// Export a hook to check if Google Maps is available
export function useGoogleMapsReady(): boolean {
  const { isLoaded, loadError } = useGoogleMaps()
  return isLoaded && !loadError
}

