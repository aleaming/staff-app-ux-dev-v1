"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Users,
  Clock,
  Home,
  MessageSquare,
  Wrench,
  Send,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import {
  type MeetGreetReportData,
  type PartyType,
  type StayReason,
  type GuestActivity,
  type EnglishLevel,
  type PunctualityStatus,
  type LateEarlyReason,
  type AgreementScale,
  type ContactPreference,
  type PhonePreference,
  type YesNo,
  type YesNoNotSure,
  type WiFiTestResult,
  type DifficultReason,
  type ActivityTypeOption,
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
  createEmptyMGReport,
  saveMGReport,
  loadMGReport,
} from "@/lib/meet-greet-report-types"

interface MeetGreetReportFormProps {
  homeId: string
  homeCode: string
  homeName?: string
  activityId?: string
  bookingId?: string
  city?: string
  staffName?: string
  onSubmit?: (data: MeetGreetReportData) => void
  onCancel?: () => void
}

export function MeetGreetReportForm({
  homeId,
  homeCode,
  homeName,
  activityId,
  bookingId,
  city,
  staffName,
  onSubmit,
  onCancel,
}: MeetGreetReportFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    guests: true,
    greet: true,
    closing: true,
  })

  // Initialize form data
  const [formData, setFormData] = useState<MeetGreetReportData>(() => {
    // Try to load existing draft
    const existing = loadMGReport(homeId, activityId)
    if (existing) return existing
    
    // Create new empty report
    return createEmptyMGReport(homeId, homeCode, homeName, activityId, bookingId, city, staffName)
  })

  // Auto-save draft
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveMGReport(formData)
    }, 1000)
    return () => clearTimeout(timeoutId)
  }, [formData])

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  // Update helpers
  const updateBasicInfo = useCallback((updates: Partial<MeetGreetReportData["basicInfo"]>) => {
    setFormData(prev => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, ...updates },
    }))
  }, [])

  const updateAboutGuests = useCallback((updates: Partial<MeetGreetReportData["aboutGuests"]>) => {
    setFormData(prev => ({
      ...prev,
      aboutGuests: { ...prev.aboutGuests, ...updates },
    }))
  }, [])

  const updateAboutGreet = useCallback((updates: Partial<MeetGreetReportData["aboutGreet"]>) => {
    setFormData(prev => ({
      ...prev,
      aboutGreet: { ...prev.aboutGreet, ...updates },
    }))
  }, [])

  const updateMaintenanceClosing = useCallback((updates: Partial<MeetGreetReportData["maintenanceClosing"]>) => {
    setFormData(prev => ({
      ...prev,
      maintenanceClosing: { ...prev.maintenanceClosing, ...updates },
    }))
  }, [])

  // Toggle guest activity
  const toggleGuestActivity = (activity: GuestActivity) => {
    const current = formData.aboutGuests.guestActivities || []
    const updated = current.includes(activity)
      ? current.filter(a => a !== activity)
      : [...current, activity]
    updateAboutGuests({ guestActivities: updated })
  }

  // Toggle difficult reason
  const toggleDifficultReason = (reason: DifficultReason) => {
    const current = formData.maintenanceClosing.difficultReasons || []
    const updated = current.includes(reason)
      ? current.filter(r => r !== reason)
      : [...current, reason]
    updateMaintenanceClosing({ difficultReasons: updated })
  }

  // Check if party type requires group counts
  const showGroupCounts = ["single-family", "multiple-families", "friendship-group", "business-group"].includes(
    formData.aboutGuests.partyType || ""
  )

  // Check if greet was not enjoyable
  const showDifficultReasons = ["disagree", "strongly-disagree"].includes(
    formData.maintenanceClosing.greetEnjoyable || ""
  )

  // Check if guests didn't love the home
  const showNotLoveHomeReason = ["disagree", "strongly-disagree"].includes(
    formData.aboutGreet.guestsLovedHome || ""
  )

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const submittedData: MeetGreetReportData = {
        ...formData,
        submittedAt: new Date().toISOString(),
      }

      // Save final version
      saveMGReport(submittedData)

      if (onSubmit) {
        onSubmit(submittedData)
      } else {
        // Default: redirect back to activity tracker with report complete flag
        const returnUrl = activityId
          ? `/homes/${homeId}/activities/meet-greet/track?reportComplete=true&activityId=${activityId}`
          : `/homes/${homeId}/activities/meet-greet/track?reportComplete=true`
        
        if (bookingId) {
          router.push(`${returnUrl}&bookingId=${bookingId}`)
        } else {
          router.push(returnUrl)
        }
      }
    } catch (error) {
      console.error("Error submitting report:", error)
      alert("Failed to submit report. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Section Header Component
  const SectionHeader = ({ 
    title, 
    icon: Icon, 
    section, 
    description 
  }: { 
    title: string
    icon: React.ElementType
    section: string
    description?: string
  }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between py-2 text-left"
    >
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <div>
          <h3 className="font-semibold">{title}</h3>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {expandedSections[section] ? (
        <ChevronUp className="h-4 w-4 text-muted-foreground" />
      ) : (
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      )}
    </button>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">M&G Activity Report</h1>
          <p className="text-sm text-muted-foreground">
            {homeCode} {homeName && `• ${homeName}`}
          </p>
        </div>
        <Badge variant="secondary">Draft auto-saved</Badge>
      </div>

      {/* Section 1: Basic Information */}
      <Card>
        <CardHeader className="pb-2">
          <SectionHeader
            title="Basic Information"
            icon={Clock}
            section="basic"
          />
        </CardHeader>
        {expandedSections.basic && (
          <CardContent className="space-y-4">
            {/* Home Code (read-only) */}
            <div className="space-y-2">
              <Label>Home Code</Label>
              <Input value={homeCode} disabled className="bg-muted" />
            </div>

            {/* Activity Type */}
            <div className="space-y-2">
              <Label>What activity is this?</Label>
              <Select
                value={formData.basicInfo.activityType}
                onValueChange={(value: ActivityTypeOption) => updateBasicInfo({ activityType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="greet">It's a Greet</SelectItem>
                  <SelectItem value="viewing">It's a Viewing</SelectItem>
                  <SelectItem value="other">It's something else</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Conditional: Other activity type */}
            {formData.basicInfo.activityType === "other" && (
              <div className="space-y-2">
                <Label>Please tell us what activity you're doing:</Label>
                <Input
                  value={formData.basicInfo.activityTypeOther || ""}
                  onChange={(e) => updateBasicInfo({ activityTypeOther: e.target.value })}
                  placeholder="Enter activity type"
                />
              </div>
            )}

            {/* Date of Greet */}
            <div className="space-y-2">
              <Label>Date of Greet <span className="text-destructive">*</span></Label>
              <Input
                type="date"
                value={formData.basicInfo.dateOfGreet}
                onChange={(e) => updateBasicInfo({ dateOfGreet: e.target.value })}
                required
              />
            </div>

            {/* Arrival Time */}
            <div className="space-y-2">
              <Label>What time did you arrive at the home?</Label>
              <Input
                type="time"
                value={formData.basicInfo.arrivalTime || ""}
                onChange={(e) => updateBasicInfo({ arrivalTime: e.target.value })}
              />
            </div>

            {/* Departure Time */}
            <div className="space-y-2">
              <Label>What time did you leave the home?</Label>
              <Input
                type="time"
                value={formData.basicInfo.departureTime || ""}
                onChange={(e) => updateBasicInfo({ departureTime: e.target.value })}
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Section 2: About the Guests */}
      <Card>
        <CardHeader className="pb-2">
          <SectionHeader
            title="About the Guests"
            icon={Users}
            section="guests"
            description="Your information helps us make the onefinestay service better"
          />
        </CardHeader>
        {expandedSections.guests && (
          <CardContent className="space-y-4">
            {/* Party Type */}
            <div className="space-y-2">
              <Label>What was the party type?</Label>
              <Select
                value={formData.aboutGuests.partyType || ""}
                onValueChange={(value: PartyType) => updateAboutGuests({ partyType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select party type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PARTY_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Conditional: Group counts */}
            {showGroupCounts && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>How many adults (18+)?</Label>
                  <Select
                    value={formData.aboutGuests.adultsCount || ""}
                    onValueChange={(value) => updateAboutGuests({ adultsCount: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {["1", "2", "3", "4", "5", "6", "7+"].map((num) => (
                        <SelectItem key={num} value={num}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>How many children (0-18)?</Label>
                  <Select
                    value={formData.aboutGuests.childrenCount || ""}
                    onValueChange={(value) => updateAboutGuests({ childrenCount: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {["0", "1", "2", "3", "4", "5+"].map((num) => (
                        <SelectItem key={num} value={num}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Stay Reason */}
            <div className="space-y-2">
              <Label>What was the guest's main reason for their stay?</Label>
              <Select
                value={formData.aboutGuests.stayReason || ""}
                onValueChange={(value: StayReason) => updateAboutGuests({ stayReason: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STAY_REASON_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Conditional: Other reason */}
            {formData.aboutGuests.stayReason === "other" && (
              <div className="space-y-2">
                <Label>If the guests are visiting for another reason, please tell us!</Label>
                <Input
                  value={formData.aboutGuests.stayReasonOther || ""}
                  onChange={(e) => updateAboutGuests({ stayReasonOther: e.target.value })}
                  placeholder="Enter reason"
                />
              </div>
            )}

            {/* Guest Activities - Multi-select */}
            <div className="space-y-2">
              <Label>Which of the following will the guest be doing during their stay?</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(GUEST_ACTIVITY_LABELS).map(([value, label]) => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`activity-${value}`}
                      checked={formData.aboutGuests.guestActivities?.includes(value as GuestActivity)}
                      onCheckedChange={() => toggleGuestActivity(value as GuestActivity)}
                    />
                    <label
                      htmlFor={`activity-${value}`}
                      className="text-sm cursor-pointer"
                    >
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Advice Requested */}
            <div className="space-y-2">
              <Label>Did the guests ask for your advice on any services or things to do?</Label>
              <Textarea
                value={formData.aboutGuests.adviceRequested || ""}
                onChange={(e) => updateAboutGuests({ adviceRequested: e.target.value })}
                placeholder="e.g. taxis, babysitting, restaurants..."
                rows={2}
              />
            </div>

            {/* English Level */}
            <div className="space-y-2">
              <Label>How was the guest's level of English?</Label>
              <Select
                value={formData.aboutGuests.englishLevel || ""}
                onValueChange={(value: EnglishLevel) => updateAboutGuests({ englishLevel: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ENGLISH_LEVEL_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Conditional: First Language */}
            {formData.aboutGuests.englishLevel && formData.aboutGuests.englishLevel !== "first-language" && (
              <div className="space-y-2">
                <Label>What is their first language?</Label>
                <Input
                  value={formData.aboutGuests.firstLanguage || ""}
                  onChange={(e) => updateAboutGuests({ firstLanguage: e.target.value })}
                  placeholder="Enter language"
                />
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Section 3: About the Greet */}
      <Card>
        <CardHeader className="pb-2">
          <SectionHeader
            title="About the Greet"
            icon={Home}
            section="greet"
            description="How did it go?"
          />
        </CardHeader>
        {expandedSections.greet && (
          <CardContent className="space-y-4">
            {/* Punctuality */}
            <div className="space-y-2">
              <Label>Were the guests on time?</Label>
              <Select
                value={formData.aboutGreet.guestsPunctuality || ""}
                onValueChange={(value: PunctualityStatus) => updateAboutGreet({ guestsPunctuality: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PUNCTUALITY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Conditional: Early reason */}
            {formData.aboutGreet.guestsPunctuality === "early-30-plus" && (
              <div className="space-y-2">
                <Label>Why were they early?</Label>
                <Select
                  value={formData.aboutGreet.earlyReason || ""}
                  onValueChange={(value: LateEarlyReason) => updateAboutGreet({ earlyReason: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(LATE_EARLY_REASON_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Conditional: Late reason */}
            {formData.aboutGreet.guestsPunctuality === "late-30-plus" && (
              <div className="space-y-2">
                <Label>Why were they late?</Label>
                <Select
                  value={formData.aboutGreet.lateReason || ""}
                  onValueChange={(value: LateEarlyReason) => updateAboutGreet({ lateReason: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(LATE_EARLY_REASON_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Conditional: Other late/early reason */}
            {(formData.aboutGreet.earlyReason === "other" || formData.aboutGreet.lateReason === "other") && (
              <div className="space-y-2">
                <Label>If other, why?</Label>
                <Input
                  value={formData.aboutGreet.lateEarlyOtherReason || ""}
                  onChange={(e) => updateAboutGreet({ lateEarlyOtherReason: e.target.value })}
                  placeholder="Enter reason"
                />
              </div>
            )}

            <Separator />

            {/* Guests loved home */}
            <div className="space-y-2">
              <Label>The guests loved the home!</Label>
              <Select
                value={formData.aboutGreet.guestsLovedHome || ""}
                onValueChange={(value: AgreementScale) => updateAboutGreet({ guestsLovedHome: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(AGREEMENT_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Conditional: Why didn't love home */}
            {showNotLoveHomeReason && (
              <div className="space-y-2">
                <Label>Please can you provide more details, as to why the guest does not love the home?</Label>
                <Textarea
                  value={formData.aboutGreet.guestsNotLoveHomeReason || ""}
                  onChange={(e) => updateAboutGreet({ guestsNotLoveHomeReason: e.target.value })}
                  rows={3}
                />
              </div>
            )}

            <Separator />

            {/* Contact Preference */}
            <div className="space-y-2">
              <Label>Guest contact preference?</Label>
              <Select
                value={formData.aboutGreet.contactPreference || ""}
                onValueChange={(value: ContactPreference) => updateAboutGreet({ contactPreference: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CONTACT_PREFERENCE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Conditional: Alternative phone number */}
            {formData.aboutGreet.contactPreference === "phone-sms-different" && (
              <div className="space-y-2">
                <Label>Please provide the alternative number.</Label>
                <Input
                  type="tel"
                  value={formData.aboutGreet.alternativePhoneNumber || ""}
                  onChange={(e) => updateAboutGreet({ alternativePhoneNumber: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
            )}

            {/* Conditional: Phone preference */}
            {formData.aboutGreet.contactPreference && 
             ["phone-sms-on-file", "phone-sms-different", "email"].includes(formData.aboutGreet.contactPreference) && (
              <div className="space-y-2">
                <Label>Would the guest prefer phonecalls or SMS?</Label>
                <Select
                  value={formData.aboutGreet.phonePreference || ""}
                  onValueChange={(value: PhonePreference) => updateAboutGreet({ phonePreference: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phonecalls">Phonecalls</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="not-sure">Not sure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Separator />

            {/* Checkout time knowledge */}
            <div className="space-y-2">
              <Label>Do the guests have an idea of their check-out time?</Label>
              <p className="text-xs text-muted-foreground">
                Remember to check that guests have not booked a transfer with us; they are always free to stay until 11am.
              </p>
              <Select
                value={formData.aboutGreet.knowsCheckoutTime || ""}
                onValueChange={(value: YesNoNotSure) => updateAboutGreet({ knowsCheckoutTime: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(YES_NO_NOT_SURE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Conditional: Checkout time */}
            {formData.aboutGreet.knowsCheckoutTime === "yes" && (
              <div className="space-y-2">
                <Label>What time will they check-out?</Label>
                <Input
                  type="time"
                  value={formData.aboutGreet.checkoutTime || ""}
                  onChange={(e) => updateAboutGreet({ checkoutTime: e.target.value })}
                />
              </div>
            )}

            <Separator />

            {/* Pre-auth issues */}
            <div className="space-y-2">
              <Label>Did the guest/s have any issues with the pre-auth?</Label>
              <Select
                value={formData.aboutGreet.preAuthIssues || ""}
                onValueChange={(value: YesNo) => updateAboutGreet({ preAuthIssues: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(YES_NO_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Conditional: Pre-auth issues details */}
            {formData.aboutGreet.preAuthIssues === "yes" && (
              <div className="space-y-2">
                <Label>What were the guest issues with the pre-auth?</Label>
                <Input
                  value={formData.aboutGreet.preAuthIssuesDetails || ""}
                  onChange={(e) => updateAboutGreet({ preAuthIssuesDetails: e.target.value })}
                  placeholder="Describe the issues"
                />
              </div>
            )}

            <Separator />

            {/* Meets standards */}
            <div className="space-y-2">
              <Label>Did you feel the home meets onefinestay's standards?</Label>
              <Select
                value={formData.aboutGreet.meetsStandards || ""}
                onValueChange={(value: YesNoNotSure) => updateAboutGreet({ meetsStandards: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(YES_NO_NOT_SURE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Conditional: Standards issues */}
            {formData.aboutGreet.meetsStandards && formData.aboutGreet.meetsStandards !== "yes" && (
              <div className="space-y-2">
                <Label>Why didn't you think the home was up to our standards?</Label>
                <Input
                  value={formData.aboutGreet.standardsIssuesDetails || ""}
                  onChange={(e) => updateAboutGreet({ standardsIssuesDetails: e.target.value })}
                  placeholder="Describe the issues"
                />
              </div>
            )}

            <Separator />

            {/* Staff app problems */}
            <div className="space-y-2">
              <Label>Did you have a problem with the Staff App?</Label>
              <Select
                value={formData.aboutGreet.staffAppProblems || ""}
                onValueChange={(value: YesNo) => updateAboutGreet({ staffAppProblems: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(YES_NO_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Conditional: Staff app problems details */}
            {formData.aboutGreet.staffAppProblems === "yes" && (
              <div className="space-y-2">
                <Label>What went wrong with the App?</Label>
                <Input
                  value={formData.aboutGreet.staffAppProblemsDetails || ""}
                  onChange={(e) => updateAboutGreet({ staffAppProblemsDetails: e.target.value })}
                  placeholder="Describe the problem"
                />
              </div>
            )}

            <Separator />

            {/* Party risk */}
            <div className="space-y-2">
              <Label>Is there a risk that the guests will have a party?</Label>
              <Select
                value={formData.aboutGreet.partyRisk || ""}
                onValueChange={(value: YesNo) => updateAboutGreet({ partyRisk: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(YES_NO_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Conditional: Party risk details */}
            {formData.aboutGreet.partyRisk === "yes" && (
              <div className="space-y-2">
                <Label>Why do you think there's a risk that the guests will have a party?</Label>
                <Textarea
                  value={formData.aboutGreet.partyRiskDetails || ""}
                  onChange={(e) => updateAboutGreet({ partyRiskDetails: e.target.value })}
                  rows={2}
                />
              </div>
            )}

            <Separator />

            {/* WiFi test */}
            <div className="space-y-2">
              <Label>Were you able to successfully stream a YouTube video in the home?</Label>
              <Select
                value={formData.aboutGreet.wifiTestSuccess || ""}
                onValueChange={(value: WiFiTestResult) => updateAboutGreet({ wifiTestSuccess: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(WIFI_TEST_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Guest requests */}
            <div className="space-y-2">
              <Label>Did the guests request anything else?</Label>
              <Textarea
                value={formData.aboutGreet.guestRequests || ""}
                onChange={(e) => updateAboutGreet({ guestRequests: e.target.value })}
                rows={2}
                placeholder="Enter any additional requests"
              />
            </div>

            {/* Home info changes */}
            <div className="space-y-2">
              <Label>Did you spot anything we need to change for this home's Home Information?</Label>
              <Textarea
                value={formData.aboutGreet.homeInfoChanges || ""}
                onChange={(e) => updateAboutGreet({ homeInfoChanges: e.target.value })}
                rows={2}
                placeholder="Enter any changes needed"
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Section 4: Maintenance & Closing */}
      <Card>
        <CardHeader className="pb-2">
          <SectionHeader
            title="Maintenance & Closing"
            icon={Wrench}
            section="closing"
          />
        </CardHeader>
        {expandedSections.closing && (
          <CardContent className="space-y-4">
            {/* Maintenance issues */}
            <div className="space-y-2">
              <Label>Did you have any problems with any of the appliances during the Greet, or any maintenance issues that need addressing in stay?</Label>
              <Select
                value={formData.maintenanceClosing.maintenanceIssues || ""}
                onValueChange={(value: YesNo) => updateMaintenanceClosing({ maintenanceIssues: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(YES_NO_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Conditional: Maintenance issues details */}
            {formData.maintenanceClosing.maintenanceIssues === "yes" && (
              <div className="space-y-2">
                <Label>Please can you describe the problem?</Label>
                <Textarea
                  value={formData.maintenanceClosing.maintenanceIssuesDetails || ""}
                  onChange={(e) => updateMaintenanceClosing({ maintenanceIssuesDetails: e.target.value })}
                  rows={3}
                />
              </div>
            )}

            <Separator />

            {/* Greet enjoyable */}
            <div className="space-y-2">
              <Label>That greet was really enjoyable!</Label>
              <Select
                value={formData.maintenanceClosing.greetEnjoyable || ""}
                onValueChange={(value: AgreementScale) => updateMaintenanceClosing({ greetEnjoyable: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(AGREEMENT_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Conditional: Difficult reasons */}
            {showDifficultReasons && (
              <div className="space-y-2">
                <Label>What made it difficult?</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(DIFFICULT_REASON_LABELS).map(([value, label]) => (
                    <div key={value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`difficult-${value}`}
                        checked={formData.maintenanceClosing.difficultReasons?.includes(value as DifficultReason)}
                        onCheckedChange={() => toggleDifficultReason(value as DifficultReason)}
                      />
                      <label
                        htmlFor={`difficult-${value}`}
                        className="text-sm cursor-pointer"
                      >
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conditional: Other difficult reason */}
            {formData.maintenanceClosing.difficultReasons?.includes("other") && (
              <div className="space-y-2">
                <Label>If other, what made it difficult?</Label>
                <Input
                  value={formData.maintenanceClosing.difficultOtherReason || ""}
                  onChange={(e) => updateMaintenanceClosing({ difficultOtherReason: e.target.value })}
                  placeholder="Enter reason"
                />
              </div>
            )}

            <Separator />

            {/* Other comments */}
            <div className="space-y-2">
              <Label>Any other comments?</Label>
              <Textarea
                value={formData.maintenanceClosing.otherComments || ""}
                onChange={(e) => updateMaintenanceClosing({ otherComments: e.target.value })}
                rows={3}
                placeholder="Enter any additional comments"
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 pb-24">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="sm:flex-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="sm:flex-1"
        >
          {isSubmitting ? (
            "Submitting..."
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Submit Report & Complete Activity
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

