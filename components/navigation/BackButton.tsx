"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BackButtonProps {
  href?: string
  label?: string
  className?: string
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "lg" | "icon"
}

export function BackButton({ 
  href, 
  label = "Back",
  className,
  variant = "ghost",
  size = "icon"
}: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  if (size === "icon") {
    return (
      <Button 
        variant={variant} 
        size={size}
        onClick={handleClick}
        className={className}
        aria-label={label}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Button 
      variant={variant} 
      size={size}
      onClick={handleClick}
      className={cn("flex items-center gap-2", className)}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  )
}

