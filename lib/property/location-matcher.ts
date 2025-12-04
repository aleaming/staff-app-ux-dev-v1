/**
 * Location Matching Utility
 * 
 * Matches task location strings to PropertyHierarchyNode items
 * Handles various location formats and fuzzy matching
 */

import type { PropertyHierarchyNode } from "@/lib/test-data"

interface MatchResult {
  node: PropertyHierarchyNode
  breadcrumbs: Array<{ label: string; href?: string }>
}

/**
 * Normalize location string for matching
 */
function normalizeLocation(location: string): string {
  return location
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ") // Normalize whitespace
    .replace(/[^\w\s-]/g, "") // Remove special chars except hyphens
}

/**
 * Check if a label matches a location string (fuzzy matching)
 */
function labelMatchesLocation(label: string, location: string): boolean {
  const normalizedLabel = normalizeLocation(label)
  const normalizedLocation = normalizeLocation(location)
  
  // Exact match
  if (normalizedLabel === normalizedLocation) {
    return true
  }
  
  // Label contains location (e.g., "Left Bedside Table" matches "bedside table")
  if (normalizedLabel.includes(normalizedLocation)) {
    return true
  }
  
  // Location contains label (e.g., "Master Bedroom - left bedside table" matches "Left Bedside Table")
  if (normalizedLocation.includes(normalizedLabel)) {
    return true
  }
  
  // Handle context format: "Master Bedroom - left bedside table"
  // Extract the item part after the dash
  if (normalizedLocation.includes(" - ")) {
    const parts = normalizedLocation.split(" - ")
    const itemPart = parts[parts.length - 1]
    if (normalizedLabel.includes(itemPart) || itemPart.includes(normalizedLabel)) {
      return true
    }
  }
  
  return false
}

/**
 * Recursively find a node by label
 */
function findNodeByLabel(
  node: PropertyHierarchyNode,
  location: string,
  currentPath: string[] = []
): PropertyHierarchyNode | null {
  // Check if current node matches
  if (labelMatchesLocation(node.label, location)) {
    return node
  }
  
  // Check children
  if (node.children) {
    for (const child of node.children) {
      const found = findNodeByLabel(child, location, [...currentPath, node.label])
      if (found) {
        return found
      }
    }
  }
  
  return null
}

/**
 * Build breadcrumbs path to a node
 */
function buildBreadcrumbs(
  hierarchy: PropertyHierarchyNode,
  targetNode: PropertyHierarchyNode,
  currentPath: PropertyHierarchyNode[] = []
): PropertyHierarchyNode[] | null {
  const path = [...currentPath, hierarchy]
  
  if (hierarchy.id === targetNode.id) {
    return path
  }
  
  if (hierarchy.children) {
    for (const child of hierarchy.children) {
      const result = buildBreadcrumbs(child, targetNode, path)
      if (result) {
        return result
      }
    }
  }
  
  return null
}

/**
 * Find PropertyHierarchyNode by location string
 * 
 * Handles various formats:
 * - Simple: "Kitchen", "Dishwasher"
 * - With context: "Master Bedroom - left bedside table"
 * - With path: "Kitchen > Dishwasher" (future enhancement)
 */
export function findNodeByLocation(
  hierarchy: PropertyHierarchyNode,
  location: string
): MatchResult | null {
  if (!location || !location.trim()) {
    return null
  }
  
  // Handle path format: "Kitchen > Dishwasher"
  if (location.includes(">")) {
    const parts = location.split(">").map(p => p.trim())
    let current: PropertyHierarchyNode | null = hierarchy
    
    for (const part of parts) {
      if (!current || !current.children) {
        return null
      }
      
      const found: PropertyHierarchyNode | undefined = current.children.find(child => 
        labelMatchesLocation(child.label, part)
      )
      
      if (!found) {
        return null
      }
      
      current = found
    }
    
    if (current) {
      const breadcrumbPath = buildBreadcrumbs(hierarchy, current)
      const breadcrumbs = breadcrumbPath
        ? breadcrumbPath.map(node => ({ label: node.label }))
        : [{ label: current.label }]
      
      return { node: current, breadcrumbs }
    }
    
    return null
  }
  
  // Simple or context format: "Kitchen" or "Master Bedroom - left bedside table"
  const foundNode = findNodeByLabel(hierarchy, location)
  
  if (!foundNode) {
    return null
  }
  
  const breadcrumbPath = buildBreadcrumbs(hierarchy, foundNode)
  const breadcrumbs = breadcrumbPath
    ? breadcrumbPath.map(node => ({ label: node.label }))
    : [{ label: foundNode.label }]
  
  return { node: foundNode, breadcrumbs }
}

/**
 * Find all nodes that match a location (for cases with multiple matches)
 */
export function findAllNodesByLocation(
  hierarchy: PropertyHierarchyNode,
  location: string
): MatchResult[] {
  const results: MatchResult[] = []
  
  if (!location || !location.trim()) {
    return results
  }
  
  function collectMatches(node: PropertyHierarchyNode, currentPath: PropertyHierarchyNode[] = []) {
    if (labelMatchesLocation(node.label, location)) {
      const breadcrumbs = [...currentPath, node].map(n => ({ label: n.label }))
      results.push({ node, breadcrumbs })
    }
    
    if (node.children) {
      for (const child of node.children) {
        collectMatches(child, [...currentPath, node])
      }
    }
  }
  
  collectMatches(hierarchy)
  
  // Sort by specificity (longest path first)
  return results.sort((a, b) => b.breadcrumbs.length - a.breadcrumbs.length)
}

