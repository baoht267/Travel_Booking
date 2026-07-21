import './App.css'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Navigate, Route, Routes } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import AppFooter from './components/layout/AppFooter'
import AppHeader from './components/layout/AppHeader'
import BookingConfirmationPage from './pages/BookingConfirmationPage'
import CarRentalCheckoutPage from './pages/CarRentalCheckoutPage'
import CheckoutPage from './pages/CheckoutPage'
import DestinationDetailPage from './pages/DestinationDetailPage'
import DestinationFormPage from './pages/DestinationFormPage'
import DestinationListPage from './pages/DestinationListPage'
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
import { fetchDestinations } from './features/destinations/destinationsSlice'
import { readSession } from './utils/authSession'

function AdminRoute({ children }) {
  const session = readSession()

  if (!session) {
    return <Navigate to="/auth" replace />
  }

  return session.role === 'admin' ? children : <Navigate to="/" replace />
}

function App() {
  const dispatch = useDispatch()
  const location = useLocation()
  const isAuthRoute = location.pathname === '/auth'

  // Tải danh sách điểm đến (do admin quản lý) một lần cho toàn app,
  // để trang chủ và tìm kiếm đều thấy dữ liệu mới nhất.
  useEffect(() => {
    dispatch(fetchDestinations())
  }, [dispatch])
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
          <Route path="/manage-destinations" element={<AdminRoute><DestinationListPage /></AdminRoute>} />
          <Route path="/manage-destinations/new" element={<AdminRoute><DestinationFormPage /></AdminRoute>} />
          <Route path="/manage-destinations/:destinationId" element={<AdminRoute><DestinationDetailPage /></AdminRoute>} />
          <Route path="/manage-destinations/:destinationId/edit" element={<AdminRoute><DestinationFormPage /></AdminRoute>} />
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
