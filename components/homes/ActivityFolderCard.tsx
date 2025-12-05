"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Calendar,
  Clock,
  Image,
  ChevronRight
} from "lucide-react"
import { ActivityMediaGallery } from "./ActivityMediaGallery"

import type { ActivityType } from "@/lib/activity-templates"

interface ActivityFolder {
  id: string
  activityType: ActivityType
  date: Date
  status: "pending" | "in-progress" | "completed"
  photoCount: number
  rooms: string[]
  tasks: string[]
}

interface ActivityFolderCardProps {
  activity: ActivityFolder
  homeCode: string
}

const activityTypeConfig: Record<string, { label: string; color: string }> = {
  // Home preparation
  "provisioning": { label: "Provisioning", color: "var(--activity-provisioning)" },
  "deprovisioning": { label: "Deprovisioning", color: "var(--activity-deprovision)" },
  "turn": { label: "Turn", color: "var(--activity-turn)" },
  "maid-service": { label: "Maid Service", color: "var(--activity-maid)" },
  "mini-maid": { label: "Mini-Maid", color: "var(--activity-mini-maid)" },
  "touch-up": { label: "Touch-Up", color: "var(--activity-touch-up)" },
  "quality-check": { label: "Quality Check", color: "var(--activity-quality-check)" },
  // Guest welcoming
  "meet-greet": { label: "Meet & Greet", color: "var(--activity-greet)" },
  "additional-greet": { label: "Additional Greet", color: "var(--activity-additional-greet)" },
  "bag-drop": { label: "Bag Drop", color: "var(--activity-bag-drop)" },
  "service-recovery": { label: "Service Recovery", color: "var(--activity-service-recovery)" },
  "home-viewing": { label: "Home Viewing", color: "var(--activity-home-viewing)" },
  // Other
  "adhoc": { label: "Ad-hoc", color: "var(--activity-adhoc)" },
}

export function ActivityFolderCard({ activity, homeCode }: ActivityFolderCardProps) {
  const [galleryOpen, setGalleryOpen] = useState(false)
  const config = activityTypeConfig[activity.activityType]

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  return (
    <>
      <Card 
        className="hover:bg-muted/50 transition-colors cursor-pointer group overflow-hidden border-l-[8px]"
        style={{ borderLeftColor: config.color }}
        onClick={() => setGalleryOpen(true)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h3 className="font-semibold text-lg">{config.label}</h3>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(activity.date)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTime(activity.date)}
                </span>
              </div>
            </div>
            <Badge variant="outline" className="whitespace-nowrap">
              {activity.status}
            </Badge>
          </div>

          {/* Photo count and preview info */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 text-sm">
              <Image className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{activity.photoCount}</span>
              <span className="text-muted-foreground">photos</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">
              {activity.rooms.length} {activity.rooms.length === 1 ? 'room' : 'rooms'}
            </span>
          </div>

          {/* Rooms */}
          <div className="flex flex-wrap gap-2 mb-3">
            {activity.rooms.slice(0, 3).map((room) => (
              <Badge key={room} variant="secondary" className="text-xs">
                {room}
              </Badge>
            ))}
            {activity.rooms.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{activity.rooms.length - 3} more
              </Badge>
            )}
          </div>

          {/* View button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full sm:w-auto group-hover:bg-background"
            onClick={(e) => {
              e.stopPropagation()
              setGalleryOpen(true)
            }}
          >
            View Photos
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* Gallery Sheet */}
      <ActivityMediaGallery
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
        activity={activity}
        homeCode={homeCode}
      />
    </>
  )
}

