"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ActivityTypeSelector } from "@/components/activities/ActivityTypeSelector"
import { ActivitySwitchDialog } from "@/components/activities/ActivitySwitchDialog"
import { PreActivityConfirmationModal } from "@/components/activities/PreActivityConfirmationModal"
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs"
import type { ActivityType } from "@/lib/activity-templates"
import { testHomes } from "@/lib/test-data"
import { getActiveActivity, clearActiveActivity, type ActiveActivityInfo } from "@/lib/activity-utils"

interface StartActivityPageProps {
  params: Promise<{ id: string }>
}

export default function StartActivityPage({ params }: StartActivityPageProps) {
  const router = useRouter()
  const [homeId, setHomeId] = useState<string>("")
  const [homeCode, setHomeCode] = useState<string>("")
  const [homeName, setHomeName] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [showSwitchDialog, setShowSwitchDialog] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [pendingActivityType, setPendingActivityType] = useState<ActivityType | null>(null)
  const [currentActivity, setCurrentActivity] = useState<ActiveActivityInfo | null>(null)

  useEffect(() => {
    params.then(async (p) => {
      setHomeId(p.id)
      // Load home data
      const home = testHomes.find(h => h.id === p.id)
      if (home) {
        setHomeCode(home.code)
        setHomeName(home.name)
      }
      setLoading(false)
    })
  }, [params])

  const handleSelectActivity = (type: ActivityType) => {
    if (!homeId) return

    // Check if there's an active activity
    const activeActivity = getActiveActivity()
    
    console.log("handleSelectActivity - activeActivity:", activeActivity, "new type:", type, "homeId:", homeId)
    
    if (activeActivity) {
      // Check if it's the same activity (same home and same type)
      if (activeActivity.homeId === homeId && activeActivity.activityType === type) {
        // Same activity - show confirmation modal before continuing
        console.log("Same activity, showing confirmation")
        setPendingActivityType(type)
        setShowConfirmation(true)
        return
      }
      
      // Different activity - show dialog
      console.log("Different activity detected, showing dialog")
      setCurrentActivity(activeActivity)
      setPendingActivityType(type)
      setShowSwitchDialog(true)
    } else {
      // No active activity - show confirmation modal
      console.log("No active activity, showing confirmation")
      setPendingActivityType(type)
      setShowConfirmation(true)
    }
  }

  const handleSaveAndSwitch = () => {
    if (!pendingActivityType || !homeId || !currentActivity) return
    
    // Current activity is already saved in localStorage, just clear it and switch
    clearActiveActivity(currentActivity.storageKey)
    setShowSwitchDialog(false)
    setCurrentActivity(null)
    // Show confirmation modal before navigating
    setShowConfirmation(true)
  }

  const handleDiscardAndSwitch = () => {
    if (!pendingActivityType || !homeId || !currentActivity) return
    
    // Clear current activity without saving
    clearActiveActivity(currentActivity.storageKey)
    setShowSwitchDialog(false)
    setCurrentActivity(null)
    // Show confirmation modal before navigating
    setShowConfirmation(true)
  }

  const handleConfirmAndStart = () => {
    if (!pendingActivityType || !homeId) return
    setShowConfirmation(false)
    router.push(`/homes/${homeId}/activities/${pendingActivityType}/track`)
  }

  const handleCancelSwitch = () => {
    setShowSwitchDialog(false)
    setCurrentActivity(null)
    setPendingActivityType(null)
  }

  const handleCancel = () => {
    if (!homeId) return
    router.push(`/homes/${homeId}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  const breadcrumbs = homeId
    ? [
        { label: "Homes", href: "/homes" },
        { label: homeCode || "Home", href: `/homes/${homeId}` },
        { label: "Start Activity" }
      ]
    : [
        { label: "Homes", href: "/homes" },
        { label: "Start Activity" }
      ]

  return (
    <>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="space-y-6">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbs} />
          
          <ActivityTypeSelector
            homeCode={homeCode}
            homeName={homeName}
            onSelect={handleSelectActivity}
            onCancel={handleCancel}
          />
        </div>
      </div>

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

      {/* Pre-Activity Confirmation Modal */}
      <PreActivityConfirmationModal
        open={showConfirmation}
        onClose={() => {
          setShowConfirmation(false)
          setPendingActivityType(null)
        }}
        onConfirm={handleConfirmAndStart}
        homeCode={homeCode}
        homeName={homeName}
      />
    </>
  )
}

