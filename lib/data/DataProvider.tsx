"use client"

/**
 * Data Provider Context
 * 
 * Provides async-loaded CSV data to all components in the app.
 * Handles loading state and error handling for data fetching.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { refreshHomes } from './homes-loader'
import { refreshBookings } from './bookings-loader'
import { refreshActivities } from './activities-loader'
import { refreshBookingNotes } from './booking-notes-loader'
import type { Home, Booking, Activity, BookingNotes } from '../test-data'

interface DataContextType {
  homes: Home[]
  bookings: Booking[]
  activities: Activity[]
  bookingNotes: BookingNotes[]
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
}

const DataContext = createContext<DataContextType | null>(null)

interface DataProviderProps {
  children: ReactNode
}

export function DataProvider({ children }: DataProviderProps) {
  const [homes, setHomes] = useState<Home[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [bookingNotes, setBookingNotes] = useState<BookingNotes[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('[DataProvider] Starting data load...')
      const [loadedHomes, loadedBookings, loadedActivities, loadedBookingNotes] = await Promise.all([
        refreshHomes(),
        refreshBookings(),
        refreshActivities(),
        refreshBookingNotes(),
      ])
      
      console.log('[DataProvider] Loaded:', {
        homes: loadedHomes.length,
        bookings: loadedBookings.length,
        activities: loadedActivities.length,
        bookingNotes: loadedBookingNotes.length
      })
      
      setHomes(loadedHomes)
      setBookings(loadedBookings)
      setActivities(loadedActivities)
      setBookingNotes(loadedBookingNotes)
    } catch (err) {
      console.error('[DataProvider] Failed to load data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const value: DataContextType = {
    homes,
    bookings,
    activities,
    bookingNotes,
    isLoading,
    error,
    refresh: loadData,
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

/**
 * Hook to access data from the DataProvider
 * @throws Error if used outside of DataProvider
 */
export function useData(): DataContextType {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

/**
 * Hook to access homes data
 */
export function useHomes() {
  const { homes, isLoading, error } = useData()
  return { homes, isLoading, error }
}

/**
 * Hook to access bookings data
 */
export function useBookings() {
  const { bookings, isLoading, error } = useData()
  return { bookings, isLoading, error }
}

/**
 * Hook to access activities data
 */
export function useActivities() {
  const { activities, isLoading, error } = useData()
  return { activities, isLoading, error }
}

/**
 * Hook to access booking notes data
 */
export function useBookingNotes() {
  const { bookingNotes, isLoading, error } = useData()
  return { bookingNotes, isLoading, error }
}

