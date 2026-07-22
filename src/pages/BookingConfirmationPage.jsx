import { Link, Navigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectBookingById } from '../features/bookings/bookingsSlice'
import { formatVndCurrency } from '../utils/currency'

const TYPE_CONFIG = {
  hotel: {
    icon: 'hotel',
    label: 'Đặt Phòng Khách Sạn',
    backLabel: 'Tìm thêm chỗ ở',
    backPath: '/search',
  },
}

function formatCurrency(value, currency) {
  if (currency === 'VND') {
    return formatVndCurrency(value)
  }
  return formatVndCurrency(value)
}

function formatDate(iso) {
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

function BookingConfirmationPage() {
  const { bookingId } = useParams()
  const booking = useSelector(selectBookingById(bookingId))

  if (!booking) {
    return <Navigate to="/" replace />
  }

  const config = TYPE_CONFIG[booking.type] || TYPE_CONFIG.hotel

  return (
    <div className="bconf-page">
      <div className="bconf-card">
        <div className="bconf-success-banner">
          <span className="material-symbols-outlined bconf-check-icon">check_circle</span>
          <h1>Đặt chỗ thành công!</h1>
          <p>Xác nhận đặt chỗ đã được gửi đến email của bạn.</p>
        </div>

        <div className="bconf-body">
          <div className="bconf-ref-row">
            <span className="bconf-ref-label">Mã đặt chỗ</span>
            <span className="bconf-ref-code">{booking.id}</span>
          </div>

          <div className="bconf-type-badge">
            <span className="material-symbols-outlined">{config.icon}</span>
            {config.label}
          </div>

          {booking.image && (
            <div className="bconf-image-wrap">
              <img src={booking.image} alt={booking.title} />
            </div>
          )}

          <h2 className="bconf-title">{booking.title}</h2>
          {booking.subtitle && <p className="bconf-subtitle">{booking.subtitle}</p>}

          <div className="bconf-details-grid">
            {booking.details && Object.entries(booking.details).map(([key, value]) => (
              value ? (
                <div key={key} className="bconf-detail-item">
                  <span className="bconf-detail-label">{key}</span>
                  <span className="bconf-detail-value">{value}</span>
                </div>
              ) : null
            ))}
          </div>

          <div className="bconf-total-row">
            <span>Tổng thanh toán</span>
            <strong>{formatCurrency(booking.total, booking.currency)}</strong>
          </div>

          <p className="bconf-booked-at">
            Đặt lúc {formatDate(booking.bookedAt)}
          </p>

          <div className="bconf-actions">
            <Link to="/my-bookings" className="bconf-btn bconf-btn-primary">
              <span className="material-symbols-outlined">receipt_long</span>
              Xem đơn đặt của tôi
            </Link>
            <Link to={config.backPath} className="bconf-btn bconf-btn-secondary">
              {config.backLabel}
            </Link>
            <Link to="/" className="bconf-btn bconf-btn-ghost">
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingConfirmationPage
