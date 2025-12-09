"use client"

import { useState, useMemo } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Image as ImageIcon,
  Download,
  Share2,
  X,
  Clock,
  MapPin,
  Tag,
  ChevronLeft,
  ChevronRight,
  Filter
} from "lucide-react"
import { cn } from "@/lib/utils"
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

interface ActivityPhoto {
  id: string
  url: string
  timestamp: Date
  room: string
  task: string
  metadata?: Record<string, any>
}

interface ActivityMediaGalleryProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activity: ActivityFolder
  homeCode: string
}

// Mock photo data - in production, this would be loaded from API
const generateMockPhotos = (activity: ActivityFolder): ActivityPhoto[] => {
  const photos: ActivityPhoto[] = []
  let photoId = 1

  activity.rooms.forEach((room, roomIndex) => {
    activity.tasks.forEach((task, taskIndex) => {
      // Generate 2-4 photos per room/task combination
      const photoCount = 2 + (roomIndex + taskIndex) % 3
      for (let i = 0; i < photoCount && photoId <= activity.photoCount; i++) {
        photos.push({
          id: `photo-${photoId}`,
          url: `/placeholder-image.jpg`,
          timestamp: new Date(activity.date.getTime() + photoId * 60000),
          room,
          task,
          metadata: {
            uploadedBy: "Staff Member",
            size: "2.4 MB",
            resolution: "1920x1080"
          }
        })
        photoId++
      }
    })
  })

  return photos.slice(0, activity.photoCount)
}

export function ActivityMediaGallery({ 
  open, 
  onOpenChange, 
  activity, 
  homeCode 
}: ActivityMediaGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<ActivityPhoto | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<string>("all")
  const [selectedTask, setSelectedTask] = useState<string>("all")

  // Generate photos when sheet opens
  const allPhotos = useMemo(() => generateMockPhotos(activity), [activity])

  // Filter photos
  const filteredPhotos = useMemo(() => {
    return allPhotos.filter(photo => {
      const matchesRoom = selectedRoom === "all" || photo.room === selectedRoom
      const matchesTask = selectedTask === "all" || photo.task === selectedTask
      return matchesRoom && matchesTask
    })
  }, [allPhotos, selectedRoom, selectedTask])

  // Group photos by room
  const photosByRoom = useMemo(() => {
    const groups: Record<string, ActivityPhoto[]> = {}
    filteredPhotos.forEach(photo => {
      if (!groups[photo.room]) {
        groups[photo.room] = []
      }
      groups[photo.room].push(photo)
    })
    return groups
  }, [filteredPhotos])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const handlePreviousPhoto = () => {
    if (!selectedPhoto) return
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id)
    if (currentIndex > 0) {
      setSelectedPhoto(filteredPhotos[currentIndex - 1])
    }
  }

  const handleNextPhoto = () => {
    if (!selectedPhoto) return
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id)
    if (currentIndex < filteredPhotos.length - 1) {
      setSelectedPhoto(filteredPhotos[currentIndex + 1])
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[calc(92vh-4rem)] overflow-hidden flex flex-col">
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{activity.activityType} Photos</h2>
                <p className="text-sm text-muted-foreground font-normal">
                  {homeCode} • {activity.date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </SheetTitle>
          </SheetHeader>

          {/* Filters */}
          <div className="flex gap-2 mb-4 flex-wrap items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {selectedRoom === "all" ? "All Rooms" : selectedRoom}
                  <Badge variant="secondary" className="ml-2">
                    {filteredPhotos.length}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Filter by Room</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={selectedRoom} onValueChange={setSelectedRoom}>
                  <DropdownMenuRadioItem value="all">
                    All Rooms ({allPhotos.length})
                  </DropdownMenuRadioItem>
                  {activity.rooms.map(room => {
                    const count = allPhotos.filter(p => p.room === room).length
                    return (
                      <DropdownMenuRadioItem key={room} value={room}>
                        {room} ({count})
                      </DropdownMenuRadioItem>
                    )
                  })}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Photo Grid */}
          <div className="flex-1 overflow-y-auto">
            {selectedRoom === "all" ? (
              // Group by room when showing all
              <div className="space-y-6">
                {Object.entries(photosByRoom).map(([room, photos]) => (
                  <div key={room}>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {room}
                      <Badge variant="secondary">{photos.length} photos</Badge>
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {photos.map((photo) => (
                        <div
                          key={photo.id}
                          className="relative aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer group hover:ring-2 hover:ring-primary transition-all"
                          onClick={() => setSelectedPhoto(photo)}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ImageIcon className="h-12 w-12 text-muted-foreground" />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-xs font-medium">{photo.task}</p>
                            <p className="text-xs text-white/80 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(photo.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Show filtered photos
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer group hover:ring-2 hover:ring-primary transition-all"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs font-medium">{photo.task}</p>
                      <p className="text-xs text-white/80 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(photo.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredPhotos.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-lg font-semibold">No photos found</p>
                <p className="text-muted-foreground">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Full-size Photo Viewer */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-white/80 transition-colors"
            onClick={() => setSelectedPhoto(null)}
          >
            <X className="h-8 w-8" />
          </button>

          {/* Navigation */}
          <button
            className="absolute left-4 text-white hover:text-white/80 transition-colors disabled:opacity-30"
            onClick={(e) => {
              e.stopPropagation()
              handlePreviousPhoto()
            }}
            disabled={filteredPhotos.findIndex(p => p.id === selectedPhoto.id) === 0}
          >
            <ChevronLeft className="h-12 w-12" />
          </button>

          <button
            className="absolute right-4 text-white hover:text-white/80 transition-colors disabled:opacity-30"
            onClick={(e) => {
              e.stopPropagation()
              handleNextPhoto()
            }}
            disabled={filteredPhotos.findIndex(p => p.id === selectedPhoto.id) === filteredPhotos.length - 1}
          >
            <ChevronRight className="h-12 w-12" />
          </button>

          {/* Image and metadata */}
          <div className="max-w-7xl max-h-[90vh] w-full mx-4 flex flex-col items-center gap-4">
            <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="h-32 w-32 text-muted-foreground" />
              </div>
            </div>

            {/* Photo metadata */}
            <div className="bg-background/10 backdrop-blur-sm text-white rounded-lg p-4 w-full max-w-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{selectedPhoto.room}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <span className="text-sm">{selectedPhoto.task}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{formatTime(selectedPhoto.timestamp)}</span>
                </div>
                {selectedPhoto.metadata && (
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    <span className="text-sm">{selectedPhoto.metadata.resolution}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

