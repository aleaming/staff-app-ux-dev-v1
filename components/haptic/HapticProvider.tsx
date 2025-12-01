'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useHaptic } from '@/lib/use-haptic'

type HapticPattern = 'light' | 'medium' | 'success' | 'error' | 'warning'

interface HapticContextType {
  trigger: (pattern: HapticPattern) => void
  isEnabled: boolean
  toggleEnabled: (enabled: boolean) => void
  isSupported: boolean
}

const HapticContext = createContext<HapticContextType | undefined>(undefined)

export function HapticProvider({ children }: { children: ReactNode }) {
  const haptic = useHaptic()
  
  return (
    <HapticContext.Provider value={haptic}>
      {children}
    </HapticContext.Provider>
  )
}

export function useHapticFeedback() {
  const context = useContext(HapticContext)
  if (!context) {
    throw new Error('useHapticFeedback must be used within HapticProvider')
  }
  return context
}

