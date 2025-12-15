"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { testHomes, type Damage } from "@/lib/test-data"
import { DamagesSheet } from "./DamagesSheet"

interface DamagesNotificationBannerProps {
  /** Optional home ID to use directly (bypasses URL extraction) */
  homeId?: string
  /** Optional damages array to use directly */
  damages?: Damage[]
}

export function DamagesNotificationBanner({ homeId: propHomeId, damages: propDamages }: DamagesNotificationBannerProps) {
  const pathname = usePathname()
  const [homeId, setHomeId] = useState<string | null>(propHomeId || null)
  const [damages, setDamages] = useState<Damage[]>(propDamages || [])
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    // If homeId or damages are passed as props, use them directly
    if (propHomeId) {
      setHomeId(propHomeId)
      
      if (propDamages && propDamages.length > 0) {
        setDamages(propDamages)
      } else {
        // Look up damages from the home data
        const home = testHomes.find(h => h.id === propHomeId || h.code === propHomeId)
        if (home && home.damages && home.damages.length > 0) {
          setDamages(home.damages)
          setHomeId(home.id)
        } else {
          setDamages([])
        }
      }
      return
    }

    // Extract home ID from pathname
    // Paths like /homes/home-1 or /homes/home-1/...
    if (pathname?.startsWith("/homes/")) {
      const parts = pathname.split("/")
      const id = parts[2] // /homes/[id]/...
      if (id && id !== "start-activity" && !id.includes("activities")) {
        setHomeId(id)
        
        // Find home and get damages
        const home = testHomes.find(h => h.id === id)
        if (home && home.damages && home.damages.length > 0) {
          setDamages(home.damages)
        } else {
          setDamages([])
        }
      } else {
        setHomeId(null)
        setDamages([])
      }
    } else {
      setHomeId(null)
      setDamages([])
    }
  }, [pathname, propHomeId, propDamages])

  if (!homeId || damages.length === 0) {
    return null
  }

  const openDamages = damages.filter(d => d.status !== "resolved")
  const openCount = openDamages.length

  if (openCount === 0) {
    return null
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <div className="w-full bg-orange-50 dark:bg-orange-950 border-b border-orange-200 dark:border-orange-800 py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900">
            <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-orange-900 dark:text-orange-300">
                Known Damages
              </span>
              <Badge variant="destructive" className="text-xs">
                {openCount}
              </Badge>
            </div>
            <p className="text-xs text-orange-700 dark:text-orange-300 mt-0.5">
              {openCount} {openCount === 1 ? "damage" : "damages"} reported for this property
            </p>
          </div>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="bg-white dark:bg-orange-900 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-800"
            >
              View
            </Button>
          </DialogTrigger>
        </div>
      </div>

      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-lg max-h-[85vh] overflow-y-auto mx-auto my-4 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Known Damages
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <DamagesSheet homeId={homeId} damages={damages} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
