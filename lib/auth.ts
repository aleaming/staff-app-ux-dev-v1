/**
 * Simple authentication utilities
 * In production, this would use a proper auth library (NextAuth, Clerk, etc.)
 */

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("isAuthenticated") === "true"
}

export function getUserEmail(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("userEmail")
}

export function logout(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("isAuthenticated")
  localStorage.removeItem("userEmail")
  window.location.href = "/login"
}

export function requireAuth(): boolean {
  if (typeof window === "undefined") return true // Server-side, allow
  if (!isAuthenticated()) {
    window.location.href = "/login"
    return false
  }
  return true
}

