"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { ArrowLeft, RefreshCw, Wifi, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs"
import { HierarchicalListItem } from "./HierarchicalListItem"
import { ItemDetailsSheet } from "./ItemDetailsSheet"
import { PropertyIssueReportSheet } from "./PropertyIssueReportSheet"
import { PropertySearch } from "./PropertySearch"
import {
  getPropertyHierarchy,
  getIssuesForProperty,
  bubbleUpIssueCounts,
  type PropertyHierarchyNode,
  type PropertyIssue,
  type PropertyIssueType,
  type PropertyIssuePriority
} from "@/lib/test-data"
import { toast } from "sonner"

interface Photo {
  id: string
  file: File
  preview: string
  thumbnail?: string
}

interface PropertyBrowserProps {
  homeId: string
  homeCode: string
  homeName?: string
}

type SheetType = "details" | "issue-report" | null

export function PropertyBrowser({ homeId, homeCode, homeName }: PropertyBrowserProps) {
  const [hierarchy, setHierarchy] = useState<PropertyHierarchyNode | null>(null)
  const [issues, setIssues] = useState<Record<string, PropertyIssue[]>>({})
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ label: string; href?: string }>>([])
  const [selectedItem, setSelectedItem] = useState<PropertyHierarchyNode | null>(null)
  const [openSheet, setOpenSheet] = useState<SheetType>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load hierarchy and issues
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      
      // Check for cached hierarchy
      const cacheKey = `property-hierarchy-${homeId}`
      const cached = typeof window !== "undefined" ? localStorage.getItem(cacheKey) : null
      
      let hierarchyData: PropertyHierarchyNode | null = null
      
      if (cached) {
        try {
          const parsed = JSON.parse(cached)
          const cacheTime = new Date(parsed.timestamp)
          const now = new Date()
          const hoursSinceCache = (now.getTime() - cacheTime.getTime()) / (1000 * 60 * 60)
          
          if (hoursSinceCache < 24) {
            // Use cached data if less than 24 hours old
            hierarchyData = parsed.data
            setLastSync(cacheTime)
          }
        } catch (e) {
          console.error("Error reading cached hierarchy:", e)
        }
      }
      
      // If no cache or stale, load fresh
      if (!hierarchyData) {
        hierarchyData = getPropertyHierarchy(homeId)
        if (hierarchyData && typeof window !== "undefined") {
          localStorage.setItem(cacheKey, JSON.stringify({
            data: hierarchyData,
            timestamp: new Date().toISOString()
          }))
          setLastSync(new Date())
        }
      }
      
      setHierarchy(hierarchyData)
      
      // Load issues
      const issuesData = getIssuesForProperty(homeId)
      setIssues(issuesData)
      
      // Set initial breadcrumbs
      if (hierarchyData) {
        setBreadcrumbs([{ label: homeCode }])
      }
      
      setIsLoading(false)
    }
    
    loadData()
    
    // Set up online/offline listeners
    setIsOnline(navigator.onLine)
    const handleOnline = () => {
      setIsOnline(true)
      // Try to sync queued issues
      syncQueuedIssues()
    }
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [homeId])

  // Sync queued issues when coming back online
  const syncQueuedIssues = useCallback(async () => {
    if (typeof window === "undefined") return
    
    const queueKey = `property-issue-queue-${homeId}`
    const queue = localStorage.getItem(queueKey)
    if (!queue) return
    
    try {
      const queuedIssues = JSON.parse(queue)
      // In production, submit to API
      // For now, just move to issues
      queuedIssues.forEach((queued: any) => {
        const issue: PropertyIssue = {
          id: `issue-${Date.now()}-${Math.random()}`,
          itemId: queued.itemId,
          reporterName: "Staff Member", // In production, get from auth
          reportedDate: new Date(queued.timestamp),
          description: queued.description,
          status: "open",
          priority: queued.priority,
          type: queued.type,
          photos: queued.photos
        }
        
        const issuesKey = `property-issues-${homeId}`
        const existing = JSON.parse(localStorage.getItem(issuesKey) || "[]")
        localStorage.setItem(issuesKey, JSON.stringify([...existing, issue]))
      })
      
      localStorage.removeItem(queueKey)
      toast.success(`${queuedIssues.length} queued issue(s) submitted`)
      
      // Reload issues
      const issuesData = getIssuesForProperty(homeId)
      setIssues(issuesData)
    } catch (e) {
      console.error("Error syncing queued issues:", e)
    }
  }, [homeId])

  // Compute current level items
  const currentLevelItems = useMemo(() => {
    if (!hierarchy) return []
    
    let current = hierarchy
    for (const nodeId of currentPath) {
      const found = current.children?.find(child => child.id === nodeId)
      if (!found) return []
      current = found
    }
    
    return current.children || []
  }, [hierarchy, currentPath])

  // Get highest priority issue for a node
  const getHighestPriority = useCallback((nodeId: string, issuesMap: Record<string, PropertyIssue[]>): PropertyIssuePriority => {
    const nodeIssues = issuesMap[nodeId] || []
    if (nodeIssues.length === 0) return "medium"
    
    const priorities: PropertyIssuePriority[] = nodeIssues.map(i => i.priority)
    if (priorities.includes("high")) return "high"
    if (priorities.includes("medium")) return "medium"
    return "low"
  }, [])

  // Apply issue counts to hierarchy
  const hierarchyWithIssues = useMemo(() => {
    if (!hierarchy) return null
    return bubbleUpIssueCounts(hierarchy, issues)
  }, [hierarchy, issues])

  // Get current level items with issue counts
  const itemsWithCounts = useMemo(() => {
    if (!hierarchyWithIssues) return []
    
    let current = hierarchyWithIssues
    for (const nodeId of currentPath) {
      const found = current.children?.find(child => child.id === nodeId)
      if (!found) return []
      current = found
    }
    
    return (current.children || []).map(child => ({
      item: child,
      issueCount: child.issueCount || 0,
      issuePriority: getHighestPriority(child.id, issues)
    }))
  }, [hierarchyWithIssues, currentPath, issues, getHighestPriority])

  // Update breadcrumbs helper
  const updateBreadcrumbs = useCallback((path: string[]) => {
    if (!hierarchy) return
    
    const breadcrumbList: Array<{ label: string; href?: string }> = [
      { label: homeCode, href: undefined }
    ]
    
    let current = hierarchy
    for (const nodeId of path) {
      const found = current.children?.find(child => child.id === nodeId)
      if (found) {
        breadcrumbList.push({ label: found.label })
        current = found
      } else {
        break
      }
    }
    
    setBreadcrumbs(breadcrumbList)
  }, [hierarchy, homeCode])

  // Navigation functions
  const navigateTo = useCallback((nodeId: string) => {
    if (!hierarchy) return
    
    // Find node and build path from root
    const findNodePath = (node: PropertyHierarchyNode, targetId: string, currentPath: string[] = []): string[] | null => {
      if (node.id === targetId) return currentPath
      if (node.children) {
        for (const child of node.children) {
          const found = findNodePath(child, targetId, [...currentPath, child.id])
          if (found) return found
        }
      }
      return null
    }
    
    const newPath = findNodePath(hierarchy, nodeId)
    
    if (newPath) {
      setCurrentPath(newPath)
      updateBreadcrumbs(newPath)
    }
  }, [hierarchy, updateBreadcrumbs])

  const navigateBack = useCallback(() => {
    if (currentPath.length > 0) {
      const newPath = currentPath.slice(0, -1)
      setCurrentPath(newPath)
      updateBreadcrumbs(newPath)
    }
  }, [currentPath, updateBreadcrumbs])

  const navigateToBreadcrumb = useCallback((index: number) => {
    const newPath = currentPath.slice(0, index + 1)
    setCurrentPath(newPath)
    updateBreadcrumbs(newPath)
  }, [currentPath, updateBreadcrumbs])

  // Handle item interactions
  const handleItemNavigate = useCallback((item: PropertyHierarchyNode) => {
    if (item.children && item.children.length > 0) {
      navigateTo(item.id)
    } else {
      // Terminal item - open details
      handleItemInfoClick(item)
    }
  }, [navigateTo])

  const handleItemInfoClick = useCallback((item: PropertyHierarchyNode) => {
    setSelectedItem(item)
    setOpenSheet("details")
  }, [])

  const handleReportIssue = useCallback(() => {
    setOpenSheet("issue-report")
  }, [])

  const handleIssueSubmit = useCallback((issueData: {
    itemId?: string
    type: PropertyIssueType
    description: string
    priority: PropertyIssuePriority
    photos: Photo[]
  }) => {
    if (!issueData.itemId) {
      console.error("Item ID is required for property issues")
      return
    }

    const issue: PropertyIssue = {
      id: `issue-${Date.now()}-${Math.random()}`,
      itemId: issueData.itemId,
      reporterName: "Staff Member", // In production, get from auth
      reportedDate: new Date(),
      description: issueData.description,
      status: "open",
      priority: issueData.priority,
      type: issueData.type,
      photos: issueData.photos.map(p => ({
        id: p.id,
        url: p.preview, // In production, upload to server
        fileName: p.file.name
      }))
    }

    // Save to localStorage
    const issuesKey = `property-issues-${homeId}`
    const existing = typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem(issuesKey) || "[]")
      : []
    
    if (typeof window !== "undefined") {
      localStorage.setItem(issuesKey, JSON.stringify([...existing, issue]))
    }

    // Update state
    const updatedIssues = getIssuesForProperty(homeId)
    setIssues(updatedIssues)

    setOpenSheet(null)
    setSelectedItem(null)
  }, [homeId])

  const handleSearchNavigate = useCallback((nodeId: string, path: string[]) => {
    // Navigate to the node
    navigateTo(nodeId)
  }, [navigateTo])

  const handleSearchOpenDetails = useCallback((item: PropertyHierarchyNode, path: string[]) => {
    setSelectedItem(item)
    setOpenSheet("details")
  }, [])

  const handleRefresh = useCallback(() => {
    if (typeof window === "undefined") return
    
    // Clear cache and reload
    const cacheKey = `property-hierarchy-${homeId}`
    localStorage.removeItem(cacheKey)
    
    const hierarchyData = getPropertyHierarchy(homeId)
    setHierarchy(hierarchyData)
    
    if (hierarchyData && typeof window !== "undefined") {
      localStorage.setItem(cacheKey, JSON.stringify({
        data: hierarchyData,
        timestamp: new Date().toISOString()
      }))
      setLastSync(new Date())
    }
    
    toast.success("Data refreshed")
  }, [homeId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading property data...</p>
        </div>
      </div>
    )
  }

  if (!hierarchy) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No property data available</p>
      </div>
    )
  }

  const selectedItemIssue = selectedItem ? (issues[selectedItem.id] || []).find(i => i.status !== "resolved") : undefined

  return (
    <div className="space-y-4">
        {/* Search */}
      <PropertySearch
        propertyId={homeId}
        propertyName={homeCode}
        hierarchy={hierarchyWithIssues || hierarchy}
        issues={issues}
        onNavigate={handleSearchNavigate}
        onOpenDetails={handleSearchOpenDetails}
      />
      {/* Header with breadcrumbs and actions */}
      <div className="flex flex-col items-start gap-1">
        <div className="flex flex-row gap-1">
          
          <Breadcrumbs items={breadcrumbs} />
        </div>
       
        
        
      </div>

      <div className="flex flex-row items-center justify-between gap-2">
        {currentPath.length > 0 && (
            <Button
              variant="secondary"
              size="icon"
              onClick={navigateBack}
              className="mb-0"
              aria-label="Go back"
            >
              <ArrowLeft className="h-8 w-8" />
            </Button>
          )}
          <div className="flex items-center gap-2">
          {!isOnline && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground" title="Offline">
              <WifiOff className="h-4 w-4" />
            </div>
          )}
          {lastSync && (
            <div className="text-xs text-muted-foreground">
              Synced {lastSync.toLocaleTimeString()}
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            aria-label="Refresh data"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
            </div>

      {/* Items List */}
      <div className="space-y-1">
        {itemsWithCounts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No items at this level
          </div>
        ) : (
          itemsWithCounts.map(({ item, issueCount, issuePriority }) => (
            <HierarchicalListItem
              key={item.id}
              item={item}
              onNavigate={() => handleItemNavigate(item)}
              onInfoClick={() => handleItemInfoClick(item)}
              issueCount={issueCount}
              issuePriority={issuePriority}
              hasDetails={!!(item.instructions || item.photos || item.details)}
            />
          ))
        )}
      </div>

      {/* Sheets */}
      {selectedItem && openSheet === "details" && (
        <ItemDetailsSheet
          item={selectedItem}
          breadcrumbs={breadcrumbs}
          issue={selectedItemIssue}
          onClose={() => {
            setOpenSheet(null)
            setSelectedItem(null)
          }}
          onReportIssue={handleReportIssue}
        />
      )}

      {selectedItem && openSheet === "issue-report" && (
        <PropertyIssueReportSheet
          item={selectedItem}
          breadcrumbs={breadcrumbs}
          homeId={homeId}
          homeCode={homeCode}
          homeName={homeName}
          onClose={() => {
            setOpenSheet("details")
          }}
          onSubmit={handleIssueSubmit}
        />
      )}
    </div>
  )
}

