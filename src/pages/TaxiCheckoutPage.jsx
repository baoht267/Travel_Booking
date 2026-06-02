import { useMemo, useState } from 'react'
import { Button } from 'react-bootstrap'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import mockTaxis from '../data/mockTaxis'
import { readSession } from '../utils/authSession'
import { addBooking } from '../features/bookings/bookingsSlice'
import { useToast } from '../context/toastState'

function formatPrice(value) {
  return new Intl.NumberFormat('vi-VN').format(value)
}

function formatDatetime(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(value))
}

function splitFullName(fullName) {
  const parts = (fullName?.trim() || '').split(/\s+/)
  return { firstName: parts.slice(0, -1).join(' ') || parts[0] || '', lastName: parts.at(-1) || '' }
}

export default function TaxiCheckoutPage() {
  const { taxiId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const session = useMemo(() => readSession(), [])
  const dispatch = useDispatch()
  const showToast = useToast()

  const taxi = mockTaxis.find((t) => t.id === taxiId)

  const direction = searchParams.get('direction') || 'arrival'
  const destination = searchParams.get('destination') || taxi?.destination || ''
  const datetime = searchParams.get('datetime') || ''
  const passengers = Number(searchParams.get('passengers') || 1)
  const luggage = Number(searchParams.get('luggage') || 1)

  const initial = splitFullName(session?.fullName)
  const [step, setStep] = useState(1)

  const [contact, setContact] = useState({
    firstName: initial.firstName,
    lastName: initial.lastName,
    email: session?.email || '',
    phone: '',
    flightNumber: '',
    requests: '',
  })

  const [payment, setPayment] = useState({
    cardholderName: session?.fullName || '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    acceptedTerms: false,
  })

  if (!session) return <Navigate to="/auth" replace />
  if (!taxi) return <Navigate to="/search?tab=airport-taxis" replace />

  const meetFee = 50000
  const total = taxi.price + meetFee

  const handleContact = (e) => {
    const { name, value } = e.target
    setContact((p) => ({ ...p, [name]: value }))
  }

  const handlePayment = (e) => {
    const { name, value, type, checked } = e.target
    setPayment((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  const dirLabel = direction === 'arrival' ? 'Từ sân bay' : 'Đến sân bay'
  const pickupLabel = direction === 'arrival' ? taxi.airportName : destination
  const dropLabel = direction === 'arrival' ? destination : taxi.airportName

  const handleSubmit = (e) => {
    e.preventDefault()
    if (step === 1) {
      if (!destination.trim()) {
        showToast('Vui lòng nhập điểm đến hoặc điểm đón', 'danger')
        return
      }
      if (datetime && new Date(datetime).getTime() < Date.now()) {
        showToast('Thời gian đón taxi không thể là thời gian trong quá khứ', 'danger')
        return
      }
      setStep(2)
      return
    }
    const booking = dispatch(addBooking({
      type: 'taxi',
      title: taxi.carModel,
      subtitle: `${taxi.provider} · ${dirLabel}`,
      image: taxi.image,
      total,
      currency: 'VND',
      details: {
        'Lộ trình': `${pickupLabel} → ${dropLabel || '—'}`,
        'Thời gian': datetime ? formatDatetime(datetime) : '—',
        'Hành khách': `${passengers} khách · ${luggage} kiện`,
        'Xe': taxi.type,
      },
    }))
    const bookingId = booking.payload.id
    showToast(`Đặt taxi thành công! Mã đặt chỗ: #${bookingId.slice(-6).toUpperCase()}`, 'success', 5000)
    navigate(`/booking-confirmation/${bookingId}`, { replace: true })
  }

  return (
    <div className="tco-page">
      {/* Header */}
      <header className="tco-header">
        <div className="tco-header-inner">
          <button type="button" className="tco-back-btn-header" onClick={() => navigate(-1)}>
            <span className="material-symbols-outlined">arrow_back</span>
            Quay lại
          </button>
          <Link to="/" className="tco-brand">GOCHIP</Link>
          <div className="tco-header-secure">
            <span className="material-symbols-outlined">lock</span>
            Thanh Toán An Toàn
          </div>
        </div>
      </header>

      {/* Stepper */}
      <div className="tco-stepper-wrap">
        <div className="tco-stepper">
          {[
            { n: 1, label: 'Chi Tiết' },
            { n: 2, label: 'Thanh Toán' },
            { n: 3, label: 'Xác Nhận' },
          ].map(({ n, label }, i, arr) => (
            <div key={n} className="tco-step-group">
              <div className={`tco-step${step >= n ? ' is-done' : ''}${step === n ? ' is-current' : ''}`}>
                <span className="tco-step-badge">
                  {step > n
                    ? <span className="material-symbols-outlined" style={{ fontSize: 15 }}>check</span>
                    : n}
                </span>
                <span className="tco-step-label">{label}</span>
              </div>
              {i < arr.length - 1 && <span className="tco-step-line" />}
            </div>
          ))}
        </div>
      </div>

      <div className="tco-layout">
        {/* ── MAIN ── */}
        <main className="tco-main">
          <form onSubmit={handleSubmit}>
              {step === 1 && (
                <>
                  {/* Contact info */}
                  <div className="tco-panel">
                    <h2 className="tco-panel-title">
                      <span className="material-symbols-outlined">person</span>
                      Thông Tin Liên Lạc
                    </h2>
                    <div className="tco-grid">
                      <div className="tco-field">
                        <label>Họ</label>
                        <input name="lastName" value={contact.lastName}
                          onChange={handleContact} placeholder="vd. Nguyễn" required />
                      </div>
                      <div className="tco-field">
                        <label>Tên</label>
                        <input name="firstName" value={contact.firstName}
                          onChange={handleContact} placeholder="vd. Văn A" required />
                      </div>
                      <div className="tco-field">
                        <label>Email</label>
                        <input type="email" name="email" value={contact.email}
                          onChange={handleContact} placeholder="email@example.com" required />
                        <small>Xác nhận sẽ được gửi đến đây</small>
                      </div>
                      <div className="tco-field">
                        <label>Số điện thoại</label>
                        <input name="phone" value={contact.phone}
                          onChange={handleContact} placeholder="+84 0xx xxx xxxx" required />
                      </div>
                    </div>
                  </div>

                  {/* Flight info */}
                  <div className="tco-panel">
                    <h2 className="tco-panel-title">
                      <span className="material-symbols-outlined">flight</span>
                      Thông Tin Chuyến Bay
                    </h2>
                    <p className="tco-panel-hint">
                      Cung cấp số hiệu chuyến bay để lái xe theo dõi và điều chỉnh giờ đón nếu chuyến bay bị trễ.
                    </p>
                    <div className="tco-grid">
                      <div className="tco-field">
                        <label>Số hiệu chuyến bay <span className="tco-optional">(tùy chọn)</span></label>
                        <div className="tco-input-icon-wrap">
                          <span className="material-symbols-outlined">flight</span>
                          <input name="flightNumber" value={contact.flightNumber}
                            onChange={handleContact} placeholder="vd. VN123" />
                        </div>
                      </div>
                      <div className="tco-field">
                        <label>Yêu cầu đặc biệt <span className="tco-optional">(tùy chọn)</span></label>
                        <input name="requests" value={contact.requests}
                          onChange={handleContact}
                          placeholder="Ghế trẻ em, xe lăn, v.v." />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="tco-next-btn">
                    Tiếp Theo: Thanh Toán
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </Button>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="tco-panel">
                    <div className="tco-payment-head">
                      <h2 className="tco-panel-title">
                        <span className="material-symbols-outlined">credit_card</span>
                        Thanh Toán
                      </h2>
                      <div className="tco-card-brands">
                        <span>VISA</span><span>MC</span><span>JCB</span>
                      </div>
                    </div>

                    <div className="tco-field">
                      <label>Tên chủ thẻ</label>
                      <input name="cardholderName" value={payment.cardholderName}
                        onChange={handlePayment} placeholder="Tên như trên thẻ" required />
                    </div>

                    <div className="tco-field">
                      <label>Số thẻ</label>
                      <div className="tco-card-input">
                        <input name="cardNumber" value={payment.cardNumber}
                          onChange={handlePayment} placeholder="0000 0000 0000 0000" required />
                        <span className="material-symbols-outlined">credit_card</span>
                      </div>
                    </div>

                    <div className="tco-grid">
                      <div className="tco-field">
                        <label>Ngày hết hạn</label>
                        <input name="expiryDate" value={payment.expiryDate}
                          onChange={handlePayment} placeholder="MM/YY" required />
                      </div>
                      <div className="tco-field">
                        <label>CVV</label>
                        <input name="cvv" value={payment.cvv}
                          onChange={handlePayment} placeholder="123" required />
                      </div>
                    </div>

                    <label className="tco-policy-box" htmlFor="tco-terms">
                      <input id="tco-terms" name="acceptedTerms" type="checkbox"
                        checked={payment.acceptedTerms} onChange={handlePayment} required />
                      <span>
                        Tôi đồng ý với <Link to="/">Điều Khoản</Link> và{' '}
                        <Link to="/">Chính Sách Hủy</Link> của GOCHIP.
                      </span>
                    </label>
                  </div>

                  <div className="tco-step-nav">
                    <button type="button" className="tco-back-btn" onClick={() => setStep(1)}>
                      <span className="material-symbols-outlined">arrow_back</span>
                      Quay lại
                    </button>
                    <Button type="submit" className="tco-confirm-btn">
                      <span className="material-symbols-outlined">check_circle</span>
                      Xác Nhận Đặt Xe
                    </Button>
                  </div>

                  <div className="tco-trust-row">
                    <div><span className="material-symbols-outlined">verified_user</span><span>SSL Secured</span></div>
                    <div><span className="material-symbols-outlined">shield</span><span>Thanh toán bảo vệ</span></div>
                    <div><span className="material-symbols-outlined">support_agent</span><span>Hỗ trợ 24/7</span></div>
                  </div>
                </>
              )}
            </form>
        </main>

        {/* ── SIDEBAR ── */}
        <aside className="tco-sidebar">
          {/* Vehicle card */}
          <div className="tco-summary-card">
            <div className="tco-summary-media">
              <img src={taxi.image} alt={taxi.carModel} />
              <div className="tco-summary-overlay" />
              <div className="tco-summary-type">
                <span className="material-symbols-outlined">{taxi.typeIcon}</span>
                {taxi.type}
              </div>
            </div>

            <div className="tco-summary-body">
              <h3 className="tco-summary-car">{taxi.carModel}</h3>
              <p className="tco-summary-provider">{taxi.provider}</p>

              {/* Route */}
              <div className="tco-route">
                <div className="tco-route-point tco-route-from">
                  <span className="tco-route-dot tco-dot-green" />
                  <div>
                    <p className="tco-route-label">Đón</p>
                    <p className="tco-route-place">{pickupLabel}</p>
                  </div>
                </div>
                <div className="tco-route-line-v" />
                <div className="tco-route-point">
                  <span className="tco-route-dot tco-dot-red" />
                  <div>
                    <p className="tco-route-label">Trả</p>
                    <p className="tco-route-place">{dropLabel || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Meta */}
              <div className="tco-meta-list">
                <div>
                  <span className="material-symbols-outlined">schedule</span>
                  <span>{formatDatetime(datetime)}</span>
                </div>
                <div>
                  <span className="material-symbols-outlined">group</span>
                  <span>{passengers} khách · {luggage} kiện hành lý</span>
                </div>
                <div>
                  <span className="material-symbols-outlined">timer</span>
                  <span>~{taxi.estimatedTime} ({taxi.distance})</span>
                </div>
                <div>
                  <span className="material-symbols-outlined">where_to_vote</span>
                  <span>{taxi.meetingPoint}</span>
                </div>
              </div>

              {/* Included */}
              <div className="tco-included">
                {taxi.features.map((f) => (
                  <span key={f} className="tco-included-tag">
                    <span className="material-symbols-outlined">check</span>
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="tco-price-card">
            <h4>Chi Tiết Giá</h4>
            <div className="tco-price-row">
              <span>Giá xe ({taxi.type})</span>
              <span>{formatPrice(taxi.price)}₫</span>
            </div>
            <div className="tco-price-row">
              <span>Phí đón tại cửa ra</span>
              <span>{formatPrice(meetFee)}₫</span>
            </div>
            <div className="tco-price-total">
              <div>
                <strong>Tổng Cộng</strong>
                <small>Giá cố định, không phụ phí</small>
              </div>
              <span className="tco-total-amount">{formatPrice(total)}₫</span>
            </div>
          </div>

          {/* Cancel policy */}
          <div className="tco-cancel-note">
            <span className="material-symbols-outlined">event_available</span>
            <p>{taxi.cancelPolicy} · Không tính phí thay đổi lịch</p>
          </div>
        </aside>
      </div>

      <footer className="tco-footer">
        <div className="tco-footer-brand">GOCHIP</div>
        <p>© 2024 GOCHIP. Bảo lưu mọi quyền.</p>
        <div className="tco-footer-links">
          <Link to="/">Về Chúng Tôi</Link>
          <Link to="/">Chính Sách Bảo Mật</Link>
          <Link to="/">Điều Khoản</Link>
        </div>
      </footer>
    </div>
  )
}
