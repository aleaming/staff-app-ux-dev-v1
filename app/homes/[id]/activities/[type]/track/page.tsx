"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ActivityTracker } from "@/components/activities/ActivityTracker"
import { testHomes } from "@/lib/test-data"
import type { ActivityType } from "@/lib/activity-templates"

interface TrackActivityPageProps {
  params: Promise<{ id: string; type: string }>
}

export default function TrackActivityPage({ params }: TrackActivityPageProps) {
  const searchParams = useSearchParams()
  const [homeId, setHomeId] = useState<string>("")
  const [activityType, setActivityType] = useState<ActivityType | null>(null)
  const [homeCode, setHomeCode] = useState<string>("")
  const [homeName, setHomeName] = useState<string | undefined>(undefined)
  const [bookingId, setBookingId] = useState<string | undefined>(undefined)

  useEffect(() => {
    params.then(async (p) => {
      setHomeId(p.id)

      // Validate activity type
      const validTypes: ActivityType[] = [
        "adhoc",
        "deprovisioning",
        "meet-greet",
        "maid-service",
        "provisioning",
        "turn"
      ]

      if (validTypes.includes(p.type as ActivityType)) {
        setActivityType(p.type as ActivityType)
      }

      // Load home data
      const home = testHomes.find(h => h.id === p.id)
      if (home) {
        setHomeCode(home.code)
        setHomeName(home.name)
      }

      // Get bookingId from query params
      const bookingIdParam = searchParams.get("bookingId")
      if (bookingIdParam) {
        setBookingId(bookingIdParam)
      }
    })
  }, [params, searchParams])

  if (!homeId || !activityType) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="text-center">
          <p>Loading activity tracker...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <ActivityTracker
        activityType={activityType}
        homeId={homeId}
        homeCode={homeCode}
        homeName={homeName}
        bookingId={bookingId}
      />
    </div>
  )
}

