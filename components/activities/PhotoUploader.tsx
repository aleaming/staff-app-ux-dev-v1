"use client"

import { useRef, useState, forwardRef, useImperativeHandle } from "react"
import { Button } from "@/components/ui/button"
import { Camera, X, Upload } from "lucide-react"
import { compressImage, generateThumbnail } from "@/lib/photo-utils"
import { useHapticFeedback } from "@/components/haptic/HapticProvider"

export interface PhotoUploaderHandle {
  triggerUpload: () => void
}

interface PhotoUploaderProps {
  onPhotoSelect: (file: File, thumbnail?: string) => void
  multiple?: boolean
  maxPhotos?: number
  currentCount?: number
  children?: React.ReactNode
}

export const PhotoUploader = forwardRef<PhotoUploaderHandle, PhotoUploaderProps>(
  function PhotoUploader({
    onPhotoSelect,
    multiple = false,
    maxPhotos,
    currentCount = 0,
    children
  }, ref) {
  const { trigger } = useHapticFeedback()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Expose triggerUpload method via ref
  useImperativeHandle(ref, () => ({
    triggerUpload: () => fileInputRef.current?.click()
  }))

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    // Light haptic for file selection
    trigger('light')

    const filesArray = Array.from(files)
    const filesToProcess = maxPhotos 
      ? filesArray.slice(0, maxPhotos - currentCount)
      : filesArray

    setIsUploading(true)

    for (const file of filesToProcess) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file")
        trigger('error')
        continue
      }

      try {
        // Compress image
        const compressed = await compressImage(file)
        
        // Generate thumbnail
        const thumbnail = await generateThumbnail(compressed.file)
        
        // Pass compressed file and thumbnail
        onPhotoSelect(compressed.file, thumbnail)
        
        // Success haptic for each photo uploaded
        trigger('success')
      } catch (error) {
        console.error("Error processing image:", error)
        alert("Failed to process image. Please try again.")
        // Error haptic for upload failure
        trigger('error')
        // Fallback: pass original file if compression fails
        onPhotoSelect(file)
      }
    }

    setIsUploading(false)

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
        capture="environment" // Use back camera on mobile
      />
      {children ? (
        <div onClick={handleClick}>
          {children}
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={isUploading || (maxPhotos !== undefined && currentCount >= maxPhotos)}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Upload className="h-4 w-4 mr-2 animate-pulse" />
              Processing...
            </>
          ) : (
            <>
              <Camera className="h-4 w-4 mr-2" />
              {multiple ? "Add Photos" : "Add Photo"}
            </>
          )}
        </Button>
      )}
      {maxPhotos !== undefined && currentCount >= maxPhotos && (
        <p className="text-xs text-muted-foreground mt-1 text-center">
          Maximum {maxPhotos} photos reached
        </p>
      )}
    </div>
  )
})

