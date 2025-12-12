/**
 * PDF Generation Utility for Activity Completion Reports
 */

import jsPDF from "jspdf"
import type { ActivityType } from "./activity-templates"
import { getActivityTemplate } from "./activity-templates"
import { testHomes, type Damage } from "./test-data"
import type { MeetGreetReportData } from "./meet-greet-report-types"
import {
  PARTY_TYPE_LABELS,
  STAY_REASON_LABELS,
  GUEST_ACTIVITY_LABELS,
  ENGLISH_LEVEL_LABELS,
  PUNCTUALITY_LABELS,
  LATE_EARLY_REASON_LABELS,
  AGREEMENT_LABELS,
  CONTACT_PREFERENCE_LABELS,
  YES_NO_LABELS,
  YES_NO_NOT_SURE_LABELS,
  WIFI_TEST_LABELS,
  DIFFICULT_REASON_LABELS,
} from "./meet-greet-report-types"

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
  
  // Meet & Greet Report
  meetGreetReport?: MeetGreetReportData
  
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

  // Set default font explicitly to fix letter-spacing issues
  doc.setFont("helvetica", "normal")

  // Helper function to add new page if needed
  const checkNewPage = (requiredSpace: number = 10) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage()
      yPosition = margin
      return true
    }
    return false
  }

  // Helper function to add a section header
  const addSectionHeader = (title: string) => {
    checkNewPage(20)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(60, 60, 60)
    doc.text(title, margin, yPosition)
    yPosition += 2
    // Draw underline
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.5)
    doc.line(margin, yPosition, pageWidth - margin, yPosition)
    yPosition += 6
    doc.setTextColor(0, 0, 0)
  }

  // Helper function to add a label-value pair
  const addLabelValue = (label: string, value: string, indent: number = 0) => {
    checkNewPage(8)
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(80, 80, 80)
    doc.text(`${label}:`, margin + indent, yPosition)
    
    const labelWidth = doc.getTextWidth(`${label}: `)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(0, 0, 0)
    
    const valueLines = doc.splitTextToSize(value, maxWidth - labelWidth - indent)
    valueLines.forEach((line: string, i: number) => {
      if (i === 0) {
        doc.text(line, margin + indent + labelWidth, yPosition)
      } else {
        yPosition += 5
        checkNewPage(5)
        doc.text(line, margin + indent + labelWidth, yPosition)
      }
    })
    yPosition += 6
  }

  // Helper function to add simple text
  const addText = (text: string, fontSize: number = 10, isBold: boolean = false, indent: number = 0) => {
    doc.setFontSize(fontSize)
    doc.setFont("helvetica", isBold ? "bold" : "normal")
    
    const lines = doc.splitTextToSize(text, maxWidth - indent)
    lines.forEach((line: string) => {
      checkNewPage(6)
      doc.text(line, margin + indent, yPosition)
      yPosition += fontSize * 0.5
    })
  }

  // ===== HEADER =====
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(40, 40, 40)
  const template = getActivityTemplate(data.activityType)
  doc.text(template?.name || "Activity Report", margin, yPosition)
  yPosition += 8

  // Completion timestamp
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(100, 100, 100)
  doc.text(`Completed: ${data.completedAt.toLocaleString()}`, margin, yPosition)
  yPosition += 12

  // ===== PROPERTY INFORMATION =====
  addSectionHeader("Property Information")
  addLabelValue("Property Code", data.homeCode)
  if (data.homeName) {
    addLabelValue("Property Name", data.homeName)
  }
  if (data.homeAddress) {
    addLabelValue("Address", data.homeAddress)
  }
  yPosition += 4

  // ===== STAFF INFORMATION =====
  addSectionHeader("Staff Information")
  if (data.assignedTo) {
    addLabelValue("Assigned To", data.assignedTo)
  }
  addLabelValue("Completed By", data.completedBy || data.assignedTo || "Not specified")
  yPosition += 4

  // ===== WEATHER (if available) =====
  if (data.weather) {
    addSectionHeader("Weather Conditions")
    addLabelValue("Temperature", `${data.weather.temperature}°C`)
    addLabelValue("Condition", data.weather.condition)
    addLabelValue("Humidity", `${data.weather.humidity}%`)
    addLabelValue("Wind Speed", `${data.weather.windSpeed} km/h`)
    yPosition += 4
  }

  // ===== KNOWN DAMAGES =====
  if (data.damages && data.damages.length > 0) {
    addSectionHeader("Known Damages")
    data.damages.forEach((damage, index) => {
      checkNewPage(25)
      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")
      doc.text(`${index + 1}. ${damage.description}`, margin, yPosition)
      yPosition += 5
      
      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)
      doc.setTextColor(80, 80, 80)
      doc.text(`Location: ${damage.location} | Severity: ${damage.severity} | Status: ${damage.status}`, margin + 8, yPosition)
      doc.setTextColor(0, 0, 0)
      yPosition += 6
    })
    yPosition += 4
  }

  // ===== DAMAGE UPDATES =====
  if (data.damageUpdates && data.damageUpdates.length > 0) {
    addSectionHeader("Damage Updates")
    data.damageUpdates.forEach((update, index) => {
      checkNewPage(20)
      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")
      doc.text(`${index + 1}. ${update.description}`, margin, yPosition)
      yPosition += 5
      
      if (update.notes) {
        doc.setFont("helvetica", "normal")
        doc.setFontSize(9)
        doc.text(`Notes: ${update.notes}`, margin + 8, yPosition)
        yPosition += 5
      }
      if (update.photosAdded && update.photosAdded > 0) {
        doc.setFont("helvetica", "normal")
        doc.setFontSize(9)
        doc.text(`Photos Added: ${update.photosAdded}`, margin + 8, yPosition)
        yPosition += 5
      }
    })
    yPosition += 4
  }

  // ===== TASK COMPLETION SUMMARY =====
  addSectionHeader("Task Completion")
  
  // Summary box
  doc.setFillColor(245, 245, 245)
  doc.roundedRect(margin, yPosition - 2, maxWidth, 16, 2, 2, "F")
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text(`Progress: ${data.completedTasks} of ${data.totalTasks} tasks completed`, margin + 4, yPosition + 5)
  doc.setFont("helvetica", "normal")
  doc.text(`Total Photos: ${data.totalPhotos}`, margin + 4, yPosition + 11)
  yPosition += 22

  // ===== INDIVIDUAL TASKS =====
  data.tasks.forEach((task, index) => {
    checkNewPage(20)
    
    // Task status indicator
    const statusSymbol = task.completed ? "[DONE]" : "[    ]"
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.text(`${statusSymbol} ${index + 1}. ${task.name}`, margin, yPosition)
    yPosition += 5

    // Task details
    if (task.notes || (task.photos && task.photos.length > 0)) {
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(80, 80, 80)
      
      if (task.notes) {
        const noteLines = doc.splitTextToSize(`Notes: ${task.notes}`, maxWidth - 12)
        noteLines.forEach((line: string) => {
          checkNewPage(5)
          doc.text(line, margin + 12, yPosition)
          yPosition += 4
        })
      }
      
      if (task.photos && task.photos.length > 0) {
        doc.text(`Photos: ${task.photos.length} uploaded`, margin + 12, yPosition)
        yPosition += 4
        
        task.photos.forEach((photo) => {
          if (photo.fileName) {
            checkNewPage(4)
            doc.text(`- ${photo.fileName}`, margin + 16, yPosition)
            yPosition += 4
          }
        })
      }
      
      doc.setTextColor(0, 0, 0)
    }
    yPosition += 3
  })

  // ===== ACTIVITY NOTES =====
  if (data.activityNotes) {
    addSectionHeader("Activity Notes")
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    const noteLines = doc.splitTextToSize(data.activityNotes, maxWidth)
    noteLines.forEach((line: string) => {
      checkNewPage(5)
      doc.text(line, margin, yPosition)
      yPosition += 5
    })
    yPosition += 4
  }

  // ===== BOOKING NOTES =====
  if (data.bookingNotes && data.bookingNotes.length > 0) {
    addSectionHeader("Booking Notes")
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    data.bookingNotes.forEach((note, index) => {
      checkNewPage(8)
      doc.text(`${index + 1}. ${note}`, margin, yPosition)
      yPosition += 5
    })
    yPosition += 4
  }

  // ===== ACTIVITY ADJUSTMENTS =====
  if (data.activityAdjustments && data.activityAdjustments.length > 0) {
    addSectionHeader("Activity Adjustments")
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    data.activityAdjustments.forEach((adjustment, index) => {
      checkNewPage(8)
      doc.text(`${index + 1}. ${adjustment}`, margin, yPosition)
      yPosition += 5
    })
    yPosition += 4
  }

  // ===== MEET & GREET REPORT =====
  if (data.meetGreetReport) {
    const mgReport = data.meetGreetReport

    // New page for M&G Report
    doc.addPage()
    yPosition = margin

    // M&G Report Title
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(40, 40, 40)
    doc.text("Meet & Greet Activity Report", margin, yPosition)
    yPosition += 12

    // 1. Basic Information
    addSectionHeader("1. Basic Information")
    addLabelValue("Date of Greet", mgReport.basicInfo.dateOfGreet)
    if (mgReport.basicInfo.arrivalTime) {
      addLabelValue("Arrival Time", mgReport.basicInfo.arrivalTime)
    }
    if (mgReport.basicInfo.departureTime) {
      addLabelValue("Departure Time", mgReport.basicInfo.departureTime)
    }
    if (mgReport.basicInfo.activityType) {
      const activityTypeLabel = mgReport.basicInfo.activityType === "greet" ? "Greet" 
        : mgReport.basicInfo.activityType === "viewing" ? "Viewing" 
        : mgReport.basicInfo.activityTypeOther || "Other"
      addLabelValue("Activity Type", activityTypeLabel)
    }
    yPosition += 4

    // 2. About the Guests
    addSectionHeader("2. About the Guests")
    if (mgReport.aboutGuests.partyType) {
      addLabelValue("Party Type", PARTY_TYPE_LABELS[mgReport.aboutGuests.partyType] || mgReport.aboutGuests.partyType)
    }
    if (mgReport.aboutGuests.adultsCount) {
      addLabelValue("Adults", mgReport.aboutGuests.adultsCount)
    }
    if (mgReport.aboutGuests.childrenCount) {
      addLabelValue("Children", mgReport.aboutGuests.childrenCount)
    }
    if (mgReport.aboutGuests.stayReason) {
      const reasonLabel = mgReport.aboutGuests.stayReason === "other" 
        ? mgReport.aboutGuests.stayReasonOther || "Other"
        : STAY_REASON_LABELS[mgReport.aboutGuests.stayReason] || mgReport.aboutGuests.stayReason
      addLabelValue("Reason for Stay", reasonLabel)
    }
    if (mgReport.aboutGuests.guestActivities && mgReport.aboutGuests.guestActivities.length > 0) {
      const activities = mgReport.aboutGuests.guestActivities
        .map(a => GUEST_ACTIVITY_LABELS[a] || a)
        .join(", ")
      addLabelValue("Planned Activities", activities)
    }
    if (mgReport.aboutGuests.adviceRequested) {
      addLabelValue("Advice Requested", mgReport.aboutGuests.adviceRequested)
    }
    if (mgReport.aboutGuests.englishLevel) {
      addLabelValue("English Level", ENGLISH_LEVEL_LABELS[mgReport.aboutGuests.englishLevel] || mgReport.aboutGuests.englishLevel)
    }
    if (mgReport.aboutGuests.firstLanguage) {
      addLabelValue("First Language", mgReport.aboutGuests.firstLanguage)
    }
    yPosition += 4

    // 3. About the Greet
    addSectionHeader("3. About the Greet")
    if (mgReport.aboutGreet.guestsPunctuality) {
      addLabelValue("Guest Punctuality", PUNCTUALITY_LABELS[mgReport.aboutGreet.guestsPunctuality] || mgReport.aboutGreet.guestsPunctuality)
    }
    if (mgReport.aboutGreet.earlyReason) {
      const reason = mgReport.aboutGreet.earlyReason === "other" 
        ? mgReport.aboutGreet.lateEarlyOtherReason || "Other"
        : LATE_EARLY_REASON_LABELS[mgReport.aboutGreet.earlyReason] || mgReport.aboutGreet.earlyReason
      addLabelValue("Early Reason", reason)
    }
    if (mgReport.aboutGreet.lateReason) {
      const reason = mgReport.aboutGreet.lateReason === "other" 
        ? mgReport.aboutGreet.lateEarlyOtherReason || "Other"
        : LATE_EARLY_REASON_LABELS[mgReport.aboutGreet.lateReason] || mgReport.aboutGreet.lateReason
      addLabelValue("Late Reason", reason)
    }
    if (mgReport.aboutGreet.guestsLovedHome) {
      addLabelValue("Guests Loved Home", AGREEMENT_LABELS[mgReport.aboutGreet.guestsLovedHome] || mgReport.aboutGreet.guestsLovedHome)
    }
    if (mgReport.aboutGreet.guestsNotLoveHomeReason) {
      addLabelValue("Issue Details", mgReport.aboutGreet.guestsNotLoveHomeReason)
    }
    if (mgReport.aboutGreet.contactPreference) {
      addLabelValue("Contact Preference", CONTACT_PREFERENCE_LABELS[mgReport.aboutGreet.contactPreference] || mgReport.aboutGreet.contactPreference)
    }
    if (mgReport.aboutGreet.alternativePhoneNumber) {
      addLabelValue("Alternative Phone", mgReport.aboutGreet.alternativePhoneNumber)
    }
    if (mgReport.aboutGreet.knowsCheckoutTime) {
      addLabelValue("Knows Checkout Time", YES_NO_NOT_SURE_LABELS[mgReport.aboutGreet.knowsCheckoutTime] || mgReport.aboutGreet.knowsCheckoutTime)
    }
    if (mgReport.aboutGreet.checkoutTime) {
      addLabelValue("Checkout Time", mgReport.aboutGreet.checkoutTime)
    }
    if (mgReport.aboutGreet.preAuthIssues) {
      addLabelValue("Pre-Auth Issues", YES_NO_LABELS[mgReport.aboutGreet.preAuthIssues] || mgReport.aboutGreet.preAuthIssues)
    }
    if (mgReport.aboutGreet.preAuthIssuesDetails) {
      addLabelValue("Pre-Auth Details", mgReport.aboutGreet.preAuthIssuesDetails)
    }
    if (mgReport.aboutGreet.meetsStandards) {
      addLabelValue("Meets Standards", YES_NO_NOT_SURE_LABELS[mgReport.aboutGreet.meetsStandards] || mgReport.aboutGreet.meetsStandards)
    }
    if (mgReport.aboutGreet.standardsIssuesDetails) {
      addLabelValue("Standards Issues", mgReport.aboutGreet.standardsIssuesDetails)
    }
    if (mgReport.aboutGreet.staffAppProblems) {
      addLabelValue("Staff App Issues", YES_NO_LABELS[mgReport.aboutGreet.staffAppProblems] || mgReport.aboutGreet.staffAppProblems)
    }
    if (mgReport.aboutGreet.staffAppProblemsDetails) {
      addLabelValue("App Issue Details", mgReport.aboutGreet.staffAppProblemsDetails)
    }
    if (mgReport.aboutGreet.partyRisk) {
      addLabelValue("Party Risk", YES_NO_LABELS[mgReport.aboutGreet.partyRisk] || mgReport.aboutGreet.partyRisk)
    }
    if (mgReport.aboutGreet.partyRiskDetails) {
      addLabelValue("Party Risk Details", mgReport.aboutGreet.partyRiskDetails)
    }
    if (mgReport.aboutGreet.wifiTestSuccess) {
      addLabelValue("WiFi Test", WIFI_TEST_LABELS[mgReport.aboutGreet.wifiTestSuccess] || mgReport.aboutGreet.wifiTestSuccess)
    }
    if (mgReport.aboutGreet.guestRequests) {
      addLabelValue("Guest Requests", mgReport.aboutGreet.guestRequests)
    }
    if (mgReport.aboutGreet.homeInfoChanges) {
      addLabelValue("Home Info Changes", mgReport.aboutGreet.homeInfoChanges)
    }
    yPosition += 4

    // 4. Maintenance & Closing
    addSectionHeader("4. Maintenance & Closing")
    if (mgReport.maintenanceClosing.maintenanceIssues) {
      addLabelValue("Maintenance Issues", YES_NO_LABELS[mgReport.maintenanceClosing.maintenanceIssues] || mgReport.maintenanceClosing.maintenanceIssues)
    }
    if (mgReport.maintenanceClosing.maintenanceIssuesDetails) {
      addLabelValue("Issue Details", mgReport.maintenanceClosing.maintenanceIssuesDetails)
    }
    if (mgReport.maintenanceClosing.greetEnjoyable) {
      addLabelValue("Greet Enjoyable", AGREEMENT_LABELS[mgReport.maintenanceClosing.greetEnjoyable] || mgReport.maintenanceClosing.greetEnjoyable)
    }
    if (mgReport.maintenanceClosing.difficultReasons && mgReport.maintenanceClosing.difficultReasons.length > 0) {
      const reasons = mgReport.maintenanceClosing.difficultReasons
        .map(r => r === "other" ? mgReport.maintenanceClosing.difficultOtherReason || "Other" : DIFFICULT_REASON_LABELS[r] || r)
        .join(", ")
      addLabelValue("Difficult Reasons", reasons)
    }
    if (mgReport.maintenanceClosing.otherComments) {
      addLabelValue("Other Comments", mgReport.maintenanceClosing.otherComments)
    }
    yPosition += 4

    // Submission timestamp
    if (mgReport.submittedAt) {
      checkNewPage(12)
      doc.setFontSize(9)
      doc.setFont("helvetica", "italic")
      doc.setTextColor(100, 100, 100)
      doc.text(`Report submitted: ${new Date(mgReport.submittedAt).toLocaleString()}`, margin, yPosition)
      doc.setTextColor(0, 0, 0)
    }
  }

  // ===== FOOTER =====
  const totalPages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
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

