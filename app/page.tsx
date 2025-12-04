import { Suspense } from "react"
import DashboardContent from "./DashboardContent"
import { Skeleton } from "@/components/ui/skeleton"

function DashboardFallback() {
  return (
    <div className="container mx-auto px-4 sm:px-3 md:px-4 py-3 sm:py-4 md:py-6 lg:py-8 w-full max-w-full">
      <div className="space-y-4 sm:space-y-6 md:space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardContent />
    </Suspense>
  )
}
