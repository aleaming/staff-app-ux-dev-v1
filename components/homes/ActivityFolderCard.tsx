"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Package,
  Handshake,
  RefreshCw,
  X as XIcon,
  AlertCircle,
  Calendar,
  Clock,
  Image,
  ChevronRight
} from "lucide-react"
import { ActivityMediaGallery } from "./ActivityMediaGallery"

interface ActivityFolder {
  id: string
  activityType: "provisioning" | "meet-greet" | "turn" | "deprovision" | "ad-hoc"
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

const activityTypeConfig = {
  "provisioning": { 
    label: "Provisioning", 
    icon: Package, 
    color: "bg-blue-500" 
  },
  "meet-greet": { 
    label: "Meet & Greet", 
    icon: Handshake, 
    color: "bg-green-500" 
  },
  "turn": { 
    label: "Turn", 
    icon: RefreshCw, 
    color: "bg-orange-500" 
  },
  "deprovision": { 
    label: "Deprovision", 
    icon: XIcon, 
    color: "bg-red-500" 
  },
  "ad-hoc": { 
    label: "Ad-hoc", 
    icon: AlertCircle, 
    color: "bg-purple-500" 
  },
}

export function ActivityFolderCard({ activity, homeCode }: ActivityFolderCardProps) {
  const [galleryOpen, setGalleryOpen] = useState(false)
  const config = activityTypeConfig[activity.activityType]
  const Icon = config.icon

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
        className="hover:bg-muted/50 transition-colors cursor-pointer group"
        onClick={() => setGalleryOpen(true)}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Timeline indicator */}
            <div className="flex flex-col items-center gap-2">
              <div className={`p-3 rounded-lg ${config.color} text-white`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="w-px h-full bg-border min-h-[40px]" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
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
            </div>
          </div>
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

