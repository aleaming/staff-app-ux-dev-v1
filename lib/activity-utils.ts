/**
 * Utility functions for managing activities
 */

import { testHomes } from "./test-data"
import { getActivityTemplate, type ActivityType } from "./activity-templates"
import type { Activity } from "./test-data"

export interface ActiveActivityInfo {
  homeId: string
  homeCode: string
  homeName?: string
  activityType: ActivityType
  storageKey: string
  completedTasks: number
  totalTasks: number
}

/**
 * Check if there's an active activity in localStorage
 */
export function getActiveActivity(): ActiveActivityInfo | null {
  if (typeof window === "undefined") return null

  const keys = Object.keys(localStorage)
  const activityKeys = keys.filter(key => 
    key.startsWith("activity-tracker-draft-") || key.startsWith("activity-draft-")
  )

  if (activityKeys.length === 0) return null

  // Get the most recent activity
  const mostRecentKey = activityKeys[activityKeys.length - 1]
  const activityData = localStorage.getItem(mostRecentKey)

  if (!activityData) return null

  try {
    const taskStates = JSON.parse(activityData)

    // Extract homeId and activityType from key
    const keyWithoutPrefix = mostRecentKey.replace("activity-tracker-draft-", "").replace("activity-draft-", "")
    const parts = keyWithoutPrefix.split("-")
    const activityType = parts[parts.length - 1] as ActivityType
    const homeId = parts.slice(0, -1).join("-")

    const template = getActivityTemplate(activityType)
    const home = testHomes.find(h => h.id === homeId)

    if (home && template) {
      const completedTasks = Object.values(taskStates).filter(
        (t: any) => t.completed
      ).length

      return {
        homeId,
        homeCode: home.code,
        homeName: home.name,
        activityType,
        storageKey: mostRecentKey,
        completedTasks,
        totalTasks: template.tasks.length
      }
    }
  } catch (error) {
    console.error("Error parsing activity data:", error)
  }

  return null
}

/**
 * Clear the active activity (used when switching to a new one)
 */
export function clearActiveActivity(storageKey: string): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(storageKey)
  }
}

/**
 * Save an incomplete activity
 */
export function saveIncompleteActivity(activity: Activity): void {
  if (typeof window === "undefined") return

  const incompleteActivities = getIncompleteActivities()

  // Check if activity already exists (by homeCode and type)
  const existingIndex = incompleteActivities.findIndex(
    a => a.homeCode === activity.homeCode && a.type === activity.type
  )

  if (existingIndex >= 0) {
    // Update existing incomplete activity
    incompleteActivities[existingIndex] = activity
  } else {
    // Add new incomplete activity
    incompleteActivities.push(activity)
  }

  localStorage.setItem("incomplete-activities", JSON.stringify(incompleteActivities))
}

/**
 * Get all incomplete activities
 */
export function getIncompleteActivities(): Activity[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem("incomplete-activities")
  if (!stored) return []

  try {
    const activities = JSON.parse(stored)
    // Convert date strings back to Date objects and ensure status is "paused"
    return activities.map((activity: any) => ({
      ...activity,
      scheduledTime: new Date(activity.scheduledTime),
      status: "paused" as const
    }))
  } catch (error) {
    console.error("Error parsing incomplete activities:", error)
    return []
  }
}

/**
 * Remove an incomplete activity
 */
export function removeIncompleteActivity(activityId: string): void {
  if (typeof window === "undefined") return

  const incompleteActivities = getIncompleteActivities()
  const filtered = incompleteActivities.filter(a => a.id !== activityId)

  localStorage.setItem("incomplete-activities", JSON.stringify(filtered))
}

