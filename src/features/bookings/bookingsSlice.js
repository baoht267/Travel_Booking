import { createSlice } from '@reduxjs/toolkit'

function generateBookingId() {
  return 'BK-' + Math.random().toString(36).slice(2, 8).toUpperCase()
}

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: [],
  },
  reducers: {
    replaceBookingsState(state, action) {
      state.bookings = Array.isArray(action.payload?.bookings) ? action.payload.bookings : []
    },
    addBooking: {
      reducer(state, action) {
        state.bookings.unshift(action.payload)
      },
      prepare(data) {
        return {
          payload: {
            id: generateBookingId(),
            bookedAt: new Date().toISOString(),
            status: 'upcoming',
            ...data,
          },
        }
      },
    },
    cancelBooking(state, action) {
      const booking = state.bookings.find((b) => b.id === action.payload)
      if (booking) {
        booking.status = 'cancelled'
      }
    },
  },
})

export const { addBooking, cancelBooking, replaceBookingsState } = bookingsSlice.actions

export const selectBookings = (state) => state.bookings.bookings
export const selectBookingById = (id) => (state) =>
  state.bookings.bookings.find((b) => b.id === id)

export const selectHotelBookingsByStay = (stayId) => (state) =>
  state.bookings.bookings.filter(
    (b) => b.type === 'hotel' && b.stayId === stayId && b.status !== 'cancelled' && b.checkIn && b.checkOut
  )

export default bookingsSlice.reducer
