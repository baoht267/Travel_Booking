import './App.css'
import { useLocation } from 'react-router-dom'
import { Navigate, Route, Routes } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import AppFooter from './components/layout/AppFooter'
import AppHeader from './components/layout/AppHeader'
import BookingConfirmationPage from './pages/BookingConfirmationPage'
import CheckoutPage from './pages/CheckoutPage'
import MyBookingsPage from './pages/MyBookingsPage'
import ProfilePage from './pages/ProfilePage'
import HotelDetailsPage from './pages/HotelDetailsPage'
import HomePage from './pages/HomePage'
import SavedPage from './pages/SavedPage'
import SearchResultsPage from './pages/SearchResultsPage'
import RoomListPage from './pages/RoomListPage'
import RoomFormPage from './pages/RoomFormPage'
import RoomDetailPage from './pages/RoomDetailPage'

function App() {
  const location = useLocation()
  const isAuthRoute = location.pathname === '/auth'

  const isCheckoutRoute =
    location.pathname.startsWith('/checkout') ||
    location.pathname.includes('/checkout') ||
    location.pathname.startsWith('/booking-confirmation')

  return (
    <div className="app-shell">
      {!isAuthRoute && !isCheckoutRoute && <AppHeader />}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/checkout/:stayId" element={<CheckoutPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/rooms" element={<RoomListPage />} />
          <Route path="/rooms/new" element={<RoomFormPage />} />
          <Route path="/rooms/:roomId" element={<RoomDetailPage />} />
          <Route path="/rooms/:roomId/edit" element={<RoomFormPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/stays/:stayId" element={<HotelDetailsPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmationPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAuthRoute && !isCheckoutRoute && <AppFooter />}
    </div>
  )
}

export default App
