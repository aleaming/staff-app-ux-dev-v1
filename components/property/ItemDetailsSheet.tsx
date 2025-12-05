"use client"

import { AlertTriangle, Flag } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PhotoGallery } from "@/components/activities/PhotoGallery"
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs"
import type { PropertyHierarchyNode, PropertyIssue } from "@/lib/test-data"

interface ItemDetailsSheetProps {
  item: PropertyHierarchyNode
  breadcrumbs: Array<{ label: string; href?: string }>
  issue?: PropertyIssue
  onClose: () => void
  onReportIssue: () => void
}

export function ItemDetailsSheet({
  item,
  breadcrumbs,
  issue,
  onClose,
  onReportIssue
}: ItemDetailsSheetProps) {
  const hasActiveIssue = issue && issue.status !== "resolved"
  
  // Convert item photos to PhotoGallery format
  const photos = item.photos?.map(photo => ({
    id: photo.id,
    localPath: photo.url,
    status: "uploaded" as const,
    uploadedAt: new Date(),
    url: photo.url
  })) || []

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent side="bottom" className="max-h-[100vh] overflow-y-auto pb-48">
        <SheetHeader>
          <SheetTitle className="text-left">{item.label}</SheetTitle>
          <div className="mt-2">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Issue Alert Banner */}
          {hasActiveIssue && (
            <Alert className="bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800">
              <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <AlertDescription className="text-orange-800 dark:text-orange-200">
                <div className="font-semibold mb-1">Issue Reported</div>
                <div className="text-sm">
                  Reported by {issue.reporterName} on {issue.reportedDate.toLocaleDateString()}
                </div>
                {issue.description && (
                  <div className="text-sm mt-1">{issue.description}</div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Tabs for Information and Photos */}
          {(item.instructions || (item.details && Object.keys(item.details).length > 0) || photos.length > 0) ? (
            <Tabs defaultValue="information" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="information">
                  Information
                </TabsTrigger>
                <TabsTrigger value="photos">
                  Photos {photos.length > 0 && `(${photos.length})`}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="information" className="mt-4 space-y-4">
                {/* Instructions */}
                {item.instructions ? (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Instructions</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {item.instructions}
                    </p>
                  </div>
                ) : null}

                {/* Details */}
                {item.details && Object.keys(item.details).length > 0 ? (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Details</h3>
                    <dl className="space-y-2">
                      {Object.entries(item.details).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-start">
                          <dt className="text-sm font-medium text-muted-foreground">{key}:</dt>
                          <dd className="text-sm text-right ml-4">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ) : null}

                {/* Empty state for information tab */}
                {!item.instructions && (!item.details || Object.keys(item.details).length === 0) && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No instructions or details available for this item.
                  </div>
                )}
              </TabsContent>

              <TabsContent value="photos" className="mt-4">
                {photos.length > 0 ? (
                  <PhotoGallery photos={photos} />
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No reference photos available for this item.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No additional information available for this item.
            </div>
          )}
        </div>

        <SheetFooter className="mt-6">
          <Button
            variant="secondary"
            onClick={onReportIssue}
            className="w-full"
          >
            <Flag className="h-4 w-4 mr-2" />
            Report Issue
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

