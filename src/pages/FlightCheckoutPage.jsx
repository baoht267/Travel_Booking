import { useMemo, useState } from 'react'
import { Button } from 'react-bootstrap'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { readSession } from '../utils/authSession'
import { addBooking } from '../features/bookings/bookingsSlice'
import { useToast } from '../context/toastState'
import mockFlights from '../data/mockFlights'

function formatPrice(value) {
  return new Intl.NumberFormat('vi-VN').format(value)
}

function splitFullName(fullName) {
  const normalized = fullName?.trim() || ''
  if (!normalized) return { firstName: '', lastName: '' }
  const parts = normalized.split(/\s+/)
  return { firstName: parts.slice(0, -1).join(' ') || parts[0], lastName: parts.at(-1) || '' }
}

export default function FlightCheckoutPage() {
  const { flightId } = useParams()
  const [searchParams] = useSearchParams()
  const session = useMemo(() => readSession(), [])
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const showToast = useToast()

  const flight = mockFlights.find((f) => f.id === flightId)
  const passengers = Math.max(1, Number(searchParams.get('passengers') || 1))
  const departDate = searchParams.get('departDate') || new Date().toISOString().split('T')[0]
  const selectedClass = searchParams.get('class') || 'economy'
  const isBusinessClass = selectedClass === 'business'
  const todayStr = new Date().toISOString().split('T')[0]

  const initialName = splitFullName(session?.fullName)
  const [step, setStep] = useState(1)

  const [leadPassenger, setLeadPassenger] = useState({
    firstName: initialName.firstName,
    lastName: initialName.lastName,
    email: session?.email || '',
    phone: '',
    idNumber: '',
    dob: '',
    nationality: 'Việt Nam',
  })

  const [extraPassengers, setExtraPassengers] = useState(
    Array.from({ length: passengers - 1 }, () => ({
      firstName: '',
      lastName: '',
      idNumber: '',
    })),
  )

  const [payment, setPayment] = useState({
    cardholderName: session?.fullName || '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    acceptedTerms: false,
  })

  if (!session) return <Navigate to="/auth" replace />
  if (!flight) return <Navigate to="/search?tab=flights" replace />

  const pricePerPerson = isBusinessClass
    ? (flight.businessPrice ?? flight.price)
    : flight.price
  const baseFare = pricePerPerson * passengers
  const taxRate = 0.1
  const taxes = Math.round(baseFare * taxRate)
  const serviceFee = 55000 * passengers
  const total = baseFare + taxes + serviceFee

  const handleLeadChange = (e) => {
    const { name, value } = e.target
    setLeadPassenger((p) => ({ ...p, [name]: value }))
  }

  const handleExtraChange = (index, e) => {
    const { name, value } = e.target
    setExtraPassengers((arr) => {
      const next = [...arr]
      next[index] = { ...next[index], [name]: value }
      return next
    })
  }

  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target
    setPayment((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (step === 1) {
      if (departDate < todayStr) {
        showToast('Ngày bay không thể là ngày trong quá khứ', 'danger')
        return
      }
      if (leadPassenger.dob > todayStr) {
        showToast('Ngày sinh không thể là ngày trong tương lai', 'danger')
        return
      }
      setStep(2)
      return
    }
    const classBadgeLabel = isBusinessClass ? 'Thương Gia' : 'Phổ Thông'
    const booking = dispatch(addBooking({
      type: 'flight',
      title: `${flight.from} → ${flight.to}`,
      subtitle: `${flight.airline} · ${classBadgeLabel}`,
      image: null,
      total,
      currency: 'VND',
      details: {
        'Hãng bay': flight.airline,
        'Ngày bay': new Intl.DateTimeFormat('vi-VN').format(new Date(departDate)),
        'Giờ khởi hành': `${flight.departTime} → ${flight.arriveTime}`,
        'Hành khách': `${passengers} người · ${classBadgeLabel}`,
      },
    }))
    const bookingId = booking.payload.id
    showToast(`Đặt vé bay thành công! Mã đặt chỗ: #${bookingId.slice(-6).toUpperCase()}`, 'success', 5000)
    navigate(`/booking-confirmation/${bookingId}`, { replace: true })
  }

  const formatFlightDate = (dateStr) => {
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    }).format(new Date(dateStr))
  }

  const classBadge = isBusinessClass ? 'Thương Gia' : 'Phổ Thông'

  return (
    <div className="fco-page">
      {/* Header */}
      <header className="fco-header">
        <div className="fco-header-inner">
          <button type="button" className="fco-back-btn-header" onClick={() => navigate(-1)}>
            <span className="material-symbols-outlined">arrow_back</span>
            Quay lại
          </button>
          <Link to="/" className="fco-brand">GOCHIP</Link>
          <div className="fco-header-secure">
            <span className="material-symbols-outlined">lock</span>
            Thanh Toán An Toàn
          </div>
        </div>
      </header>

      {/* Stepper */}
      <div className="fco-stepper-wrap">
        <div className="fco-stepper">
          {[
            { n: 1, label: 'Hành Khách' },
            { n: 2, label: 'Thanh Toán' },
            { n: 3, label: 'Xác Nhận' },
          ].map(({ n, label }, i, arr) => (
            <div key={n} className="fco-step-group">
              <div className={`fco-step${step >= n ? ' is-done' : ''}${step === n ? ' is-current' : ''}`}>
                <span className="fco-step-badge">
                  {step > n
                    ? <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check</span>
                    : n}
                </span>
                <span className="fco-step-label">{label}</span>
              </div>
              {i < arr.length - 1 && <span className="fco-step-line" />}
            </div>
          ))}
        </div>
      </div>

      <div className="fco-layout">
        {/* ── LEFT COLUMN ── */}
        <main className="fco-main">
          <form onSubmit={handleSubmit}>
              {/* ── STEP 1: Thông tin hành khách ── */}
              {step === 1 && (
                <>
                  {/* Hành khách chính */}
                  <div className="fco-panel">
                    <h2 className="fco-panel-title">
                      <span className="material-symbols-outlined">person</span>
                      Hành Khách Chính (Hành khách 1)
                    </h2>
                    <div className="fco-grid-2">
                      <div className="fco-field">
                        <label>Họ</label>
                        <input name="lastName" value={leadPassenger.lastName}
                          onChange={handleLeadChange} placeholder="vd. Nguyễn" required />
                      </div>
                      <div className="fco-field">
                        <label>Tên</label>
                        <input name="firstName" value={leadPassenger.firstName}
                          onChange={handleLeadChange} placeholder="vd. Văn A" required />
                      </div>
                      <div className="fco-field">
                        <label>Ngày sinh</label>
                        <input type="date" name="dob" value={leadPassenger.dob}
                          onChange={handleLeadChange} max={todayStr} required />
                      </div>
                      <div className="fco-field">
                        <label>Quốc tịch</label>
                        <select name="nationality" value={leadPassenger.nationality}
                          onChange={handleLeadChange}>
                          {['Việt Nam', 'Nhật Bản', 'Hàn Quốc', 'Pháp', 'Mỹ',
                            'Singapore', 'Thái Lan', 'Anh', 'Úc', 'Khác'].map((n) => (
                            <option key={n}>{n}</option>
                          ))}
                        </select>
                      </div>
                      <div className="fco-field fco-field-full">
                        <label>Số CCCD / Hộ chiếu</label>
                        <input name="idNumber" value={leadPassenger.idNumber}
                          onChange={handleLeadChange} placeholder="Nhập số CCCD hoặc hộ chiếu"
                          required />
                      </div>
                    </div>
                  </div>

                  {/* Thông tin liên lạc */}
                  <div className="fco-panel">
                    <h2 className="fco-panel-title">
                      <span className="material-symbols-outlined">contact_mail</span>
                      Thông Tin Liên Lạc
                    </h2>
                    <div className="fco-grid-2">
                      <div className="fco-field">
                        <label>Email</label>
                        <input type="email" name="email" value={leadPassenger.email}
                          onChange={handleLeadChange} placeholder="email@example.com" required />
                        <small>Vé điện tử sẽ được gửi đến đây</small>
                      </div>
                      <div className="fco-field">
                        <label>Số điện thoại</label>
                        <input name="phone" value={leadPassenger.phone}
                          onChange={handleLeadChange} placeholder="+84 0xx xxx xxxx" required />
                      </div>
                    </div>
                  </div>

                  {/* Hành khách bổ sung */}
                  {extraPassengers.map((p, i) => (
                    <div key={i} className="fco-panel">
                      <h2 className="fco-panel-title">
                        <span className="material-symbols-outlined">person_add</span>
                        Hành Khách {i + 2}
                      </h2>
                      <div className="fco-grid-2">
                        <div className="fco-field">
                          <label>Họ</label>
                          <input name="lastName" value={p.lastName}
                            onChange={(e) => handleExtraChange(i, e)}
                            placeholder="vd. Trần" required />
                        </div>
                        <div className="fco-field">
                          <label>Tên</label>
                          <input name="firstName" value={p.firstName}
                            onChange={(e) => handleExtraChange(i, e)}
                            placeholder="vd. Thị B" required />
                        </div>
                        <div className="fco-field fco-field-full">
                          <label>Số CCCD / Hộ chiếu</label>
                          <input name="idNumber" value={p.idNumber}
                            onChange={(e) => handleExtraChange(i, e)}
                            placeholder="Nhập số CCCD hoặc hộ chiếu" required />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="submit"
                    className="fco-next-btn"
                  >
                    Tiếp Theo: Thanh Toán
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </Button>
                </>
              )}

              {/* ── STEP 2: Thanh toán ── */}
              {step === 2 && (
                <>
                  <div className="fco-panel">
                    <div className="fco-payment-head">
                      <h2 className="fco-panel-title">
                        <span className="material-symbols-outlined">credit_card</span>
                        Thông Tin Thanh Toán
                      </h2>
                      <div className="fco-card-brands">
                        <span>VISA</span>
                        <span>MC</span>
                        <span>JCB</span>
                      </div>
                    </div>

                    <div className="fco-field">
                      <label>Tên chủ thẻ</label>
                      <input name="cardholderName" value={payment.cardholderName}
                        onChange={handlePaymentChange} placeholder="Tên như trên thẻ" required />
                    </div>

                    <div className="fco-field">
                      <label>Số thẻ</label>
                      <div className="fco-card-input">
                        <input name="cardNumber" value={payment.cardNumber}
                          onChange={handlePaymentChange}
                          placeholder="0000 0000 0000 0000" required />
                        <span className="material-symbols-outlined">credit_card</span>
                      </div>
                    </div>

                    <div className="fco-grid-2">
                      <div className="fco-field">
                        <label>Ngày hết hạn</label>
                        <input name="expiryDate" value={payment.expiryDate}
                          onChange={handlePaymentChange} placeholder="MM/YY" required />
                      </div>
                      <div className="fco-field">
                        <label>CVV</label>
                        <input name="cvv" value={payment.cvv}
                          onChange={handlePaymentChange} placeholder="123" required />
                      </div>
                    </div>

                    <label className="fco-policy-box" htmlFor="acceptedTerms">
                      <input
                        id="acceptedTerms" name="acceptedTerms" type="checkbox"
                        checked={payment.acceptedTerms} onChange={handlePaymentChange}
                        required
                      />
                      <span>
                        Tôi đồng ý với{' '}
                        <Link to="/">Điều Khoản & Điều Kiện</Link> và{' '}
                        <Link to="/">Chính Sách Bảo Mật</Link> của GOCHIP.
                      </span>
                    </label>
                  </div>

                  <div className="fco-step-nav">
                    <button type="button" className="fco-back-btn" onClick={() => setStep(1)}>
                      <span className="material-symbols-outlined">arrow_back</span>
                      Quay lại
                    </button>
                    <Button type="submit" className="fco-confirm-btn">
                      <span className="material-symbols-outlined">check_circle</span>
                      Xác Nhận & Thanh Toán
                    </Button>
                  </div>

                  <div className="fco-trust-row">
                    <div><span className="material-symbols-outlined">verified_user</span><span>Kết nối SSL</span></div>
                    <div><span className="material-symbols-outlined">security</span><span>Bảo mật 3D Secure</span></div>
                    <div><span className="material-symbols-outlined">shield</span><span>Thanh toán được bảo vệ</span></div>
                  </div>
                </>
              )}
            </form>
        </main>

        {/* ── RIGHT COLUMN: Summary ── */}
        <aside className="fco-sidebar">
          {/* Flight Summary Card */}
          <div className="fco-summary-card">
            <div className="fco-summary-header">
              <div className="fco-summary-airline">
                <div className="fco-summary-logo">{flight.logo}</div>
                <div>
                  <p className="fco-summary-airline-name">{flight.airline}</p>
                  <p className="fco-summary-class">{classBadge} · {flight.aircraft}</p>
                </div>
              </div>
            </div>

            <div className="fco-summary-route">
              <div className="fco-summary-endpoint">
                <span className="fco-summary-time">{flight.departTime}</span>
                <span className="fco-summary-code">{flight.fromCode}</span>
                <span className="fco-summary-city">{flight.from}</span>
                <span className="fco-summary-airport">{flight.fromAirport}</span>
              </div>
              <div className="fco-summary-middle">
                <span className="fco-summary-duration">{flight.duration}</span>
                <div className="fco-summary-line">
                  <span className="material-symbols-outlined">flight</span>
                </div>
                <span className="fco-summary-stops">
                  {flight.stops === 0 ? 'Bay thẳng' : `${flight.stops} điểm dừng`}
                </span>
              </div>
              <div className="fco-summary-endpoint fco-summary-right">
                <span className="fco-summary-time">{flight.arriveTime}</span>
                <span className="fco-summary-code">{flight.toCode}</span>
                <span className="fco-summary-city">{flight.to}</span>
                <span className="fco-summary-airport">{flight.toAirport}</span>
              </div>
            </div>

            <div className="fco-summary-meta">
              <div>
                <span className="material-symbols-outlined">calendar_today</span>
                <span>{formatFlightDate(departDate)}</span>
              </div>
              <div>
                <span className="material-symbols-outlined">group</span>
                <span>{passengers} hành khách</span>
              </div>
              <div>
                <span className="material-symbols-outlined">work</span>
                <span>{isBusinessClass ? flight.businessBaggage : flight.baggage}</span>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="fco-price-card">
            <h4>Chi Tiết Giá</h4>
            <div className="fco-price-row">
              <span>Giá vé ({classBadge}) × {passengers}</span>
              <span>{formatPrice(baseFare)}₫</span>
            </div>
            <div className="fco-price-row">
              <span>Thuế & phí sân bay</span>
              <span>{formatPrice(taxes)}₫</span>
            </div>
            <div className="fco-price-row">
              <span>Phí dịch vụ</span>
              <span>{formatPrice(serviceFee)}₫</span>
            </div>
            <div className="fco-total-row">
              <div>
                <strong>Tổng Cộng</strong>
                <small>Đã bao gồm VAT</small>
              </div>
              <span className="fco-total-amount">{formatPrice(total)}₫</span>
            </div>
          </div>

          {/* Policy note */}
          <div className="fco-policy-note">
            <span className="material-symbols-outlined">info</span>
            <p>Vé có thể hoàn/đổi theo chính sách của hãng hàng không. Kiểm tra trước khi đặt.</p>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="fco-footer">
        <div className="fco-footer-brand">GOCHIP</div>
        <p>© 2024 GOCHIP. Bảo lưu mọi quyền.</p>
        <div className="fco-footer-links">
          <Link to="/">Về Chúng Tôi</Link>
          <Link to="/">Chính Sách Bảo Mật</Link>
          <Link to="/">Điều Khoản</Link>
        </div>
      </footer>
    </div>
  )
}
