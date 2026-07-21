import { useState } from 'react'
import { Container } from 'react-bootstrap'
import { Link, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { cancelBooking, selectBookings } from '../features/bookings/bookingsSlice'
import { readSession } from '../utils/authSession'
import { formatVndCurrency } from '../utils/currency'

const TYPE_ICON = {
  hotel: 'hotel',
  flight: 'flight',
  taxi: 'local_taxi',
  car: 'directions_car',
  souvenir: 'shopping_bag',
}

const TYPE_LABEL = {
  hotel: 'Khách sạn',
  flight: 'Chuyến bay',
  taxi: 'Taxi',
  car: 'Thuê xe',
  souvenir: 'Đồ lưu niệm',
}

const STATUS_CONFIG = {
  upcoming: { label: 'Sắp tới', className: 'mybk-status-upcoming' },
  completed: { label: 'Đã hoàn thành', className: 'mybk-status-completed' },
  cancelled: { label: 'Đã hủy', className: 'mybk-status-cancelled' },
}

const TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'upcoming', label: 'Sắp tới' },
  { key: 'completed', label: 'Đã hoàn thành' },
  { key: 'cancelled', label: 'Đã hủy' },
]

function formatCurrency(value, currency) {
  if (currency === 'VND') {
    return formatVndCurrency(value)
  }
  return formatVndCurrency(value)
}

function formatDate(iso) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

function BookingCard({ booking, onCancel }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const statusCfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.upcoming
  const icon = TYPE_ICON[booking.type] || 'receipt'

  return (
    <div className={`mybk-card mybk-card-${booking.type}`}>
      {booking.image && (
        <div className="mybk-card-image">
          <img src={booking.image} alt={booking.title} />
          <div className="mybk-card-image-overlay" />
        </div>
      )}

      <div className="mybk-card-body">
        <div className="mybk-card-head">
          <div className="mybk-card-type">
            <span className="material-symbols-outlined">{icon}</span>
            <span>{TYPE_LABEL[booking.type] || 'Đơn hàng'}</span>
          </div>
          <span className={`mybk-status ${statusCfg.className}`}>{statusCfg.label}</span>
        </div>

        <h3 className="mybk-card-title">{booking.title}</h3>
        {booking.subtitle && <p className="mybk-card-subtitle">{booking.subtitle}</p>}

        {booking.details && (
          <div className="mybk-card-details">
            {Object.entries(booking.details).slice(0, 3).map(([key, value]) =>
              value ? (
                <div key={key} className="mybk-detail-item">
                  <span className="mybk-detail-label">{key}</span>
                  <span className="mybk-detail-value">{value}</span>
                </div>
              ) : null
            )}
          </div>
        )}

        <div className="mybk-card-footer">
          <div className="mybk-card-meta">
            <span className="mybk-ref">#{booking.id}</span>
            <span className="mybk-booked-at">Đặt {formatDate(booking.bookedAt)}</span>
          </div>
          <div className="mybk-card-price-row">
            <strong className="mybk-total">{formatCurrency(booking.total, booking.currency)}</strong>
            {booking.status === 'upcoming' && (
              <div className="mybk-card-actions">
                <Link to={`/booking-confirmation/${booking.id}`} className="mybk-btn mybk-btn-view">
                  Chi tiết
                </Link>
                {!showConfirm ? (
                  <button
                    type="button"
                    className="mybk-btn mybk-btn-cancel"
                    onClick={() => setShowConfirm(true)}
                  >
                    Hủy đặt chỗ
                  </button>
                ) : (
                  <div className="mybk-confirm-cancel">
                    <span>Xác nhận hủy?</span>
                    <button
                      type="button"
                      className="mybk-btn mybk-btn-confirm"
                      onClick={() => onCancel(booking.id)}
                    >
                      Có, hủy
                    </button>
                    <button
                      type="button"
                      className="mybk-btn mybk-btn-ghost"
                      onClick={() => setShowConfirm(false)}
                    >
                      Không
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function MyBookingsPage() {
  const dispatch = useDispatch()
  const bookings = useSelector(selectBookings)
  const [activeTab, setActiveTab] = useState('all')

  if (!readSession()) return <Navigate to="/auth" replace />

  const filtered = activeTab === 'all'
    ? bookings
    : bookings.filter((b) => b.status === activeTab)

  const countByStatus = (status) => bookings.filter((b) => b.status === status).length

  const handleCancel = (id) => {
    dispatch(cancelBooking(id))
  }

  return (
    <Container className="page-section mybk-page">
      <div className="mybk-heading">
        <h1>Đơn Đặt Của Tôi</h1>
        <p>Quản lý tất cả các đặt chỗ của bạn</p>
      </div>

      <div className="mybk-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`mybk-tab${activeTab === tab.key ? ' is-active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {tab.key !== 'all' && (
              <span className="mybk-tab-count">{countByStatus(tab.key)}</span>
            )}
            {tab.key === 'all' && (
              <span className="mybk-tab-count">{bookings.length}</span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mybk-empty">
          <span className="material-symbols-outlined mybk-empty-icon">receipt_long</span>
          <h2>Chưa có đơn đặt nào</h2>
          <p>
            {activeTab === 'all'
              ? 'Bạn chưa thực hiện đặt chỗ nào. Hãy khám phá các điểm đến!'
              : `Không có đơn đặt nào với trạng thái "${TABS.find((t) => t.key === activeTab)?.label}".`}
          </p>
          <div className="mybk-empty-actions">
            <Link to="/search" className="mybk-btn mybk-btn-primary">Tìm chỗ ở</Link>
            <Link to="/search?tab=flights" className="mybk-btn mybk-btn-secondary">Tìm chuyến bay</Link>
          </div>
        </div>
      ) : (
        <div className="mybk-list">
          {filtered.map((booking) => (
            <BookingCard key={booking.id} booking={booking} onCancel={handleCancel} />
          ))}
        </div>
      )}
    </Container>
  )
}

export default MyBookingsPage
