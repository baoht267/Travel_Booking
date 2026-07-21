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

export const fetchSouvenirs = createAsyncThunk(
  'souvenirs/fetchSouvenirs',
  () => requestJson('/souvenirs'),
)

export const fetchSouvenirById = createAsyncThunk(
  'souvenirs/fetchSouvenirById',
  (id) => requestJson(`/souvenirs/${id}`),
)

export const addSouvenir = createAsyncThunk(
  'souvenirs/addSouvenir',
  (souvenir) =>
    requestJson('/souvenirs', {
      method: 'POST',
      body: JSON.stringify(souvenir),
    }),
)

export const updateSouvenir = createAsyncThunk(
  'souvenirs/updateSouvenir',
  ({ id, souvenir }) =>
    requestJson(`/souvenirs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(souvenir),
    }),
)

export const deleteSouvenir = createAsyncThunk(
  'souvenirs/deleteSouvenir',
  async (id) => {
    await requestJson(`/souvenirs/${id}`, { method: 'DELETE' })
    return id
  },
)

const souvenirsSlice = createSlice({
  name: 'souvenirs',
  initialState: {
    items: [],
    selected: null,
    status: 'idle',
    selectedStatus: 'idle',
    mutationStatus: 'idle',
    error: '',
  },
  reducers: {
    clearSouvenirError(state) {
      state.error = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSouvenirs.pending, (state) => {
        state.status = 'loading'
        state.error = ''
      })
      .addCase(fetchSouvenirs.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchSouvenirs.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Could not load souvenirs'
      })
      .addCase(fetchSouvenirById.pending, (state) => {
        state.selectedStatus = 'loading'
        state.error = ''
      })
      .addCase(fetchSouvenirById.fulfilled, (state, action) => {
        state.selectedStatus = 'succeeded'
        state.selected = action.payload
        const exists = state.items.some((item) => item.id === action.payload.id)
        if (!exists) {
          state.items.push(action.payload)
        }
      })
      .addCase(fetchSouvenirById.rejected, (state, action) => {
        state.selectedStatus = 'failed'
        state.selected = null
        state.error = action.error.message || 'Could not load souvenir'
      })
      .addCase(addSouvenir.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = ''
      })
      .addCase(addSouvenir.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        state.items.unshift(action.payload)
        state.selected = action.payload
      })
      .addCase(addSouvenir.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.error.message || 'Could not add souvenir'
      })
      .addCase(updateSouvenir.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = ''
      })
      .addCase(updateSouvenir.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        state.selected = action.payload
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        )
      })
      .addCase(updateSouvenir.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.error.message || 'Could not update souvenir'
      })
      .addCase(deleteSouvenir.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = ''
      })
      .addCase(deleteSouvenir.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        state.items = state.items.filter((item) => item.id !== action.payload)
        if (state.selected?.id === action.payload) {
          state.selected = null
        }
      })
      .addCase(deleteSouvenir.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.error.message || 'Could not delete souvenir'
      })
  },
})

export const { clearSouvenirError } = souvenirsSlice.actions

const selectSouvenirsState = (state) => state.souvenirs

export const selectSouvenirs = createSelector(
  [selectSouvenirsState],
  (souvenirsState) => souvenirsState.items,
)

export const selectSelectedSouvenir = createSelector(
  [selectSouvenirsState],
  (souvenirsState) => souvenirsState.selected,
)

export const selectSouvenirsStatus = createSelector(
  [selectSouvenirsState],
  (souvenirsState) => souvenirsState.status,
)

export const selectSelectedSouvenirStatus = createSelector(
  [selectSouvenirsState],
  (souvenirsState) => souvenirsState.selectedStatus,
)

export const selectSouvenirMutationStatus = createSelector(
  [selectSouvenirsState],
  (souvenirsState) => souvenirsState.mutationStatus,
)

export const selectSouvenirError = createSelector(
  [selectSouvenirsState],
  (souvenirsState) => souvenirsState.error,
)

export default souvenirsSlice.reducer
