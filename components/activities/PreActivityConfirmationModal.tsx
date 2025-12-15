"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Key,
  Shield,
  AlertTriangle,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  MapPin,
  Bell
} from "lucide-react"
import { getHomeAccessInfo, type HomeAccessInfo } from "@/lib/home-access-data"

interface EntryCodes {
  streetLevel?: string
  apartment?: string
}

interface PreActivityConfirmationModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  homeCode: string
  homeName?: string
  entryCodes?: EntryCodes
}

export function PreActivityConfirmationModal({
  open,
  onClose,
  onConfirm,
  homeCode,
  homeName,
  entryCodes
}: PreActivityConfirmationModalProps) {
  const [accessChecked, setAccessChecked] = useState(false)
  const [alarmChecked, setAlarmChecked] = useState(false)
  const [sensitivityChecked, setSensitivityChecked] = useState(false)
  const [showAccessCode, setShowAccessCode] = useState(false)
  const [showAlarmCode, setShowAlarmCode] = useState(false)
  const [accessInfo, setAccessInfo] = useState<HomeAccessInfo | null>(null)

  // Load access info when modal opens
  useEffect(() => {
    if (open) {
      const info = getHomeAccessInfo(homeCode)
      setAccessInfo(info)
      // Reset checkboxes when modal opens
      setAccessChecked(false)
      setAlarmChecked(false)
      setSensitivityChecked(false)
      setShowAccessCode(false)
      setShowAlarmCode(false)
    }
  }, [open, homeCode])

  const allChecked = accessChecked && alarmChecked && sensitivityChecked

  const handleConfirm = () => {
    if (allChecked) {
      onConfirm()
    }
  }

  if (!accessInfo) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-lg max-h-[85vh] overflow-y-auto mx-auto my-4 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Before You Start</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {homeCode}{homeName && ` • ${homeName}`}
          </p>
        </DialogHeader>

        <div className="space-y-2 py-4">
          {/* Guest Entry Codes Section - Only shown if entry codes exist */}
          {entryCodes && (entryCodes.streetLevel || entryCodes.apartment) && (
            <div className="p-4 rounded-lg border-2 border-primary/30 bg-primary/5" role="region" aria-label="Guest Entry Codes">
              <div className="flex items-center gap-2 mb-3">
                <Key className="h-5 w-5 text-primary" />
                <span className="font-semibold text-base">Guest Entry Codes</span>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800">
                  FOR GUEST
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Test these codes before the guest arrives and send via TextMagic.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {entryCodes.streetLevel && (
                  <div className="px-3 py-2 bg-background rounded border">
                    <span className="text-xs text-muted-foreground">Street Level</span>
                    <p className="font-mono font-bold text-lg">{entryCodes.streetLevel}</p>
                  </div>
                )}
                {entryCodes.apartment && (
                  <div className="px-3 py-2 bg-background rounded border">
                    <span className="text-xs text-muted-foreground">Apartment</span>
                    <p className="font-mono font-bold text-lg">{entryCodes.apartment}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Access Information Section */}
          <div
            className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
              accessChecked 
                ? "border-green-500 bg-green-50 dark:bg-green-950/30" 
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => setAccessChecked(!accessChecked)}
          >
            <div className="flex items-start gap-4">
              <Checkbox
                id="access-check"
                checked={accessChecked}
                onCheckedChange={(checked) => setAccessChecked(checked === true)}
                className="h-7 w-7 mt-0.5"
              />
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-primary" />
                  <label htmlFor="access-check" className="font-semibold text-base cursor-pointer">
                    Access Information
                  </label>
                </div>
                
                <div className="space-y-2 text-sm">
                  {accessInfo.access.entryCode && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Entry Code:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold">
                          {showAccessCode ? accessInfo.access.entryCode : "••••••"}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowAccessCode(!showAccessCode)
                          }}
                        >
                          {showAccessCode ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {accessInfo.access.keyLocation && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Key Location:</span>
                      <span className="font-medium">{accessInfo.access.keyLocation}</span>
                    </div>
                  )}
                  
                  {accessInfo.access.doorInstructions && (
                    <div className="pt-2 border-t">
                      <p className="text-muted-foreground">{accessInfo.access.doorInstructions}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Alarm Information Section */}
          <div
            className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
              alarmChecked 
                ? "border-green-500 bg-green-50 dark:bg-green-950/30" 
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => setAlarmChecked(!alarmChecked)}
          >
            <div className="flex items-start gap-4">
              <Checkbox
                id="alarm-check"
                checked={alarmChecked}
                onCheckedChange={(checked) => setAlarmChecked(checked === true)}
                className="h-7 w-7 mt-0.5"
              />
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <label htmlFor="alarm-check" className="font-semibold text-base cursor-pointer">
                    Alarm Information
                  </label>
                  <Badge 
                    variant="outline" 
                    className={accessInfo.alarm.hasAlarm 
                      ? "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800" 
                      : "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900 dark:text-gray-400"
                    }
                  >
                    {accessInfo.alarm.hasAlarm ? "ACTIVE" : "NONE"}
                  </Badge>
                </div>
                
                {accessInfo.alarm.hasAlarm ? (
                  <div className="space-y-2 text-sm">
                    {accessInfo.alarm.disarmCode && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Disarm Code:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold">
                            {showAlarmCode ? accessInfo.alarm.disarmCode : "••••••"}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowAlarmCode(!showAlarmCode)
                            }}
                          >
                            {showAlarmCode ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {accessInfo.alarm.location && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Keypad Location:</span>
                        <span className="font-medium">{accessInfo.alarm.location}</span>
                      </div>
                    )}
                    
                    {accessInfo.alarm.armCode && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Arm on Exit:</span>
                        <span className="font-mono font-medium">
                          {showAlarmCode ? accessInfo.alarm.armCode : "••••••"}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No alarm system at this property.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sensitivity Notes Section */}
          <div
            className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
              sensitivityChecked 
                ? "border-green-500 bg-green-50 dark:bg-green-950/30" 
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => setSensitivityChecked(!sensitivityChecked)}
          >
            <div className="flex items-start gap-4">
              <Checkbox
                id="sensitivity-check"
                checked={sensitivityChecked}
                onCheckedChange={(checked) => setSensitivityChecked(checked === true)}
                className="h-7 w-7 mt-0.5"
              />
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  <label htmlFor="sensitivity-check" className="font-semibold text-base cursor-pointer">
                    Sensitivity Notes
                  </label>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      {accessInfo.sensitivity.hasDoorman ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-muted-foreground">Doorman building</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {accessInfo.sensitivity.sensitiveNeighbours ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-muted-foreground">Sensitive neighbours</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {accessInfo.sensitivity.sensitiveDoorman ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-muted-foreground">Sensitive doorman</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {accessInfo.sensitivity.neighboursAware ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-muted-foreground">Neighbours aware</span>
                    </div>
                  </div>
                  
                  {accessInfo.sensitivity.notes && (
                    <div className="pt-2 mt-2 border-t">
                      <p className="text-muted-foreground whitespace-pre-line">
                        {accessInfo.sensitivity.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!allChecked}
            className="flex-1"
          >
            {allChecked ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirm & Start
              </>
            ) : (
              "Check all items to continue"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

