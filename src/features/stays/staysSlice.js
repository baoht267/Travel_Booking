import { createSelector, createSlice } from '@reduxjs/toolkit'
import mockStays from '../../data/mockStays'
import { matchesDestinationQuery } from '../../utils/locationSearch'

function formatDate(offsetDays) {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)
  return date.toISOString().slice(0, 10)
}

const initialState = {
  list: mockStays,
  criteria: {
    destination: '',
    checkIn: formatDate(6),
    checkOut: formatDate(9),
    guests: 2,
    rooms: 1,
  },
  filters: {
    maxPrice: 150,
    minReviewScore: 0,
    propertyTypes: [],
    onlyFreeCancellation: false,
    onlyBreakfastIncluded: false,
  },
  recentSearches: [],
}

const staysSlice = createSlice({
  name: 'stays',
  initialState,
  reducers: {
    replacePersistedStaysState(state, action) {
      state.filters = {
        ...initialState.filters,
        ...action.payload?.filters,
      }
      state.recentSearches = Array.isArray(action.payload?.recentSearches)
        ? action.payload.recentSearches
        : []
      state.criteria = { ...initialState.criteria }
    },
    updateCriteria(state, action) {
      state.criteria = { ...state.criteria, ...action.payload }
    },
    resetCriteria(state) {
      state.criteria = { ...initialState.criteria }
    },
    addRecentSearch(state, action) {
      const criteria = action.payload
      const key = [
        criteria.destination,
        criteria.checkIn,
        criteria.checkOut,
        criteria.guests,
        criteria.rooms,
      ].join('|')

      state.recentSearches = [
        { key, ...criteria },
        ...state.recentSearches.filter((item) => item.key !== key),
      ].slice(0, 4)
    },
    updateFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload }
    },
    togglePropertyType(state, action) {
      const propertyType = action.payload
      const exists = state.filters.propertyTypes.includes(propertyType)

      state.filters.propertyTypes = exists
        ? state.filters.propertyTypes.filter((item) => item !== propertyType)
        : [...state.filters.propertyTypes, propertyType]
    },
    resetFilters(state) {
      state.filters = { ...initialState.filters }
    },
  },
})

export const {
  addRecentSearch,
  replacePersistedStaysState,
  resetCriteria,
  resetFilters,
  togglePropertyType,
  updateCriteria,
  updateFilters,
} = staysSlice.actions

const selectStaysState = (state) => state.stays

export const selectCriteria = createSelector(
  [selectStaysState],
  (staysState) => staysState.criteria,
)

export const selectFilters = createSelector(
  [selectStaysState],
  (staysState) => staysState.filters,
)

export const selectRecentSearches = createSelector(
  [selectStaysState],
  (staysState) => staysState.recentSearches,
)

export const selectAllStays = createSelector(
  [selectStaysState],
  (staysState) => staysState.list,
)

export const selectFilteredStays = createSelector(
  [selectAllStays, selectCriteria, selectFilters],
  (stays, criteria, filters) =>
    stays.filter((stay) => {
      const matchesDestination = matchesDestinationQuery(stay, criteria.destination)

      const matchesPrice = stay.pricePerNight <= filters.maxPrice
      const matchesReview = stay.reviewScore >= filters.minReviewScore
      const matchesType =
        filters.propertyTypes.length === 0 ||
        filters.propertyTypes.includes(stay.propertyType)
      const matchesCancellation =
        !filters.onlyFreeCancellation ||
        stay.perks.includes('Free cancellation')
      const matchesBreakfast =
        !filters.onlyBreakfastIncluded ||
        stay.perks.some((perk) => perk.toLowerCase().includes('breakfast'))

      return (
        matchesDestination &&
        matchesPrice &&
        matchesReview &&
        matchesType &&
        matchesCancellation &&
        matchesBreakfast
      )
    }),
)

export default staysSlice.reducer
