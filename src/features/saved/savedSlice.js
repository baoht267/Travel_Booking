import { createSlice } from '@reduxjs/toolkit'

const savedSlice = createSlice({
  name: 'saved',
  initialState: {
    savedIds: [],
  },
  reducers: {
    toggleSaved(state, action) {
      const stayId = action.payload
      const exists = state.savedIds.includes(stayId)

      state.savedIds = exists
        ? state.savedIds.filter((id) => id !== stayId)
        : [...state.savedIds, stayId]
    },
  },
})

export const { toggleSaved } = savedSlice.actions

export default savedSlice.reducer
