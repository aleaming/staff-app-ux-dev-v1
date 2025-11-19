"use client"

import { useState, useMemo, useCallback } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { IssueBadge } from "./IssueBadge"
import { cn } from "@/lib/utils"
import type { PropertyHierarchyNode, PropertyIssuePriority } from "@/lib/test-data"

interface SearchResult {
  item: PropertyHierarchyNode
  breadcrumbPath: string[]
  issueCount: number
  issuePriority?: PropertyIssuePriority
}

interface PropertySearchProps {
  propertyId: string
  propertyName: string
  hierarchy: PropertyHierarchyNode
  issues: Record<string, any[]>
  onNavigate: (nodeId: string, path: string[]) => void
  onOpenDetails: (item: PropertyHierarchyNode, path: string[]) => void
}

export function PropertySearch({
  propertyId,
  propertyName,
  hierarchy,
  issues,
  onNavigate,
  onOpenDetails
}: PropertySearchProps) {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)

  // Flatten hierarchy into searchable array with full paths
  const searchableItems = useMemo(() => {
    const items: Array<{
      node: PropertyHierarchyNode
      path: string[]
      fullPath: string
    }> = []

    const traverse = (node: PropertyHierarchyNode, path: string[] = []) => {
      const currentPath = [...path, node.label]
      const fullPath = currentPath.join(" > ")

      items.push({
        node,
        path: currentPath,
        fullPath
      })

      if (node.children) {
        node.children.forEach(child => traverse(child, currentPath))
      }
    }

    traverse(hierarchy)
    return items
  }, [hierarchy])

  // Fuzzy search function
  const fuzzyMatch = useCallback((text: string, pattern: string): boolean => {
    const textLower = text.toLowerCase()
    const patternLower = pattern.toLowerCase()
    
    // Exact match
    if (textLower.includes(patternLower)) return true
    
    // Fuzzy match: check if all pattern characters appear in order
    let patternIndex = 0
    for (let i = 0; i < textLower.length && patternIndex < patternLower.length; i++) {
      if (textLower[i] === patternLower[patternIndex]) {
        patternIndex++
      }
    }
    return patternIndex === patternLower.length
  }, [])

  // Search results
  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return []

    const queryLower = query.toLowerCase()
    const matched: SearchResult[] = []

    searchableItems.forEach(({ node, path, fullPath }) => {
      // Search in: label, full path, metadata, details
      const searchTexts = [
        node.label,
        fullPath,
        node.metadata || "",
        ...(node.details ? Object.values(node.details) : []),
        node.type
      ].filter(Boolean).join(" ")

      if (fuzzyMatch(searchTexts, queryLower)) {
        const nodeIssues = issues[node.id] || []
        const issueCount = nodeIssues.filter((issue: any) => issue.status !== "resolved").length
        const issuePriority = nodeIssues.length > 0 
          ? (nodeIssues[0] as any).priority || "medium"
          : undefined

        matched.push({
          item: node,
          breadcrumbPath: path,
          issueCount,
          issuePriority
        })
      }
    })

    return matched.slice(0, 20) // Limit to 20 results
  }, [query, searchableItems, issues, fuzzyMatch])

  const handleSearchChange = (value: string) => {
    setQuery(value)
    setIsSearching(value.length >= 2)

    // Debounce search
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    const timer = setTimeout(() => {
      // Search is handled by useMemo
    }, 300)

    setDebounceTimer(timer)
  }

  const handleClear = () => {
    setQuery("")
    setIsSearching(false)
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
  }

  const handleResultClick = (result: SearchResult) => {
    if (result.item.type === "item") {
      // Terminal item - open details
      onOpenDetails(result.item, result.breadcrumbPath)
    } else {
      // Navigate to that level
      onNavigate(result.item.id, result.breadcrumbPath)
    }
    handleClear()
  }

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search property..."
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-10 rounded-full bg-white/80 dark:bg-black/70"
          aria-label="Search property"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Results */}
      {isSearching && (
        <div className="border rounded-lg bg-background shadow-sm max-h-[400px] overflow-y-auto">
          {results.length > 0 ? (
            <>
              <div className="sticky top-0 bg-muted/50 px-4 py-2 text-sm font-medium border-b">
                Found {results.length} result{results.length !== 1 ? "s" : ""} in {propertyName}
              </div>
              <div className="divide-y">
                {results.map((result, index) => (
                  <button
                    key={`${result.item.id}-${index}`}
                    onClick={() => handleResultClick(result)}
                    className={cn(
                      "w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors",
                      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    )}
                    aria-label={`${result.item.label}, ${result.breadcrumbPath.join(", ")}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-base truncate">
                          {result.item.label}
                        </div>
                        <div className="text-sm text-muted-foreground truncate mt-0.5">
                          {result.breadcrumbPath.join(" > ")}
                        </div>
                      </div>
                      {result.issueCount > 0 && (
                        <IssueBadge
                          count={result.issueCount}
                          priority={result.issuePriority}
                        />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}

