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
    addBooking(state, action) {
      const booking = {
        id: generateBookingId(),
        bookedAt: new Date().toISOString(),
        status: 'upcoming',
        ...action.payload,
      }
      state.bookings.unshift(booking)
    },
    cancelBooking(state, action) {
      const booking = state.bookings.find((b) => b.id === action.payload)
      if (booking) {
        booking.status = 'cancelled'
      }
    },
  },
})

export const { addBooking, cancelBooking } = bookingsSlice.actions

export const selectBookings = (state) => state.bookings.bookings
export const selectBookingById = (id) => (state) =>
  state.bookings.bookings.find((b) => b.id === id)

export const selectHotelBookingsByStay = (stayId) => (state) =>
  state.bookings.bookings.filter(
    (b) => b.type === 'hotel' && b.stayId === stayId && b.status !== 'cancelled' && b.checkIn && b.checkOut
  )

export default bookingsSlice.reducer
