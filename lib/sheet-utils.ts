/**
 * Utility for managing sheet state across the app.
 * Dispatches a custom event that sheets can listen to for closing.
 */

export const CLOSE_ALL_SHEETS_EVENT = 'closeAllSheets'

/**
 * Dispatch an event to close all open sheets.
 * Call this before navigation to ensure clean transitions.
 */
export function closeAllSheets() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CLOSE_ALL_SHEETS_EVENT))
  }
}

/**
 * Hook to listen for close-all-sheets events.
 * Returns a callback ref that sheets should call when they need to close.
 */
export function useCloseOnNavigation(setOpen: (open: boolean) => void) {
  if (typeof window !== 'undefined') {
    const handleClose = () => setOpen(false)
    
    return {
      subscribe: () => {
        window.addEventListener(CLOSE_ALL_SHEETS_EVENT, handleClose)
        return () => window.removeEventListener(CLOSE_ALL_SHEETS_EVENT, handleClose)
      }
    }
  }
  return { subscribe: () => () => {} }
}

