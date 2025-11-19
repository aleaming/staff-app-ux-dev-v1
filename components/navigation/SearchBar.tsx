"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ 
  onSearch, 
  placeholder = "Search homes, bookings, activities...",
  className = ""
}: SearchBarProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim())
      } else {
        // Default: navigate to search page
        window.location.href = `/search?q=${encodeURIComponent(query.trim())}`
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`flex-1 max-w-2xl ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-4 w-full rounded-full bg-white dark:bg-black/40"
        />
      </div>
    </form>
  )
}

