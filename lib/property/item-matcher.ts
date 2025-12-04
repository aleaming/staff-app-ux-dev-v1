/**
 * Item Name Matching Utility
 * 
 * Matches task names to PropertyHierarchyNode items
 * Extracts item names from task descriptions and finds matching blueprint items
 */

import type { PropertyHierarchyNode } from "@/lib/test-data"

export interface MatchResult {
  node: PropertyHierarchyNode
  breadcrumbs: Array<{ label: string; href?: string }>
}

/**
 * Normalize string for matching
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ") // Normalize whitespace
    .replace(/[^\w\s-]/g, "") // Remove special chars except hyphens
}

/**
 * Extract potential item names from task name
 * Examples:
 * - "Check oven" -> ["oven"]
 * - "Test dishwasher" -> ["dishwasher"]
 * - "Verify coffee machine" -> ["coffee machine", "coffee", "machine"]
 * - "Empty washing machine" -> ["washing machine", "washing", "machine"]
 */
function extractItemNames(taskName: string): string[] {
  const normalized = normalizeString(taskName)
  const itemNames: string[] = []
  
  // Common action verbs to remove
  const actionVerbs = [
    "check", "test", "verify", "empty", "clean", "inspect",
    "examine", "review", "assess", "evaluate", "monitor",
    "connect", "disconnect", "turn on", "turn off", "start",
    "stop", "restart", "reset", "clear", "remove", "add",
    "replace", "fix", "repair", "maintain", "service"
  ]
  
  // Remove action verbs from the beginning
  let cleaned = normalized
  for (const verb of actionVerbs) {
    if (cleaned.startsWith(verb + " ")) {
      cleaned = cleaned.substring(verb.length + 1).trim()
      break
    }
  }
  
  // If nothing left after removing verb, try the original
  if (!cleaned) {
    cleaned = normalized
  }
  
  // Add the full cleaned string
  itemNames.push(cleaned)
  
  // Add individual words (for multi-word items like "coffee machine")
  const words = cleaned.split(/\s+/).filter(w => w.length > 2) // Filter out short words
  if (words.length > 1) {
    // Add the last two words together (e.g., "coffee machine")
    itemNames.push(words.slice(-2).join(" "))
    // Add the last word (e.g., "machine")
    itemNames.push(words[words.length - 1])
  }
  
  return itemNames
}

/**
 * Check if a node label matches an item name
 */
function labelMatchesItemName(label: string, itemName: string): boolean {
  const normalizedLabel = normalizeString(label)
  const normalizedItemName = normalizeString(itemName)
  
  // Exact match
  if (normalizedLabel === normalizedItemName) {
    return true
  }
  
  // Label contains item name (e.g., "Oven" matches "oven", "Coffee Machine" matches "coffee machine")
  if (normalizedLabel.includes(normalizedItemName)) {
    return true
  }
  
  // Item name contains label (e.g., "oven" matches "Oven")
  if (normalizedItemName.includes(normalizedLabel)) {
    return true
  }
  
  // Handle multi-word matches (e.g., "washing machine" matches "Washing Machine")
  const labelWords = normalizedLabel.split(/\s+/)
  const itemWords = normalizedItemName.split(/\s+/)
  
  // Check if all item words are in label
  if (itemWords.every(word => labelWords.some(lw => lw.includes(word) || word.includes(lw)))) {
    return true
  }
  
  return false
}

/**
 * Recursively find all matching nodes, preferring items over rooms/floors
 */
function findAllMatchingNodes(
  node: PropertyHierarchyNode,
  itemNames: string[],
  currentPath: PropertyHierarchyNode[] = []
): Array<{ node: PropertyHierarchyNode; breadcrumbs: PropertyHierarchyNode[] }> {
  const matches: Array<{ node: PropertyHierarchyNode; breadcrumbs: PropertyHierarchyNode[] }> = []
  
  // Check if current node matches any item name
  for (const itemName of itemNames) {
    if (labelMatchesItemName(node.label, itemName)) {
      matches.push({
        node,
        breadcrumbs: [...currentPath, node]
      })
      break // Only add once per node
    }
  }
  
  // Recursively check children
  if (node.children) {
    for (const child of node.children) {
      const childMatches = findAllMatchingNodes(child, itemNames, [...currentPath, node])
      matches.push(...childMatches)
    }
  }
  
  return matches
}

/**
 * Find PropertyHierarchyNode by task name
 * 
 * Extracts item names from task name and finds matching blueprint items.
 * Prefers items (type: "item") over rooms/floors when multiple matches exist.
 * 
 * @param hierarchy - The property hierarchy to search
 * @param taskName - The task name (e.g., "Check oven", "Test dishwasher")
 * @returns MatchResult with the node and breadcrumbs, or null if no match
 */
export function findNodeByItemName(
  hierarchy: PropertyHierarchyNode,
  taskName: string
): MatchResult | null {
  if (!taskName || !taskName.trim()) {
    return null
  }
  
  // Extract potential item names from task name
  const itemNames = extractItemNames(taskName)
  
  if (itemNames.length === 0) {
    return null
  }
  
  // Find all matching nodes
  const allMatches = findAllMatchingNodes(hierarchy, itemNames)
  
  if (allMatches.length === 0) {
    return null
  }
  
  // Prefer items over rooms/floors
  const itemMatches = allMatches.filter(m => m.node.type === "item")
  const preferredMatches = itemMatches.length > 0 ? itemMatches : allMatches
  
  // If multiple matches, prefer the most specific (longest breadcrumb path)
  preferredMatches.sort((a, b) => {
    // First, prefer items over other types
    if (a.node.type === "item" && b.node.type !== "item") return -1
    if (a.node.type !== "item" && b.node.type === "item") return 1
    
    // Then, prefer longer paths (more specific)
    return b.breadcrumbs.length - a.breadcrumbs.length
  })
  
  // Return the best match
  const bestMatch = preferredMatches[0]
  
  return {
    node: bestMatch.node,
    breadcrumbs: bestMatch.breadcrumbs.map(n => ({ label: n.label }))
  }
}

