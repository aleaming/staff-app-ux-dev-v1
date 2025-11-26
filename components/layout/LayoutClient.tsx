"use client"

import { useState } from "react"
import { TopNav } from "@/components/navigation/TopNav"
import { FixedSearchBar } from "@/components/navigation/FixedSearchBar"
import { GlobalSearchSheet } from "@/components/navigation/GlobalSearchSheet"
import { BottomNav } from "@/components/navigation/BottomNav"
import { DamagesNotificationBanner } from "@/components/homes/DamagesNotificationBanner"
import { Toaster } from "sonner"

interface LayoutClientProps {
  children: React.ReactNode
}

export function LayoutClient({ children }: LayoutClientProps) {
  const [searchSheetOpen, setSearchSheetOpen] = useState(false)

  return (
    <>
      <TopNav onOpenSearch={() => setSearchSheetOpen(true)} />
      <FixedSearchBar onOpenSearch={() => setSearchSheetOpen(true)} />
      <DamagesNotificationBanner />
      <main className="flex-1 pb-48 md:pb-48">
        {children}
      </main>
      <BottomNav />
      <Toaster position="top-center" richColors />
      <GlobalSearchSheet open={searchSheetOpen} onOpenChange={setSearchSheetOpen} />
    </>
  )
}


