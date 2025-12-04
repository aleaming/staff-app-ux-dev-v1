/**
 * Home Access Data
 * 
 * Mock data for home access information including:
 * - Access codes and key locations
 * - Alarm information and codes
 * - Sensitivity notes and neighbour awareness
 */

export interface AccessInfo {
  entryCode?: string
  keyLocation?: string
  doorInstructions?: string
}

export interface AlarmInfo {
  hasAlarm: boolean
  alarmCode?: string
  disarmCode?: string
  armCode?: string
  location?: string
}

export interface SensitivityInfo {
  hasDoorman: boolean
  sensitiveDoorman: boolean
  sensitiveNeighbours: boolean
  neighboursAware: boolean
  notes?: string
}

export interface HomeAccessInfo {
  access: AccessInfo
  alarm: AlarmInfo
  sensitivity: SensitivityInfo
}

// Mock data for different homes
const homeAccessData: Record<string, HomeAccessInfo> = {
  // COS285 - The Westover House
  "COS285": {
    access: {
      entryCode: "4521",
      keyLocation: "Lockbox by front door (code: 1234)",
      doorInstructions: "Double lock front door. Ensure all windows are closed before leaving."
    },
    alarm: {
      hasAlarm: true,
      disarmCode: "7890#",
      armCode: "7890#",
      location: "Hallway entrance, on the right wall"
    },
    sensitivity: {
      hasDoorman: false,
      sensitiveDoorman: false,
      sensitiveNeighbours: false,
      neighboursAware: false,
      notes: "1. HK: do not use anything abrasive nor with bleach in when cleaning the kitchen counter surfaces.\n2. Please be mindful of noise levels, especially early morning or late evening."
    }
  },
  // MAY147 - Mayfair Residence
  "MAY147": {
    access: {
      entryCode: "8832",
      keyLocation: "Concierge desk - ask for Unit 147 keys",
      doorInstructions: "Must check in with concierge before going up. Use service lift."
    },
    alarm: {
      hasAlarm: true,
      disarmCode: "5544",
      armCode: "5544",
      location: "Inside front door, left panel"
    },
    sensitivity: {
      hasDoorman: true,
      sensitiveDoorman: true,
      sensitiveNeighbours: true,
      neighboursAware: true,
      notes: "Very high-profile building. Always use service entrance and lift. Do not speak to other residents. The concierge is aware of all scheduled visits."
    }
  },
  // KEN322 - Kensington House
  "KEN322": {
    access: {
      entryCode: "2468",
      keyLocation: "Under mat (temporary) or with neighbour at 324",
      doorInstructions: "Gate code is same as entry code. Ring bell at 324 if key not under mat."
    },
    alarm: {
      hasAlarm: false
    },
    sensitivity: {
      hasDoorman: false,
      sensitiveDoorman: false,
      sensitiveNeighbours: true,
      neighboursAware: true,
      notes: "Neighbours at 320 work night shifts - please be quiet before 10am. The garden is shared, do not use owner's furniture on the patio."
    }
  },
  // CHE456 - Chelsea Townhouse
  "CHE456": {
    access: {
      entryCode: "1357",
      keyLocation: "Key safe mounted on basement wall (code: 9876)",
      doorInstructions: "Main entrance is on the street level. Basement entrance is for staff only."
    },
    alarm: {
      hasAlarm: true,
      disarmCode: "2580#",
      armCode: "2580*",
      location: "Basement hallway, behind the door"
    },
    sensitivity: {
      hasDoorman: false,
      sensitiveDoorman: false,
      sensitiveNeighbours: false,
      neighboursAware: false,
      notes: "Owner has valuable artwork in living room - please be extremely careful. Do not move any framed pieces."
    }
  },
  // NOT789 - Notting Hill Flat
  "NOT789": {
    access: {
      entryCode: "9999",
      keyLocation: "With building porter - ground floor",
      doorInstructions: "Sign in with porter. Collect key and return when finished."
    },
    alarm: {
      hasAlarm: true,
      disarmCode: "1234",
      armCode: "1234",
      location: "Entry hallway, immediate right"
    },
    sensitivity: {
      hasDoorman: true,
      sensitiveDoorman: false,
      sensitiveNeighbours: false,
      neighboursAware: true,
      notes: "Porter is very helpful. Building has strict recycling rules - please separate all waste properly."
    }
  }
}

// Default access info for homes not in our database
const defaultAccessInfo: HomeAccessInfo = {
  access: {
    entryCode: "Contact office for code",
    keyLocation: "Key available from office",
    doorInstructions: "Follow standard entry procedures"
  },
  alarm: {
    hasAlarm: false
  },
  sensitivity: {
    hasDoorman: false,
    sensitiveDoorman: false,
    sensitiveNeighbours: false,
    neighboursAware: false,
    notes: "No special notes for this property. Follow standard operating procedures."
  }
}

/**
 * Get access information for a home
 * @param homeCode The home code (e.g., "COS285")
 * @returns HomeAccessInfo object with access, alarm, and sensitivity data
 */
export function getHomeAccessInfo(homeCode: string): HomeAccessInfo {
  // Normalize the home code (uppercase, remove any prefixes)
  const normalizedCode = homeCode.toUpperCase().replace(/^HOME-/, "")
  
  // Check for exact match
  if (homeAccessData[normalizedCode]) {
    return homeAccessData[normalizedCode]
  }
  
  // Try to extract code from formatted IDs like "home-cos285-0"
  const match = homeCode.match(/([A-Z]{3}\d{3})/i)
  if (match) {
    const extractedCode = match[1].toUpperCase()
    if (homeAccessData[extractedCode]) {
      return homeAccessData[extractedCode]
    }
  }
  
  // Return default if not found
  return defaultAccessInfo
}

/**
 * Check if a home has an active alarm system
 * @param homeCode The home code
 * @returns boolean indicating if alarm is active
 */
export function homeHasAlarm(homeCode: string): boolean {
  const info = getHomeAccessInfo(homeCode)
  return info.alarm.hasAlarm
}

/**
 * Check if a home has sensitivity concerns
 * @param homeCode The home code
 * @returns boolean indicating if there are any sensitivity flags
 */
export function homeHasSensitivityConcerns(homeCode: string): boolean {
  const info = getHomeAccessInfo(homeCode)
  return (
    info.sensitivity.sensitiveDoorman ||
    info.sensitivity.sensitiveNeighbours ||
    (info.sensitivity.notes !== undefined && info.sensitivity.notes.length > 0)
  )
}

