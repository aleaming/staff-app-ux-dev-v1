"use client"

import { useCallback, useRef } from "react"

interface UseThemeTransitionOptions {
  /**
   * Duration of the transition in milliseconds
   * @default 300
   */
  duration?: number
}

interface UseThemeTransitionReturn {
  /**
   * Wraps a DOM update in a View Transition for smooth animation
   * Falls back to immediate execution if View Transitions API is not supported
   */
  startTransition: (callback: () => void) => void
  /**
   * Reference to store the button element for position-aware animations
   */
  triggerRef: React.RefObject<HTMLButtonElement>
  /**
   * Whether View Transitions API is supported in this browser
   */
  isSupported: boolean
}

/**
 * Hook that wraps the View Transitions API with automatic fallbacks
 * for unsupported browsers (Firefox, older Safari)
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
 */
export function useThemeTransition(
  options: UseThemeTransitionOptions = {}
): UseThemeTransitionReturn {
  const { duration = 300 } = options
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Check for View Transitions API support
  const isSupported = typeof document !== "undefined" && "startViewTransition" in document

  const startTransition = useCallback(
    (callback: () => void) => {
      // Fallback for unsupported browsers
      if (!isSupported) {
        callback()
        return
      }

      // Get button position for the circle animation origin
      const button = triggerRef.current
      let x = window.innerWidth / 2
      let y = window.innerHeight / 2

      if (button) {
        const rect = button.getBoundingClientRect()
        x = rect.left + rect.width / 2
        y = rect.top + rect.height / 2
      }

      // Calculate the maximum radius needed to cover the entire screen
      const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )

      // Determine the TARGET theme (opposite of current since we're toggling)
      // The backdrop needs the TARGET theme's color because the new state clips in on top
      const isCurrentlyDark = document.documentElement.classList.contains("dark")
      const targetThemeColor = isCurrentlyDark 
        ? "hsl(48 50% 97%)"   // Going TO light
        : "hsl(60 3% 15%)"    // Going TO dark
      
      // Inject the animation styles dynamically
      const styleId = "theme-transition-styles"
      let styleEl = document.getElementById(styleId) as HTMLStyleElement | null

      if (!styleEl) {
        styleEl = document.createElement("style")
        styleEl.id = styleId
        document.head.appendChild(styleEl)
      }

      // Simplified animation logic:
      // - The ::view-transition pseudo-element gets the TARGET theme's background
      // - Old state (current theme) stays fully visible as backdrop (z-index: 1)
      // - New state (target theme) clips in on top (z-index: 9999)
      // - Backdrop matches target to prevent color flash at clip-path edges
      styleEl.textContent = `
        /* Solid backdrop using TARGET theme color to prevent flash */
        ::view-transition {
          background-color: ${targetThemeColor};
        }

        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation: none;
          mix-blend-mode: normal;
        }

        /* Old state stays visible as full backdrop */
        ::view-transition-old(root) {
          z-index: 1;
        }

        /* New state clips in on top */
        ::view-transition-new(root) {
          z-index: 9999;
          animation: circle-clip ${duration}ms ease-in-out forwards;
        }

        @keyframes circle-clip {
          from {
            clip-path: circle(0px at ${x}px ${y}px);
          }
          to {
            clip-path: circle(${maxRadius}px at ${x}px ${y}px);
          }
        }
      `

      // Start the view transition
      // @ts-expect-error - View Transitions API types not in all TypeScript versions
      document.startViewTransition(() => {
        callback()
      })
    },
    [isSupported, duration]
  )

  return {
    startTransition,
    triggerRef,
    isSupported,
  }
}
