/**
 * Meet & Greet Activity Report Types
 * Based on the WuFoo form: M&G Activity Report - all cities
 */

// ==================== ENUM TYPES ====================

export type ActivityTypeOption = 
  | "greet" 
  | "viewing" 
  | "other"

export type PartyType = 
  | "individual" 
  | "couple" 
  | "single-family" 
  | "multiple-families" 
  | "friendship-group" 
  | "business-group"

export type StayReason = 
  | "business" 
  | "leisure" 
  | "special-occasion" 
  | "relocation" 
  | "other"

export type GuestActivity = 
  | "sightseeing"
  | "exploring-city"
  | "shopping"
  | "visiting-family-friends"
  | "enjoying-home"
  | "eating-out"
  | "play-concert-show"
  | "wedding-special-occasion"
  | "visiting-schools-universities"

export type EnglishLevel = 
  | "first-language"
  | "easy-to-communicate"
  | "difficult-to-communicate"
  | "no-english"

export type PunctualityStatus = 
  | "on-time"
  | "early-30-plus"
  | "late-30-plus"

export type LateEarlyReason = 
  | "flight"
  | "train"
  | "traffic"
  | "other"
  | "not-sure"

export type AgreementScale = 
  | "strongly-agree"
  | "agree"
  | "disagree"
  | "strongly-disagree"

export type ContactPreference = 
  | "phone-sms-on-file"
  | "phone-sms-different"
  | "email"
  | "not-sure"

export type PhonePreference = 
  | "phonecalls"
  | "sms"
  | "not-sure"

export type YesNoNotSure = 
  | "yes"
  | "no"
  | "not-sure"

export type YesNo = 
  | "yes"
  | "no"

export type WiFiTestResult = 
  | "yes"
  | "no"
  | "unable-to-test"

export type DifficultReason = 
  | "guests-late-early"
  | "difficult-to-find-home"
  | "home-low-standard"
  | "problem-staff-app"
  | "problem-pre-auth"
  | "problem-wifi"
  | "problem-appliances"
  | "other"

// ==================== SECTION INTERFACES ====================

/**
 * Section 1: Basic Information
 */
export interface BasicInformation {
  // Hidden/pre-filled fields
  bookingRef?: string
  city?: string
  staffName?: string
  homeCode: string
  homeName?: string
  
  // User-entered fields
  activityType: ActivityTypeOption
  activityTypeOther?: string // Conditional: shown if activityType === "other"
  dateOfGreet: string // ISO date string
  arrivalTime?: string // HH:MM format
  departureTime?: string // HH:MM format
}

/**
 * Section 2: About the Guests
 */
export interface AboutGuests {
  partyType?: PartyType
  adultsCount?: string // Conditional: shown if partyType is group type
  childrenCount?: string // Conditional: shown if partyType is group type
  stayReason?: StayReason
  stayReasonOther?: string // Conditional: shown if stayReason === "other"
  guestActivities: GuestActivity[] // Multi-select
  adviceRequested?: string // Free text - what did they ask for
  englishLevel?: EnglishLevel
  firstLanguage?: string // Conditional: shown if englishLevel !== "first-language"
}

/**
 * Section 3: About the Greet
 */
export interface AboutGreet {
  // Punctuality
  guestsPunctuality?: PunctualityStatus
  earlyReason?: LateEarlyReason // Conditional: shown if punctuality === "early-30-plus"
  lateReason?: LateEarlyReason // Conditional: shown if punctuality === "late-30-plus"
  lateEarlyOtherReason?: string // Conditional: shown if earlyReason or lateReason === "other"
  
  // Home satisfaction
  guestsLovedHome?: AgreementScale
  guestsNotLoveHomeReason?: string // Conditional: shown if guestsLovedHome is disagree/strongly disagree
  
  // Contact preferences
  contactPreference?: ContactPreference
  alternativePhoneNumber?: string // Conditional: shown if contactPreference === "phone-sms-different"
  phonePreference?: PhonePreference // Conditional: shown if contactPreference includes phone
  
  // Check-out
  knowsCheckoutTime?: YesNoNotSure
  checkoutTime?: string // Conditional: shown if knowsCheckoutTime === "yes"
  
  // NYC specific
  notifiedOfHomeownerName?: YesNoNotSure // Conditional: shown if city === "NYC"
  
  // Pre-auth
  preAuthIssues?: YesNo
  preAuthIssuesDetails?: string // Conditional: shown if preAuthIssues === "yes"
  
  // Standards
  meetsStandards?: YesNoNotSure
  standardsIssuesDetails?: string // Conditional: shown if meetsStandards !== "yes"
  standardsIssuesPhotos?: string[] // File paths - Conditional
  
  // Staff app
  staffAppProblems?: YesNo
  staffAppProblemsDetails?: string // Conditional: shown if staffAppProblems === "yes"
  staffAppProblemsPhotos?: string[] // File paths - Conditional
  
  // Party risk
  partyRisk?: YesNo
  partyRiskDetails?: string // Conditional: shown if partyRisk === "yes"
  
  // WiFi test
  wifiTestSuccess?: WiFiTestResult
  
  // Guest requests
  guestRequests?: string // Free text
  
  // Home info changes
  homeInfoChanges?: string // Free text
  homeInfoChangesPhotos?: string[] // File paths
}

/**
 * Section 4: Maintenance & Closing
 */
export interface MaintenanceClosing {
  // Maintenance issues
  maintenanceIssues?: YesNo
  maintenanceIssuesDetails?: string // Conditional: shown if maintenanceIssues === "yes"
  
  // Enjoyability
  greetEnjoyable?: AgreementScale
  difficultReasons?: DifficultReason[] // Conditional: shown if greetEnjoyable is disagree/strongly disagree
  difficultOtherReason?: string // Conditional: shown if difficultReasons includes "other"
  
  // Comments
  otherComments?: string // Free text
  
  // File attachments
  attachments?: string[] // File paths
}

// ==================== COMPLETE FORM DATA ====================

/**
 * Complete M&G Activity Report Form Data
 */
export interface MeetGreetReportData {
  // Metadata
  id: string
  homeId: string
  activityId?: string
  submittedAt?: string // ISO timestamp
  
  // Form sections
  basicInfo: BasicInformation
  aboutGuests: AboutGuests
  aboutGreet: AboutGreet
  maintenanceClosing: MaintenanceClosing
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Get the localStorage key for a M&G report
 */
export function getMGReportStorageKey(homeId: string, activityId?: string): string {
  return activityId 
    ? `mg-report-${homeId}-${activityId}`
    : `mg-report-${homeId}-draft`
}

/**
 * Save M&G report to localStorage
 */
export function saveMGReport(report: MeetGreetReportData): void {
  if (typeof window === "undefined") return
  const key = getMGReportStorageKey(report.homeId, report.activityId)
  localStorage.setItem(key, JSON.stringify(report))
}

/**
 * Load M&G report from localStorage
 */
export function loadMGReport(homeId: string, activityId?: string): MeetGreetReportData | null {
  if (typeof window === "undefined") return null
  const key = getMGReportStorageKey(homeId, activityId)
  const data = localStorage.getItem(key)
  if (!data) return null
  try {
    return JSON.parse(data) as MeetGreetReportData
  } catch {
    return null
  }
}

/**
 * Clear M&G report from localStorage
 */
export function clearMGReport(homeId: string, activityId?: string): void {
  if (typeof window === "undefined") return
  const key = getMGReportStorageKey(homeId, activityId)
  localStorage.removeItem(key)
}

/**
 * Create initial empty report data
 */
export function createEmptyMGReport(
  homeId: string, 
  homeCode: string, 
  homeName?: string,
  activityId?: string,
  bookingRef?: string,
  city?: string,
  staffName?: string
): MeetGreetReportData {
  const today = new Date().toISOString().split('T')[0]
  
  return {
    id: `mg-${Date.now()}`,
    homeId,
    activityId,
    basicInfo: {
      bookingRef,
      city,
      staffName,
      homeCode,
      homeName,
      activityType: "greet",
      dateOfGreet: today,
    },
    aboutGuests: {
      guestActivities: [],
    },
    aboutGreet: {},
    maintenanceClosing: {},
  }
}

// ==================== DISPLAY LABELS ====================

export const PARTY_TYPE_LABELS: Record<PartyType, string> = {
  "individual": "Individual",
  "couple": "Couple",
  "single-family": "Single family",
  "multiple-families": "Multiple families",
  "friendship-group": "Friendship group",
  "business-group": "Business group",
}

export const STAY_REASON_LABELS: Record<StayReason, string> = {
  "business": "Business",
  "leisure": "Leisure",
  "special-occasion": "Special occasion",
  "relocation": "Relocation to the city",
  "other": "Other",
}

export const GUEST_ACTIVITY_LABELS: Record<GuestActivity, string> = {
  "sightseeing": "Sightseeing",
  "exploring-city": "Exploring the city",
  "shopping": "Shopping",
  "visiting-family-friends": "Visiting family and/or friends",
  "enjoying-home": "Enjoying the home",
  "eating-out": "Eating out",
  "play-concert-show": "Seeing a play/concert/show",
  "wedding-special-occasion": "Wedding or other special occasion",
  "visiting-schools-universities": "Visiting schools/universities",
}

export const ENGLISH_LEVEL_LABELS: Record<EnglishLevel, string> = {
  "first-language": "First language",
  "easy-to-communicate": "Easy to communicate",
  "difficult-to-communicate": "Difficult to communicate",
  "no-english": "Guests do not speak English",
}

export const PUNCTUALITY_LABELS: Record<PunctualityStatus, string> = {
  "on-time": "On time",
  "early-30-plus": "Early (over 30 mins)",
  "late-30-plus": "Late (over 30 mins)",
}

export const LATE_EARLY_REASON_LABELS: Record<LateEarlyReason, string> = {
  "flight": "Flight",
  "train": "Train",
  "traffic": "Traffic",
  "other": "Other",
  "not-sure": "Not sure",
}

export const AGREEMENT_LABELS: Record<AgreementScale, string> = {
  "strongly-agree": "Strongly agree",
  "agree": "Agree",
  "disagree": "Disagree",
  "strongly-disagree": "Strongly disagree",
}

export const CONTACT_PREFERENCE_LABELS: Record<ContactPreference, string> = {
  "phone-sms-on-file": "Phone calls/SMS on the number on file",
  "phone-sms-different": "Phone calls/SMS on a different number",
  "email": "Email",
  "not-sure": "Not sure",
}

export const YES_NO_LABELS: Record<YesNo, string> = {
  "yes": "Yes",
  "no": "No",
}

export const YES_NO_NOT_SURE_LABELS: Record<YesNoNotSure, string> = {
  "yes": "Yes",
  "no": "No",
  "not-sure": "Not sure",
}

export const WIFI_TEST_LABELS: Record<WiFiTestResult, string> = {
  "yes": "Yes",
  "no": "No",
  "unable-to-test": "Wasn't able to test",
}

export const DIFFICULT_REASON_LABELS: Record<DifficultReason, string> = {
  "guests-late-early": "Guests late/early",
  "difficult-to-find-home": "Difficult to find the home",
  "home-low-standard": "Home was of a low standard",
  "problem-staff-app": "Problem with the staff app",
  "problem-pre-auth": "Problem with the pre-auth",
  "problem-wifi": "Problem with wifi",
  "problem-appliances": "Problem with appliances",
  "other": "Other",
}

