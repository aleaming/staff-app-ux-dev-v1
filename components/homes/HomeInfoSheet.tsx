"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { CLOSE_ALL_SHEETS_EVENT } from "@/lib/sheet-utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HomeAccess } from "@/components/homes/HomeAccess"
import { HomeEssentials } from "@/components/homes/HomeEssentials"
import { HomeRules } from "@/components/homes/HomeRules"
import { HomeMedia } from "@/components/homes/HomeMedia"
import { PropertyBrowser } from "@/components/property/PropertyBrowser"
import { HomeActivitiesSheet } from "@/components/homes/HomeActivitiesSheet"
import { Home } from "lucide-react"

interface HomeInfoSheetProps {
  homeId: string
  homeCode: string
  homeName?: string
  defaultTab?: "browse" | "access" | "essentials" | "rules" | "media"
  children: React.ReactNode
}

export function HomeInfoSheet({ 
  homeId, 
  homeCode, 
  homeName,
  defaultTab = "essentials",
  children
}: HomeInfoSheetProps) {
  const [open, setOpen] = useState(false)

  // Close sheet when navigation occurs
  useEffect(() => {
    const handleClose = () => setOpen(false)
    window.addEventListener(CLOSE_ALL_SHEETS_EVENT, handleClose)
    return () => window.removeEventListener(CLOSE_ALL_SHEETS_EVENT, handleClose)
  }, [])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>

      <SheetContent side="bottom" className="h-[calc(92vh-8rem)] max-h-[calc(92vh-4rem)]">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            {homeCode} {homeName && `• ${homeName}`}
          </SheetTitle>
        </SheetHeader>

        {/* Home Activities Button */}
        <div className="mb-4">
          <HomeActivitiesSheet 
            homeId={homeId} 
            homeCode={homeCode} 
            homeName={homeName} 
          />
        </div>
        
        <Tabs defaultValue={defaultTab} className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-5 mb-4">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="access">Access</TabsTrigger>
            <TabsTrigger value="essentials">Essentials</TabsTrigger>
            <TabsTrigger value="rules">Rules</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="browse" className="mt-0">
              <PropertyBrowser homeId={homeId} homeCode={homeCode} homeName={homeName} />
            </TabsContent>

            <TabsContent value="access" className="mt-0">
              <HomeAccess homeCode={homeCode} />
            </TabsContent>

            <TabsContent value="essentials" className="mt-0">
              <HomeEssentials homeCode={homeCode} />
            </TabsContent>

            <TabsContent value="rules" className="mt-0">
              <HomeRules homeCode={homeCode} />
            </TabsContent>

            <TabsContent value="media" className="mt-0">
              <HomeMedia homeCode={homeCode} />
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}

