import axios from 'axios'
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Chuyển lỗi axios thành Error với message rõ ràng để reducer đọc action.error.message.
function toApiError(error) {
  const message =
    error.response?.data?.message || error.message || 'Yêu cầu API thất bại'
  return new Error(message)
}

export const fetchRooms = createAsyncThunk('rooms/fetchRooms', async () => {
  try {
    const { data } = await api.get('/rooms')
    return data
  } catch (error) {
    throw toApiError(error)
  }
})

export const fetchRoomById = createAsyncThunk('rooms/fetchRoomById', async (id) => {
  try {
    const { data } = await api.get(`/rooms/${id}`)
    return data
  } catch (error) {
    throw toApiError(error)
  }
})

export const addRoom = createAsyncThunk('rooms/addRoom', async (room) => {
  try {
    const { data } = await api.post('/rooms', room)
    return data
  } catch (error) {
    throw toApiError(error)
  }
})

export const updateRoom = createAsyncThunk('rooms/updateRoom', async ({ id, room }) => {
  try {
    const { data } = await api.put(`/rooms/${id}`, room)
    return data
  } catch (error) {
    throw toApiError(error)
  }
})

export const deleteRoom = createAsyncThunk('rooms/deleteRoom', async (id) => {
  try {
    await api.delete(`/rooms/${id}`)
    return id
  } catch (error) {
    throw toApiError(error)
  }
})

const roomsSlice = createSlice({
  name: 'rooms',
  initialState: {
    items: [],
    selected: null,
    status: 'idle',
    selectedStatus: 'idle',
    mutationStatus: 'idle',
    error: '',
  },
  reducers: {
    clearRoomError(state) {
      state.error = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.status = 'loading'
        state.error = ''
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Không thể tải danh sách phòng'
      })
      .addCase(fetchRoomById.pending, (state) => {
        state.selectedStatus = 'loading'
        state.error = ''
      })
      .addCase(fetchRoomById.fulfilled, (state, action) => {
        state.selectedStatus = 'succeeded'
        state.selected = action.payload
        const exists = state.items.some((item) => item.id === action.payload.id)
        if (!exists) {
          state.items.push(action.payload)
        }
      })
      .addCase(fetchRoomById.rejected, (state, action) => {
        state.selectedStatus = 'failed'
        state.selected = null
        state.error = action.error.message || 'Không thể tải thông tin phòng'
      })
      .addCase(addRoom.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = ''
      })
      .addCase(addRoom.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        state.items.unshift(action.payload)
        state.selected = action.payload
      })
      .addCase(addRoom.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.error.message || 'Không thể thêm phòng'
      })
      .addCase(updateRoom.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = ''
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        state.selected = action.payload
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        )
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.error.message || 'Không thể cập nhật phòng'
      })
      .addCase(deleteRoom.pending, (state) => {
        state.mutationStatus = 'loading'
        state.error = ''
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        state.items = state.items.filter((item) => item.id !== action.payload)
        if (state.selected?.id === action.payload) {
          state.selected = null
        }
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.error.message || 'Không thể xóa phòng'
      })
  },
})

export const { clearRoomError } = roomsSlice.actions

const selectRoomsState = (state) => state.rooms

export const selectRooms = createSelector(
  [selectRoomsState],
  (roomsState) => roomsState.items,
)

export const selectSelectedRoom = createSelector(
  [selectRoomsState],
  (roomsState) => roomsState.selected,
)

export const selectRoomsStatus = createSelector(
  [selectRoomsState],
  (roomsState) => roomsState.status,
)

export const selectSelectedRoomStatus = createSelector(
  [selectRoomsState],
  (roomsState) => roomsState.selectedStatus,
)

export const selectRoomMutationStatus = createSelector(
  [selectRoomsState],
  (roomsState) => roomsState.mutationStatus,
)

export const selectRoomError = createSelector(
  [selectRoomsState],
  (roomsState) => roomsState.error,
)

export default roomsSlice.reducer
