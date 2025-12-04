/**
 * Data Loaders Index
 * 
 * Re-exports all data loading functions from the individual loader modules.
 */

// Data Provider (React Context)
export { DataProvider, useData, useHomes, useBookings, useActivities } from './DataProvider'

// Homes
export {
  loadHomesSync,
  loadHomesAsync,
  getHomes,
  refreshHomes,
  getHomeByCode,
  getHomeById,
} from './homes-loader'

// Bookings
export {
  loadBookings,
  getBookings,
  refreshBookings,
  getBookingByRef,
  getBookingById,
  getBookingsForHome,
  getCurrentBookings,
  getUpcomingBookings,
} from './bookings-loader'

// Activities
export {
  loadActivities,
  getActivities,
  refreshActivities,
  getActivityById,
  getActivitiesForHome,
  getActivitiesForBooking,
  getActivitiesByStatus,
  getTodaysActivities,
  getIncompleteActivities,
} from './activities-loader'

