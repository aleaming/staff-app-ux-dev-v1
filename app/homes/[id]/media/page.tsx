"use client"

import { use, useState, useMemo } from "react"
import Link from "next/link"
import { useData } from "@/lib/data/DataProvider"
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { PhotoLightbox } from "@/components/homes/PhotoLightbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Image as ImageIcon, 
  Filter, 
  ArrowLeft,
  AlertTriangle
} from "lucide-react"

interface PropertyPhoto {
  id: string
  url: string
  caption: string
  room: string
  uploadedAt?: Date
}

// Generate mock photos for testing - in production this would come from API
const generateMockPhotos = (homeCode: string): PropertyPhoto[] => {
  const rooms = [
    "Living Room",
    "Kitchen", 
    "Master Bedroom",
    "Bedroom 2",
    "Bedroom 3",
    "Bathroom 1",
    "Bathroom 2",
    "Dining Area",
    "Balcony",
    "Entrance",
    "Exterior"
  ]
  
  const photoDescriptions: Record<string, string[]> = {
    "Living Room": ["Main seating area", "TV setup", "Window view", "Fireplace", "Bookshelf", "Coffee table"],
    "Kitchen": ["Full kitchen view", "Appliances", "Countertop", "Sink area", "Pantry", "Dining nook"],
    "Master Bedroom": ["Bed setup", "Closet", "Window", "Nightstand", "Dresser", "En-suite door"],
    "Bedroom 2": ["Twin beds", "Desk area", "Closet", "Window view"],
    "Bedroom 3": ["Queen bed", "Wardrobe", "Reading corner"],
    "Bathroom 1": ["Full bathroom", "Shower", "Vanity", "Toilet area"],
    "Bathroom 2": ["Half bath", "Sink", "Mirror"],
    "Dining Area": ["Dining table", "Chairs", "Lighting fixture"],
    "Balcony": ["Outdoor seating", "View", "Plants"],
    "Entrance": ["Front door", "Entryway", "Coat hooks"],
    "Exterior": ["Building front", "Parking area", "Garden", "Pool area"]
  }
  
  const photos: PropertyPhoto[] = []
  let photoId = 1
  
  rooms.forEach(room => {
    const descriptions = photoDescriptions[room] || ["General view"]
    descriptions.forEach((desc, index) => {
      photos.push({
        id: `photo-${photoId}`,
        url: `/placeholder-image.jpg`,
        caption: `${room} - ${desc}`,
        room,
        uploadedAt: new Date(Date.now() - (photoId * 86400000)) // Stagger dates
      })
      photoId++
    })
  })
  
  return photos
}

function GallerySkeleton() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Skeleton className="h-6 w-48 mb-6" />
      <Skeleton className="h-10 w-full mb-6" />
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    </div>
  )
}

function HomeNotFound() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <AlertTriangle className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Home Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The property you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/catalog">Back to Catalog</Link>
        </Button>
      </div>
    </div>
  )
}

interface MediaGalleryPageProps {
  params: Promise<{ id: string }>
}

export default function MediaGalleryPage({ params }: MediaGalleryPageProps) {
  const { id } = use(params)
  const { homes, isLoading } = useData()
  const [selectedRoom, setSelectedRoom] = useState<string>("all")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)

  const home = homes.find(h => h.id === id)
  
  // Generate mock photos for this home
  const allPhotos = useMemo(() => {
    if (!home) return []
    return generateMockPhotos(home.code)
  }, [home])
  
  // Get unique rooms for filter
  const rooms = useMemo(() => {
    const uniqueRooms = [...new Set(allPhotos.map(p => p.room))]
    return uniqueRooms.sort()
  }, [allPhotos])
  
  // Filter photos by selected room
  const filteredPhotos = useMemo(() => {
    if (selectedRoom === "all") return allPhotos
    return allPhotos.filter(p => p.room === selectedRoom)
  }, [allPhotos, selectedRoom])

  if (isLoading) {
    return <GallerySkeleton />
  }

  if (!home) {
    return <HomeNotFound />
  }

  const breadcrumbs = [
    { label: "Homes", href: "/catalog" },
    { label: home.code, href: `/homes/${home.id}` },
    { label: "Media" }
  ]

  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(index)
    setLightboxOpen(true)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
        
        <div className="flex items-center justify-between mt-4">
          <div>
            <h1 className="text-2xl font-bold">Property Photos</h1>
            <p className="text-muted-foreground">
              {home.code} {home.name && `• ${home.name}`}
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href={`/homes/${home.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              {selectedRoom === "all" ? "All Rooms" : selectedRoom}
              <Badge variant="secondary" className="ml-2">
                {filteredPhotos.length}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuRadioGroup value={selectedRoom} onValueChange={setSelectedRoom}>
              <DropdownMenuRadioItem value="all">
                All Rooms ({allPhotos.length})
              </DropdownMenuRadioItem>
              {rooms.map(room => {
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
        
        <p className="text-sm text-muted-foreground">
          {filteredPhotos.length} photo{filteredPhotos.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Photo Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-lg font-semibold mb-2">No photos found</p>
          <p className="text-muted-foreground">
            {selectedRoom !== "all" 
              ? "Try selecting a different room filter"
              : "No photos have been uploaded for this property yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className="relative aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => handlePhotoClick(index)}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                <p className="text-white text-xs font-medium line-clamp-2">{photo.caption}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <PhotoLightbox
        photos={filteredPhotos}
        initialIndex={selectedPhotoIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
    </div>
  )
}

