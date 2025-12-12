"use client"

import { use, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useData } from "@/lib/data/DataProvider"
import { MeetGreetReportForm } from "@/components/activities/MeetGreetReportForm"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface MeetGreetReportPageProps {
  params: Promise<{ id: string }>
}

function ReportSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="space-y-4 max-w-2xl mx-auto">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  )
}

function HomeNotFound() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <AlertTriangle className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Home Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The home you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/activities">Back to Activities</Link>
        </Button>
      </div>
    </div>
  )
}

export default function MeetGreetReportPage({ params }: MeetGreetReportPageProps) {
  const { id: homeId } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { homes, isLoading } = useData()
  
  const activityId = searchParams.get("activityId") || undefined
  const bookingId = searchParams.get("bookingId") || undefined
  
  // Get city from search params or default
  const city = searchParams.get("city") || undefined

  if (isLoading) {
    return <ReportSkeleton />
  }

  const home = homes.find(h => h.id === homeId)

  if (!home) {
    return <HomeNotFound />
  }

  const handleCancel = () => {
    // Navigate back to the activity tracker or activity detail
    if (activityId) {
      router.push(`/activities/${activityId}`)
    } else {
      router.push(`/homes/${homeId}/activities/meet-greet/track${bookingId ? `?bookingId=${bookingId}` : ''}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={handleCancel}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <MeetGreetReportForm
          homeId={homeId}
          homeCode={home.code}
          homeName={home.name}
          activityId={activityId}
          bookingId={bookingId}
          city={city || home.market}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}

