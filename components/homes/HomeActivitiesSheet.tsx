"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ActivityTypeSelector } from "@/components/activities/ActivityTypeSelector"
import { ActivitySwitchDialog } from "@/components/activities/ActivitySwitchDialog"
import { getActiveActivity, clearActiveActivity, type ActiveActivityInfo } from "@/lib/activity-utils"
import type { ActivityType } from "@/lib/activity-templates"
import { Target } from "lucide-react"

interface HomeActivitiesSheetProps {
  homeId: string
  homeCode: string
  homeName?: string
  variant?: "default" | "quick-action"
  buttonText?: string
}

export function HomeActivitiesSheet({ 
  homeId, 
  homeCode, 
  homeName,
  variant = "default",
  buttonText = "Home Activities"
}: HomeActivitiesSheetProps) {
  const router = useRouter()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [showSwitchDialog, setShowSwitchDialog] = useState(false)
  const [pendingActivityType, setPendingActivityType] = useState<ActivityType | null>(null)
  const [currentActivity, setCurrentActivity] = useState<ActiveActivityInfo | null>(null)

  const handleSelectActivity = (type: ActivityType) => {
    if (!homeId) return

    // Check if there's an active activity
    const activeActivity = getActiveActivity()
    
    if (activeActivity) {
      // Check if it's the same activity (same home and same type)
      if (activeActivity.homeId === homeId && activeActivity.activityType === type) {
        // Same activity - just navigate to it
        setSheetOpen(false)
        router.push(`/homes/${homeId}/activities/${type}/track`)
        return
      }
      
      // Different activity - show dialog
      setCurrentActivity(activeActivity)
      setPendingActivityType(type)
      setShowSwitchDialog(true)
    } else {
      // No active activity - proceed directly
      setSheetOpen(false)
      router.push(`/homes/${homeId}/activities/${type}/track`)
    }
  }

  const handleSaveAndSwitch = () => {
    if (!pendingActivityType || !homeId || !currentActivity) return
    
    // Current activity is already saved in localStorage, just clear it and switch
    clearActiveActivity(currentActivity.storageKey)
    setShowSwitchDialog(false)
    setCurrentActivity(null)
    setPendingActivityType(null)
    setSheetOpen(false)
    router.push(`/homes/${homeId}/activities/${pendingActivityType}/track`)
  }

  const handleDiscardAndSwitch = () => {
    if (!pendingActivityType || !homeId || !currentActivity) return
    
    // Clear current activity without saving
    clearActiveActivity(currentActivity.storageKey)
    setShowSwitchDialog(false)
    setCurrentActivity(null)
    setPendingActivityType(null)
    setSheetOpen(false)
    router.push(`/homes/${homeId}/activities/${pendingActivityType}/track`)
  }

  const handleCancelSwitch = () => {
    setShowSwitchDialog(false)
    setCurrentActivity(null)
    setPendingActivityType(null)
  }

  const handleCancel = () => {
    setSheetOpen(false)
  }

  return (
    <>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          {variant === "quick-action" ? (
            <Button variant="outline" className="w-full justify-start">
              <Target className="h-4 w-4 mr-2" />
              {buttonText}
            </Button>
          ) : (
            <Button size="lg" variant="secondary" className="w-full text-lg py-6">
              <Target className="h-5 w-5 mr-2" />
              {buttonText}
            </Button>
          )}
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[calc(100vh-8rem)] max-h-[calc(100vh-4rem)] overflow-y-auto pb-48">
          <SheetHeader className="mb-4">
            <SheetTitle className="sr-only">{buttonText}</SheetTitle>
          </SheetHeader>
          <ActivityTypeSelector
            homeCode={homeCode}
            homeName={homeName}
            onSelect={handleSelectActivity}
            onCancel={handleCancel}
          />
        </SheetContent>
      </Sheet>

      {showSwitchDialog && currentActivity && pendingActivityType && (
        <ActivitySwitchDialog
          open={showSwitchDialog}
          currentActivity={currentActivity}
          newActivityType={pendingActivityType}
          newHomeCode={homeCode}
          newHomeName={homeName}
          onSaveAndSwitch={handleSaveAndSwitch}
          onDiscardAndSwitch={handleDiscardAndSwitch}
          onCancel={handleCancelSwitch}
        />
      )}
    </>
  )
}

