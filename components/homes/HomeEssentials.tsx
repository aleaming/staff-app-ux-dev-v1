"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Wifi, 
  Copy, 
  CheckCircle2, 
  X, 
  Home,
  Users,
  Droplets,
  Thermometer,
  Lock,
  Mail,
  Trash2,
  ShoppingBag,
  Eye,
  EyeOff
} from "lucide-react"

interface HomeEssentialsProps {
  homeCode: string
}

export function HomeEssentials({ homeCode }: HomeEssentialsProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  // Mock data - in production, this would come from the home data
  const essentials = {
    wifi: {
      networkName: "61 Westover",
      password: "[PASSWORD]"
    },
    homeOverview: {
      bedrooms: 4,
      bathrooms: 4,
      sleeps: 6,
      maxSleeps: 6
    },
    restrictions: {
      babiesAllowed: true,
      childrenAllowed: true,
      toddlersAllowed: true,
      petsAllowed: false,
      amberAutomationAllowed: true,
      notes: "Type of home: primary residence / family home // LMB: double check // Extended stays: availability permitting // Flexible schedule: no only during school holidays // Contact: Kathryn on kathryn.cripps@knightfrank.com or +4407825734445 // AM: Charlie // Extras: beautiful interiors // Families: all ages are welcome // Pets: No // Flex rate: NO"
    },
    instructions: {
      checkout: "When checking out of the home at the end of your stay, please ensure that the outhouse at the back of the garden has been locked and the keys are in their place to the left of the kitchen basin. Close and lock the garden doors as well as any windows in the home. Leave one set of keys on the kitchen island counter. Set the alarm on your way out and double lock the front door behind you. It is important the front door is double locked, for insurance purposes. Post the second set of keys through the letterbox in the envelope provided.",
      heatingAndHotWater: {
        hotWater: "The hot water in this home is on constant. The boiler is located in the attic space above the second bedroom.",
        heating: "The heating in this home is on a schedule and can be adjusted by the thermostats around the home. Each thermostat controls that zone's heating.",
        summerTemperatures: {
          basement: "6-11AM = 18.5 degrees; 6-9PM = 18.5 degrees",
          kitchenPlayroom: "6-10AM = 19.5 degrees; 3:20-7PM = 19.5 degrees",
          groundFloor: "7-8:30AM = 19 degrees; 4-9:45PM = 19 degrees",
          firstFloor: "6-9AM = 19 degrees; 4:30-10:30PM = 19 degrees",
          masterEnsuite: "6:30-8:30AM = 19 degrees; 5:30-10PM = 19 degrees",
          secondFloor: "6:30-8AM = 19 degrees; 5-10PM = 19 degrees"
        },
        winterTemperatures: "In winter, the temperatures will be 1/2 degrees warmer, and will be set to the same schedule as above."
      },
      locking: "When leaving the home during your stay, please ensure that the outhouse at the back of the garden has been locked and the keys are in their place to the left of the kitchen basin. Close and lock the garden doors as well as any windows in the home. Set the alarm on your way out and double lock the front door behind you. It is important the front door is double locked, for insurance purposes.",
      mail: "Should any mail come for your host during the stay, please place it in the desk drawers in the study.",
      refuse: {
        collectionSchedule: "Refuse and recycling is collected on Thursday mornings from the pavement at the end of the path. On the morning of collection days, please take the securely tied up backs from the bin cupboard in the front garden and place them on the pavement at the end of the path.",
        storage: "Outside of collection days, please store bags in the bin cupboard at the front of the home. Spare refuse and recycling sacks can be found in the cupboard below the kitchen basin. Black sacks for the regular waste, and clear/orange sacks for the recycling."
      },
      consumables: "You are welcome to use any of the kitchen and household basics."
    }
  }

  return (
    <div className="space-y-6">
      {/* WiFi Network Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            WiFi Network
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Network Name</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(essentials.wifi.networkName, "network")}
              >
                <Copy className="h-3 w-3 mr-1" />
                {copiedField === "network" ? "Copied!" : "Copy"}
              </Button>
            </div>
            <p className="font-mono font-semibold">{essentials.wifi.networkName}</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Password</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(essentials.wifi.password, "password")}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  {copiedField === "password" ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
            <p className="font-mono font-semibold">
              {showPassword ? essentials.wifi.password : "••••••••••"}
            </p>
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>Connect:</strong> The WiFi network name is {essentials.wifi.networkName} and the password is {showPassword ? essentials.wifi.password : "••••••••••"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Home Overview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Home Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">No. of Bedrooms</p>
              <p className="text-2xl font-bold">{essentials.homeOverview.bedrooms}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">No. of Bathrooms</p>
              <p className="text-2xl font-bold">{essentials.homeOverview.bathrooms}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sleeps</p>
              <p className="text-2xl font-bold">{essentials.homeOverview.sleeps}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Max. Sleeps</p>
              <p className="text-2xl font-bold">{essentials.homeOverview.maxSleeps}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Restrictions Section */}
      <Card>
        <CardHeader>
          <CardTitle>Restrictions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Babies Allowed</span>
              {essentials.restrictions.babiesAllowed ? (
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
              <span className="text-sm">Children Allowed</span>
              {essentials.restrictions.childrenAllowed ? (
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
              <span className="text-sm">Toddlers Allowed</span>
              {essentials.restrictions.toddlersAllowed ? (
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
              <span className="text-sm">Pets Allowed</span>
              {essentials.restrictions.petsAllowed ? (
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
              <span className="text-sm">Amber Automation Allowed</span>
              {essentials.restrictions.amberAutomationAllowed ? (
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
            <p className="text-sm font-semibold mb-2">Restriction notes</p>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {essentials.restrictions.notes}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Instructions Section */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Checkout */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold">Checkout</h3>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                GUEST
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {essentials.instructions.checkout}
            </p>
          </div>

          {/* Heating And Hot Water */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold">Heating And Hot Water</h3>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                OPS
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                GUEST
              </Badge>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div>
                <p className="font-medium mb-1">Hot Water:</p>
                <p>{essentials.instructions.heatingAndHotWater.hotWater}</p>
              </div>
              <div>
                <p className="font-medium mb-1">Heating:</p>
                <p>{essentials.instructions.heatingAndHotWater.heating}</p>
              </div>
              <div>
                <p className="font-medium mb-2">Summer Temperatures:</p>
                <p className="mb-2">In summer, the temperature will be set lower 1/2 degrees lower than in winter, you can expect the timings to be as follows:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Basement: {essentials.instructions.heatingAndHotWater.summerTemperatures.basement}</li>
                  <li>Kitchen & Playroom: {essentials.instructions.heatingAndHotWater.summerTemperatures.kitchenPlayroom}</li>
                  <li>Ground Floor: {essentials.instructions.heatingAndHotWater.summerTemperatures.groundFloor}</li>
                  <li>First Floor: {essentials.instructions.heatingAndHotWater.summerTemperatures.firstFloor}</li>
                  <li>Master Ensuite: {essentials.instructions.heatingAndHotWater.summerTemperatures.masterEnsuite}</li>
                  <li>Second Floor: {essentials.instructions.heatingAndHotWater.summerTemperatures.secondFloor}</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-1">Winter Temperatures:</p>
                <p>{essentials.instructions.heatingAndHotWater.winterTemperatures}</p>
              </div>
            </div>
          </div>

          {/* Locking */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold">Locking</h3>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                OPS
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                GUEST
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {essentials.instructions.locking}
            </p>
          </div>

          {/* Mail */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold">Mail</h3>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                OPS
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                GUEST
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {essentials.instructions.mail}
            </p>
          </div>

          {/* Refuse */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold">Refuse</h3>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                OPS
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                GUEST
              </Badge>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div>
                <p className="font-medium mb-1">Collection Schedule:</p>
                <p>{essentials.instructions.refuse.collectionSchedule}</p>
              </div>
              <div>
                <p className="font-medium mb-1">Storage:</p>
                <p>{essentials.instructions.refuse.storage}</p>
              </div>
            </div>
          </div>

          {/* Consumables */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold">Consumables</h3>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                GUEST
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {essentials.instructions.consumables}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

