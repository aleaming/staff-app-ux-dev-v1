"use client"

import { useState, useEffect } from "react"
import { SearchBar } from "./SearchBar"
import { cn } from "@/lib/utils"

interface FixedSearchBarProps {
  onOpenSearch?: () => void
}

export function FixedSearchBar({ onOpenSearch }: FixedSearchBarProps) {
  const [isTopNavVisible, setIsTopNavVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Show nav when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsTopNavVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsTopNavVisible(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <div 
      className={cn(
        "sticky z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden transition-all duration-300",
        isTopNavVisible ? "top-16" : "top-0"
      )}
    >
      <div className="container px-4 py-3">
        <SearchBar onOpenSearch={onOpenSearch} />
      </div>
    </div>
  )
}

