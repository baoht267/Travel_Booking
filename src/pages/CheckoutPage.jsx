import { useMemo, useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectAllStays, selectCriteria } from '../features/stays/staysSlice'
import { readSession } from '../utils/authSession'

function toCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value)
}

function formatDateRange(checkIn, checkOut) {
  const format = new Intl.DateTimeFormat('en-US', {
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
  const [submitted, setSubmitted] = useState(false)

  const stay = stays.find((item) => item.id === stayId)

  const initialName = splitFullName(session?.fullName)
  const [formValues, setFormValues] = useState({
    firstName: initialName.firstName,
    lastName: initialName.lastName,
    email: session?.email || '',
    phone: '',
    requests: '',
    cardholderName: session?.fullName || '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    acceptedTerms: false,
  })

  if (!stay) {
    return <Navigate to="/search" replace />
  }

  const nights = getNightCount(criteria.checkIn, criteria.checkOut)
  const basePrice = stay.pricePerNight * nights * criteria.rooms
  const serviceFee = Number((basePrice * 0.05).toFixed(2))
  const taxes = Number((stay.taxesAndFees * nights * criteria.rooms).toFixed(2))
  const discount = nights >= 3 ? Number((basePrice * 0.06).toFixed(2)) : 0
  const total = basePrice + serviceFee + taxes - discount
  const cardLabel = `${stay.propertyType} Booking`

  const handleFieldChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormValues((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <div className="checkout-header-inner">
          <div className="checkout-brand">Global Explorer</div>
          <div className="checkout-security">
            <span className="material-symbols-outlined">lock</span>
            Secure Checkout
          </div>
        </div>
      </header>

      <main className="checkout-main">
        <div className="checkout-stepper">
          <div className="checkout-step is-active">
            <span className="checkout-step-badge">1</span>
            <span>Selection</span>
          </div>
          <span className="checkout-step-line"></span>
          <div className="checkout-step is-current">
            <span className="checkout-step-badge">2</span>
            <span>Details & Payment</span>
          </div>
          <span className="checkout-step-line"></span>
          <div className="checkout-step">
            <span className="checkout-step-badge">3</span>
            <span>Confirmation</span>
          </div>
        </div>

        <div className="checkout-layout">
          <section className="checkout-form-column">
            {submitted && (
              <Alert variant="success" className="checkout-success-alert">
                Booking confirmed for {stay.name}. This is a mock checkout flow.
              </Alert>
            )}

            <Form onSubmit={handleSubmit} className="checkout-form-stack">
              <div className="checkout-panel">
                <h2 className="checkout-panel-title">Enter your details</h2>
                <div className="checkout-form-grid">
                  <div className="checkout-field">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      id="firstName"
                      name="firstName"
                      value={formValues.firstName}
                      onChange={handleFieldChange}
                      placeholder="e.g. John"
                      required
                    />
                  </div>
                  <div className="checkout-field">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      id="lastName"
                      name="lastName"
                      value={formValues.lastName}
                      onChange={handleFieldChange}
                      placeholder="e.g. Doe"
                      required
                    />
                  </div>
                  <div className="checkout-field">
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formValues.email}
                      onChange={handleFieldChange}
                      placeholder="john.doe@example.com"
                      required
                    />
                    <small>Confirmation will be sent here</small>
                  </div>
                  <div className="checkout-field">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      id="phone"
                      name="phone"
                      value={formValues.phone}
                      onChange={handleFieldChange}
                      placeholder="+1 (555) 000-0000"
                      required
                    />
                  </div>
                </div>

                <div className="checkout-field">
                  <label htmlFor="requests">Special Requests (Optional)</label>
                  <textarea
                    id="requests"
                    name="requests"
                    value={formValues.requests}
                    onChange={handleFieldChange}
                    placeholder="Dietary requirements, accessibility needs, etc."
                    rows={4}
                  />
                </div>
              </div>

              <div className="checkout-panel">
                <div className="checkout-payment-head">
                  <h2 className="checkout-panel-title">Secure Payment</h2>
                  <div className="checkout-card-brands">
                    <span>VISA</span>
                    <span>MC</span>
                  </div>
                </div>

                <div className="checkout-field">
                  <label htmlFor="cardholderName">Cardholder Name</label>
                  <input
                    id="cardholderName"
                    name="cardholderName"
                    value={formValues.cardholderName}
                    onChange={handleFieldChange}
                    placeholder="Name as it appears on card"
                    required
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="cardNumber">Card Number</label>
                  <div className="checkout-card-input">
                    <input
                      id="cardNumber"
                      name="cardNumber"
                      value={formValues.cardNumber}
                      onChange={handleFieldChange}
                      placeholder="0000 0000 0000 0000"
                      required
                    />
                    <span className="material-symbols-outlined">credit_card</span>
                  </div>
                </div>

                <div className="checkout-form-grid checkout-form-grid-tight">
                  <div className="checkout-field">
                    <label htmlFor="expiryDate">Expiry Date</label>
                    <input
                      id="expiryDate"
                      name="expiryDate"
                      value={formValues.expiryDate}
                      onChange={handleFieldChange}
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div className="checkout-field">
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

                <label className="checkout-policy-box" htmlFor="acceptedTerms">
                  <input
                    id="acceptedTerms"
                    name="acceptedTerms"
                    type="checkbox"
                    checked={formValues.acceptedTerms}
                    onChange={handleFieldChange}
                    required
                  />
                  <span>
                    I have read and agree to the <Link to="/">Terms & Conditions</Link> and the{' '}
                    <Link to="/">Privacy Policy</Link>.
                  </span>
                </label>
              </div>

              <Button type="submit" className="checkout-confirm-button">
                Confirm Booking
              </Button>
            </Form>

            <div className="checkout-trust-row">
              <div className="checkout-trust-item">
                <span className="material-symbols-outlined is-success">verified_user</span>
                <span>SSL Secured Connection</span>
              </div>
              <div className="checkout-trust-item">
                <span className="material-symbols-outlined is-blue">verified</span>
                <span>Travel Trust Certified</span>
              </div>
              <div className="checkout-trust-item">
                <span className="material-symbols-outlined is-primary">shield</span>
                <span>Payment Protected</span>
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
                      {criteria.guests} Adults
                      {criteria.rooms > 1 ? ` · ${criteria.rooms} Rooms` : ''}
                    </span>
                  </div>
                </div>

                <div className="checkout-price-summary">
                  <h4>Price Summary</h4>
                  <div><span>Base Price</span><span>{toCurrency(basePrice)}</span></div>
                  <div><span>Service Fee</span><span>{toCurrency(serviceFee)}</span></div>
                  <div><span>Taxes & VAT</span><span>{toCurrency(taxes)}</span></div>
                  {discount > 0 && (
                    <div className="checkout-discount-row">
                      <span>Early Bird Discount</span>
                      <span>-{toCurrency(discount)}</span>
                    </div>
                  )}
                </div>

                <div className="checkout-total-row">
                  <div>
                    <strong>Total</strong>
                    <small>All taxes included</small>
                  </div>
                  <span>{toCurrency(total)}</span>
                </div>

                <div className="checkout-info-note">
                  <span className="material-symbols-outlined">info</span>
                  <p>
                    {stay.perks.includes('Free cancellation')
                      ? 'Free cancellation is included in this mock booking. No hidden fees.'
                      : 'This mock booking includes all shown charges. No hidden fees.'}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="checkout-footer">
        <div>
          <div className="checkout-footer-brand">Global Explorer</div>
          <p>© 2024 Global Explorer. All rights reserved. Built for travelers.</p>
        </div>
        <div className="checkout-footer-links">
          <Link to="/">About Us</Link>
          <Link to="/">Customer Service</Link>
          <Link to="/">Privacy Policy</Link>
          <Link to="/">Terms & Conditions</Link>
        </div>
      </footer>
    </div>
  )
}

export default CheckoutPage
