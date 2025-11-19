"use client"

import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { BreadcrumbItem } from "./Breadcrumbs"
import Link from "next/link"

interface BreadcrumbEllipsisProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbEllipsis({ items }: BreadcrumbEllipsisProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-foreground"
          aria-label="Show more breadcrumbs"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto">
        {items.map((item, index) => (
          <DropdownMenuItem key={index} asChild>
            {item.href ? (
              <Link href={item.href} className="cursor-pointer">
                {item.label}
              </Link>
            ) : (
              <span>{item.label}</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

