"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { 
  X, 
  AlertTriangle, 
  MapPin, 
  FileText,
  Save,
  Trash2
} from "lucide-react"

export type AnnotationType = "damage" | "storage" | "note"

export interface PhotoAnnotation {
  id: string
  type: AnnotationType
  x: number // Percentage
  y: number // Percentage
  text?: string
  drawing?: string // SVG path or base64
}

interface PhotoAnnotationProps {
  photoUrl: string
  annotations: PhotoAnnotation[]
  onSave: (annotations: PhotoAnnotation[]) => void
  onClose: () => void
  open: boolean
}

const annotationConfig = {
  damage: {
    label: "Damage",
    icon: AlertTriangle,
    color: "bg-destructive dark:bg-destructive",
    textColor: "text-destructive-foreground dark:text-destructive-foreground",
    borderColor: "border-destructive dark:border-destructive"
  },
  storage: {
    label: "Storage Location",
    icon: MapPin,
    color: "bg-blue-500 dark:bg-blue-600",
    textColor: "text-blue-700 dark:text-blue-300",
    borderColor: "border-blue-300 dark:border-blue-700"
  },
  note: {
    label: "Note",
    icon: FileText,
    color: "bg-yellow-500 dark:bg-yellow-600",
    textColor: "text-yellow-700 dark:text-yellow-300",
    borderColor: "border-yellow-300 dark:border-yellow-700"
  }
}

export function PhotoAnnotationDialog({
  photoUrl,
  annotations: initialAnnotations,
  onSave,
  onClose,
  open
}: PhotoAnnotationProps) {
  const [annotations, setAnnotations] = useState<PhotoAnnotation[]>(initialAnnotations)
  const [selectedType, setSelectedType] = useState<AnnotationType | null>(null)
  const [currentAnnotation, setCurrentAnnotation] = useState<Partial<PhotoAnnotation> | null>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setAnnotations(initialAnnotations)
    }
  }, [open, initialAnnotations])

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedType || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    const newAnnotation: PhotoAnnotation = {
      id: `annotation-${Date.now()}`,
      type: selectedType,
      x,
      y,
      text: ""
    }

    setCurrentAnnotation(newAnnotation)
  }

  const handleSaveAnnotation = () => {
    if (!currentAnnotation || !selectedType) return

    const annotation: PhotoAnnotation = {
      id: currentAnnotation.id || `annotation-${Date.now()}`,
      type: selectedType,
      x: currentAnnotation.x || 0,
      y: currentAnnotation.y || 0,
      text: currentAnnotation.text || ""
    }

    setAnnotations(prev => [...prev, annotation])
    setCurrentAnnotation(null)
    setSelectedType(null)
  }

  const handleDeleteAnnotation = (id: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== id))
  }

  const handleSave = () => {
    onSave(annotations)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Annotate Photo</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Annotation Type Selector */}
          <div className="flex gap-2">
            {(Object.keys(annotationConfig) as AnnotationType[]).map((type) => {
              const config = annotationConfig[type]
              const Icon = config.icon
              const isSelected = selectedType === type
              
              return (
                <Button
                  key={type}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedType(isSelected ? null : type)
                    setCurrentAnnotation(null)
                  }}
                  className={isSelected ? config.color : ""}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {config.label}
                </Button>
              )
            })}
          </div>

          {/* Photo Canvas */}
          <div 
            ref={containerRef}
            className="relative border rounded-lg overflow-hidden bg-muted cursor-crosshair"
            style={{ aspectRatio: "16/9" }}
            onClick={handleImageClick}
          >
            <img
              ref={imageRef}
              src={photoUrl}
              alt="Photo to annotate"
              className="w-full h-full object-contain pointer-events-none"
            />
            
            {/* Existing Annotations */}
            {annotations.map((annotation) => {
              const config = annotationConfig[annotation.type]
              const Icon = config.icon
              
              return (
                <div
                  key={annotation.id}
                  className={`absolute ${config.color} ${config.color.includes('destructive') ? 'text-destructive-foreground' : 'text-background'} rounded-full p-2 cursor-pointer hover:scale-110 transition-transform`}
                  style={{
                    left: `${annotation.x}%`,
                    top: `${annotation.y}%`,
                    transform: "translate(-50%, -50%)"
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentAnnotation(annotation)
                  }}
                >
                  <Icon className="h-4 w-4" />
                </div>
              )
            })}
          </div>

          {/* Annotation Details */}
          {currentAnnotation && (
            <div className={`p-4 border rounded-lg ${annotationConfig[currentAnnotation.type || "note"].borderColor} ${annotationConfig[currentAnnotation.type || "note"].textColor}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">
                  {annotationConfig[currentAnnotation.type || "note"].label}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setCurrentAnnotation(null)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                placeholder="Add details..."
                value={currentAnnotation.text || ""}
                onChange={(e) => setCurrentAnnotation({
                  ...currentAnnotation,
                  text: e.target.value
                })}
                rows={2}
              />
              <Button
                size="sm"
                onClick={handleSaveAnnotation}
                className="mt-2"
              >
                <Save className="h-3 w-3 mr-2" />
                Save Annotation
              </Button>
            </div>
          )}

          {/* Annotations List */}
          {annotations.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Annotations ({annotations.length})</h4>
              {annotations.map((annotation) => {
                const config = annotationConfig[annotation.type]
                const Icon = config.icon
                
                return (
                  <div
                    key={annotation.id}
                    className={`flex items-center justify-between p-2 border rounded ${config.borderColor}`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${config.textColor}`} />
                      <span className="text-sm font-medium">{config.label}</span>
                      {annotation.text && (
                        <span className="text-xs text-muted-foreground">
                          {annotation.text.substring(0, 30)}...
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteAnnotation(annotation.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Annotations
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

