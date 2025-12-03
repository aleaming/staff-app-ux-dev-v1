"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Shield,
  Camera,
  Navigation,
  AlertCircle,
  CheckCircle2,
  X,
  Eye,
  EyeOff
} from "lucide-react"

interface HomeAccessProps {
  homeCode: string
}

export function HomeAccess({ homeCode }: HomeAccessProps) {
  const [showCodes, setShowCodes] = useState<Record<string, boolean>>({})

  const toggleCode = (key: string) => {
    setShowCodes(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Mock data extracted from the image - in production, this would come from the home data
  const accessInfo = {
    address: "61 Westover Road, SW18 2RF",
    streetName: "Westover Road III",
    coordinates: {
      lat: 51.4500,
      lng: -0.1900
    },
    sensitivity: {
      doormanBuilding: false,
      sensitiveDoorman: false,
      sensitiveNeighbours: false,
      neighboursAware: false,
      sensitiveNotes: "1. HK: do not use anything abrasive nor with bleach in when cleaning the kitchen counter surfaces."
    },
    directions: {
      meetAndGreet: {
        visible: false, // Hidden in image
        tags: ["GUEST"]
      },
      toBuilding: {
        visible: false, // Hidden in image
        tags: ["OPS", "GUEST"]
      }
    },
    burglarAlarm: {
      inUse: true,
      code: "[CODE]", // Hidden in image, but we'll show it when toggled
      location: "Hallway entrance", // Hidden in image
      disarmCode: "[CODE]", // Hidden in image
      armCode: "[CODE]" // Hidden in image
    },
    media: [
      { id: "1", type: "image", caption: "Front door", url: "/placeholder-door.jpg" },
      { id: "2", type: "image", caption: "Alarm keypad - Hallway", url: "/placeholder-keypad-1.jpg" },
      { id: "3", type: "image", caption: "Alarm keypad - Entrance", url: "/placeholder-keypad-2.jpg" }
    ]
  }

  const MaskedField = ({ value, label, fieldKey }: { value: string, label: string, fieldKey: string }) => {
    const isVisible = showCodes[fieldKey]
    return (
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold">
            {isVisible ? value : "••••••"}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => toggleCode(fieldKey)}
          >
            {isVisible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Property Location Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Property Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Map Display */}
          <div className="aspect-video bg-muted rounded-lg overflow-hidden relative border">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${accessInfo.coordinates.lng - 0.01}%2C${accessInfo.coordinates.lat - 0.01}%2C${accessInfo.coordinates.lng + 0.01}%2C${accessInfo.coordinates.lat + 0.01}&layer=mapnik&marker=${accessInfo.coordinates.lat}%2C${accessInfo.coordinates.lng}`}
              className="border-0"
              title="Property Location Map"
            />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Street Name</p>
            <p className="font-medium">{accessInfo.streetName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Address</p>
            <p className="font-medium">{accessInfo.address}</p>
          </div>

          {/* Get Directions Button */}
          <Button
            variant="secondary"
            size="lg"
            className="w-full h-12 text-base font-semibold gap-2"
            onClick={() => {
              const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${accessInfo.coordinates.lat},${accessInfo.coordinates.lng}`
              window.open(mapsUrl, '_blank')
            }}
          >
            <Navigation className="h-5 w-5" />
            Get Directions
          </Button>
        </CardContent>
      </Card>

      {/* Home Sensitivity Section */}
      <Card>
        <CardHeader>
          <CardTitle>Home Sensitivity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Doorman building</span>
              {accessInfo.sensitivity.doormanBuilding ? (
                <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  YES
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800">
                  <X className="h-3 w-3 mr-1" />
                  NO
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Sensitive doorman</span>
              {accessInfo.sensitivity.sensitiveDoorman ? (
                <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  YES
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800">
                  <X className="h-3 w-3 mr-1" />
                  NO
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Sensitive neighbours</span>
              {accessInfo.sensitivity.sensitiveNeighbours ? (
                <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  YES
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800">
                  <X className="h-3 w-3 mr-1" />
                  NO
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Neighbours aware</span>
              {accessInfo.sensitivity.neighboursAware ? (
                <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  YES
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800">
                  <X className="h-3 w-3 mr-1" />
                  NO
                </Badge>
              )}
            </div>
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm font-semibold mb-2">Sensitive notes</p>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {accessInfo.sensitivity.sensitiveNotes}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Home Directions Section */}
      <Card>
        <CardHeader>
          <CardTitle>Home Directions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">Meet And Greet</h3>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                GUEST
              </Badge>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Instructions</p>
                <p className="text-sm">Contact host for meet and greet instructions</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">To Building</h3>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                OPS
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                GUEST
              </Badge>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Directions</p>
                <p className="text-sm">Enter through main entrance. Use key code to access building.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Burglar Alarm Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Burglar Alarm
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">In Use</span>
            {accessInfo.burglarAlarm.inUse ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                YES
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                <X className="h-3 w-3 mr-1" />
                NO
              </Badge>
            )}
          </div>

          <MaskedField
            value={accessInfo.burglarAlarm.code}
            label="Code"
            fieldKey="alarmCode"
          />

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Location</span>
            <span className="font-semibold">{accessInfo.burglarAlarm.location}</span>
          </div>

          <div className="pt-4 border-t space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Additional Codes
            </h4>
            <MaskedField
              value={accessInfo.burglarAlarm.disarmCode}
              label="Disarm"
              fieldKey="disarmCode"
            />
            <MaskedField
              value={accessInfo.burglarAlarm.armCode}
              label="Arm"
              fieldKey="armCode"
            />
          </div>
        </CardContent>
      </Card>

      {/* Media Section */}
      <Card>
        <CardHeader>
          <CardTitle>Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {accessInfo.media.map((item) => (
              <div key={item.id} className="relative aspect-square bg-muted rounded-lg overflow-hidden group">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 dark:bg-black/70 text-background p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs truncate">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

