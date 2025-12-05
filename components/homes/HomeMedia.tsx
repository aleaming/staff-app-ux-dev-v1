"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Image, 
  Video, 
  FileText, 
  Camera, 
  Search,
  Filter,
  Package,
  Handshake,
  RefreshCw,
  X,
  AlertCircle,
  Calendar
} from "lucide-react"
import { toast } from "sonner"
import { ActivityFolderCard } from "./ActivityFolderCard"

interface HomeMediaProps {
  homeCode: string
}

// Mock activity folder data - in production, this would come from API
const mockActivityFolders = [
  {
    id: "1",
    activityType: "turn" as const,
    date: new Date("2024-01-15T14:30:00"),
    status: "completed" as const,
    photoCount: 12,
    rooms: ["Living Room", "Kitchen", "Bedroom 1"],
    tasks: ["Pre-inspection", "Cleaning verification"]
  },
  {
    id: "2",
    activityType: "provisioning" as const,
    date: new Date("2024-01-10T09:00:00"),
    status: "completed" as const,
    photoCount: 24,
    rooms: ["Kitchen", "Bedroom 1", "Bedroom 2", "Bathroom"],
    tasks: ["Stock check", "Setup verification"]
  },
  {
    id: "3",
    activityType: "meet-greet" as const,
    date: new Date("2024-01-08T16:00:00"),
    status: "completed" as const,
    photoCount: 3,
    rooms: ["Entrance"],
    tasks: ["Guest arrival", "Property walkthrough"]
  },
  {
    id: "4",
    activityType: "deprovisioning" as const,
    date: new Date("2024-01-05T11:00:00"),
    status: "completed" as const,
    photoCount: 18,
    rooms: ["Living Room", "Kitchen", "Bedroom 1", "Bedroom 2"],
    tasks: ["Inventory check", "Damage inspection"]
  },
  {
    id: "5",
    activityType: "adhoc" as const,
    date: new Date("2024-01-03T13:30:00"),
    status: "completed" as const,
    photoCount: 5,
    rooms: ["Bathroom"],
    tasks: ["Maintenance check"]
  }
]

export function HomeMedia({ homeCode }: HomeMediaProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  
  // State for property media photos (can be added/deleted)
  const [propertyPhotos, setPropertyPhotos] = useState([
    { id: "1", url: "/placeholder-image.jpg", caption: "Living Room" },
    { id: "2", url: "/placeholder-image.jpg", caption: "Kitchen" },
    { id: "3", url: "/placeholder-image.jpg", caption: "Master Bedroom" },
    { id: "4", url: "/placeholder-image.jpg", caption: "Bathroom" }
  ])

  // Mock data for other property media
  const media = {
    videos: [
      { id: "1", url: "/placeholder-video.mp4", title: "Property Tour" }
    ],
    documents: [
      { id: "1", name: "Property Manual", type: "PDF" },
      { id: "2", name: "Emergency Contacts", type: "PDF" }
    ]
  }

  const handleDeletePhoto = (photoId: string) => {
    setPropertyPhotos(prev => prev.filter(p => p.id !== photoId))
    toast.success("Photo removed")
  }

  // Filter activities based on search and filters
  const filteredActivities = mockActivityFolders.filter(activity => {
    const matchesSearch = searchQuery === "" || 
      activity.activityType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.rooms.some(room => room.toLowerCase().includes(searchQuery.toLowerCase())) ||
      activity.tasks.some(task => task.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesFilters = selectedFilters.length === 0 || 
      selectedFilters.includes(activity.activityType)
    
    return matchesSearch && matchesFilters
  })

  const activityTypes = [
    { type: "provisioning", label: "Provisioning", icon: Package },
    { type: "deprovisioning", label: "Deprovisioning", icon: X },
    { type: "turn", label: "Turn", icon: RefreshCw },
    { type: "maid-service", label: "Maid Service", icon: RefreshCw },
    { type: "meet-greet", label: "Meet & Greet", icon: Handshake },
    { type: "adhoc", label: "Ad-hoc", icon: AlertCircle }
  ]

  const toggleFilter = (type: string) => {
    setSelectedFilters(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  return (
    <Tabs defaultValue="activity" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="activity">Activity Media</TabsTrigger>
        <TabsTrigger value="property">Property Media</TabsTrigger>
      </TabsList>

      {/* Activity Media Tab */}
      <TabsContent value="activity" className="space-y-4">
        {/* Search and Filter Bar */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by activity type, room, or task..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Filter className="h-4 w-4 mr-2" />
                    Activity Type
                    {selectedFilters.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {selectedFilters.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>Filter by Activity Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {activityTypes.map(({ type, label, icon: Icon }) => (
                    <DropdownMenuCheckboxItem
                      key={type}
                      checked={selectedFilters.includes(type)}
                      onCheckedChange={() => toggleFilter(type)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {label}
                    </DropdownMenuCheckboxItem>
                  ))}
                  {selectedFilters.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem
                        onSelect={() => setSelectedFilters([])}
                        className="text-muted-foreground"
                      >
                        Clear all filters
                      </DropdownMenuCheckboxItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <div className="space-y-4">
          {filteredActivities.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-semibold mb-2">No activities found</p>
                <p className="text-muted-foreground">
                  {searchQuery || selectedFilters.length > 0
                    ? "Try adjusting your search or filters"
                    : "Activity media will appear here once activities are completed"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredActivities.map((activity) => (
              <ActivityFolderCard
                key={activity.id}
                activity={activity}
                homeCode={homeCode}
              />
            ))
          )}
        </div>
      </TabsContent>

      {/* Property Media Tab */}
      <TabsContent value="property" className="space-y-6">
        {/* Photos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Photos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 grid-cols-3 md:grid-cols-4">
              {propertyPhotos.map((photo) => (
                <div key={photo.id} className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 dark:bg-black/70 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-sm">{photo.caption}</p>
                  </div>
                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/50 dark:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                    onClick={() => handleDeletePhoto(photo.id)}
                    aria-label="Delete photo"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Camera className="h-4 w-4 mr-2" />
              View All Photos
            </Button>
          </CardContent>
        </Card>

        {/* Videos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Videos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {media.videos.map((video) => (
              <div key={video.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded">
                      <Video className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{video.title}</p>
                      <p className="text-sm text-muted-foreground">Video tour</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Play</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {media.documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">{doc.type}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Download</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
