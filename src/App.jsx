import './App.css'
import { useLocation } from 'react-router-dom'
import { Navigate, Route, Routes } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import AppFooter from './components/layout/AppFooter'
import AppHeader from './components/layout/AppHeader'
import CheckoutPage from './pages/CheckoutPage'
import HotelDetailsPage from './pages/HotelDetailsPage'
import HomePage from './pages/HomePage'
import SavedPage from './pages/SavedPage'
import SearchResultsPage from './pages/SearchResultsPage'

function App() {
  const location = useLocation()
  const isAuthRoute = location.pathname === '/auth'
  const isCheckoutRoute = location.pathname.startsWith('/checkout')

  return (
    <div className="app-shell">
      {!isAuthRoute && !isCheckoutRoute && <AppHeader />}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/checkout/:stayId" element={<CheckoutPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/stays/:stayId" element={<HotelDetailsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAuthRoute && !isCheckoutRoute && <AppFooter />}
    </div>
  )
}

export default App
