"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronDown,
  Eye,
  EyeOff,
  MapPin,
  Wifi,
  Thermometer,
  Package,
  LogOut
} from "lucide-react"
import type { PropertyMetadata } from "@/lib/activity-templates"
import { cn } from "@/lib/utils"

interface PropertyInfoCardProps {
  metadata: PropertyMetadata
  className?: string
  defaultOpen?: boolean
}

export function PropertyInfoCard({ 
  metadata, 
  className,
  defaultOpen = false 
}: PropertyInfoCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [showWifiPasswords, setShowWifiPasswords] = useState(false)

  const sensitivityConfig = {
    low: { label: "Low", variant: "secondary" as const, color: "text-green-600" },
    medium: { label: "Medium", variant: "default" as const, color: "text-yellow-600" },
    high: { label: "High", variant: "destructive" as const, color: "text-red-600" }
  }

  const alertConfig = {
    critical: { icon: AlertTriangle, color: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200" },
    warning: { icon: AlertCircle, color: "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200" },
    info: { icon: Info, color: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200" }
  }

  const sensitivityInfo = sensitivityConfig[metadata.sensitivityLevel]

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={className}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">
                    {metadata.propertyCode} • {metadata.propertyName}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Version {metadata.version}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={sensitivityInfo.variant} className="whitespace-nowrap">
                  {sensitivityInfo.label} Sensitivity
                </Badge>
                <ChevronDown className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform",
                  isOpen && "rotate-180"
                )} />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            {/* Critical Alerts */}
            {metadata.alerts && metadata.alerts.length > 0 && (
              <div className="space-y-2">
                {metadata.alerts.map((alert, index) => {
                  const AlertIcon = alertConfig[alert.type].icon
                  return (
                    <Alert 
                      key={index} 
                      className={cn("border", alertConfig[alert.type].color)}
                    >
                      <AlertIcon className="h-4 w-4" />
                      <AlertDescription className="text-sm font-medium">
                        {alert.message}
                      </AlertDescription>
                    </Alert>
                  )
                })}
              </div>
            )}

            {/* Check Instructions */}
            {metadata.checkInstructions && metadata.checkInstructions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  At Each Activity
                </h4>
                <ul className="space-y-1 ml-6">
                  {metadata.checkInstructions.map((instruction, index) => (
                    <li key={index} className="text-sm text-muted-foreground list-disc">
                      {instruction}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Storage Locations */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Package className="h-4 w-4" />
                Storage Locations
              </h4>
              <ul className="space-y-1 ml-6">
                {metadata.storage.map((location, index) => (
                  <li key={index} className="text-sm text-muted-foreground list-disc">
                    {location}
                  </li>
                ))}
              </ul>
            </div>

            {/* WiFi Networks */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Wifi className="h-4 w-4" />
                  WiFi Networks
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowWifiPasswords(!showWifiPasswords)}
                  className="h-8"
                >
                  {showWifiPasswords ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-1" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-1" />
                      Show Passwords
                    </>
                  )}
                </Button>
              </div>
              <div className="space-y-3">
                {metadata.wifi.map((network, index) => (
                  <div key={index} className="bg-muted/50 rounded-lg p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{network.name}</p>
                      {network.location && (
                        <p className="text-xs text-muted-foreground">{network.location}</p>
                      )}
                    </div>
                    <p className="text-sm font-mono">
                      {showWifiPasswords ? network.password : "••••••••••••"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Heating */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                Heating & Hot Water
              </h4>
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">{metadata.heating.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">{metadata.heating.location}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Summer:</span>
                  <span className="font-medium">{metadata.heating.summerSetting}</span>
                </div>
                <div className="text-sm space-y-1">
                  <p className="text-muted-foreground">Winter Settings:</p>
                  <ul className="ml-4 space-y-0.5">
                    {Object.entries(metadata.heating.winterSettings).map(([key, value]) => (
                      <li key={key} className="text-sm">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>{" "}
                        <span className="font-medium">{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Exit Instructions */}
            {metadata.exitInstructions && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Exit Instructions
                </h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {metadata.exitInstructions.locking && (
                    <div>
                      <span className="font-medium text-foreground">Locking: </span>
                      {metadata.exitInstructions.locking}
                    </div>
                  )}
                  {metadata.exitInstructions.refuse && (
                    <div>
                      <span className="font-medium text-foreground">Refuse: </span>
                      {metadata.exitInstructions.refuse}
                    </div>
                  )}
                  {metadata.exitInstructions.checkout && (
                    <div>
                      <span className="font-medium text-foreground">Checkout: </span>
                      {metadata.exitInstructions.checkout}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

