"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { testRecentItems } from "@/lib/test-data"
import { Home, Calendar, Target, X, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export type RecentItemType = "home" | "booking" | "activity"

export interface RecentItem {
  id: string
  type: RecentItemType
  title: string
  subtitle?: string
  href: string
  accessedAt: Date
}

interface RecentlyAccessedProps {
  items?: RecentItem[]
  isLoading?: boolean
  maxItems?: number
}

const typeConfig = {
  "home": { label: "Home", icon: Home, color: "bg-blue-500" },
  "booking": { label: "Booking", icon: Calendar, color: "bg-green-500" },
  "activity": { label: "Activity", icon: Target, color: "bg-orange-500" },
}

export function RecentlyAccessed({ 
  items = [], 
  isLoading = false,
  maxItems = 10 
}: RecentlyAccessedProps) {
  const [recentItems, setRecentItems] = useState<RecentItem[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('recentItems')
    if (stored) {
      try {
        const parsed = JSON.parse(stored).map((item: any) => ({
          ...item,
          accessedAt: new Date(item.accessedAt)
        }))
        setRecentItems(parsed.slice(0, maxItems))
      } catch (e) {
        console.error('Failed to parse recent items', e)
      }
    }
  }, [maxItems])

  // Use provided items or fall back to test data
  const displayItems = recentItems.length > 0 ? recentItems : (items.length > 0 ? items : testRecentItems)

  const formatTimeAgo = (date: Date): string => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const handleClearHistory = () => {
    localStorage.removeItem('recentItems')
    setRecentItems([])
  }

  const handleRemoveItem = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const updated = recentItems.filter(item => item.id !== id)
    setRecentItems(updated)
    localStorage.setItem('recentItems', JSON.stringify(updated))
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-row items-start sm:items-center justify-between gap-3 sm:gap-2">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2 flex-wrap">
            <span className="break-words">Recently Accessed</span>
            {displayItems.length > 0 && (
              <Badge variant="secondary" className="text-xs">{displayItems.length}</Badge>
            )}
          </CardTitle>
          {displayItems.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleClearHistory}
              className="text-xs sm:text-sm"
            >
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        {displayItems.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No recent items</p>
            <p className="text-sm text-muted-foreground mt-1">
              Items you view will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayItems.map((item) => {
              const typeInfo = typeConfig[item.type]
              const Icon = typeInfo.icon

              return (
                <Link 
                  key={item.id} 
                  href={item.href}
                  className="block"
                >
                  <Card className="hover:bg-muted/50 transition-colors group">
                    <CardContent className="p-2.5 sm:p-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${typeInfo.color} text-background`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium truncate">{item.title}</h3>
                              {item.subtitle && (
                                <p className="text-sm text-muted-foreground truncate">
                                  {item.subtitle}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatTimeAgo(item.accessedAt)}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => handleRemoveItem(item.id, e)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

