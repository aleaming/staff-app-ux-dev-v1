/**
 * PDF Generation Utility for Activity Completion Reports
 */

import jsPDF from "jspdf"
import type { ActivityType } from "./activity-templates"
import { getActivityTemplate } from "./activity-templates"
import { testHomes, type Damage } from "./test-data"

export interface ActivityPDFData {
  // Activity Info
  activityType: ActivityType
  homeId: string
  homeCode: string
  homeName?: string
  homeAddress?: string
  homeCoordinates?: { lat: number; lng: number }
  
  // Staff Info
  assignedTo?: string
  completedBy?: string
  
  // Task Data
  tasks: Array<{
    id: string
    name: string
    completed: boolean
    notes?: string
    photos: Array<{
      id: string
      fileName?: string
      uploadedAt?: Date
      annotations?: any[]
    }>
  }>
  
  // Activity Notes
  activityNotes?: string
  
  // Damages
  damages?: Damage[]
  damageUpdates?: Array<{
    damageId: string
    description: string
    notes?: string
    photosAdded?: number
  }>
  
  // Weather
  weather?: {
    temperature: number
    condition: string
    humidity: number
    windSpeed: number
  }
  
  // Booking/Activity Adjustments
  bookingNotes?: string[]
  activityAdjustments?: string[]
  
  // Completion Info
  completedAt: Date
  completedTasks: number
  totalTasks: number
  totalPhotos: number
}

export async function generateActivityPDF(data: ActivityPDFData): Promise<Blob> {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const maxWidth = pageWidth - (margin * 2)
  let yPosition = margin

  // Helper function to add new page if needed
  const checkNewPage = (requiredSpace: number = 10) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage()
      yPosition = margin
      return true
    }
    return false
  }

  // Helper function to add text with word wrap
  const addText = (text: string, fontSize: number = 10, isBold: boolean = false, color?: [number, number, number]) => {
    doc.setFontSize(fontSize)
    if (isBold) {
      doc.setFont(undefined, "bold")
    } else {
      doc.setFont(undefined, "normal")
    }
    if (color) {
      doc.setTextColor(color[0], color[1], color[2])
    }
    
    const lines = doc.splitTextToSize(text, maxWidth)
    lines.forEach((line: string) => {
      checkNewPage(6)
      doc.text(line, margin, yPosition)
      yPosition += 6
    })
    
    doc.setTextColor(0, 0, 0) // Reset to black
    doc.setFont(undefined, "normal")
  }

  // Title
  doc.setFontSize(20)
  doc.setFont(undefined, "bold")
  const template = getActivityTemplate(data.activityType)
  doc.text(template?.name || "Activity Report", margin, yPosition)
  yPosition += 10

  // Date and Time
  doc.setFontSize(10)
  doc.setFont(undefined, "normal")
  doc.text(`Completed: ${data.completedAt.toLocaleString()}`, margin, yPosition)
  yPosition += 8

  // Property Information Section
  checkNewPage(15)
  doc.setFontSize(14)
  doc.setFont(undefined, "bold")
  doc.text("Property Information", margin, yPosition)
  yPosition += 8

  doc.setFontSize(10)
  doc.setFont(undefined, "normal")
  addText(`Property Code: ${data.homeCode}`, 10)
  if (data.homeName) {
    addText(`Property Name: ${data.homeName}`, 10)
  }
  if (data.homeAddress) {
    addText(`Address: ${data.homeAddress}`, 10)
  }
  if (data.homeCoordinates) {
    addText(`Coordinates: ${data.homeCoordinates.lat.toFixed(4)}, ${data.homeCoordinates.lng.toFixed(4)}`, 10)
  }
  yPosition += 5

  // Staff Information
  checkNewPage(15)
  doc.setFontSize(14)
  doc.setFont(undefined, "bold")
  doc.text("Staff Information", margin, yPosition)
  yPosition += 8

  doc.setFontSize(10)
  doc.setFont(undefined, "normal")
  if (data.assignedTo) {
    addText(`Assigned To: ${data.assignedTo}`, 10)
  }
  if (data.completedBy) {
    addText(`Completed By: ${data.completedBy}`, 10)
  } else {
    addText(`Completed By: ${data.assignedTo || "Not specified"}`, 10)
  }
  yPosition += 5

  // Weather Information
  if (data.weather) {
    checkNewPage(15)
    doc.setFontSize(14)
    doc.setFont(undefined, "bold")
    doc.text("Weather Conditions", margin, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    doc.setFont(undefined, "normal")
    addText(`Temperature: ${data.weather.temperature}°C`, 10)
    addText(`Condition: ${data.weather.condition}`, 10)
    addText(`Humidity: ${data.weather.humidity}%`, 10)
    addText(`Wind Speed: ${data.weather.windSpeed} km/h`, 10)
    yPosition += 5
  }

  // Known Damages Section
  if (data.damages && data.damages.length > 0) {
    checkNewPage(20)
    doc.setFontSize(14)
    doc.setFont(undefined, "bold")
    doc.text("Known Damages", margin, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    doc.setFont(undefined, "normal")
    data.damages.forEach((damage, index) => {
      checkNewPage(20)
      addText(`${index + 1}. ${damage.description}`, 10, true)
      addText(`   Location: ${damage.location}`, 9)
      addText(`   Severity: ${damage.severity}`, 9)
      addText(`   Status: ${damage.status}`, 9)
      addText(`   Reported: ${new Date(damage.reportedDate).toLocaleDateString()}`, 9)
      yPosition += 3
    })
    yPosition += 5
  }

  // Damage Updates/Additions
  if (data.damageUpdates && data.damageUpdates.length > 0) {
    checkNewPage(20)
    doc.setFontSize(14)
    doc.setFont(undefined, "bold")
    doc.text("Damage Updates/Additions", margin, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    doc.setFont(undefined, "normal")
    data.damageUpdates.forEach((update, index) => {
      checkNewPage(20)
      addText(`${index + 1}. ${update.description}`, 10, true)
      if (update.notes) {
        addText(`   Notes: ${update.notes}`, 9)
      }
      if (update.photosAdded && update.photosAdded > 0) {
        addText(`   Photos Added: ${update.photosAdded}`, 9)
      }
      yPosition += 3
    })
    yPosition += 5
  }

  // Task Completion Section
  checkNewPage(20)
  doc.setFontSize(14)
  doc.setFont(undefined, "bold")
  doc.text("Task Completion", margin, yPosition)
  yPosition += 8

  doc.setFontSize(10)
  doc.setFont(undefined, "normal")
  addText(`Progress: ${data.completedTasks} of ${data.totalTasks} tasks completed`, 10)
  addText(`Total Photos: ${data.totalPhotos}`, 10)
  yPosition += 8

  // Individual Tasks
  data.tasks.forEach((task, index) => {
    checkNewPage(25)
    doc.setFontSize(11)
    doc.setFont(undefined, "bold")
    const status = task.completed ? "✓" : "✗"
    doc.text(`${status} ${index + 1}. ${task.name}`, margin, yPosition)
    yPosition += 6

    doc.setFontSize(9)
    doc.setFont(undefined, "normal")
    if (task.notes) {
      addText(`   Notes: ${task.notes}`, 9)
    }
    if (task.photos && task.photos.length > 0) {
      addText(`   Photos: ${task.photos.length} photo(s) uploaded`, 9)
      task.photos.forEach((photo, photoIndex) => {
        if (photo.fileName) {
          addText(`     - ${photo.fileName}`, 8)
        }
        if (photo.uploadedAt) {
          addText(`       Uploaded: ${new Date(photo.uploadedAt).toLocaleString()}`, 8)
        }
        if (photo.annotations && photo.annotations.length > 0) {
          addText(`       Annotations: ${photo.annotations.length}`, 8)
        }
      })
    }
    yPosition += 5
  })

  // Activity Notes
  if (data.activityNotes) {
    checkNewPage(20)
    doc.setFontSize(14)
    doc.setFont(undefined, "bold")
    doc.text("Activity Notes", margin, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    doc.setFont(undefined, "normal")
    addText(data.activityNotes, 10)
    yPosition += 5
  }

  // Booking/Activity Adjustments
  if (data.bookingNotes && data.bookingNotes.length > 0) {
    checkNewPage(20)
    doc.setFontSize(14)
    doc.setFont(undefined, "bold")
    doc.text("Booking Notes/Adjustments", margin, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    doc.setFont(undefined, "normal")
    data.bookingNotes.forEach((note, index) => {
      checkNewPage(10)
      addText(`${index + 1}. ${note}`, 10)
    })
    yPosition += 5
  }

  if (data.activityAdjustments && data.activityAdjustments.length > 0) {
    checkNewPage(20)
    doc.setFontSize(14)
    doc.setFont(undefined, "bold")
    doc.text("Activity Adjustments", margin, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    doc.setFont(undefined, "normal")
    data.activityAdjustments.forEach((adjustment, index) => {
      checkNewPage(10)
      addText(`${index + 1}. ${adjustment}`, 10)
    })
    yPosition += 5
  }

  // Footer
  const totalPages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setFont(undefined, "normal")
    doc.setTextColor(128, 128, 128)
    doc.text(
      `Page ${i} of ${totalPages} - Generated ${new Date().toLocaleString()}`,
      pageWidth - margin,
      pageHeight - 10,
      { align: "right" }
    )
    doc.setTextColor(0, 0, 0)
  }

  // Generate blob
  return doc.output("blob")
}

/**
 * Download the PDF
 */
export async function downloadActivityPDF(data: ActivityPDFData, filename?: string): Promise<void> {
  const blob = await generateActivityPDF(data)
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename || `activity-report-${data.homeCode}-${data.completedAt.toISOString().split('T')[0]}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

