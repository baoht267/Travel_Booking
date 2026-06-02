import { configureStore } from '@reduxjs/toolkit'
import bookingsReducer from '../features/bookings/bookingsSlice'
import savedReducer from '../features/saved/savedSlice'
import staysReducer from '../features/stays/staysSlice'

const STORAGE_KEY = 'travel-booking-state'
const defaultSavedState = savedReducer(undefined, { type: '@@INIT' })
const defaultStaysState = staysReducer(undefined, { type: '@@INIT' })
const defaultBookingsState = bookingsReducer(undefined, { type: '@@INIT' })

function loadPersistedState() {
  try {
    const rawState = localStorage.getItem(STORAGE_KEY)
    if (!rawState) {
      return undefined
    }

    const parsedState = JSON.parse(rawState)

    return {
      saved: {
        ...defaultSavedState,
        ...parsedState.saved,
        savedIds: parsedState.saved?.savedIds ?? defaultSavedState.savedIds,
      },
      stays: {
        ...defaultStaysState,
        ...parsedState.stays,
        criteria: {
          ...defaultStaysState.criteria,
          ...parsedState.stays?.criteria,
        },
        filters: {
          ...defaultStaysState.filters,
          ...parsedState.stays?.filters,
        },
        recentSearches: Array.isArray(parsedState.stays?.recentSearches)
          ? parsedState.stays.recentSearches
          : defaultStaysState.recentSearches,
      },
      bookings: {
        ...defaultBookingsState,
        bookings: Array.isArray(parsedState.bookings?.bookings)
          ? parsedState.bookings.bookings
          : defaultBookingsState.bookings,
      },
    }
  } catch {
    return undefined
  }
}

function persistState(state) {
  try {
    const serializableState = {
      saved: state.saved,
      stays: {
        criteria: state.stays.criteria,
        filters: state.stays.filters,
        recentSearches: state.stays.recentSearches,
      },
      bookings: state.bookings,
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializableState))
  } catch {
    return
  }
}

export const store = configureStore({
  reducer: {
    stays: staysReducer,
    saved: savedReducer,
    bookings: bookingsReducer,
  },
  preloadedState: loadPersistedState(),
})

store.subscribe(() => {
  persistState(store.getState())
})
