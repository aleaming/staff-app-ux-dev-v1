"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, ExternalLink, Copy, Check } from "lucide-react"
import { useState, useEffect } from "react"
import { CLOSE_ALL_SHEETS_EVENT } from "@/lib/sheet-utils"
import { GoogleMapView, HomeMarker } from "./GoogleMapView"

interface MapSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  homeCode: string
  homeName?: string
  address: string
  city?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export function MapSheet({
  open,
  onOpenChange,
  homeCode,
  homeName,
  address,
  city = "London",
  coordinates
}: MapSheetProps) {
  const [copiedAddress, setCopiedAddress] = useState(false)

  // Close sheet when navigation occurs
  useEffect(() => {
    const handleClose = () => onOpenChange(false)
    window.addEventListener(CLOSE_ALL_SHEETS_EVENT, handleClose)
    return () => window.removeEventListener(CLOSE_ALL_SHEETS_EVENT, handleClose)
  }, [onOpenChange])
  
  // Use provided coordinates or fallback to London center
  const lat = coordinates?.lat ?? 51.5074
  const lng = coordinates?.lng ?? -0.1278
  
  // Generate Google Maps and Apple Maps links
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  const appleMapsUrl = `https://maps.apple.com/?q=${lat},${lng}`
  
  const fullAddress = `${address}, ${city}`

  // Create marker for the home location
  const marker: HomeMarker = {
    id: `home-${homeCode}`,
    type: "home",
    lat,
    lng,
    code: homeCode,
    name: homeName,
    address: fullAddress,
  }
  
  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(fullAddress)
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 2000)
    } catch (error) {
      console.error("Failed to copy address:", error)
    }
  }
  
  const handleGetDirections = () => {
    // Detect if iOS/Safari to use Apple Maps, otherwise Google Maps
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    
    if (isIOS || isSafari) {
      window.open(appleMapsUrl, '_blank')
    } else {
      window.open(googleMapsUrl, '_blank')
    }
  }
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[77vh] max-h-[77vh] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-4 sm:p-6 pb-4 border-b">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-lg sm:text-xl mb-1">
                  {homeCode} {homeName && `• ${homeName}`}
                </SheetTitle>
                <p className="text-sm text-muted-foreground break-words">
                  {fullAddress}
                </p>
              </div>
            </div>
          </SheetHeader>

          {/* Google Map Container */}
          <div className="flex-1 overflow-hidden relative bg-muted">
            <GoogleMapView
              markers={[marker]}
              center={{ lat, lng }}
              zoom={16}
              singleMarkerMode
              showInfoWindows={false}
              className="absolute inset-0"
            />
            
            {/* Map overlay badge */}
            <div className="absolute top-4 left-4 z-10">
              <Badge variant="secondary" className="bg-background/95 backdrop-blur shadow-lg">
                <MapPin className="h-3 w-3 mr-1" />
                {homeCode}
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 sm:p-6 pt-4 border-t bg-background space-y-3">
            <Button
              onClick={handleGetDirections}
              className="w-full"
              size="lg"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Get Directions
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleCopyAddress}
                variant="outline"
                className="w-full"
              >
                {copiedAddress ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Address
                  </>
                )}
              </Button>
              
              <Button
                onClick={() => window.open(`https://www.google.com/maps/@${lat},${lng},15z`, '_blank')}
                variant="outline"
                className="w-full"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in Maps
              </Button>
            </div>
            
            <p className="text-xs text-center text-muted-foreground pt-2">
              Coordinates: {lat.toFixed(6)}, {lng.toFixed(6)}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
