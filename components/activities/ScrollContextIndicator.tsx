"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { LogIn, Home, LogOut, ChevronRight, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface ScrollContext {
  phaseName: string | null
  phaseId: string | null
  roomCode: string | null
  roomName: string | null
  roomId: string | null
  roomLocation: string | null
}

interface TopmostSection {
  type: 'phase' | 'room'
  phaseName?: string
  phaseId?: string
  roomCode?: string
  roomName?: string
  roomLocation?: string
  roomId?: string
}

const phaseIcons: Record<string, typeof LogIn> = {
  arrive: LogIn,
  during: Home,
  depart: LogOut,
}

export function ScrollContextIndicator() {
  const [context, setContext] = useState<ScrollContext>({
    phaseName: null,
    phaseId: null,
    roomCode: null,
    roomName: null,
    roomId: null,
    roomLocation: null,
  })
  const [isVisible, setIsVisible] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const headerObserverRef = useRef<IntersectionObserver | null>(null)

  // Debounce context updates for smooth transitions
  const updateContext = useCallback((newContext: ScrollContext) => {
    setContext(prev => {
      // Only update if something changed
      if (
        prev.phaseName === newContext.phaseName &&
        prev.roomCode === newContext.roomCode &&
        prev.roomName === newContext.roomName &&
        prev.roomLocation === newContext.roomLocation
      ) {
        return prev
      }
      return newContext
    })
  }, [])

  useEffect(() => {
    // Track visible sections
    const visibleSections: Map<string, { element: Element; top: number; type: 'phase' | 'room'; phaseName?: string }> = new Map()
    // Track which elements we're already observing
    const observedElements = new Set<Element>()

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        const element = entry.target
        const phaseId = element.getAttribute('data-phase-id')
        const phaseName = element.getAttribute('data-phase-name')
        const roomId = element.getAttribute('data-room-id')
        const roomName = element.getAttribute('data-room-name')
        const roomPhaseName = element.getAttribute('data-room-phase-name')

        const key = roomId || phaseId || ''
        
        if (entry.isIntersecting) {
          const rect = entry.boundingClientRect
          visibleSections.set(key, {
            element,
            top: rect.top,
            type: roomId ? 'room' : 'phase',
            phaseName: roomPhaseName || phaseName || undefined,
          })
        } else {
          visibleSections.delete(key)
        }
      })

      // Find the topmost visible section
      let topmostSection: TopmostSection | null = null
      let topmostTop = Infinity

      visibleSections.forEach((section) => {
        // Get current position (may have changed since intersection)
        const rect = section.element.getBoundingClientRect()
        // Consider sections that are at or above the sticky header position
        if (rect.top < 200 && rect.bottom > 100) {
          if (rect.top < topmostTop || (section.type === 'room' && topmostSection?.type === 'phase')) {
            topmostTop = rect.top
            
            if (section.type === 'room') {
              topmostSection = {
                type: 'room',
                phaseName: section.phaseName,
                roomCode: section.element.getAttribute('data-room-code') || undefined,
                roomName: section.element.getAttribute('data-room-name') || undefined,
                roomLocation: section.element.getAttribute('data-room-location') || undefined,
                roomId: section.element.getAttribute('data-room-id') || undefined,
              }
            } else {
              topmostSection = {
                type: 'phase',
                phaseName: section.element.getAttribute('data-phase-name') || undefined,
                phaseId: section.element.getAttribute('data-phase-id') || undefined,
              }
            }
          }
        }
      })

      // Type assertion needed because TypeScript can't track type through forEach closure
      const result = topmostSection as TopmostSection | null
      if (result) {
        updateContext({
          phaseName: result.phaseName || null,
          phaseId: result.phaseId || null,
          roomCode: result.roomCode || null,
          roomName: result.roomName || null,
          roomId: result.roomId || null,
          roomLocation: result.roomLocation || null,
        })
      }
    }

    // Observer for header card to control visibility
    const handleHeaderIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        // Show breadcrumb when header is not fully visible
        setIsVisible(!entry.isIntersecting || entry.intersectionRatio < 0.5)
      })
    }

    // Create observers
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      rootMargin: '-100px 0px -50% 0px',
    })

    headerObserverRef.current = new IntersectionObserver(handleHeaderIntersection, {
      threshold: [0, 0.5, 1],
    })

    // Function to observe all phase and room sections
    const observeSections = () => {
      const phaseSections = document.querySelectorAll('[data-phase-id]')
      const roomSections = document.querySelectorAll('[data-room-id]')

      phaseSections.forEach(section => {
        if (!observedElements.has(section)) {
          observerRef.current?.observe(section)
          observedElements.add(section)
        }
      })

      roomSections.forEach(section => {
        if (!observedElements.has(section)) {
          observerRef.current?.observe(section)
          observedElements.add(section)
        }
      })
    }

    // Initial observation
    observeSections()

    const headerCard = document.querySelector('[data-activity-header]')
    if (headerCard) {
      headerObserverRef.current?.observe(headerCard)
    }

    // MutationObserver to detect when new room/phase elements are added (e.g., accordion opens)
    const mutationObserver = new MutationObserver((mutations) => {
      let shouldReobserve = false
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof Element) {
              // Check if the added node or its descendants have room/phase data attributes
              if (node.hasAttribute('data-room-id') || node.hasAttribute('data-phase-id') ||
                  node.querySelector('[data-room-id]') || node.querySelector('[data-phase-id]')) {
                shouldReobserve = true
              }
            }
          })
        }
      })
      if (shouldReobserve) {
        observeSections()
      }
    })

    // Observe the entire document for DOM changes
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })

    // Also update on scroll for more responsive updates
    const handleScroll = () => {
      // Re-check sections on scroll in case new ones appeared
      observeSections()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      observerRef.current?.disconnect()
      headerObserverRef.current?.disconnect()
      mutationObserver.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [updateContext])

  // Don't render if no context or not visible
  if (!isVisible || !context.phaseName) {
    return null
  }

  const PhaseIcon = phaseIcons[context.phaseName.toLowerCase()] || Home

  return (
    <div 
      className={cn(
        "sticky top-[116px] z-20 -mx-4 px-4 sm:-mx-6 sm:px-6 py-2 transition-all duration-200",
        "bg-background/95 backdrop-blur-sm border-b",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      )}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <Badge 
          variant="secondary" 
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium"
        >
          <PhaseIcon className="h-3.5 w-3.5" />
          <span className="capitalize">{context.phaseName}</span>
          {context.roomName && (
            <>
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
              <span>{context.roomName}</span>
            </>
          )}
        </Badge>
        {context.roomLocation && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {context.roomLocation}
          </span>
        )}
      </div>
    </div>
  )
}

