import { useCallback, useEffect, useState } from 'react'

type HapticPattern = 'light' | 'medium' | 'success' | 'error' | 'warning'

const patterns: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 20,
  success: [10, 50, 10],
  error: [50, 100, 50, 100, 50],
  warning: [30, 100, 30],
}

export function useHaptic() {
  const [isEnabled, setIsEnabled] = useState(true)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if Vibration API is supported
    setIsSupported('vibrate' in navigator)
    
    // Load user preference from localStorage
    const stored = localStorage.getItem('haptics-enabled')
    if (stored !== null) {
      setIsEnabled(stored === 'true')
    }
  }, [])

  const trigger = useCallback((pattern: HapticPattern) => {
    if (!isSupported || !isEnabled) return

    try {
      const vibrationPattern = patterns[pattern]
      navigator.vibrate(vibrationPattern)
    } catch (error) {
      console.warn('Haptic feedback failed:', error)
    }
  }, [isSupported, isEnabled])

  const toggleEnabled = useCallback((enabled: boolean) => {
    setIsEnabled(enabled)
    localStorage.setItem('haptics-enabled', enabled.toString())
  }, [])

  return { trigger, isEnabled, toggleEnabled, isSupported }
}

