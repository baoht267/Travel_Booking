import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

async function requestJson(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || 'API request failed')
  }

  return data
}

export const fetchDestinations = createAsyncThunk(
  'destinations/fetchDestinations',
  () => requestJson('/destinations'),
)

export const fetchDestinationById = createAsyncThunk(
  'destinations/fetchDestinationById',
  (id) => requestJson(`/destinations/${id}`),
)

export const addDestination = createAsyncThunk(
  'destinations/addDestination',
  (destination) =>
    requestJson('/destinations', {
      method: 'POST',
      body: JSON.stringify(destination),
    }),
)

export const updateDestination = createAsyncThunk(
  'destinations/updateDestination',
  ({ id, destination }) =>
    requestJson(`/destinations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(destination),
    }),
)

export const deleteDestination = createAsyncThunk(
  'destinations/deleteDestination',
  async (id) => {
    await requestJson(`/destinations/${id}`, { method: 'DELETE' })
    return id
  },
)

const destinationsSlice = createSlice({
  name: 'destinations',
  initialState: {
    items: [],
    selected: null,
    status: 'idle',
    selectedStatus: 'idle',
    mutationStatus: 'idle',
    error: '',
  },
  reducers: {
    clearDestinationError(state) {
      state.error = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDestinations.pending, (state) => {
        state.status = 'loading'
        state.error = ''
      })
      .addCase(fetchDestinations.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchDestinations.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Could not load destinations'
      })
      .addCase(fetchDestinationById.pending, (state) => {
        state.selectedStatus = 'loading'
        state.error = ''
      })
      .addCase(fetchDestinationById.fulfilled, (state, action) => {
        state.selectedStatus = 'succeeded'
        state.selected = action.payload
        const exists = state.items.some((item) => item.id === action.payload.id)
        if (!exists) {
          state.items.push(action.payload)
        }
      })
      .addCase(fetchDestinationById.rejected, (state, action) => {
        state.selectedStatus = 'failed'
        state.selected = null
        state.error = action.error.message || 'Could not load destination'
      })
      .addCase(addDestination.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = ''
      })
      .addCase(addDestination.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        state.items.unshift(action.payload)
        state.selected = action.payload
      })
      .addCase(addDestination.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.error.message || 'Could not add destination'
      })
      .addCase(updateDestination.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = ''
      })
      .addCase(updateDestination.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        state.selected = action.payload
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        )
      })
      .addCase(updateDestination.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.error.message || 'Could not update destination'
      })
      .addCase(deleteDestination.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = ''
      })
      .addCase(deleteDestination.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        state.items = state.items.filter((item) => item.id !== action.payload)
        if (state.selected?.id === action.payload) {
          state.selected = null
        }
      })
      .addCase(deleteDestination.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.error.message || 'Could not delete destination'
      })
  },
})

export const { clearDestinationError } = destinationsSlice.actions

const selectDestinationsState = (state) => state.destinations

export const selectDestinations = createSelector(
  [selectDestinationsState],
  (destinationsState) => destinationsState.items,
)

export const selectSelectedDestination = createSelector(
  [selectDestinationsState],
  (destinationsState) => destinationsState.selected,
)

export const selectDestinationsStatus = createSelector(
  [selectDestinationsState],
  (destinationsState) => destinationsState.status,
)

export const selectSelectedDestinationStatus = createSelector(
  [selectDestinationsState],
  (destinationsState) => destinationsState.selectedStatus,
)

export const selectDestinationMutationStatus = createSelector(
  [selectDestinationsState],
  (destinationsState) => destinationsState.mutationStatus,
)

export const selectDestinationError = createSelector(
  [selectDestinationsState],
  (destinationsState) => destinationsState.error,
)

export default destinationsSlice.reducer
