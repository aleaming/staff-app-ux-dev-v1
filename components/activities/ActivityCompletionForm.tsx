"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, X, Camera, AlertCircle } from "lucide-react"
import type { Activity } from "@/lib/test-data"

interface ChecklistItem {
  id: string
  label: string
  required: boolean
}

interface ActivityCompletionFormProps {
  activity: Activity
  checklist?: ChecklistItem[]
  onComplete?: (data: CompletionData) => void
}

export interface CompletionData {
  checklistItems: Record<string, boolean>
  notes: string
  issues: string[]
  photos: string[] // URLs or base64
}

const defaultChecklist: ChecklistItem[] = [
  { id: "arrival-check", label: "Arrived at location", required: true },
  { id: "access-check", label: "Gained access to property", required: true },
  { id: "alarm-check", label: "Alarm disarmed (if applicable)", required: false },
  { id: "inspection-check", label: "Property inspection completed", required: true },
  { id: "tasks-check", label: "All tasks completed", required: true },
  { id: "photos-check", label: "Photos taken", required: false },
  { id: "secure-check", label: "Property secured", required: true },
]

export function ActivityCompletionForm({ 
  activity, 
  checklist = defaultChecklist,
  onComplete 
}: ActivityCompletionFormProps) {
  const router = useRouter()
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({})
  const [notes, setNotes] = useState("")
  const [issues, setIssues] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChecklistChange = (id: string, checked: boolean) => {
    setChecklistState(prev => ({ ...prev, [id]: checked }))
  }

  const handleAddIssue = () => {
    const issue = prompt("Describe the issue:")
    if (issue && issue.trim()) {
      setIssues(prev => [...prev, issue.trim()])
    }
  }

  const handleRemoveIssue = (index: number) => {
    setIssues(prev => prev.filter((_, i) => i !== index))
  }

  const canSubmit = () => {
    const requiredItems = checklist.filter(item => item.required)
    return requiredItems.every(item => checklistState[item.id] === true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!canSubmit()) {
      alert("Please complete all required checklist items")
      return
    }

    setIsSubmitting(true)

    const completionData: CompletionData = {
      checklistItems: checklistState,
      notes,
      issues,
      photos: [] // TODO: Implement photo upload
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (onComplete) {
      onComplete(completionData)
    } else {
      // Default behavior: navigate back
      router.push("/")
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {checklist.map((item) => (
            <div key={item.id} className="flex items-start space-x-3">
              <Checkbox
                id={item.id}
                checked={checklistState[item.id] || false}
                onCheckedChange={(checked) => 
                  handleChecklistChange(item.id, checked === true)
                }
              />
              <div className="flex-1">
                <Label 
                  htmlFor={item.id} 
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                    item.required ? "" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                  {item.required && <span className="text-destructive ml-1">*</span>}
                </Label>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Add any additional notes or observations..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-2"
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Issues */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Issues Reported
            </CardTitle>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={handleAddIssue}
            >
              Add Issue
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {issues.length === 0 ? (
            <p className="text-sm text-muted-foreground">No issues reported</p>
          ) : (
            <div className="space-y-2">
              {issues.map((issue, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <p className="text-sm">{issue}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveIssue(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Photo Upload (Placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Photos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Photo upload functionality coming soon
          </p>
          <Button type="button" variant="outline" disabled>
            <Camera className="h-4 w-4 mr-2" />
            Upload Photos
          </Button>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={!canSubmit() || isSubmitting}
          className="flex-1"
          size="lg"
        >
          {isSubmitting ? (
            "Completing..."
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Complete Activity
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>

      {!canSubmit() && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            Please complete all required checklist items to finish the activity.
          </p>
        </div>
      )}
    </form>
  )
}

