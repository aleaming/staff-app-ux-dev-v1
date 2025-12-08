"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  width?: number
  height?: number
}

export function Logo({ className, width = 101, height = 33 }: LogoProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Show light mode logo by default during SSR/hydration
  const logoSrc = mounted && resolvedTheme === "dark" 
    ? "/hosted-logo-dark-mode.svg" 
    : "/hosted-logo-light-mode.svg"

  return (
    <Image 
      src={logoSrc}
      alt="hosted" 
      width={width}
      height={height}
      className={cn("h-8 w-auto", className)}
      priority
    />
  )
}

