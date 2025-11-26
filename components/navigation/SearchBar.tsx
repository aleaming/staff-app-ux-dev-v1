"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  onOpenSearch?: () => void
  placeholder?: string
  className?: string
}

export function SearchBar({ 
  onOpenSearch,
  placeholder = "Search homes, bookings, activities...",
  className = ""
}: SearchBarProps) {
  const handleClick = () => {
    if (onOpenSearch) {
      onOpenSearch()
    }
  }

  return (
    <div className={`flex-1 max-w-2xl ${className}`} onClick={handleClick}>
      <div className="relative cursor-pointer">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder={placeholder}
          className="pl-10 pr-4 w-full rounded-full bg-white dark:bg-black/40 cursor-pointer"
          readOnly
        />
      </div>
    </div>
  )
}

