import { createSlice } from '@reduxjs/toolkit'

const savedSlice = createSlice({
  name: 'saved',
  initialState: {
    savedIds: [],
  },
  reducers: {
    replaceSavedState(state, action) {
      state.savedIds = Array.isArray(action.payload?.savedIds) ? action.payload.savedIds : []
    },
    toggleSaved(state, action) {
      const stayId = action.payload
      const exists = state.savedIds.includes(stayId)

      state.savedIds = exists
        ? state.savedIds.filter((id) => id !== stayId)
        : [...state.savedIds, stayId]
    },
  },
})

export const { replaceSavedState, toggleSaved } = savedSlice.actions

export default savedSlice.reducer
