/**
 * CSV Loading Utility
 * 
 * Generic CSV parsing utility using PapaParse for loading mock data from CSV files.
 */

import Papa from 'papaparse'

export interface CSVParseResult<T> {
  data: T[]
  errors: Papa.ParseError[]
  meta: Papa.ParseMeta
}

/**
 * Parse CSV string into typed array
 */
export function parseCSV<T>(csvString: string): CSVParseResult<T> {
  const result = Papa.parse<T>(csvString, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    transform: (value) => value.trim(),
  })

  return {
    data: result.data,
    errors: result.errors,
    meta: result.meta,
  }
}

/**
 * Load and parse CSV from a URL (for client-side or server-side use)
 */
export async function loadCSVFromURL<T>(url: string): Promise<CSVParseResult<T>> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to load CSV from ${url}: ${response.statusText}`)
  }
  const csvString = await response.text()
  return parseCSV<T>(csvString)
}

/**
 * CSV Row types for our data files
 */
export interface HomesCSVRow {
  'Home ID': string
  'Home Name': string
  'Active': string
  'Location': string
  'Market': string
  'Market Code': string
  'Marketable': string
  'Rates': string
  'Availability': string
  'Rates Update': string
  'Calendar Update': string
  'Images Update': string
  'Onboarding Status': string
  'Business Address': string
}

export interface BookingsCSVRow {
  'Booking Ref': string
  'Status': string
  'Arrival': string
  'Departure': string
  'Home ID': string
  'Home Name': string
  'Guest': string
  'Market': string
  'Channel': string
  'Balance Due': string
  'GTV': string
  'Business Address': string
}

export interface ActivitiesCSVRow {
  'Date': string
  'Home ID': string
  'Home Name': string
  'Booking Ref': string
  'Activity Type': string
  'Time': string
  'Location Market': string
  'Schedule State': string
  'Assignee Status': string
  'Business Address': string
}

export interface BookingNotesCSVRow {
  'booking_ref': string
  'notes1': string
  'notes2': string
  'notes3': string
}

