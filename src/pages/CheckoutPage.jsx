import { useMemo, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import VNPayQR from '../components/payment/VNPayQR'
import CardPaymentForm from '../components/payment/CardPaymentForm'
import { useDispatch, useSelector } from 'react-redux'
import { selectAllStays, selectCriteria } from '../features/stays/staysSlice'
import { addBooking, selectHotelBookingsByStay } from '../features/bookings/bookingsSlice'
import { readSession } from '../utils/authSession'
import { useToast } from '../context/toastState'
import { convertBasePriceToVnd, formatVndCurrency } from '../utils/currency'
import { isFutureDate } from '../utils/travelDates'

function toCurrency(value) {
  return formatVndCurrency(value)
}

function formatDateRange(checkIn, checkOut) {
  const format = new Intl.DateTimeFormat('vi-VN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return `${format.format(new Date(checkIn))} - ${format.format(new Date(checkOut))}`
}

function getNightCount(checkIn, checkOut) {
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const difference = end.getTime() - start.getTime()
  const nights = Math.round(difference / (1000 * 60 * 60 * 24))
  return nights > 0 ? nights : 1
}

function splitFullName(fullName) {
  const normalized = fullName?.trim() || ''

  if (!normalized) {
    return { firstName: '', lastName: '' }
  }

  const parts = normalized.split(/\s+/)
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' '),
  }
}

function CheckoutPage() {
  const { stayId } = useParams()
  const stays = useSelector(selectAllStays)
  const criteria = useSelector(selectCriteria)
  const session = useMemo(() => readSession(), [])
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const showToast = useToast()
  const existingBookings = useSelector(selectHotelBookingsByStay(stayId))
  const stay = stays.find((item) => item.id === stayId)

  const initialName = splitFullName(session?.fullName)
  const [payReference] = useState(() => `GC${Date.now().toString(36).toUpperCase().slice(-6)}`)
  const [paymentMethod, setPaymentMethod] = useState('vnpay')
  const [formValues, setFormValues] = useState({
    firstName: initialName.firstName,
    lastName: initialName.lastName,
    email: session?.email || '',
    phone: '',
    requests: '',
    acceptedTerms: false,
    cardholderName: session?.fullName || '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  })

  if (!session) {
    return <Navigate to="/auth" replace />
  }

  if (!stay) {
    return <Navigate to="/search" replace />
  }

  const nights = getNightCount(criteria.checkIn, criteria.checkOut)
  const basePrice = stay.pricePerNight * nights * criteria.rooms
  const serviceFee = Number((basePrice * 0.05).toFixed(2))
  const taxes = Number((stay.taxesAndFees * nights * criteria.rooms).toFixed(2))
  const discount = nights >= 3 ? Number((basePrice * 0.06).toFixed(2)) : 0
  const total = basePrice + serviceFee + taxes - discount
  const basePriceVnd = convertBasePriceToVnd(basePrice)
  const serviceFeeVnd = convertBasePriceToVnd(serviceFee)
  const taxesVnd = convertBasePriceToVnd(taxes)
  const discountVnd = convertBasePriceToVnd(discount)
  const totalVnd = convertBasePriceToVnd(total)
  const cardLabel = `Đặt ${stay.propertyType}`

  const handleFieldChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormValues((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!isFutureDate(criteria.checkIn)) {
      showToast('Ngày nhận phòng phải là ngày trong tương lai', 'danger')
      return
    }
    if (criteria.checkOut <= criteria.checkIn) {
      showToast('Ngày trả phòng phải sau ngày nhận phòng', 'danger')
      return
    }
    const conflict = existingBookings.some(
      (b) => criteria.checkIn < b.checkOut && criteria.checkOut > b.checkIn
    )
    if (conflict) {
      showToast('Phòng đã được đặt trong khoảng thời gian này, vui lòng chọn ngày khác', 'danger')
      return
    }
    if (paymentMethod === 'card') {
      if (!formValues.cardholderName || !formValues.cardNumber || !formValues.expiryDate || !formValues.cvv) {
        showToast('Vui lòng điền đầy đủ thông tin thẻ ngân hàng', 'danger')
        return
      }
    }
    const booking = dispatch(addBooking({
      type: 'hotel',
      stayId: stay.id,
      checkIn: criteria.checkIn,
      checkOut: criteria.checkOut,
      title: stay.name,
      subtitle: `${stay.city}, ${stay.country}`,
      image: stay.image,
      total: totalVnd,
      currency: 'VND',
      details: {
        'Nhận phòng': new Intl.DateTimeFormat('vi-VN').format(new Date(criteria.checkIn)),
        'Trả phòng': new Intl.DateTimeFormat('vi-VN').format(new Date(criteria.checkOut)),
        'Số đêm': `${getNightCount(criteria.checkIn, criteria.checkOut)} đêm`,
        'Số khách': `${criteria.guests} khách · ${criteria.rooms} phòng`,
      },
    }))
    const bookingId = booking.payload.id
    showToast(`Đặt ${stay.propertyType} thành công! Mã đặt chỗ: #${bookingId.slice(-6).toUpperCase()}`, 'success', 5000)
    navigate(`/booking-confirmation/${bookingId}`, { replace: true })
  }

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <div className="checkout-header-inner">
          <button
            type="button"
            className="checkout-back-btn"
            onClick={() => navigate(-1)}
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Quay lại
          </button>
          <div className="checkout-brand">GOCHIP</div>
          <div className="checkout-security">
            <span className="material-symbols-outlined">lock</span>
            Thanh Toán An Toàn
          </div>
        </div>
      </header>

      <main className="checkout-main">
        <div className="checkout-stepper">
          <div className="checkout-step is-active">
            <span className="checkout-step-badge">1</span>
            <span>Lựa Chọn</span>
          </div>
          <span className="checkout-step-line"></span>
          <div className="checkout-step is-current">
            <span className="checkout-step-badge">2</span>
            <span>Chi Tiết & Thanh Toán</span>
          </div>
          <span className="checkout-step-line"></span>
          <div className="checkout-step">
            <span className="checkout-step-badge">3</span>
            <span>Xác Nhận</span>
          </div>
        </div>

        <div className="checkout-layout">
          <section className="checkout-form-column">
            <Form onSubmit={handleSubmit} className="checkout-form-stack">
              <div className="checkout-panel">
                <h2 className="checkout-panel-title">Nhập thông tin của bạn</h2>
                <div className="checkout-form-grid">
                  <div className="checkout-field">
                    <label htmlFor="firstName">Tên</label>
                    <input
                      id="firstName"
                      name="firstName"
                      value={formValues.firstName}
                      onChange={handleFieldChange}
                      placeholder="vd. Văn A"
                      required
                    />
                  </div>
                  <div className="checkout-field">
                    <label htmlFor="lastName">Họ</label>
                    <input
                      id="lastName"
                      name="lastName"
                      value={formValues.lastName}
                      onChange={handleFieldChange}
                      placeholder="vd. Nguyễn"
                      required
                    />
                  </div>
                  <div className="checkout-field">
                    <label htmlFor="email">Địa Chỉ Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formValues.email}
                      onChange={handleFieldChange}
                      placeholder="nguyenvana@example.com"
                      required
                    />
                    <small>Xác nhận sẽ được gửi đến đây</small>
                  </div>
                  <div className="checkout-field">
                    <label htmlFor="phone">Số Điện Thoại</label>
                    <input
                      id="phone"
                      name="phone"
                      value={formValues.phone}
                      onChange={handleFieldChange}
                      placeholder="+84 (0) 000 000 000"
                      required
                    />
                  </div>
                </div>

                <div className="checkout-field">
                  <label htmlFor="requests">Yêu Cầu Đặc Biệt (Tùy Chọn)</label>
                  <textarea
                    id="requests"
                    name="requests"
                    value={formValues.requests}
                    onChange={handleFieldChange}
                    placeholder="Yêu cầu ăn uống, nhu cầu tiếp cận, v.v."
                    rows={4}
                  />
                </div>
              </div>

              <div className="checkout-payment-tabs">
                <button
                  type="button"
                  className={`checkout-payment-tab${paymentMethod === 'vnpay' ? ' is-active' : ''}`}
                  onClick={() => setPaymentMethod('vnpay')}
                >
                  <span className="material-symbols-outlined">qr_code_2</span>
                  QR VNPay
                </button>
                <button
                  type="button"
                  className={`checkout-payment-tab${paymentMethod === 'card' ? ' is-active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <span className="material-symbols-outlined">credit_card</span>
                  Thẻ ngân hàng
                </button>
              </div>

              {paymentMethod === 'vnpay' ? (
                <VNPayQR
                  amount={toCurrency(totalVnd)}
                  reference={payReference}
                  confirmed={formValues.acceptedTerms}
                  onConfirmChange={(e) =>
                    setFormValues((v) => ({ ...v, acceptedTerms: e.target.checked }))
                  }
                />
              ) : (
                <CardPaymentForm
                  values={{
                    cardholderName: formValues.cardholderName,
                    cardNumber: formValues.cardNumber,
                    expiryDate: formValues.expiryDate,
                    cvv: formValues.cvv,
                  }}
                  onChange={handleFieldChange}
                />
              )}

              <Button type="submit" className="checkout-confirm-button">
                Xác Nhận Đặt Chỗ
              </Button>
            </Form>

            <div className="checkout-trust-row">
              <div className="checkout-trust-item">
                <span className="material-symbols-outlined is-success">verified_user</span>
                <span>Kết Nối SSL An Toàn</span>
              </div>
              <div className="checkout-trust-item">
                <span className="material-symbols-outlined is-blue">verified</span>
                <span>Được Chứng Nhận Du Lịch An Toàn</span>
              </div>
              <div className="checkout-trust-item">
                <span className="material-symbols-outlined is-primary">shield</span>
                <span>Thanh Toán Được Bảo Vệ</span>
              </div>
            </div>
          </section>

          <aside className="checkout-summary-column">
            <div className="checkout-summary-card">
              <div className="checkout-summary-visual">
                <img src={stay.image} alt={stay.name} />
                <div className="checkout-summary-overlay"></div>
                <div className="checkout-summary-title">
                  <p>{cardLabel}</p>
                  <h3>{stay.name}</h3>
                </div>
              </div>

              <div className="checkout-summary-body">
                <div className="checkout-summary-meta">
                  <div>
                    <span className="material-symbols-outlined">calendar_today</span>
                    <span>{formatDateRange(criteria.checkIn, criteria.checkOut)}</span>
                  </div>
                  <div>
                    <span className="material-symbols-outlined">location_on</span>
                    <span>
                      {stay.city}, {stay.country}
                    </span>
                  </div>
                  <div>
                    <span className="material-symbols-outlined">person</span>
                    <span>
                      {criteria.guests} Người Lớn
                      {criteria.rooms > 1 ? ` · ${criteria.rooms} Phòng` : ''}
                    </span>
                  </div>
                </div>

                <div className="checkout-price-summary">
                  <h4>Tóm Tắt Giá</h4>
                  <div><span>Giá Cơ Bản</span><span>{toCurrency(basePriceVnd)}</span></div>
                  <div><span>Phí Dịch Vụ</span><span>{toCurrency(serviceFeeVnd)}</span></div>
                  <div><span>Thuế & VAT</span><span>{toCurrency(taxesVnd)}</span></div>
                  {discount > 0 && (
                    <div className="checkout-discount-row">
                      <span>Giảm Giá Đặt Sớm</span>
                      <span>-{toCurrency(discountVnd)}</span>
                    </div>
                  )}
                </div>

                <div className="checkout-total-row">
                  <div>
                    <strong>Tổng Cộng</strong>
                    <small>Đã bao gồm tất cả thuế</small>
                  </div>
                  <span>{toCurrency(totalVnd)}</span>
                </div>

                <div className="checkout-info-note">
                  <span className="material-symbols-outlined">info</span>
                  <p>
                    {stay.perks.some((p) => p.toLowerCase().includes('hủy'))
                      ? 'Hủy miễn phí được bao gồm trong đặt chỗ mẫu này. Không có phí ẩn.'
                      : 'Đặt chỗ mẫu này bao gồm tất cả các khoản phí hiển thị. Không có phí ẩn.'}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="checkout-footer">
        <div>
          <div className="checkout-footer-brand">GOCHIP</div>
          <p>© 2024 GOCHIP. Bảo lưu mọi quyền. Được xây dựng cho du khách.</p>
        </div>
        <div className="checkout-footer-links">
          <Link to="/">Về Chúng Tôi</Link>
          <Link to="/">Dịch Vụ Khách Hàng</Link>
          <Link to="/">Chính Sách Bảo Mật</Link>
          <Link to="/">Điều Khoản & Điều Kiện</Link>
        </div>
      </footer>
    </div>
  )
}

export default CheckoutPage
