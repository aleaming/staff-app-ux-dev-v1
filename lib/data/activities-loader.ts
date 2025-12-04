/**
 * Activities Data Loader
 * 
 * Loads activities data from CSV and maps to Activity interface.
 */

import { parseCSV, type ActivitiesCSVRow } from '../csv-loader'
import type { Activity, ActivityType, ActivityStatus } from '../test-data'

// CSV data (loaded at runtime from public folder)
let activitiesCSV: string = ''
let _isInitialized = false

/**
 * Initialize the activities loader by fetching CSV data
 */
async function initializeActivitiesData(): Promise<void> {
  if (_isInitialized && activitiesCSV) return
  
  try {
    console.log('[activities-loader] Fetching /data/activities.csv...')
    const response = await fetch('/data/activities.csv')
    console.log('[activities-loader] Response status:', response.status)
    if (response.ok) {
      activitiesCSV = await response.text()
      _isInitialized = true
      console.log('[activities-loader] CSV loaded, length:', activitiesCSV.length)
    } else {
      console.error('[activities-loader] Failed to fetch CSV:', response.statusText)
    }
  } catch (error) {
    console.warn('[activities-loader] Failed to load activities CSV:', error)
  }
}

/**
 * Map CSV activity type to ActivityType
 */
function mapActivityType(csvType: string): ActivityType {
  const typeMap: Record<string, ActivityType> = {
    'Provision': 'provisioning',
    'Greet': 'meet-greet',
    'Deprovision': 'deprovisioning',
    'Bag Drop': 'bag-drop',
    'Maid': 'maid-service',
    'Turn': 'turn',
    // Additional mappings
    'Quality Check': 'quality-check',
    'Mini Maid': 'mini-maid',
    'Touch Up': 'touch-up',
    'Additional Greet': 'additional-greet',
    'Service Recovery': 'service-recovery',
    'Home Viewing': 'home-viewing',
  }

  const normalizedType = csvType?.trim() || ''
  return typeMap[normalizedType] || 'adhoc'
}

/**
 * Map CSV schedule state to ActivityStatus
 */
function mapActivityStatus(scheduleState: string): ActivityStatus {
  const stateMap: Record<string, ActivityStatus> = {
    'To be scheduled': 'to-start',
    '[Blank]': 'to-start',
    'Scheduled': 'to-start',
    'In Progress': 'in-progress',
    'Completed': 'completed',
    'Cancelled': 'cancelled',
    'Paused': 'paused',
    'Abandoned': 'abandoned',
    'Ignored': 'ignored',
  }

  const normalizedState = scheduleState?.trim() || ''
  return stateMap[normalizedState] || 'to-start'
}

/**
 * Parse date string from CSV format (e.g., "Thu 4 Dec") to Date
 */
function parseActivityDate(dateStr: string, timeStr: string): Date {
  // Current year - activities are typically scheduled for current/near future
  const currentYear = new Date().getFullYear()
  
  // Parse date like "Thu 4 Dec"
  const dateMatch = dateStr?.match(/\w+\s+(\d+)\s+(\w+)/)
  if (!dateMatch) {
    return new Date()
  }

  const day = parseInt(dateMatch[1], 10)
  const monthStr = dateMatch[2]
  
  const monthMap: Record<string, number> = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  }
  
  const month = monthMap[monthStr] ?? 0

  // Parse time like "09:00–12:00" - use start time
  let hours = 9
  let minutes = 0
  
  const timeMatch = timeStr?.match(/(\d{1,2}):(\d{2})/)
  if (timeMatch) {
    hours = parseInt(timeMatch[1], 10)
    minutes = parseInt(timeMatch[2], 10)
  }

  // Determine year - if month is in the past, use next year
  const now = new Date()
  let year = currentYear
  const testDate = new Date(year, month, day)
  if (testDate < new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30)) {
    // If more than 30 days in the past, assume it's next year
    year = currentYear + 1
  }

  return new Date(year, month, day, hours, minutes)
}

/**
 * Generate activity title based on type and home
 */
function generateActivityTitle(type: ActivityType, homeName: string | undefined): string {
  const typeLabels: Record<ActivityType, string> = {
    'provisioning': 'Provisioning',
    'deprovisioning': 'Deprovisioning',
    'turn': 'Turn',
    'maid-service': 'Maid Service',
    'mini-maid': 'Mini-maid',
    'touch-up': 'Touch-up',
    'quality-check': 'Quality Check',
    'meet-greet': 'Meet & Greet',
    'additional-greet': 'Additional Greet',
    'bag-drop': 'Bag Drop',
    'service-recovery': 'Service Recovery',
    'home-viewing': 'Home Viewing',
    'adhoc': 'Ad-hoc Task',
  }

  const label = typeLabels[type] || 'Activity'
  return homeName ? `${label} - ${homeName}` : label
}

/**
 * Generate a unique ID for activity
 */
function generateActivityId(homeCode: string, type: string, index: number): string {
  const cleanCode = homeCode?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'unknown'
  const cleanType = type?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'activity'
  return `activity-${cleanCode}-${cleanType}-${index}`
}

/**
 * Determine if an activity should be assigned to the current user
 * For demo purposes, assign roughly every other activity to "Alex"
 */
function shouldAssignToCurrentUser(index: number): boolean {
  // Assign activities with index 0, 1, 2, 4, 5, 7, 8, 10... (most activities)
  return index % 3 !== 2
}

/**
 * Convert CSV row to Activity interface
 */
function mapCSVRowToActivity(row: ActivitiesCSVRow, index: number): Activity | null {
  // Skip empty rows or header rows
  if (!row['Home ID'] || row['Home ID'].trim() === '' || row['Date'] === '') {
    return null
  }

  const homeCode = row['Home ID'].trim()
  const activityType = mapActivityType(row['Activity Type'] || 'adhoc')
  const scheduledTime = parseActivityDate(row['Date'], row['Time'] || '09:00')

  return {
    id: generateActivityId(homeCode, row['Activity Type'], index),
    type: activityType,
    title: generateActivityTitle(activityType, row['Home Name']?.trim()),
    homeCode: homeCode,
    homeName: row['Home Name']?.trim() || undefined,
    bookingId: row['Booking Ref']?.trim() || undefined,
    scheduledTime: scheduledTime,
    status: mapActivityStatus(row['Schedule State'] || '[Blank]'),
    // Default values for optional fields
    priority: index % 5 === 0 ? 'high' : 'normal', // Every 5th activity is high priority
    description: undefined,
    assignedTo: shouldAssignToCurrentUser(index) ? 'Alex' : undefined, // Assign most activities to Alex
    // Activity attributes
    confirmed: false,
    onTime: true,
    delayed: false,
    hasIssues: false,
  }
}

/**
 * Load activities from CSV (sync, uses cached data)
 */
export function loadActivities(): Activity[] {
  if (!activitiesCSV) {
    console.warn('Activities CSV not loaded yet. Call refreshActivities() first.')
    return []
  }

  const result = parseCSV<ActivitiesCSVRow>(activitiesCSV)
  
  if (result.errors.length > 0) {
    console.warn('Activities CSV parsing errors:', result.errors)
  }

  return result.data
    .map((row, index) => mapCSVRowToActivity(row, index))
    .filter((activity): activity is Activity => activity !== null)
}

/**
 * Get activity by ID
 */
export function getActivityById(activities: Activity[], id: string): Activity | undefined {
  return activities.find(a => a.id === id)
}

/**
 * Get activities for a specific home
 */
export function getActivitiesForHome(activities: Activity[], homeCode: string): Activity[] {
  return activities.filter(a => a.homeCode === homeCode)
}

/**
 * Get activities for a specific booking
 */
export function getActivitiesForBooking(activities: Activity[], bookingId: string): Activity[] {
  return activities.filter(a => a.bookingId === bookingId)
}

/**
 * Get activities by status
 */
export function getActivitiesByStatus(activities: Activity[], status: ActivityStatus): Activity[] {
  return activities.filter(a => a.status === status)
}

/**
 * Get activities for today
 */
export function getTodaysActivities(activities: Activity[]): Activity[] {
  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
  
  return activities.filter(a => {
    const activityDate = new Date(a.scheduledTime)
    return activityDate >= startOfDay && activityDate < endOfDay
  })
}

/**
 * Get incomplete activities (not completed, cancelled, or ignored)
 */
export function getIncompleteActivities(activities: Activity[]): Activity[] {
  const completeStatuses: ActivityStatus[] = ['completed', 'cancelled', 'ignored']
  return activities.filter(a => !completeStatuses.includes(a.status))
}

// Export pre-loaded activities for immediate use
let _cachedActivities: Activity[] | null = null

export function getActivities(): Activity[] {
  if (!_cachedActivities) {
    _cachedActivities = loadActivities()
  }
  return _cachedActivities
}

export async function refreshActivities(): Promise<Activity[]> {
  await initializeActivitiesData()
  _cachedActivities = loadActivities()
  return _cachedActivities
}

// Initialize data when module loads (if in browser)
if (typeof window !== 'undefined') {
  initializeActivitiesData().catch(console.warn)
}
