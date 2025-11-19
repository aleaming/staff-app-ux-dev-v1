import { notFound } from "next/navigation"
import { getActivityById } from "@/lib/test-data"
import { ActivityCompletionForm } from "@/components/activities/ActivityCompletionForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs"
import { BackButton } from "@/components/navigation/BackButton"

interface ActivityCompletePageProps {
  params: Promise<{ id: string }>
}

export default async function ActivityCompletePage({ params }: ActivityCompletePageProps) {
  const { id } = await params
  const activity = getActivityById(id)

  if (!activity) {
    notFound()
  }

  const breadcrumbs = [
    { label: "Activities", href: "/activities" },
    { label: activity.title, href: `/activities/${id}` },
    { label: "Complete" }
  ]

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Header */}
        <div className="flex items-center gap-4">
          
          <div>
            <h1 className="text-2xl font-bold">Complete Activity</h1>
            <p className="text-muted-foreground mt-1">{activity.title}</p>
          </div>
        </div>

        {/* Completion Form */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityCompletionForm activity={activity} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

