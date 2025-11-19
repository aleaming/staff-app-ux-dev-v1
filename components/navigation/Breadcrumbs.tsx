"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { BreadcrumbEllipsis } from "./BreadcrumbEllipsis"

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
  maxVisible?: number // Maximum number of items to show before using ellipsis
}

export function Breadcrumbs({ items, className, maxVisible = 3 }: BreadcrumbsProps) {
  const [shouldShowEllipsis, setShouldShowEllipsis] = useState(false)
  const [visibleItems, setVisibleItems] = useState<BreadcrumbItem[]>(items)
  const [hiddenItems, setHiddenItems] = useState<BreadcrumbItem[]>([])

  useEffect(() => {
    // If items exceed maxVisible, show ellipsis
    if (items.length > maxVisible) {
      setShouldShowEllipsis(true)
      // Show first item, ellipsis, and last (maxVisible - 1) items
      // e.g., if maxVisible = 3: [first] ... [second-to-last] [last]
      const firstItem = items[0]
      const lastItems = items.slice(-(maxVisible - 1))
      const middleItems = items.slice(1, items.length - (maxVisible - 1))
      
      setVisibleItems([firstItem, ...lastItems])
      setHiddenItems(middleItems)
    } else {
      setShouldShowEllipsis(false)
      setVisibleItems(items)
      setHiddenItems([])
    }
  }, [items, maxVisible])

  if (items.length === 0) {
    return (
      <nav 
        aria-label="Breadcrumb" 
        className={cn("flex items-center space-x-1.5 text-xs text-muted-foreground", className)}
      >
        <Link 
          href="/" 
          className="hover:text-foreground transition-colors flex items-center"
        >
          <Home className="h-4 w-4" />
        </Link>
      </nav>
    )
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn("flex items-center space-x-1.5 text-xs text-muted-foreground flex-wrap", className)}
    >
      <Link 
        href="/" 
        className="hover:text-foreground transition-colors flex items-center"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {shouldShowEllipsis ? (
        <>
          {/* First visible item */}
          {visibleItems[0] && (
            <div className="flex items-center space-x-1.5">
              <ChevronRight className="h-4 w-4" />
              {visibleItems[0].href ? (
                <Link 
                  href={visibleItems[0].href} 
                  className="hover:text-foreground transition-colors"
                >
                  {visibleItems[0].label}
                </Link>
              ) : (
                <span>{visibleItems[0].label}</span>
              )}
            </div>
          )}
          
          {/* Ellipsis with hidden items */}
          {hiddenItems.length > 0 && (
            <div className="flex items-center space-x-1.5">
              <ChevronRight className="h-4 w-4" />
              <BreadcrumbEllipsis items={hiddenItems} />
            </div>
          )}
          
          {/* Remaining visible items */}
          {visibleItems.slice(1).map((item, index) => {
            const actualIndex = items.length - visibleItems.length + index + 1
            const isLast = actualIndex === items.length - 1
            
            return (
              <div key={actualIndex} className="flex items-center space-x-1.5">
                <ChevronRight className="h-4 w-4" />
                {isLast ? (
                  <span className="text-foreground font-medium">{item.label}</span>
                ) : item.href ? (
                  <Link 
                    href={item.href} 
                    className="hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span>{item.label}</span>
                )}
              </div>
            )
          })}
        </>
      ) : (
        // Show all items when not using ellipsis
        items.map((item, index) => {
          const isLast = index === items.length - 1
          
          return (
            <div key={index} className="flex items-center space-x-1.5">
              <ChevronRight className="h-4 w-4" />
              {isLast ? (
                <span className="text-foreground font-medium">{item.label}</span>
              ) : item.href ? (
                <Link 
                  href={item.href} 
                  className="hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span>{item.label}</span>
              )}
            </div>
          )
        })
      )}
    </nav>
  )
}

