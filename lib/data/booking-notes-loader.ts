/**
 * Booking Notes Data Loader
 * 
 * Loads booking notes data from CSV and parses structured fields.
 * These notes contain critical information for field staff including
 * entry codes, guest context, and special instructions.
 */

import { parseCSV, type BookingNotesCSVRow } from '../csv-loader'
import type { BookingNotes } from '../test-data'

// CSV data (loaded at runtime from public folder)
let bookingNotesCSV: string = ''
let _isInitialized = false

/**
 * Initialize the booking notes loader by fetching CSV data
 */
async function initializeBookingNotesData(): Promise<void> {
  if (_isInitialized && bookingNotesCSV) return
  
  try {
    console.log('[booking-notes-loader] Fetching /data/booking-notes.csv...')
    const response = await fetch('/data/booking-notes.csv')
    console.log('[booking-notes-loader] Response status:', response.status)
    if (response.ok) {
      bookingNotesCSV = await response.text()
      _isInitialized = true
      console.log('[booking-notes-loader] CSV loaded, length:', bookingNotesCSV.length)
    } else {
      console.error('[booking-notes-loader] Failed to fetch CSV:', response.statusText)
    }
  } catch (error) {
    console.warn('[booking-notes-loader] Failed to load booking notes CSV:', error)
  }
}

/**
 * Extract a field value from notes text using regex
 */
function extractField(notes: string, fieldName: string): string | undefined {
  // Try various patterns for field extraction
  const patterns = [
    new RegExp(`${fieldName}:\\s*([^\\n]+?)(?=\\s+[A-Z][a-z]+\\s*:|$)`, 'i'),
    new RegExp(`${fieldName}\\?:\\s*([^\\n]+?)(?=\\s+[A-Z][a-z]+\\s*:|$)`, 'i'),
    new RegExp(`${fieldName}:\\s*(.+?)(?=\\s+\\w+:|$)`, 'i'),
  ]
  
  for (const pattern of patterns) {
    const match = notes.match(pattern)
    if (match && match[1]) {
      const value = match[1].trim()
      if (value && value !== 'N/A' && value !== 'NA' && value !== 'None' && value !== 'NULL') {
        return value
      }
    }
  }
  return undefined
}

/**
 * Extract entry codes from notes text
 */
function extractEntryCodes(notes: string): { streetLevel?: string; apartment?: string } | undefined {
  const codes: { streetLevel?: string; apartment?: string } = {}
  
  // Look for street level code
  const streetMatch = notes.match(/Street\s+level\s*(?:CODE)?:?\s*(\d+)/i)
  if (streetMatch) {
    codes.streetLevel = streetMatch[1]
  }
  
  // Look for apartment code
  const apartmentMatch = notes.match(/Apartment\s*(?:CODE)?:?\s*(\d+)/i)
  if (apartmentMatch) {
    codes.apartment = apartmentMatch[1]
  }
  
  return (codes.streetLevel || codes.apartment) ? codes : undefined
}

/**
 * Extract JIRA link from notes text
 */
function extractJiraLink(notes: string): string | undefined {
  const jiraMatch = notes.match(/https:\/\/onefinestay\.atlassian\.net\/[^\s]+/i)
  return jiraMatch ? jiraMatch[0] : undefined
}

/**
 * Extract action required notices from notes text
 */
function extractActionRequired(notes: string): string | undefined {
  const actionMatch = notes.match(/ACTION REQUIRED[^!]*!/i)
  if (actionMatch) {
    // Get more context around the action required
    const fullMatch = notes.match(/(?:M&G\s+)?ACTION REQUIRED[^.!]*[.!]/i)
    return fullMatch ? fullMatch[0].trim() : actionMatch[0].trim()
  }
  return undefined
}

/**
 * Parse repeat guest field to boolean
 */
function parseRepeatGuest(value: string | undefined): boolean | undefined {
  if (!value) return undefined
  const lowerValue = value.toLowerCase().trim()
  if (lowerValue === 'yes' || lowerValue === 'true') return true
  if (lowerValue === 'no' || lowerValue === 'false') return false
  return undefined
}

/**
 * Convert CSV row to BookingNotes interface
 */
function mapCSVRowToBookingNotes(row: BookingNotesCSVRow): BookingNotes | null {
  const bookingRef = row['booking_ref']?.trim()
  if (!bookingRef) return null
  
  // Combine all notes fields
  const allNotes = [row['notes1'], row['notes2'], row['notes3']]
    .filter(n => n && n !== 'NULL')
    .join(' ')
    .trim()
  
  if (!allNotes) {
    return { bookingRef, rawNotes: '' }
  }
  
  return {
    bookingRef,
    advisorInitials: extractField(allNotes, 'Initials') || extractField(allNotes, 'Advisor Name'),
    repeatGuest: parseRepeatGuest(
      extractField(allNotes, 'Repeat Guest') || extractField(allNotes, 'Repeat guest')
    ),
    contextOfStay: extractField(allNotes, 'Context Of Stay') || extractField(allNotes, 'Purpose of the stay'),
    groupMakeup: extractField(allNotes, 'Group Make Up') || extractField(allNotes, 'Group Makeup'),
    concerns: extractField(allNotes, 'Any Concerns/Requirements/Requests') || 
              extractField(allNotes, 'Any Concerns/Exceptions/Requirements/Request'),
    checkInOutNotes: extractField(allNotes, 'Outlined Check-In/Check-Out time'),
    flexRate: extractField(allNotes, 'Offered Flex Rate') || extractField(allNotes, 'Offered Flex'),
    discountNote: extractField(allNotes, 'Discount Note'),
    adminFeeNote: extractField(allNotes, 'Admin Fee Note'),
    homeownerNotes: extractField(allNotes, 'Homeowner Notes') || extractField(allNotes, 'Homeowner'),
    jiraLink: extractJiraLink(allNotes),
    welcomeMessage: extractField(allNotes, 'Welcome Message'),
    entryCodes: extractEntryCodes(allNotes),
    actionRequired: extractActionRequired(allNotes),
    rawNotes: allNotes,
  }
}

/**
 * Load booking notes from CSV (sync, uses cached data)
 */
export function loadBookingNotes(): BookingNotes[] {
  if (!bookingNotesCSV) {
    console.warn('Booking notes CSV not loaded yet. Call refreshBookingNotes() first.')
    return []
  }

  const result = parseCSV<BookingNotesCSVRow>(bookingNotesCSV)
  
  if (result.errors.length > 0) {
    console.warn('Booking notes CSV parsing errors:', result.errors)
  }

  return result.data
    .map(row => mapCSVRowToBookingNotes(row))
    .filter((notes): notes is BookingNotes => notes !== null)
}

/**
 * Get booking notes by booking reference
 */
export function getBookingNotesByRef(notes: BookingNotes[], bookingRef: string): BookingNotes | undefined {
  return notes.find(n => n.bookingRef === bookingRef)
}

/**
 * Get all bookings with entry codes
 */
export function getBookingsWithEntryCodes(notes: BookingNotes[]): BookingNotes[] {
  return notes.filter(n => n.entryCodes && (n.entryCodes.streetLevel || n.entryCodes.apartment))
}

/**
 * Get all bookings with action required
 */
export function getBookingsWithActionRequired(notes: BookingNotes[]): BookingNotes[] {
  return notes.filter(n => n.actionRequired)
}

// Export pre-loaded notes for immediate use
let _cachedBookingNotes: BookingNotes[] | null = null

export function getBookingNotes(): BookingNotes[] {
  if (!_cachedBookingNotes) {
    _cachedBookingNotes = loadBookingNotes()
  }
  return _cachedBookingNotes
}

export async function refreshBookingNotes(): Promise<BookingNotes[]> {
  await initializeBookingNotesData()
  _cachedBookingNotes = loadBookingNotes()
  return _cachedBookingNotes
}

// Initialize data when module loads (if in browser)
if (typeof window !== 'undefined') {
  initializeBookingNotesData().catch(console.warn)
}

