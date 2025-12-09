"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useData } from "@/lib/data/DataProvider"
import {
  Search,
  X,
  History,
  Home,
  Calendar,
  Target,
  MapPin,
  Clock
} from "lucide-react"

const RECENT_SEARCHES_KEY = "recent-searches"
const MAX_RECENT_SEARCHES = 10
const MAX_RESULTS_PER_CATEGORY = 10

interface GlobalSearchSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GlobalSearchSheet({ open, onOpenChange }: GlobalSearchSheetProps) {
  const router = useRouter()
  const { homes, bookings, activities } = useData()
  const [query, setQuery] = useState("")
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
      if (stored) {
        try {
          setRecentSearches(JSON.parse(stored))
        } catch (error) {
          console.error("Error loading recent searches:", error)
        }
      }
    }
  }, [])

  // Clear query when sheet closes
  useEffect(() => {
    if (!open) {
      setQuery("")
    }
  }, [open])

  // Fuzzy match function
  const fuzzyMatch = useCallback((text: string, pattern: string): boolean => {
    const textLower = text.toLowerCase()
    const patternLower = pattern.toLowerCase()
    
    // Exact match
    if (textLower.includes(patternLower)) return true
    
    // Fuzzy match: check if all pattern characters appear in order
    let patternIndex = 0
    for (let i = 0; i < textLower.length && patternIndex < patternLower.length; i++) {
      if (textLower[i] === patternLower[patternIndex]) {
        patternIndex++
      }
    }
    return patternIndex === patternLower.length
  }, [])

  // Search results with debouncing
  const searchResults = useMemo(() => {
    if (!query.trim() || query.length < 2) {
      return {
        homes: [],
        bookings: [],
        activities: []
      }
    }

    const lowerQuery = query.toLowerCase()

    const matchedHomes = homes
      .filter(home => 
        fuzzyMatch(home.code, lowerQuery) ||
        fuzzyMatch(home.name || "", lowerQuery) ||
        fuzzyMatch(home.address, lowerQuery) ||
        fuzzyMatch(home.city, lowerQuery)
      )
      .slice(0, MAX_RESULTS_PER_CATEGORY)

    const matchedBookings = bookings
      .filter(booking =>
        fuzzyMatch(booking.bookingId, lowerQuery) ||
        fuzzyMatch(booking.guestName, lowerQuery) ||
        fuzzyMatch(booking.guestEmail || "", lowerQuery) ||
        fuzzyMatch(booking.homeCode, lowerQuery)
      )
      .slice(0, MAX_RESULTS_PER_CATEGORY)

    const matchedActivities = activities
      .filter(activity =>
        fuzzyMatch(activity.title, lowerQuery) ||
        fuzzyMatch(activity.homeCode, lowerQuery) ||
        fuzzyMatch(activity.homeName || "", lowerQuery) ||
        fuzzyMatch(activity.bookingId || "", lowerQuery) ||
        fuzzyMatch(activity.description || "", lowerQuery)
      )
      .slice(0, MAX_RESULTS_PER_CATEGORY)

    return { homes: matchedHomes, bookings: matchedBookings, activities: matchedActivities }
  }, [query, fuzzyMatch, homes, bookings, activities])

  // Save search to recent searches
  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return

    const updatedSearches = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, MAX_RECENT_SEARCHES)

    setRecentSearches(updatedSearches)
    if (typeof window !== "undefined") {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches))
    }
  }

  // Remove a recent search
  const removeRecentSearch = (searchQuery: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updatedSearches = recentSearches.filter(s => s !== searchQuery)
    setRecentSearches(updatedSearches)
    if (typeof window !== "undefined") {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches))
    }
  }

  // Clear all recent searches
  const clearRecentSearches = () => {
    setRecentSearches([])
    if (typeof window !== "undefined") {
      localStorage.removeItem(RECENT_SEARCHES_KEY)
    }
  }

  // Handle search change with debouncing
  const handleSearchChange = (value: string) => {
    setQuery(value)
    
    if (value.trim().length >= 2) {
      saveRecentSearch(value.trim())
    }
  }

  // Handle navigation to result
  const handleResultClick = (href: string) => {
    onOpenChange(false)
    router.push(href)
  }

  // Handle recent search click
  const handleRecentSearchClick = (searchQuery: string) => {
    setQuery(searchQuery)
  }

  const totalResults = searchResults.homes.length + searchResults.bookings.length + searchResults.activities.length

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="top" className="h-[calc(100vh-16rem)] overflow-hidden flex flex-col">
        <SheetHeader className="mb-4">
          <SheetTitle className="sr-only">Global Search</SheetTitle>
          
          {/* Search Input Row with Close Button */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
                type="search"
                placeholder="Search homes, bookings, activities..."
                value={query}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 pr-10 rounded-full"
                autoFocus
              />
              {query && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto">
          {query.trim().length >= 2 ? (
            // Search Results
            <div className="space-y-6">
              {totalResults > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    {totalResults} result{totalResults !== 1 ? 's' : ''} found
                  </p>

                  {/* Homes */}
                  {searchResults.homes.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Homes ({searchResults.homes.length})
                      </h3>
                      <div className="space-y-2">
                        {searchResults.homes.map((home) => (
                          <Card 
                            key={home.id} 
                            className="hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => handleResultClick(`/homes/${home.id}`)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold">{home.code}</p>
                                  {home.name && <p className="text-sm text-muted-foreground">{home.name}</p>}
                                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                    <MapPin className="h-3 w-3" />
                                    {home.address}, {home.city}
                                  </p>
                                </div>
                                <Badge variant={home.status === "occupied" ? "default" : "secondary"} className="ml-2">
                                  {home.status}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bookings */}
                  {searchResults.bookings.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Bookings ({searchResults.bookings.length})
                      </h3>
                      <div className="space-y-2">
                        {searchResults.bookings.map((booking) => (
                          <Card 
                            key={booking.id} 
                            className="hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => handleResultClick(`/bookings/${booking.id}`)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold">{booking.bookingId}</p>
                                  <p className="text-sm text-muted-foreground">{booking.guestName}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {booking.homeCode} • {booking.checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {booking.checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </p>
                                </div>
                                <Badge variant={booking.status === "current" ? "default" : "secondary"} className="ml-2">
                                  {booking.status}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Activities */}
                  {searchResults.activities.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Activities ({searchResults.activities.length})
                      </h3>
                      <div className="space-y-2">
                        {searchResults.activities.map((activity) => (
                          <Card 
                            key={activity.id} 
                            className="hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => handleResultClick(`/activities/${activity.id}`)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold">{activity.title}</p>
                                  <p className="text-sm text-muted-foreground">{activity.homeCode}</p>
                                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                    <Clock className="h-3 w-3" />
                                    {activity.scheduledTime.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                    {activity.endTime && ` – ${activity.endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`}
                                  </p>
                                </div>
                                <Badge
                                  variant={
                                    activity.status === "to-start" ? "secondary" :
                                    activity.status === "in-progress" ? "default" :
                                    activity.status === "paused" ? "secondary" :
                                    activity.status === "completed" ? "outline" :
                                    activity.status === "cancelled" ? "outline" :
                                    activity.status === "ignored" ? "outline" : "destructive"
                                  }
                                  className="ml-2"
                                >
                                  {activity.status === "to-start" ? "To Start" :
                                   activity.status === "in-progress" ? "In Progress" :
                                   activity.status === "paused" ? "Paused" :
                                   activity.status === "abandoned" ? "Abandoned" :
                                   activity.status === "completed" ? "Completed" :
                                   activity.status === "ignored" ? "Ignored" : "Cancelled"}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-semibold mb-2">No results found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your search query</p>
                </div>
              )}
            </div>
          ) : query.trim().length > 0 && query.trim().length < 2 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Type at least 2 characters to search
            </p>
          ) : recentSearches.length > 0 ? (
            // Recent Searches
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Recent Searches
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={clearRecentSearches}
                >
                  Clear all
                </Button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer group"
                    onClick={() => handleRecentSearchClick(search)}
                  >
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{search}</span>
                    </div>
                    
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-semibold mb-2">Start searching</p>
              <p className="text-sm text-muted-foreground">Search for homes, bookings, or activities</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

