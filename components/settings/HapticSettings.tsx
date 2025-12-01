"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Smartphone } from "lucide-react"
import { useHapticFeedback } from "@/components/haptic/HapticProvider"

export function HapticSettings() {
  const { isEnabled, toggleEnabled, isSupported, trigger } = useHapticFeedback()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Haptic Feedback
        </CardTitle>
        <CardDescription>
          Enable vibration feedback for interactions
          {!isSupported && " (Not supported on this device)"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-sm font-medium">Enable Haptics</div>
            <div className="text-sm text-muted-foreground">
              Get tactile feedback when interacting with the app
            </div>
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={toggleEnabled}
            disabled={!isSupported}
          />
        </div>
        
        {isSupported && isEnabled && (
          <div className="pt-2 border-t">
            <Button
              variant="outline"
              onClick={() => trigger('medium')}
              className="w-full"
            >
              Test Haptic Feedback
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

