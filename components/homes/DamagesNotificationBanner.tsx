"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { AlertTriangle, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { testHomes, type Damage } from "@/lib/test-data"
import { DamagesSheet } from "./DamagesSheet"

export function DamagesNotificationBanner() {
  const pathname = usePathname()
  const [homeId, setHomeId] = useState<string | null>(null)
  const [damages, setDamages] = useState<Damage[]>([])
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
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
  }, [pathname])

  if (!homeId || damages.length === 0) {
    return null
  }

  const openDamages = damages.filter(d => d.status !== "resolved")
  const openCount = openDamages.length

  if (openCount === 0) {
    return null
  }

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <div className="w-full bg-orange-50 dark:bg-orange-950 border-b border-orange-200 dark:border-orange-800">
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between h-auto py-3 px-4 hover:bg-orange-100 dark:hover:bg-orange-900 rounded-none"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900">
                <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1 text-left">
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
              <ChevronUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
          </Button>
        </SheetTrigger>
      </div>

      <SheetContent side="bottom" className="h-screen max-h-[calc(100vh-8rem)] flex flex-col bg-secondary dark:bg-secondary-foreground">
        <SheetHeader className="mb-1">
          <SheetTitle className="text-2xl text-left">Known Damages</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          <DamagesSheet homeId={homeId} damages={damages} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

