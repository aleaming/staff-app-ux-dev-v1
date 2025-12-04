/**
 * Homes Data Loader
 * 
 * Loads homes data from CSV and maps to Home interface.
 */

import { parseCSV, type HomesCSVRow } from '../csv-loader'
import { geocodeLocationSync, geocodeLocation } from '../geocoding'
import type { Home, HomeStatus } from '../test-data'

// CSV data as inline string (loaded at build time from public folder)
// This will be populated by the initialization function
let homesCSV: string = ''
let _isInitialized = false

/**
 * Initialize the homes loader by fetching CSV data
 */
async function initializeHomesData(): Promise<void> {
  if (_isInitialized && homesCSV) return
  
  try {
    const response = await fetch('/data/homes.csv')
    if (response.ok) {
      homesCSV = await response.text()
      _isInitialized = true
    }
  } catch (error) {
    console.warn('Failed to load homes CSV:', error)
  }
}

/**
 * Parse address to extract city
 */
function extractCity(address: string): string {
  // Most addresses end with "London" or have London in them
  if (address.includes('London')) {
    return 'London'
  }
  // Try to extract from the address format: "..., City PostCode, Country"
  const parts = address.split(',').map(p => p.trim())
  if (parts.length >= 2) {
    // Second to last part usually contains city
    const cityPart = parts[parts.length - 2]
    // Remove postcode if present
    return cityPart.replace(/[A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2}/gi, '').trim() || 'London'
  }
  return 'London'
}

/**
 * Map home status based on Active field and other criteria
 */
function mapHomeStatus(row: HomesCSVRow): HomeStatus {
  if (row['Active'] === 'Yes') {
    return 'available'
  }
  if (row['Home Name']?.includes('DEAD') || row['Home Name']?.includes('DELETED')) {
    return 'maintenance'
  }
  return 'available' // Default to available for mock data
}

/**
 * Generate a unique ID from home code
 */
function generateHomeId(homeCode: string, index: number): string {
  return `home-${homeCode.toLowerCase()}-${index}`
}

/**
 * Convert CSV row to Home interface (sync version using cached coordinates)
 */
function mapCSVRowToHome(row: HomesCSVRow, index: number): Home | null {
  // Skip empty rows or invalid data
  if (!row['Home ID'] || row['Home ID'].trim() === '') {
    return null
  }

  const homeCode = row['Home ID'].trim()
  const location = row['Location']?.trim() || 'London'
  
  // Try to get coordinates synchronously from cache/pre-populated data
  const coordinates = geocodeLocationSync(location)

  return {
    id: generateHomeId(homeCode, index),
    code: homeCode,
    name: row['Home Name']?.trim() || undefined,
    address: row['Business Address']?.trim() || '',
    city: extractCity(row['Business Address'] || ''),
    status: mapHomeStatus(row),
    activeBookings: 0, // Will be calculated from bookings data
    pendingActivities: 0, // Will be calculated from activities data
    coordinates: coordinates || undefined,
    // Additional fields with defaults
    bedrooms: undefined,
    bathrooms: undefined,
    damages: [],
  }
}

/**
 * Load homes from CSV synchronously (uses cached CSV data)
 */
export function loadHomesSync(): Home[] {
  if (!homesCSV) {
    console.warn('Homes CSV not loaded yet. Call initializeHomesData() first or use loadHomesAsync().')
    return []
  }

  const result = parseCSV<HomesCSVRow>(homesCSV)
  
  if (result.errors.length > 0) {
    console.warn('CSV parsing errors:', result.errors)
  }

  return result.data
    .map((row, index) => mapCSVRowToHome(row, index))
    .filter((home): home is Home => home !== null)
}

/**
 * Load homes from CSV with async initialization and geocoding
 */
export async function loadHomesAsync(): Promise<Home[]> {
  await initializeHomesData()
  
  if (!homesCSV) {
    console.warn('Failed to load homes CSV')
    return []
  }

  const result = parseCSV<HomesCSVRow>(homesCSV)
  
  if (result.errors.length > 0) {
    console.warn('CSV parsing errors:', result.errors)
  }

  const homes: Home[] = []

  for (let index = 0; index < result.data.length; index++) {
    const row = result.data[index]
    
    // Skip empty rows
    if (!row['Home ID'] || row['Home ID'].trim() === '') {
      continue
    }

    const homeCode = row['Home ID'].trim()
    const location = row['Location']?.trim() || 'London'
    
    // Get coordinates asynchronously (uses API if needed)
    const coordinates = await geocodeLocation(location)

    const home: Home = {
      id: generateHomeId(homeCode, index),
      code: homeCode,
      name: row['Home Name']?.trim() || undefined,
      address: row['Business Address']?.trim() || '',
      city: extractCity(row['Business Address'] || ''),
      status: mapHomeStatus(row),
      activeBookings: 0,
      pendingActivities: 0,
      coordinates,
      bedrooms: undefined,
      bathrooms: undefined,
      damages: [],
    }

    homes.push(home)
  }

  return homes
}

/**
 * Get home by code
 */
export function getHomeByCode(homes: Home[], code: string): Home | undefined {
  return homes.find(h => h.code === code)
}

/**
 * Get home by ID
 */
export function getHomeById(homes: Home[], id: string): Home | undefined {
  return homes.find(h => h.id === id)
}

// Export pre-loaded homes for immediate use
let _cachedHomes: Home[] | null = null

export function getHomes(): Home[] {
  if (!_cachedHomes) {
    _cachedHomes = loadHomesSync()
  }
  return _cachedHomes
}

export async function refreshHomes(): Promise<Home[]> {
  await initializeHomesData()
  _cachedHomes = loadHomesSync()
  return _cachedHomes
}

// Initialize data when module loads (if in browser)
if (typeof window !== 'undefined') {
  initializeHomesData().catch(console.warn)
}
