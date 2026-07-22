import { configureStore } from '@reduxjs/toolkit'
import bookingsReducer, { replaceBookingsState } from '../features/bookings/bookingsSlice'
import roomsReducer from '../features/rooms/roomsSlice'
import savedReducer, { replaceSavedState } from '../features/saved/savedSlice'
import staysReducer, { replacePersistedStaysState } from '../features/stays/staysSlice'
import { readSession, SESSION_EVENT_NAME } from '../utils/authSession'

const STORAGE_KEY = 'travel-booking-state'
const defaultSavedState = savedReducer(undefined, { type: '@@INIT' })
const defaultStaysState = staysReducer(undefined, { type: '@@INIT' })
const defaultBookingsState = bookingsReducer(undefined, { type: '@@INIT' })

function getCurrentStorageKey() {
  const session = readSession()
  const userKey = session?.email?.trim().toLowerCase() || 'guest'
  return `${STORAGE_KEY}:${userKey}`
}

function readPersistedState() {
  try {
    const rawState = localStorage.getItem(getCurrentStorageKey())
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
        criteria: defaultStaysState.criteria,
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
        filters: state.stays.filters,
        recentSearches: state.stays.recentSearches,
      },
      bookings: state.bookings,
    }

    localStorage.setItem(getCurrentStorageKey(), JSON.stringify(serializableState))
  } catch {
    return
  }
}

function hydrateScopedState() {
  const scopedState = readPersistedState()

  store.dispatch(replaceSavedState(scopedState?.saved ?? defaultSavedState))
  store.dispatch(replacePersistedStaysState(scopedState?.stays ?? defaultStaysState))
  store.dispatch(replaceBookingsState(scopedState?.bookings ?? defaultBookingsState))
}

export const store = configureStore({
  reducer: {
    stays: staysReducer,
    rooms: roomsReducer,
    saved: savedReducer,
    bookings: bookingsReducer,
  },
  preloadedState: readPersistedState(),
})

store.subscribe(() => {
  persistState(store.getState())
})

window.addEventListener(SESSION_EVENT_NAME, hydrateScopedState)
