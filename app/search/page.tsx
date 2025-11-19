"use client"

import { useSearchParams } from "next/navigation"
import { useState, useMemo, useEffect, useRef, Suspense } from "react"
import { testHomes, testBookings, testActivities } from "@/lib/test-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Search,
  Home,
  Calendar,
  Target,
  MapPin,
  Clock,
  History,
  X
} from "lucide-react"
import Link from "next/link"

const RECENT_SEARCHES_KEY = "recent-searches"
const MAX_RECENT_SEARCHES = 5

type TabType = "all" | "homes" | "bookings" | "activities"

function SearchPageContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const initialType = searchParams.get("type") || "all"

  const [query, setQuery] = useState(initialQuery)
  const [activeTab, setActiveTab] = useState<TabType>(
    initialType as TabType || "all"
  )
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [showRecentSearches, setShowRecentSearches] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored))
      } catch (error) {
        console.error("Error loading recent searches:", error)
      }
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowRecentSearches(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Save search to recent searches
  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return

    const updatedSearches = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, MAX_RECENT_SEARCHES)

    setRecentSearches(updatedSearches)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches))
  }

  // Remove a recent search
  const removeRecentSearch = (searchQuery: string) => {
    const updatedSearches = recentSearches.filter(s => s !== searchQuery)
    setRecentSearches(updatedSearches)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches))
  }

  // Clear all recent searches
  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem(RECENT_SEARCHES_KEY)
  }

  // Search function
  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return {
        homes: [],
        bookings: [],
        activities: []
      }
    }

    const lowerQuery = query.toLowerCase()

    const homes = testHomes.filter(home => 
      home.code.toLowerCase().includes(lowerQuery) ||
      home.name?.toLowerCase().includes(lowerQuery) ||
      home.address.toLowerCase().includes(lowerQuery) ||
      home.city.toLowerCase().includes(lowerQuery)
    )

    const bookings = testBookings.filter(booking =>
      booking.bookingId.toLowerCase().includes(lowerQuery) ||
      booking.guestName.toLowerCase().includes(lowerQuery) ||
      booking.guestEmail?.toLowerCase().includes(lowerQuery) ||
      booking.homeCode.toLowerCase().includes(lowerQuery)
    )

    const activities = testActivities.filter(activity =>
      activity.title.toLowerCase().includes(lowerQuery) ||
      activity.homeCode.toLowerCase().includes(lowerQuery) ||
      activity.homeName?.toLowerCase().includes(lowerQuery) ||
      activity.bookingId?.toLowerCase().includes(lowerQuery) ||
      activity.description?.toLowerCase().includes(lowerQuery)
    )

    return { homes, bookings, activities }
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      saveRecentSearch(query.trim())
      setShowRecentSearches(false)
    }
    // Update URL without page reload
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (activeTab !== "all") params.set("type", activeTab)
    window.history.pushState({}, "", `/search?${params.toString()}`)
  }

  const handleRecentSearchClick = (searchQuery: string) => {
    setQuery(searchQuery)
    setShowRecentSearches(false)
    // Trigger search
    const params = new URLSearchParams()
    params.set("q", searchQuery)
    if (activeTab !== "all") params.set("type", activeTab)
    window.history.pushState({}, "", `/search?${params.toString()}`)
  }

  const totalResults = searchResults.homes.length + searchResults.bookings.length + searchResults.activities.length

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 pb-48">
      <div className="space-y-6">
        {/* Search Header */}
        <div>
          <h1 className="text-2xl font-bold mb-4">Search</h1>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
                ref={inputRef}
                type="search"
                placeholder="Search homes, bookings, activities..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowRecentSearches(true)}
                className="pl-10"
              />

              {/* Recent Searches Dropdown */}
              {showRecentSearches && recentSearches.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 overflow-hidden"
                >
                  <div className="p-2 border-b bg-muted/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Recent Searches</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={clearRecentSearches}
                    >
                      Clear all
                    </Button>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {recentSearches.map((search, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer group"
                        onClick={() => handleRecentSearchClick(search)}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <History className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm">{search}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeRecentSearch(search)
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Button type="submit">Search</Button>
          </form>
        </div>

        {/* Results */}
        {query.trim() ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground">
                {totalResults} result{totalResults !== 1 ? 's' : ''} found
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
              <TabsList>
                <TabsTrigger value="all">
                  All ({totalResults})
                </TabsTrigger>
                <TabsTrigger value="homes">
                  Homes ({searchResults.homes.length})
                </TabsTrigger>
                <TabsTrigger value="bookings">
                  Bookings ({searchResults.bookings.length})
                </TabsTrigger>
                <TabsTrigger value="activities">
                  Activities ({searchResults.activities.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4 mt-6">
                {/* Homes */}
                {searchResults.homes.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <Home className="h-5 w-5" />
                      Homes ({searchResults.homes.length})
                    </h2>
                    <div className="space-y-3">
                      {searchResults.homes.map((home) => (
                        <Link key={home.id} href={`/homes/${home.id}`}>
                          <Card className="hover:bg-muted/50 transition-colors">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-semibold">{home.code}</h3>
                                  {home.name && <p className="text-sm text-muted-foreground">{home.name}</p>}
                                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                    <MapPin className="h-3 w-3" />
                                    {home.address}, {home.city}
                                  </p>
                                </div>
                                <Badge variant={home.status === "occupied" ? "default" : "secondary"}>
                                  {home.status}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bookings */}
                {searchResults.bookings.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Bookings ({searchResults.bookings.length})
                    </h2>
                    <div className="space-y-3">
                      {searchResults.bookings.map((booking) => (
                        <Link key={booking.id} href={`/bookings/${booking.id}`}>
                          <Card className="hover:bg-muted/50 transition-colors">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-semibold">{booking.bookingId}</h3>
                                  <p className="text-sm text-muted-foreground">{booking.guestName}</p>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {booking.homeCode} • {booking.checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {booking.checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </p>
                                </div>
                                <Badge variant={booking.status === "current" ? "default" : "secondary"}>
                                  {booking.status}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Activities */}
                {searchResults.activities.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Activities ({searchResults.activities.length})
                    </h2>
                    <div className="space-y-3">
                      {searchResults.activities.map((activity) => (
                        <Link key={activity.id} href={`/activities/${activity.id}`}>
                          <Card className="hover:bg-muted/50 transition-colors">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-semibold">{activity.title}</h3>
                                  <p className="text-sm text-muted-foreground">{activity.homeCode}</p>
                                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                    <Clock className="h-3 w-3" />
                                    {activity.scheduledTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                  </p>
                                </div>
                                <Badge variant={
                                  activity.status === "pending" ? "secondary" :
                                  activity.status === "in-progress" ? "default" :
                                  activity.status === "completed" ? "outline" : "destructive"
                                }>
                                  {activity.status}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {totalResults === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg font-semibold mb-2">No results found</p>
                      <p className="text-muted-foreground">Try adjusting your search query</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="homes" className="space-y-3 mt-6">
                {searchResults.homes.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Home className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No homes found</p>
                    </CardContent>
                  </Card>
                ) : (
                  searchResults.homes.map((home) => (
                    <Link key={home.id} href={`/homes/${home.id}`}>
                      <Card className="hover:bg-muted/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{home.code}</h3>
                              {home.name && <p className="text-sm text-muted-foreground">{home.name}</p>}
                              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <MapPin className="h-3 w-3" />
                                {home.address}, {home.city}
                              </p>
                            </div>
                            <Badge variant={home.status === "occupied" ? "default" : "secondary"}>
                              {home.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                )}
              </TabsContent>

              <TabsContent value="bookings" className="space-y-3 mt-6">
                {searchResults.bookings.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No bookings found</p>
                    </CardContent>
                  </Card>
                ) : (
                  searchResults.bookings.map((booking) => (
                    <Link key={booking.id} href={`/bookings/${booking.id}`}>
                      <Card className="hover:bg-muted/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{booking.bookingId}</h3>
                              <p className="text-sm text-muted-foreground">{booking.guestName}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {booking.homeCode} • {booking.checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {booking.checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </p>
                            </div>
                            <Badge variant={booking.status === "current" ? "default" : "secondary"}>
                              {booking.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                )}
              </TabsContent>

              <TabsContent value="activities" className="space-y-3 mt-6">
                {searchResults.activities.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Target className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No activities found</p>
                    </CardContent>
                  </Card>
                ) : (
                  searchResults.activities.map((activity) => (
                    <Link key={activity.id} href={`/activities/${activity.id}`}>
                      <Card className="hover:bg-muted/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{activity.title}</h3>
                              <p className="text-sm text-muted-foreground">{activity.homeCode}</p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <Clock className="h-3 w-3" />
                                {activity.scheduledTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                              </p>
                            </div>
                            <Badge variant={
                              activity.status === "pending" ? "secondary" :
                              activity.status === "in-progress" ? "default" :
                              activity.status === "completed" ? "outline" : "destructive"
                            }>
                              {activity.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-semibold mb-2">Start searching</p>
              <p className="text-muted-foreground">Enter a query to search for homes, bookings, or activities</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="text-center py-12">
          <p>Loading search...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  )
}
