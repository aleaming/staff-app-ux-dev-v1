"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, ChevronLeft, ChevronRight, Edit3, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import type { PhotoAnnotation } from "./PhotoAnnotation"

interface Photo {
  id: string
  url?: string
  localPath: string
  status: "uploaded" | "in-queue" | "failed"
  uploadedAt?: Date
  annotations?: PhotoAnnotation[]
  thumbnail?: string
}

interface PhotoGalleryProps {
  photos: Photo[]
  onAnnotate?: (photoId: string, annotations: PhotoAnnotation[]) => void
  onRetryUpload?: (photoId: string) => void
  onDeletePhoto?: (photoId: string) => void
}

export function PhotoGallery({ photos, onAnnotate, onRetryUpload, onDeletePhoto }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [showAnnotations, setShowAnnotations] = useState(false)

  const selectedPhoto = selectedIndex !== null ? photos[selectedIndex] : null

  const getStatusBadge = (status: Photo["status"]) => {
    switch (status) {
      case "uploaded":
        return (
          <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Uploaded
          </Badge>
        )
      case "in-queue":
        return (
          <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            In Queue
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        )
    }
  }

  const navigatePhoto = (direction: "prev" | "next") => {
    if (selectedIndex === null) return
    
    if (direction === "prev") {
      setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : photos.length - 1)
    } else {
      setSelectedIndex(selectedIndex < photos.length - 1 ? selectedIndex + 1 : 0)
    }
  }

  if (photos.length === 0) {
    return null
  }

  return (
    <>
      {/* Thumbnail Grid */}
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="relative aspect-square bg-muted rounded-lg overflow-hidden group cursor-pointer"
            onClick={() => setSelectedIndex(index)}
          >
            {photo.thumbnail ? (
              <img
                src={photo.thumbnail}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={photo.localPath}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Status Badge */}
            <div className="absolute top-1 left-1">
              {getStatusBadge(photo.status)}
            </div>

            {/* Annotation Indicator */}
            {photo.annotations && photo.annotations.length > 0 && (
              <div className="absolute top-1 right-1">
                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-xs">
                  {photo.annotations.length} annotation{photo.annotations.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/50 dark:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Edit3 className="h-6 w-6 text-background" />
            </div>

            {/* Delete Button */}
            {onDeletePhoto && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/50 dark:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeletePhoto(photo.id)
                }}
                aria-label="Delete photo"
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            {/* Failed Upload Retry */}
            {photo.status === "failed" && onRetryUpload && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-1 right-1 h-6 w-6 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                onClick={(e) => {
                  e.stopPropagation()
                  onRetryUpload(photo.id)
                }}
              >
                <AlertCircle className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Full Screen View */}
      {selectedPhoto && (
        <Dialog open={selectedIndex !== null} onOpenChange={() => setSelectedIndex(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] p-0">
            <div className="relative">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 bg-black/50 dark:bg-black/70 hover:bg-black/70 dark:hover:bg-black/80 text-background h-6 w-6 rounded-full"
                onClick={() => setSelectedIndex(null)}
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Navigation Buttons */}
              {photos.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 dark:bg-black/70 hover:bg-black/70 dark:hover:bg-black/80 text-background"
                    onClick={() => navigatePhoto("prev")}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 dark:bg-black/70 hover:bg-black/70 dark:hover:bg-black/80 text-background"
                    onClick={() => navigatePhoto("next")}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}

              {/* Photo */}
              <div className="relative aspect-video bg-muted">
                <img
                  src={selectedPhoto.localPath}
                  alt="Full size photo"
                  className="w-full h-full object-contain"
                />
                
                {/* Annotations Overlay */}
                {selectedPhoto.annotations && selectedPhoto.annotations.length > 0 && (
                  <div className="absolute inset-0">
                    {selectedPhoto.annotations.map((annotation) => (
                      <div
                        key={annotation.id}
                        className="absolute w-8 h-8 rounded-full border-2 border-background bg-destructive/50"
                        style={{
                          left: `${annotation.x}%`,
                          top: `${annotation.y}%`,
                          transform: "translate(-50%, -50%)"
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Photo Info */}
              <div className="p-4 bg-background border-t">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedPhoto.status)}
                    {selectedPhoto.annotations && selectedPhoto.annotations.length > 0 && (
                      <Badge variant="outline">
                        {selectedPhoto.annotations.length} annotation{selectedPhoto.annotations.length !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                  {onAnnotate && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAnnotations(true)}
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Annotate
                    </Button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Photo {selectedIndex !== null ? selectedIndex + 1 : 0} of {photos.length}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

