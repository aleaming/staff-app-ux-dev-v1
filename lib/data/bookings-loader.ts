/**
 * Bookings Data Loader
 * 
 * Loads bookings data from CSV and maps to Booking interface.
 */

import { parseCSV, type BookingsCSVRow } from '../csv-loader'
import type { Booking } from '../test-data'

// CSV data (loaded at runtime from public folder)
let bookingsCSV: string = ''
let _isInitialized = false

/**
 * Initialize the bookings loader by fetching CSV data
 */
async function initializeBookingsData(): Promise<void> {
  if (_isInitialized && bookingsCSV) return
  
  try {
    const response = await fetch('/data/bookings.csv')
    if (response.ok) {
      bookingsCSV = await response.text()
      _isInitialized = true
    }
  } catch (error) {
    console.warn('Failed to load bookings CSV:', error)
  }
}

/**
 * Parse date string from CSV format (MM-DD-YYYY) to Date
 */
function parseDate(dateStr: string): Date {
  if (!dateStr || dateStr === '[Blank]') {
    return new Date()
  }
  
  // Handle MM-DD-YYYY format
  const parts = dateStr.split('-')
  if (parts.length === 3) {
    const month = parseInt(parts[0], 10) - 1 // JS months are 0-indexed
    const day = parseInt(parts[1], 10)
    const year = parseInt(parts[2], 10)
    return new Date(year, month, day)
  }
  
  // Fallback to standard date parsing
  return new Date(dateStr)
}

/**
 * Map booking status based on CSV status and dates
 */
function mapBookingStatus(
  csvStatus: string,
  arrival: Date,
  departure: Date
): 'upcoming' | 'current' | 'departure' | 'completed' {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const arrivalDate = new Date(arrival.getFullYear(), arrival.getMonth(), arrival.getDate())
  const departureDate = new Date(departure.getFullYear(), departure.getMonth(), departure.getDate())

  // Check CSV status first
  if (csvStatus === 'Closed') {
    return 'completed'
  }

  // Date-based status
  if (departureDate.getTime() === today.getTime()) {
    return 'departure'
  }
  
  if (arrivalDate <= today && departureDate > today) {
    return 'current'
  }
  
  if (arrivalDate > today) {
    return 'upcoming'
  }

  // Past bookings
  if (departureDate < today) {
    return 'completed'
  }

  return 'upcoming'
}

/**
 * Extract guest name, handling [Blank] values
 */
function extractGuestName(guest: string): string {
  if (!guest || guest === '[Blank]' || guest.trim() === '') {
    return 'Guest'
  }
  return guest.trim()
}

/**
 * Generate a unique internal ID from booking ref
 */
function generateBookingId(bookingRef: string, index: number): string {
  // Clean up the booking ref for use as ID
  const cleanRef = bookingRef.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase()
  return `booking-${cleanRef}-${index}`
}

/**
 * Convert CSV row to Booking interface
 */
function mapCSVRowToBooking(row: BookingsCSVRow, index: number): Booking | null {
  // Skip empty rows or invalid data
  if (!row['Booking Ref'] || row['Booking Ref'].trim() === '') {
    return null
  }

  const bookingRef = row['Booking Ref'].trim()
  const arrival = parseDate(row['Arrival'])
  const departure = parseDate(row['Departure'])

  return {
    id: generateBookingId(bookingRef, index),
    bookingId: bookingRef,
    guestName: extractGuestName(row['Guest']),
    homeCode: row['Home ID']?.trim() || '',
    homeId: `home-${(row['Home ID'] || '').toLowerCase().trim()}-0`, // Simplified home ID reference
    checkIn: arrival,
    checkOut: departure,
    status: mapBookingStatus(row['Status'], arrival, departure),
    // Optional fields
    guestEmail: undefined,
    guestPhone: undefined,
    numberOfGuests: undefined,
    specialRequests: undefined,
  }
}

/**
 * Load bookings from CSV (sync, uses cached data)
 */
export function loadBookings(): Booking[] {
  if (!bookingsCSV) {
    console.warn('Bookings CSV not loaded yet. Call refreshBookings() first.')
    return []
  }

  const result = parseCSV<BookingsCSVRow>(bookingsCSV)
  
  if (result.errors.length > 0) {
    console.warn('Bookings CSV parsing errors:', result.errors)
  }

  return result.data
    .map((row, index) => mapCSVRowToBooking(row, index))
    .filter((booking): booking is Booking => booking !== null)
}

/**
 * Get booking by booking reference ID
 */
export function getBookingByRef(bookings: Booking[], bookingRef: string): Booking | undefined {
  return bookings.find(b => b.bookingId === bookingRef)
}

/**
 * Get booking by internal ID
 */
export function getBookingById(bookings: Booking[], id: string): Booking | undefined {
  return bookings.find(b => b.id === id)
}

/**
 * Get bookings for a specific home
 */
export function getBookingsForHome(bookings: Booking[], homeCode: string): Booking[] {
  return bookings.filter(b => b.homeCode === homeCode)
}

/**
 * Get current/active bookings
 */
export function getCurrentBookings(bookings: Booking[]): Booking[] {
  return bookings.filter(b => b.status === 'current')
}

/**
 * Get upcoming bookings
 */
export function getUpcomingBookings(bookings: Booking[]): Booking[] {
  return bookings.filter(b => b.status === 'upcoming')
}

// Export pre-loaded bookings for immediate use
let _cachedBookings: Booking[] | null = null

export function getBookings(): Booking[] {
  if (!_cachedBookings) {
    _cachedBookings = loadBookings()
  }
  return _cachedBookings
}

export async function refreshBookings(): Promise<Booking[]> {
  await initializeBookingsData()
  _cachedBookings = loadBookings()
  return _cachedBookings
}

// Initialize data when module loads (if in browser)
if (typeof window !== 'undefined') {
  initializeBookingsData().catch(console.warn)
}
