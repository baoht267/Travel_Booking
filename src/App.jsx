import './App.css'
import { useLocation } from 'react-router-dom'
import { Navigate, Route, Routes } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import AppFooter from './components/layout/AppFooter'
import AppHeader from './components/layout/AppHeader'
import BookingConfirmationPage from './pages/BookingConfirmationPage'
import CarRentalCheckoutPage from './pages/CarRentalCheckoutPage'
import CheckoutPage from './pages/CheckoutPage'
import AttractionsPage from './pages/AttractionsPage'
import FlightCheckoutPage from './pages/FlightCheckoutPage'
import MyBookingsPage from './pages/MyBookingsPage'
import ProfilePage from './pages/ProfilePage'
import TaxiCheckoutPage from './pages/TaxiCheckoutPage'
import ExperienceDetailsPage from './pages/ExperienceDetailsPage'
import HotelDetailsPage from './pages/HotelDetailsPage'
import HomePage from './pages/HomePage'
import SavedPage from './pages/SavedPage'
import SearchResultsPage from './pages/SearchResultsPage'

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
          <Route path="/cars/:carId/checkout" element={<CarRentalCheckoutPage />} />
          <Route path="/checkout/:stayId" element={<CheckoutPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/attractions" element={<AttractionsPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/flights/:flightId/checkout" element={<FlightCheckoutPage />} />
          <Route path="/taxis/:taxiId/checkout" element={<TaxiCheckoutPage />} />
          <Route path="/stays/:stayId" element={<HotelDetailsPage />} />
          <Route path="/experiences/:experienceId" element={<ExperienceDetailsPage />} />
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
