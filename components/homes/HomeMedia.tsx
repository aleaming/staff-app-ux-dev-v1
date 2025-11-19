"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Image, Video, FileText, Camera } from "lucide-react"

interface HomeMediaProps {
  homeCode: string
}

export function HomeMedia({ homeCode }: HomeMediaProps) {
  // Mock data - in production, this would come from the home data
  const media = {
    photos: [
      { id: "1", url: "/placeholder-image.jpg", caption: "Living Room" },
      { id: "2", url: "/placeholder-image.jpg", caption: "Kitchen" },
      { id: "3", url: "/placeholder-image.jpg", caption: "Master Bedroom" },
      { id: "4", url: "/placeholder-image.jpg", caption: "Bathroom" }
    ],
    videos: [
      { id: "1", url: "/placeholder-video.mp4", title: "Property Tour" }
    ],
    documents: [
      { id: "1", name: "Property Manual", type: "PDF" },
      { id: "2", name: "Emergency Contacts", type: "PDF" }
    ]
  }

  return (
    <div className="space-y-6">
      {/* Photos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Photos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {media.photos.map((photo) => (
              <div key={photo.id} className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 dark:bg-black/70 text-background p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-sm">{photo.caption}</p>
                </div>
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
    </div>
  )
}

