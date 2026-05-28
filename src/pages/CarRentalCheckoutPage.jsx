import { useMemo, useState } from 'react'
import { Alert, Button, Container, Form } from 'react-bootstrap'
import { useSearchParams, Navigate, useParams } from 'react-router-dom'
import mockCars from '../data/mockCars'
import { readSession } from '../utils/authSession'

function formatMoney(value) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function getRentalDays(pickupAt, dropoffAt) {
  const pickup = new Date(pickupAt)
  const dropoff = new Date(dropoffAt)
  const milliseconds = dropoff.getTime() - pickup.getTime()
  const days = Math.ceil(milliseconds / (1000 * 60 * 60 * 24))
  return days > 0 ? days : 1
}

function formatDateTimeLabel(value) {
  const date = new Date(value)

  return new Intl.DateTimeFormat('en-US', {
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
    title: 'Full Insurance Coverage',
    subtitle: 'Zero excess and theft protection',
    pricePerDay: 15,
    icon: 'shield',
  },
  {
    id: 'gps',
    title: 'GPS Navigation System',
    subtitle: 'Pre-loaded local maps',
    pricePerDay: 8,
    icon: 'map',
  },
  {
    id: 'child-seat',
    title: 'Child Safety Seat',
    subtitle: 'ISOFIX compatible, age 2-7',
    pricePerDay: 12,
    icon: 'sentiment_satisfied',
  },
]

function CarRentalCheckoutPage() {
  const { carId } = useParams()
  const [searchParams] = useSearchParams()
  const session = useMemo(() => readSession(), [])

  const car = mockCars.find((item) => item.id === carId)

  const pickupAt = searchParams.get('pickupAt') || '2026-05-22T10:00'
  const dropoffAt = searchParams.get('dropoffAt') || '2026-05-25T10:00'
  const location = searchParams.get('location') || `${car?.city || 'London'}, ${car?.country || 'United Kingdom'}`
  const rentalDays = getRentalDays(pickupAt, dropoffAt)
  const initialName = splitFullName(session?.fullName)

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
  const [submitted, setSubmitted] = useState(false)

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
    setSubmitted(true)
  }

  return (
    <Container className="page-section car-checkout-page">
      <div className="car-checkout-stepper">
        <div className="car-checkout-step is-active">
          <span>1</span>
          <strong>Details</strong>
        </div>
        <span className="car-checkout-step-line"></span>
        <div className="car-checkout-step is-current">
          <span>2</span>
          <strong>Payment</strong>
        </div>
        <span className="car-checkout-step-line"></span>
        <div className="car-checkout-step">
          <span>3</span>
          <strong>Confirmation</strong>
        </div>
      </div>

      <div className="car-checkout-layout">
        <section className="car-checkout-main">
          {submitted && (
            <Alert variant="success" className="mb-4">
              Car rental booking confirmed for {car.name}. This is a mock checkout flow.
            </Alert>
          )}

          <Form id="car-rental-checkout-form" onSubmit={handleSubmit} className="car-checkout-form">
            <div className="car-checkout-panel">
              <h2>
                <span className="material-symbols-outlined">person</span>
                Primary Driver Details
              </h2>

              <div className="car-checkout-grid">
                <div className="car-checkout-field">
                  <label htmlFor="driver-first-name">First name</label>
                  <input
                    id="driver-first-name"
                    name="firstName"
                    value={formValues.firstName}
                    onChange={handleFieldChange}
                    placeholder="e.g. John"
                    required
                  />
                </div>
                <div className="car-checkout-field">
                  <label htmlFor="driver-last-name">Last name</label>
                  <input
                    id="driver-last-name"
                    name="lastName"
                    value={formValues.lastName}
                    onChange={handleFieldChange}
                    placeholder="e.g. Smith"
                    required
                  />
                </div>
                <div className="car-checkout-field">
                  <label htmlFor="driver-email">Email address</label>
                  <input
                    id="driver-email"
                    name="email"
                    type="email"
                    value={formValues.email}
                    onChange={handleFieldChange}
                    placeholder="john.smith@example.com"
                    required
                  />
                </div>
                <div className="car-checkout-field">
                  <label htmlFor="driver-phone">Phone number</label>
                  <input
                    id="driver-phone"
                    name="phone"
                    value={formValues.phone}
                    onChange={handleFieldChange}
                    placeholder="+1 234 567 8900"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="car-checkout-panel">
              <h2>
                <span className="material-symbols-outlined">add_circle</span>
                Optional Extras
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
                      <div className="car-extra-price">+${formatMoney(extra.pricePerDay)} / day</div>
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
                  Payment Information
                </h2>
                <div className="car-checkout-cards">
                  <span>VISA</span>
                  <span>MC</span>
                </div>
              </div>

              <div className="car-checkout-field">
                <label htmlFor="cardholder-name">Cardholder name</label>
                <input
                  id="cardholder-name"
                  name="cardholderName"
                  value={formValues.cardholderName}
                  onChange={handleFieldChange}
                  placeholder="As written on card"
                  required
                />
              </div>

              <div className="car-checkout-field">
                <label htmlFor="card-number">Card number</label>
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
                  <label htmlFor="expiry-date">Expiry date</label>
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
                  {car.seats} Seats
                </span>
                <span>
                  <span className="material-symbols-outlined">work</span>
                  {car.bags} Bags
                </span>
                <span>
                  <span className="material-symbols-outlined">ac_unit</span>
                  A/C
                </span>
              </div>

              <div className="car-checkout-summary-locations">
                <div>
                  <span className="material-symbols-outlined is-blue">location_on</span>
                  <div>
                    <strong>Pick-up</strong>
                    <p>{location}</p>
                    <p>{formatDateTimeLabel(pickupAt)}</p>
                  </div>
                </div>
                <div>
                  <span className="material-symbols-outlined is-red">location_on</span>
                  <div>
                    <strong>Drop-off</strong>
                    <p>{location}</p>
                    <p>{formatDateTimeLabel(dropoffAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="car-checkout-pricing-card">
            <h4>Price Breakdown</h4>
            <div className="car-checkout-price-row">
              <span>Rental price ({rentalDays} days)</span>
              <strong>${formatMoney(rentalPrice)}</strong>
            </div>
            <div className="car-checkout-price-row">
              <span>Taxes & Fees</span>
              <strong>${formatMoney(taxesAndFees)}</strong>
            </div>
            <div className="car-checkout-price-row">
              <span>Airport Surcharge</span>
              <strong>${formatMoney(airportSurcharge)}</strong>
            </div>
            {extrasTotal > 0 && (
              <div className="car-checkout-price-row">
                <span>Selected Extras</span>
                <strong>${formatMoney(extrasTotal)}</strong>
              </div>
            )}
            <div className="car-checkout-total-row">
              <div>
                <strong>Total Price</strong>
                <small>Includes all taxes & fees</small>
              </div>
              <span>${formatMoney(totalPrice)}</span>
            </div>

            <Button type="submit" form="car-rental-checkout-form" className="car-checkout-confirm-button">
              Confirm Booking
            </Button>

            <div className="car-checkout-guarantees">
              <div>
                <span className="material-symbols-outlined is-green">verified_user</span>
                <span>SSL secured payment gateway</span>
              </div>
              <div>
                <span className="material-symbols-outlined">handyman</span>
                <span>No hidden booking fees</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  )
}

export default CarRentalCheckoutPage
