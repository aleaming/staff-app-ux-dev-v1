"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  RefreshCw,
  X
} from "lucide-react"

interface QueuedPhoto {
  id: string
  taskId: string
  taskName: string
  fileName: string
  size: number
  status: "pending" | "uploading" | "uploaded" | "failed"
  progress?: number
  error?: string
}

interface UploadQueueProps {
  queue: QueuedPhoto[]
  onRetry: (photoId: string) => void
  onCancel: (photoId: string) => void
  onClearCompleted?: () => void
}

export function UploadQueue({ 
  queue, 
  onRetry, 
  onCancel,
  onClearCompleted 
}: UploadQueueProps) {
  const pending = queue.filter(p => p.status === "pending" || p.status === "uploading")
  const uploaded = queue.filter(p => p.status === "uploaded")
  const failed = queue.filter(p => p.status === "failed")

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  if (queue.length === 0) {
    return null
  }

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Queue
          </CardTitle>
          {uploaded.length > 0 && onClearCompleted && (
            <Button variant="ghost" size="sm" onClick={onClearCompleted}>
              Clear Completed
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Pending/Uploading */}
        {pending.length > 0 && (
          <div className="space-y-2">
            {pending.map((photo) => (
              <div key={photo.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{photo.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {photo.taskName} • {formatFileSize(photo.size)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {photo.status === "uploading" ? (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        <Clock className="h-3 w-3 mr-1" />
                        Uploading...
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onCancel(photo.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {photo.status === "uploading" && photo.progress !== undefined && (
                  <Progress value={photo.progress} className="h-1" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Failed Uploads */}
        {failed.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-red-700">Failed Uploads</p>
            {failed.map((photo) => (
              <div key={photo.id} className="p-3 border border-red-200 rounded-lg bg-red-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{photo.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {photo.taskName} • {formatFileSize(photo.size)}
                    </p>
                    {photo.error && (
                      <p className="text-xs text-red-600 mt-1">{photo.error}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Failed
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRetry(photo.id)}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Retry
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Uploaded (Collapsed) */}
        {uploaded.length > 0 && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <p className="text-sm text-muted-foreground">
                  {uploaded.length} photo{uploaded.length !== 1 ? 's' : ''} uploaded successfully
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="pt-2 border-t flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {pending.length} pending • {uploaded.length} uploaded • {failed.length} failed
          </span>
          <span>
            Total: {queue.length} photo{queue.length !== 1 ? 's' : ''}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

