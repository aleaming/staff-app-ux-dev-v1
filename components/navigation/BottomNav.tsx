"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, Target, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { useHapticFeedback } from "@/components/haptic/HapticProvider"
import type { ActivityType } from "@/lib/activity-templates"

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: Home,
    badge: null,
  },
  {
    label: "Catalog",
    href: "/catalog",
    icon: BookOpen,
    badge: null,
  },
  {
    label: "Activities",
    href: "/activities",
    icon: Target,
    badge: 3, // TODO: Get from actual data
  },
]

interface ActiveActivity {
  activityType: ActivityType
  homeId: string
  homeCode: string
  bookingId?: string
}

export function BottomNav() {
  const { trigger } = useHapticFeedback()
  const pathname = usePathname()
  const [activeActivity, setActiveActivity] = useState<ActiveActivity | null>(null)

  useEffect(() => {
    // Check for active activity in localStorage
    const checkForActiveActivity = () => {
      if (typeof window === "undefined") return

      const allKeys = Object.keys(localStorage)
      const draftKeys = allKeys.filter(key => key.startsWith("activity-tracker-draft-"))

      for (const key of draftKeys) {
        const closedKey = key.replace("activity-tracker-draft-", "activity-closed-")
        const isClosed = localStorage.getItem(closedKey) === "true"

        if (!isClosed) {
          try {
            const parts = key.replace("activity-tracker-draft-", "").split("-")
            const activityType = parts.pop() as ActivityType
            const homeId = parts.join("-")

            // Get metadata for bookingId
            const metaKey = `activity-meta-${homeId}-${activityType}`
            const metaData = localStorage.getItem(metaKey)
            let bookingId: string | undefined
            let homeCode = homeId

            if (metaData) {
              try {
                const meta = JSON.parse(metaData)
                bookingId = meta.bookingId || undefined
                homeCode = meta.homeCode || homeId
              } catch (e) {
                console.error("Error parsing metadata:", e)
              }
            }

            setActiveActivity({
              activityType,
              homeId,
              homeCode,
              bookingId
            })
            return
          } catch (error) {
            console.error("Error parsing activity key:", error)
          }
        }
      }

      setActiveActivity(null)
    }

    checkForActiveActivity()

    // Listen for storage changes
    const handleStorageChange = () => {
      checkForActiveActivity()
    }

    window.addEventListener("storage", handleStorageChange)
    // Also check periodically in case changes happen in the same window
    const interval = setInterval(checkForActiveActivity, 1000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const currentActivityHref = activeActivity
    ? `/homes/${activeActivity.homeId}/activities/${activeActivity.activityType}/track${activeActivity.bookingId ? `?bookingId=${activeActivity.bookingId}` : ''}`
    : "/activities"

  const isCurrentActivityActive = pathname?.includes("/activities/") && pathname?.includes("/track")

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] md:hidden">
      {/* Liquid Glass Container */}
      <div className="liquid-glass-nav rounded-t-[32px] border-t border-border/20 shadow-2xl pt-3 pb-5">
        <div className="grid grid-cols-4 h-16 px-2">
          {navItems.map((item) => {
            // Special handling for Catalog - should be active on /catalog, /homes, and /bookings
            // BUT NOT when on an activity tracking page (/homes/.../activities/.../track)
            let isActive = false
            if (item.href === "/catalog") {
              const isOnActivityTrack = pathname?.includes("/activities/") && pathname?.includes("/track")
              isActive = !isOnActivityTrack && (
                pathname === "/catalog" || 
                pathname?.startsWith("/homes") || 
                pathname?.startsWith("/bookings")
              )
            } else {
              isActive = pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href))
            }
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => trigger('light')}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 relative",
                  "transition-all duration-200 rounded-xl",
                  "hover:bg-foreground/10 active:scale-95",
                  isActive && "bg-foreground/15"
                )}
              >
                <div className="relative">
                  <Icon className={cn(
                    "h-5 w-5 transition-all duration-200",
                    isActive ? "text-primary scale-110" : "text-foreground"
                  )} />
                  {item.badge && item.badge > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs shadow-lg"
                    >
                      {item.badge > 9 ? "9+" : item.badge}
                    </Badge>
                  )}
                </div>
                <span className={cn(
                  "text-xs font-medium transition-all duration-200",
                  isActive ? "text-primary font-semibold" : "text-foreground"
                )}>
                  {item.label}
                </span>
              </Link>
            )
          })}

          {/* Current Activity Button */}
          <Link
            href={currentActivityHref}
            onClick={() => trigger('light')}
            className={cn(
              "flex flex-col items-center justify-center gap-1 relative",
              "transition-all duration-200 rounded-xl",
              "hover:bg-foreground/10 active:scale-95",
              isCurrentActivityActive && "bg-foreground/15",
              !activeActivity && "opacity-50"
            )}
            aria-label="Current Activity"
          >
            <div className="relative">
              <Play className={cn(
                "h-5 w-5 transition-all duration-200",
                isCurrentActivityActive ? "text-primary scale-110" : "text-foreground"
              )} />
              {activeActivity && (
                <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>
            <span className={cn(
              "text-xs font-medium transition-all duration-200",
              isCurrentActivityActive ? "text-primary font-semibold" : "text-foreground"
            )}>
              Current
            </span>
          </Link>
        </div>
      </div>
    </nav>
  )
}

