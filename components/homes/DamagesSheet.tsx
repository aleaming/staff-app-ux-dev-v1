"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { PhotoUploader } from "@/components/activities/PhotoUploader"
import { PhotoGallery } from "@/components/activities/PhotoGallery"
import { AlertTriangle, Camera, CheckCircle2, Clock, X, Upload } from "lucide-react"
import { testHomes, type Damage } from "@/lib/test-data"
import type { PhotoAnnotation } from "@/components/activities/PhotoAnnotation"

interface Photo {
  id: string
  url?: string
  localPath: string
  status: "uploaded" | "in-queue" | "failed"
  uploadedAt?: Date
  annotations?: PhotoAnnotation[]
  thumbnail?: string
  fileName?: string
  size?: number
}

interface DamagesSheetProps {
  homeId: string
  damages: Damage[]
}

export function DamagesSheet({ homeId, damages }: DamagesSheetProps) {
  const home = testHomes.find(h => h.id === homeId)
  const [damageStates, setDamageStates] = useState<Record<string, {
    acknowledged: boolean
    photos: Photo[]
    notes: string
  }>>(() => {
    const initial: Record<string, any> = {}
    damages.forEach(damage => {
      initial[damage.id] = {
        acknowledged: false,
        photos: damage.media?.map(m => ({
          id: m.id,
          localPath: m.url,
          status: "uploaded" as const,
          uploadedAt: new Date(m.uploadedAt),
          url: m.url
        })) || [],
        notes: ""
      }
    })
    return initial
  })

  const getSeverityBadge = (severity: Damage["severity"]) => {
    switch (severity) {
      case "minor":
        return <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">Minor</Badge>
      case "moderate":
        return <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800">Moderate</Badge>
      case "major":
        return <Badge variant="destructive">Major</Badge>
      default:
        return null
    }
  }

  const getStatusBadge = (status: Damage["status"]) => {
    switch (status) {
      case "open":
        return <Badge variant="outline" className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800">Open</Badge>
      case "in-progress":
        return <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">In Progress</Badge>
      case "resolved":
        return <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">Resolved</Badge>
      default:
        return null
    }
  }

  const handleAcknowledge = (damageId: string, acknowledged: boolean) => {
    setDamageStates(prev => ({
      ...prev,
      [damageId]: {
        ...prev[damageId],
        acknowledged
      }
    }))
  }

  const handleAddPhoto = (damageId: string, file: File, thumbnail?: string) => {
    const photoId = `${damageId}-${Date.now()}`
    const photo: Photo = {
      id: photoId,
      localPath: URL.createObjectURL(file),
      status: "in-queue",
      fileName: file.name,
      size: file.size,
      thumbnail
    }

    setDamageStates(prev => ({
      ...prev,
      [damageId]: {
        ...prev[damageId],
        photos: [...prev[damageId].photos, photo]
      }
    }))

    // Simulate upload
    setTimeout(() => {
      setDamageStates(prev => ({
        ...prev,
        [damageId]: {
          ...prev[damageId],
          photos: prev[damageId].photos.map(p =>
            p.id === photoId
              ? { ...p, status: "uploaded" as const, uploadedAt: new Date() }
              : p
          )
        }
      }))
    }, 2000)
  }

  const handleNotesChange = (damageId: string, notes: string) => {
    setDamageStates(prev => ({
      ...prev,
      [damageId]: {
        ...prev[damageId],
        notes
      }
    }))
  }

  return (
    <div className="space-y-4">
      {/* Property Info */}
      <div className="p-3 bg-muted rounded-lg">
        <p className="font-semibold text-foreground">
          {home?.code} {home?.name && `• ${home.name}`}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Review and acknowledge each damage below. Upload photos to document current condition.
        </p>
      </div>

      <div className="space-y-4">
        {damages.map((damage) => {
          const state = damageStates[damage.id]
          const isAcknowledged = state?.acknowledged || false

          return (
            <Card key={damage.id} className={isAcknowledged ? "opacity-70" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                  <CardTitle className="text-base font-semibold">{damage.description}</CardTitle>
                </div>
                <div className="flex items-center gap-2 flex-wrap mt-2">
                  <Badge variant="outline" className="text-xs">
                    {damage.location}
                  </Badge>
                  {getSeverityBadge(damage.severity)}
                  {getStatusBadge(damage.status)}
                  <span className="text-xs text-muted-foreground">
                    Reported {new Date(damage.reportedDate).toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                {/* Notes */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Notes</label>
                  <Textarea
                    placeholder="Add any additional notes about this damage..."
                    value={state?.notes || ""}
                    onChange={(e) => handleNotesChange(damage.id, e.target.value)}
                    rows={2}
                    className="resize-none"
                  />
                </div>

                {/* Media Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Media</label>
                    <span className="text-xs text-muted-foreground">
                      {state?.photos.length || 0} photo{state?.photos.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Existing Media Gallery */}
                  {state?.photos && state.photos.length > 0 && (
                    <PhotoGallery
                      photos={state.photos}
                    />
                  )}

                  {/* Upload New Photo */}
                  <PhotoUploader
                    onPhotoSelect={(file, thumbnail) => handleAddPhoto(damage.id, file, thumbnail)}
                    multiple={true}
                  />
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox
                      id={`ack-${damage.id}`}
                      checked={isAcknowledged}
                      onCheckedChange={(checked) => handleAcknowledge(damage.id, checked as boolean)}
                      className="h-5 w-5"
                    />
                    <label
                      htmlFor={`ack-${damage.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      Acknowledge and confirm damage
                    </label>
                  </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Summary */}
      <Card className="bg-background dark:bg-secondary-foreground">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Summary</p>
              <p className="text-sm text-muted-foreground">
                {Object.values(damageStates).filter(s => s.acknowledged).length} of {damages.length} damages acknowledged
              </p>
            </div>
            <Button>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Save All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

