"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useThemeTransition } from "@/lib/hooks/use-theme-transition"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  /** Additional CSS classes */
  className?: string
  /** Show text label next to icon */
  showLabel?: boolean
}

/**
 * Animated theme toggle button with View Transitions API
 * Creates a smooth expanding circle animation when switching themes
 */
export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme()
  const { startTransition, triggerRef } = useThemeTransition({ duration: 300 })
  const [mounted, setMounted] = React.useState(false)

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === "dark"

  const toggleTheme = React.useCallback(() => {
    startTransition(() => {
      setTheme(isDark ? "light" : "dark")
    })
  }, [isDark, setTheme, startTransition])

  // Prevent hydration mismatch by showing placeholder until mounted
  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size={showLabel ? "sm" : "icon"} 
        className={cn("h-9 w-9", className)}
        disabled
      >
        <Sun className="h-4 w-4" />
        {showLabel && <span className="ml-2">Theme</span>}
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      ref={triggerRef}
      variant="ghost"
      size={showLabel ? "sm" : "icon"}
      onClick={toggleTheme}
      className={cn(
        "relative overflow-hidden",
        showLabel ? "h-9 px-3" : "h-9 w-9",
        className
      )}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      {/* Sun icon - visible in light mode */}
      <Sun
        className={cn(
          "h-4 w-4 transition-all duration-300",
          isDark
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        )}
      />
      {/* Moon icon - visible in dark mode */}
      <Moon
        className={cn(
          "absolute h-4 w-4 transition-all duration-300",
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        )}
      />
      {showLabel && (
        <span className="ml-2 text-sm">
          {isDark ? "Dark" : "Light"}
        </span>
      )}
      <span className="sr-only">
        Switch to {isDark ? "light" : "dark"} theme
      </span>
        </Button>
  )
}
