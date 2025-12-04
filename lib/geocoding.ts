/**
 * Geocoding Utility
 * 
 * Google Maps Geocoding API helper with in-memory caching to minimize API calls.
 * Converts neighborhood/location names to lat/lng coordinates.
 */

export interface Coordinates {
  lat: number
  lng: number
}

// In-memory cache for geocoded locations
const geocodeCache = new Map<string, Coordinates>()

// Pre-populated London neighborhood coordinates (fallback/cache seeds)
// These are approximate center points for common London neighborhoods
const LONDON_NEIGHBORHOODS: Record<string, Coordinates> = {
  // Central London
  "Mayfair": { lat: 51.5095, lng: -0.1476 },
  "Soho": { lat: 51.5137, lng: -0.1337 },
  "Covent Garden": { lat: 51.5117, lng: -0.1240 },
  "Westminster": { lat: 51.4975, lng: -0.1357 },
  "Marylebone": { lat: 51.5225, lng: -0.1533 },
  "Bloomsbury": { lat: 51.5225, lng: -0.1250 },
  "Holborn": { lat: 51.5173, lng: -0.1195 },
  "The City": { lat: 51.5155, lng: -0.0922 },
  "Clerkenwell": { lat: 51.5244, lng: -0.1056 },
  "King's Cross": { lat: 51.5308, lng: -0.1238 },
  
  // West London
  "Notting Hill": { lat: 51.5097, lng: -0.1969 },
  "Kensington": { lat: 51.4988, lng: -0.1883 },
  "South Kensington": { lat: 51.4941, lng: -0.1746 },
  "Chelsea": { lat: 51.4875, lng: -0.1687 },
  "Fulham": { lat: 51.4735, lng: -0.2046 },
  "Earls Court": { lat: 51.4914, lng: -0.1950 },
  "Holland Park": { lat: 51.5028, lng: -0.2075 },
  "Shepherd's Bush": { lat: 51.5046, lng: -0.2248 },
  "Hammersmith": { lat: 51.4927, lng: -0.2227 },
  "Chiswick": { lat: 51.4921, lng: -0.2617 },
  "Kensington Olympia": { lat: 51.4977, lng: -0.2100 },
  "West Kensington": { lat: 51.4872, lng: -0.2056 },
  "Bayswater": { lat: 51.5120, lng: -0.1872 },
  "Ladbroke Grove": { lat: 51.5167, lng: -0.2105 },
  "Queen's Park": { lat: 51.5342, lng: -0.2043 },
  
  // North London
  "Camden": { lat: 51.5390, lng: -0.1426 },
  "Islington": { lat: 51.5362, lng: -0.1033 },
  "Highbury": { lat: 51.5513, lng: -0.0994 },
  "Highgate": { lat: 51.5710, lng: -0.1456 },
  "Hampstead": { lat: 51.5564, lng: -0.1780 },
  "Primrose Hill": { lat: 51.5395, lng: -0.1603 },
  "St John's Wood": { lat: 51.5326, lng: -0.1722 },
  "Maida Vale": { lat: 51.5285, lng: -0.1881 },
  "West Hampstead": { lat: 51.5468, lng: -0.1911 },
  "Stoke Newington": { lat: 51.5609, lng: -0.0760 },
  
  // East London
  "Shoreditch": { lat: 51.5255, lng: -0.0779 },
  "Bermondsey": { lat: 51.4980, lng: -0.0637 },
  "Tower Hill": { lat: 51.5097, lng: -0.0766 },
  "London Bridge": { lat: 51.5055, lng: -0.0876 },
  
  // South London
  "Pimlico": { lat: 51.4893, lng: -0.1334 },
  "Belgravia": { lat: 51.4982, lng: -0.1533 },
  "Battersea": { lat: 51.4724, lng: -0.1493 },
  "Clapham": { lat: 51.4619, lng: -0.1389 },
  "Brixton": { lat: 51.4613, lng: -0.1156 },
  "Putney": { lat: 51.4612, lng: -0.2167 },
  "Wimbledon": { lat: 51.4214, lng: -0.2064 },
  "Richmond": { lat: 51.4613, lng: -0.3037 },
  "Barnes": { lat: 51.4683, lng: -0.2436 },
  "Knightsbridge": { lat: 51.5015, lng: -0.1607 },
  
  // Default London center
  "London": { lat: 51.5074, lng: -0.1278 },
}

/**
 * Get Google Maps API key from environment
 */
function getApiKey(): string | null {
  if (typeof window !== 'undefined') {
    // Client-side
    return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || null
  }
  // Server-side
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || null
}

/**
 * Geocode a location string to coordinates using Google Maps API
 */
async function geocodeWithGoogle(location: string): Promise<Coordinates | null> {
  const apiKey = getApiKey()
  if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
    return null
  }

  try {
    const encodedLocation = encodeURIComponent(`${location}, London, UK`)
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedLocation}&key=${apiKey}`
    
    const response = await fetch(url)
    if (!response.ok) {
      console.warn(`Geocoding API error: ${response.statusText}`)
      return null
    }

    const data = await response.json()
    
    if (data.status === 'OK' && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location
      return { lat, lng }
    }
    
    console.warn(`Geocoding failed for "${location}": ${data.status}`)
    return null
  } catch (error) {
    console.warn(`Geocoding error for "${location}":`, error)
    return null
  }
}

/**
 * Get coordinates for a location, using cache first, then API, then fallback
 */
export async function geocodeLocation(location: string): Promise<Coordinates> {
  // Normalize the location string
  const normalizedLocation = location.trim()
  
  // Check cache first
  if (geocodeCache.has(normalizedLocation)) {
    return geocodeCache.get(normalizedLocation)!
  }

  // Check pre-populated neighborhood data
  if (LONDON_NEIGHBORHOODS[normalizedLocation]) {
    const coords = LONDON_NEIGHBORHOODS[normalizedLocation]
    geocodeCache.set(normalizedLocation, coords)
    return coords
  }

  // Try Google Maps API
  const apiCoords = await geocodeWithGoogle(normalizedLocation)
  if (apiCoords) {
    geocodeCache.set(normalizedLocation, apiCoords)
    return apiCoords
  }

  // Fallback to London center with slight randomization
  const fallback: Coordinates = {
    lat: 51.5074 + (Math.random() - 0.5) * 0.05,
    lng: -0.1278 + (Math.random() - 0.5) * 0.05,
  }
  geocodeCache.set(normalizedLocation, fallback)
  return fallback
}

/**
 * Synchronous lookup for pre-populated neighborhoods (no API call)
 * Returns null if not found in cache or pre-populated data
 */
export function geocodeLocationSync(location: string): Coordinates | null {
  const normalizedLocation = location.trim()
  
  if (geocodeCache.has(normalizedLocation)) {
    return geocodeCache.get(normalizedLocation)!
  }

  if (LONDON_NEIGHBORHOODS[normalizedLocation]) {
    const coords = LONDON_NEIGHBORHOODS[normalizedLocation]
    geocodeCache.set(normalizedLocation, coords)
    return coords
  }

  return null
}

/**
 * Pre-warm the cache with a list of locations
 */
export async function preWarmGeocodingCache(locations: string[]): Promise<void> {
  const uniqueLocations = [...new Set(locations)]
  
  // Process in batches to avoid rate limiting
  const batchSize = 10
  for (let i = 0; i < uniqueLocations.length; i += batchSize) {
    const batch = uniqueLocations.slice(i, i + batchSize)
    await Promise.all(batch.map(location => geocodeLocation(location)))
  }
}

/**
 * Get the current cache size (for debugging)
 */
export function getGeocacheCacheSize(): number {
  return geocodeCache.size
}

/**
 * Clear the geocoding cache
 */
export function clearGeocodingCache(): void {
  geocodeCache.clear()
}

