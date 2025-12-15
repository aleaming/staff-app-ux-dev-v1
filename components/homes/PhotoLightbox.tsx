"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  X, 
  ChevronLeft, 
  ChevronRight,
  Image as ImageIcon
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Photo {
  id: string
  url: string
  caption: string
  room?: string
}

interface PhotoLightboxProps {
  photos: Photo[]
  initialIndex?: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PhotoLightbox({ 
  photos, 
  initialIndex = 0, 
  open, 
  onOpenChange 
}: PhotoLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  // Reset to initial index when opening
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex)
    }
  }, [open, initialIndex])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!open) return
    
    switch (e.key) {
      case "Escape":
        onOpenChange(false)
        break
      case "ArrowLeft":
        setCurrentIndex(prev => prev > 0 ? prev - 1 : photos.length - 1)
        break
      case "ArrowRight":
        setCurrentIndex(prev => prev < photos.length - 1 ? prev + 1 : 0)
        break
    }
  }, [open, photos.length, onOpenChange])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  if (!open || photos.length === 0) return null

  const currentPhoto = photos[currentIndex]

  const goToPrevious = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : photos.length - 1)
  }

  const goToNext = () => {
    setCurrentIndex(prev => prev < photos.length - 1 ? prev + 1 : 0)
  }

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex flex-col"
      onClick={() => onOpenChange(false)}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
            {currentIndex + 1} of {photos.length}
          </Badge>
          {currentPhoto.room && (
            <Badge variant="outline" className="text-white border-white/30">
              {currentPhoto.room}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Main Content */}
      <div 
        className="flex-1 flex items-center justify-center relative px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Previous Button */}
        {photos.length > 1 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 z-10 text-white hover:bg-white/10 h-12 w-12 rounded-full"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
        )}

        {/* Photo */}
        <div className="max-w-5xl max-h-[70vh] w-full flex items-center justify-center">
          <div className="relative w-full aspect-video bg-muted/20 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon className="h-24 w-24 text-white/30" />
            </div>
            {/* In production, this would be an actual image:
            <img
              src={currentPhoto.url}
              alt={currentPhoto.caption}
              className="w-full h-full object-contain"
            />
            */}
          </div>
        </div>

        {/* Next Button */}
        {photos.length > 1 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 z-10 text-white hover:bg-white/10 h-12 w-12 rounded-full"
            onClick={goToNext}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        )}
      </div>

      {/* Footer - Caption */}
      <div 
        className="p-4 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-white font-medium">{currentPhoto.caption}</p>
        <p className="text-white/60 text-sm mt-1">
          Use arrow keys to navigate • Press Escape to close
        </p>
      </div>

      {/* Thumbnail Strip */}
      {photos.length > 1 && (
        <div 
          className="px-4 pb-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                className={cn(
                  "relative flex-shrink-0 w-16 h-16 bg-white/10 rounded-lg overflow-hidden transition-all",
                  index === currentIndex 
                    ? "ring-2 ring-white" 
                    : "opacity-50 hover:opacity-80"
                )}
                onClick={() => setCurrentIndex(index)}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="h-5 w-5 text-white/50" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

