import { useMemo, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { useSearchParams, Navigate, useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import mockCars from '../data/mockCars'
import { readSession } from '../utils/authSession'
import { addBooking } from '../features/bookings/bookingsSlice'
import { useToast } from '../context/toastState'
import {
  convertBasePriceToVnd,
  formatBasePriceToVndCurrency,
  formatVndCurrency,
} from '../utils/currency'

function getRentalDays(pickupAt, dropoffAt) {
  const pickup = new Date(pickupAt)
  const dropoff = new Date(dropoffAt)
  const milliseconds = dropoff.getTime() - pickup.getTime()
  const days = Math.ceil(milliseconds / (1000 * 60 * 60 * 24))
  return days > 0 ? days : 1
}

function formatDateTimeLabel(value) {
  const date = new Date(value)

  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
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

const optionalExtras = [
  {
    id: 'insurance',
    title: 'Bảo Hiểm Toàn Diện',
    subtitle: 'Không mức miễn thường và bảo vệ chống trộm',
    pricePerDay: 15,
    icon: 'shield',
  },
  {
    id: 'gps',
    title: 'Hệ Thống Định Vị GPS',
    subtitle: 'Bản đồ địa phương được tải sẵn',
    pricePerDay: 8,
    icon: 'map',
  },
  {
    id: 'child-seat',
    title: 'Ghế An Toàn Trẻ Em',
    subtitle: 'Tương thích ISOFIX, trẻ 2-7 tuổi',
    pricePerDay: 12,
    icon: 'sentiment_satisfied',
  },
]

function CarRentalCheckoutPage() {
  const { carId } = useParams()
  const [searchParams] = useSearchParams()
  const session = useMemo(() => readSession(), [])
  const navigate = useNavigate()

  const car = mockCars.find((item) => item.id === carId)

  const pickupAt = searchParams.get('pickupAt') || '2026-05-22T10:00'
  const dropoffAt = searchParams.get('dropoffAt') || '2026-05-25T10:00'
  const location = searchParams.get('location') || `${car?.city || 'London'}, ${car?.country || 'United Kingdom'}`
  const rentalDays = getRentalDays(pickupAt, dropoffAt)
  const initialName = splitFullName(session?.fullName)

  const dispatch = useDispatch()
  const showToast = useToast()
  const [formValues, setFormValues] = useState({
    firstName: initialName.firstName,
    lastName: initialName.lastName,
    email: session?.email || '',
    phone: '',
    cardholderName: session?.fullName || '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  })
  const [selectedExtras, setSelectedExtras] = useState([])

  if (!session) {
    return <Navigate to="/auth" replace />
  }

  if (!car) {
    return <Navigate to="/search?tab=car-rentals" replace />
  }

  const extrasTotal = optionalExtras
    .filter((extra) => selectedExtras.includes(extra.id))
    .reduce((sum, extra) => sum + extra.pricePerDay * rentalDays, 0)
  const rentalPrice = car.dailyPrice * rentalDays
  const taxesAndFees = Number((rentalPrice * 0.18).toFixed(2))
  const airportSurcharge = 15
  const totalPrice = rentalPrice + taxesAndFees + airportSurcharge + extrasTotal
  const rentalPriceVnd = convertBasePriceToVnd(rentalPrice)
  const taxesAndFeesVnd = convertBasePriceToVnd(taxesAndFees)
  const airportSurchargeVnd = convertBasePriceToVnd(airportSurcharge)
  const extrasTotalVnd = convertBasePriceToVnd(extrasTotal)
  const totalPriceVnd = convertBasePriceToVnd(totalPrice)

  const handleFieldChange = (event) => {
    const { name, value } = event.target
    setFormValues((current) => ({ ...current, [name]: value }))
  }

  const toggleExtra = (extraId) => {
    setSelectedExtras((current) =>
      current.includes(extraId)
        ? current.filter((item) => item !== extraId)
        : [...current, extraId],
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (new Date(pickupAt).getTime() < Date.now()) {
      showToast('Ngày nhận xe không thể là thời gian trong quá khứ', 'danger')
      return
    }
    if (new Date(dropoffAt).getTime() <= new Date(pickupAt).getTime()) {
      showToast('Ngày trả xe phải sau ngày nhận xe', 'danger')
      return
    }
    const booking = dispatch(addBooking({
      type: 'car',
      title: car.name,
      subtitle: `${car.subtitle} · ${location}`,
      image: car.image,
      total: totalPriceVnd,
      currency: 'VND',
      details: {
        'Địa điểm': location,
        'Nhận xe': formatDateTimeLabel(pickupAt),
        'Trả xe': formatDateTimeLabel(dropoffAt),
        'Số ngày': `${rentalDays} ngày`,
      },
    }))
    const bookingId = booking.payload.id
    showToast(`Đặt xe thành công! Mã đặt chỗ: #${bookingId.slice(-6).toUpperCase()}`, 'success', 5000)
    navigate(`/booking-confirmation/${bookingId}`, { replace: true })
  }

  return (
    <Container className="page-section car-checkout-page">
      <button
        type="button"
        className="car-checkout-back-btn"
        onClick={() => navigate(-1)}
      >
        <span className="material-symbols-outlined">arrow_back</span>
        Quay lại
      </button>
      <div className="car-checkout-stepper">
        <div className="car-checkout-step is-active">
          <span>1</span>
          <strong>Chi Tiết</strong>
        </div>
        <span className="car-checkout-step-line"></span>
        <div className="car-checkout-step is-current">
          <span>2</span>
          <strong>Thanh Toán</strong>
        </div>
        <span className="car-checkout-step-line"></span>
        <div className="car-checkout-step">
          <span>3</span>
          <strong>Xác Nhận</strong>
        </div>
      </div>

      <div className="car-checkout-layout">
        <section className="car-checkout-main">


          <Form id="car-rental-checkout-form" onSubmit={handleSubmit} className="car-checkout-form">
            <div className="car-checkout-panel">
              <h2>
                <span className="material-symbols-outlined">person</span>
                Thông Tin Tài Xế Chính
              </h2>

              <div className="car-checkout-grid">
                <div className="car-checkout-field">
                  <label htmlFor="driver-first-name">Tên</label>
                  <input
                    id="driver-first-name"
                    name="firstName"
                    value={formValues.firstName}
                    onChange={handleFieldChange}
                    placeholder="vd. Văn A"
                    required
                  />
                </div>
                <div className="car-checkout-field">
                  <label htmlFor="driver-last-name">Họ</label>
                  <input
                    id="driver-last-name"
                    name="lastName"
                    value={formValues.lastName}
                    onChange={handleFieldChange}
                    placeholder="vd. Nguyễn"
                    required
                  />
                </div>
                <div className="car-checkout-field">
                  <label htmlFor="driver-email">Địa chỉ email</label>
                  <input
                    id="driver-email"
                    name="email"
                    type="email"
                    value={formValues.email}
                    onChange={handleFieldChange}
                    placeholder="nguyenvana@example.com"
                    required
                  />
                </div>
                <div className="car-checkout-field">
                  <label htmlFor="driver-phone">Số điện thoại</label>
                  <input
                    id="driver-phone"
                    name="phone"
                    value={formValues.phone}
                    onChange={handleFieldChange}
                    placeholder="+84 0 000 000 000"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="car-checkout-panel">
              <h2>
                <span className="material-symbols-outlined">add_circle</span>
                Dịch Vụ Tùy Chọn
              </h2>

              <div className="car-checkout-extras">
                {optionalExtras.map((extra) => {
                  const isSelected = selectedExtras.includes(extra.id)

                  return (
                    <button
                      key={extra.id}
                      type="button"
                      className={`car-extra-card${isSelected ? ' is-selected' : ''}`}
                      onClick={() => toggleExtra(extra.id)}
                    >
                      <div className="car-extra-icon">
                        <span className="material-symbols-outlined">{extra.icon}</span>
                      </div>
                      <div className="car-extra-copy">
                        <strong>{extra.title}</strong>
                        <span>{extra.subtitle}</span>
                      </div>
                      <div className="car-extra-price">+{formatBasePriceToVndCurrency(extra.pricePerDay)} / ngày</div>
                      <span className="car-extra-toggle"></span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="car-checkout-panel">
              <div className="car-checkout-panel-head">
                <h2>
                  <span className="material-symbols-outlined">credit_card</span>
                  Thông Tin Thanh Toán
                </h2>
                <div className="car-checkout-cards">
                  <span>VISA</span>
                  <span>MC</span>
                </div>
              </div>

              <div className="car-checkout-field">
                <label htmlFor="cardholder-name">Tên chủ thẻ</label>
                <input
                  id="cardholder-name"
                  name="cardholderName"
                  value={formValues.cardholderName}
                  onChange={handleFieldChange}
                  placeholder="Tên như trên thẻ"
                  required
                />
              </div>

              <div className="car-checkout-field">
                <label htmlFor="card-number">Số thẻ</label>
                <div className="car-checkout-card-input">
                  <input
                    id="card-number"
                    name="cardNumber"
                    value={formValues.cardNumber}
                    onChange={handleFieldChange}
                    placeholder="0000 0000 0000 0000"
                    required
                  />
                  <span className="material-symbols-outlined">lock</span>
                </div>
              </div>

              <div className="car-checkout-grid car-checkout-grid-tight">
                <div className="car-checkout-field">
                  <label htmlFor="expiry-date">Ngày hết hạn</label>
                  <input
                    id="expiry-date"
                    name="expiryDate"
                    value={formValues.expiryDate}
                    onChange={handleFieldChange}
                    placeholder="MM / YY"
                    required
                  />
                </div>
                <div className="car-checkout-field">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    id="cvv"
                    name="cvv"
                    value={formValues.cvv}
                    onChange={handleFieldChange}
                    placeholder="123"
                    required
                  />
                </div>
              </div>
            </div>
          </Form>
        </section>

        <aside className="car-checkout-sidebar">
          <div className="car-checkout-summary-card">
            <div className="car-checkout-summary-visual">
              <img src={car.image} alt={car.name} />
              <span className="car-checkout-transmission-pill">{car.transmission}</span>
            </div>

            <div className="car-checkout-summary-body">
              <div className="car-checkout-summary-head">
                <h3>{car.name}</h3>
                <p>{car.subtitle.replace(' | ', ' ')}</p>
              </div>

              <div className="car-checkout-summary-specs">
                <span>
                  <span className="material-symbols-outlined">person</span>
                  {car.seats} Chỗ Ngồi
                </span>
                <span>
                  <span className="material-symbols-outlined">work</span>
                  {car.bags} Túi
                </span>
                <span>
                  <span className="material-symbols-outlined">ac_unit</span>
                  Điều Hòa
                </span>
              </div>

              <div className="car-checkout-summary-locations">
                <div>
                  <span className="material-symbols-outlined is-blue">location_on</span>
                  <div>
                    <strong>Nhận Xe</strong>
                    <p>{location}</p>
                    <p>{formatDateTimeLabel(pickupAt)}</p>
                  </div>
                </div>
                <div>
                  <span className="material-symbols-outlined is-red">location_on</span>
                  <div>
                    <strong>Trả Xe</strong>
                    <p>{location}</p>
                    <p>{formatDateTimeLabel(dropoffAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="car-checkout-pricing-card">
            <h4>Chi Tiết Giá</h4>
            <div className="car-checkout-price-row">
              <span>Giá thuê xe ({rentalDays} ngày)</span>
              <strong>{formatVndCurrency(rentalPriceVnd)}</strong>
            </div>
            <div className="car-checkout-price-row">
              <span>Thuế & Phí</span>
              <strong>{formatVndCurrency(taxesAndFeesVnd)}</strong>
            </div>
            <div className="car-checkout-price-row">
              <span>Phụ Phí Sân Bay</span>
              <strong>{formatVndCurrency(airportSurchargeVnd)}</strong>
            </div>
            {extrasTotal > 0 && (
              <div className="car-checkout-price-row">
                <span>Dịch Vụ Đã Chọn</span>
                <strong>{formatVndCurrency(extrasTotalVnd)}</strong>
              </div>
            )}
            <div className="car-checkout-total-row">
              <div>
                <strong>Tổng Giá</strong>
                <small>Đã bao gồm tất cả thuế & phí</small>
              </div>
              <span>{formatVndCurrency(totalPriceVnd)}</span>
            </div>

            <Button type="submit" form="car-rental-checkout-form" className="car-checkout-confirm-button">
              Xác Nhận Đặt Chỗ
            </Button>

            <div className="car-checkout-guarantees">
              <div>
                <span className="material-symbols-outlined is-green">verified_user</span>
                <span>Cổng thanh toán SSL an toàn</span>
              </div>
              <div>
                <span className="material-symbols-outlined">handyman</span>
                <span>Không có phí ẩn khi đặt chỗ</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  )
}

export default CarRentalCheckoutPage
