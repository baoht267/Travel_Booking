import { useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Link, Navigate, useParams } from 'react-router-dom'
import { selectAllStays, selectCriteria } from '../features/stays/staysSlice'

const galleryByTheme = {
  sea: [
    'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  ],
  city: [
    'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
  ],
  nature: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1464820453369-31d2c0b651af?auto=format&fit=crop&w=1200&q=80',
  ],
  sun: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=1200&q=80',
  ],
}

const detailsByTheme = {
  sea: {
    badge: 'Top Rated',
    departure: 'Departs from private marina transfer',
    aboutTitle: 'About this stay',
    duration: '8 hours of curated experiences',
    instantLabel: 'Instant confirmation',
    languages: 'Live guide: English, Vietnamese',
    highlights: [
      {
        title: 'Sunrise Coastline Cruise',
        description:
          'Start with a smooth harbor pickup and a guided cruise past the best shoreline viewpoints near your stay.',
      },
      {
        title: 'Island Leisure Window',
        description:
          'Spend flexible time swimming, relaxing, and using the resort concierge plan for optional island stops.',
      },
      {
        title: 'Sunset Dining & Return',
        description:
          'Wrap the day with a premium waterfront dinner suggestion and a comfortable transfer back to the property.',
      },
    ],
    reviewMetrics: [
      ['Cleanliness', 9.2],
      ['Professionalism', 9.5],
      ['Value for Money', 8.4],
      ['Location', 9.8],
    ],
    guestReviews: [
      {
        initials: 'JD',
        name: 'Julianne Davies',
        location: 'United Kingdom',
        date: 'May 2024',
        score: '10',
        copy:
          "Absolutely phenomenal stay. The staff was attentive and the sea views from the room were worth every minute.",
      },
      {
        initials: 'ML',
        name: 'Marco Lombardi',
        location: 'Italy',
        date: 'June 2024',
        score: '9.0',
        copy:
          'Excellent organization and great staff. The waterfront breakfast setup was perfect for a slower luxury trip.',
      },
    ],
  },
  city: {
    badge: 'Editor Pick',
    departure: 'Close to major city landmarks',
    aboutTitle: 'About this stay',
    duration: 'Flexible city-break schedule',
    instantLabel: 'Instant confirmation',
    languages: 'Host support: English, Vietnamese',
    highlights: [
      {
        title: 'Check-in & Local Orientation',
        description:
          'Arrive with an easy self-check-in flow, neighborhood notes, and curated dining picks around the property.',
      },
      {
        title: 'Walkable District Access',
        description:
          'Use the central location for markets, cafes, and late-night food routes without needing long transfers.',
      },
      {
        title: 'Comfortable Extended Stay Setup',
        description:
          'Enjoy apartment-style amenities, quiet work corners, and a practical layout for couples or small groups.',
      },
    ],
    reviewMetrics: [
      ['Cleanliness', 8.8],
      ['Professionalism', 9.1],
      ['Value for Money', 9.0],
      ['Location', 9.6],
    ],
    guestReviews: [
      {
        initials: 'AN',
        name: 'Anh Nguyen',
        location: 'Vietnam',
        date: 'April 2024',
        score: '9.2',
        copy:
          'The location was excellent for exploring the old quarter. Clean room, smooth check-in, and very practical for two travelers.',
      },
      {
        initials: 'PS',
        name: 'Paolo Serra',
        location: 'Italy',
        date: 'May 2024',
        score: '8.9',
        copy:
          'Great base for a city trip. Cafes, street food, and key attractions were all within a short walk.',
      },
    ],
  },
  nature: {
    badge: 'Scenic Escape',
    departure: 'Panoramic mountain access included',
    aboutTitle: 'About this stay',
    duration: 'Full-day nature itinerary support',
    instantLabel: 'Instant confirmation',
    languages: 'Host support: English, Local guide',
    highlights: [
      {
        title: 'Arrival & Valley Views',
        description:
          'Settle into a scenic room with balcony access and a first look over mist-covered ridgelines.',
      },
      {
        title: 'Guided Trek Planning',
        description:
          'Coordinate day routes, transport, and local guide support directly through the lodge team.',
      },
      {
        title: 'Slow Evening Return',
        description:
          'Come back to a quieter property with warm dining options and uninterrupted mountain air.',
      },
    ],
    reviewMetrics: [
      ['Cleanliness', 9.0],
      ['Professionalism', 8.9],
      ['Value for Money', 8.8],
      ['Location', 9.7],
    ],
    guestReviews: [
      {
        initials: 'LK',
        name: 'Lena Kovacs',
        location: 'Hungary',
        date: 'March 2024',
        score: '9.1',
        copy:
          'Beautiful sunrise views and genuinely peaceful surroundings. The team helped us organize trekking without any friction.',
      },
      {
        initials: 'TR',
        name: 'Thanh R.',
        location: 'Vietnam',
        date: 'April 2024',
        score: '8.8',
        copy:
          'A strong choice if you want scenery first. Clean rooms, warm service, and a very calm atmosphere.',
      },
    ],
  },
  sun: {
    badge: 'Beachfront Favorite',
    departure: 'Private beach access included',
    aboutTitle: 'About this stay',
    duration: 'Resort-style all-day access',
    instantLabel: 'Instant confirmation',
    languages: 'Host support: English, Vietnamese',
    highlights: [
      {
        title: 'Lagoon Arrival Experience',
        description:
          'Start with a resort welcome, luggage support, and direct access to the beachfront zone.',
      },
      {
        title: 'Relaxed Day by the Water',
        description:
          'Move between villas, pools, and the private beach with optional family-friendly activities.',
      },
      {
        title: 'Evening Sunset Dining',
        description:
          'Finish with sunset-facing dinner recommendations and a quieter return to your villa.',
      },
    ],
    reviewMetrics: [
      ['Cleanliness', 9.4],
      ['Professionalism', 9.2],
      ['Value for Money', 8.9],
      ['Location', 9.5],
    ],
    guestReviews: [
      {
        initials: 'CM',
        name: 'Claire Martin',
        location: 'France',
        date: 'February 2024',
        score: '9.6',
        copy:
          'Excellent resort for a warm-weather reset. The private beach and sunset-facing dining were the standout moments.',
      },
      {
        initials: 'VT',
        name: 'Vu Tran',
        location: 'Vietnam',
        date: 'May 2024',
        score: '9.1',
        copy:
          'Very easy for family travel. The pool, rooms, and beach access all felt thoughtfully planned.',
      },
    ],
  },
}

function formatPrice(value) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function HotelDetailsPage() {
  const { stayId } = useParams()
  const stays = useSelector(selectAllStays)
  const criteria = useSelector(selectCriteria)
  const stay = stays.find((item) => item.id === stayId)
  const [activeHighlight, setActiveHighlight] = useState(0)
  const [selectedDate, setSelectedDate] = useState(criteria.checkIn)
  const [travelerCount, setTravelerCount] = useState(criteria.guests || 2)

  if (!stay) {
    return <Navigate to="/search" replace />
  }

  const detailContent = detailsByTheme[stay.theme] || detailsByTheme.city
  const gallery = [stay.image, ...(galleryByTheme[stay.theme] || galleryByTheme.city)]
  const baseTotal = stay.pricePerNight * travelerCount
  const bookingFee = stay.perks.includes('Pay at property') ? 0 : stay.taxesAndFees
  const total = baseTotal + bookingFee

  return (
    <Container className="page-section stay-detail-page">
      <section className="stay-detail-gallery">
        <div className="stay-detail-gallery-main">
          <img src={gallery[0]} alt={stay.name} />
        </div>
        <div className="stay-detail-gallery-grid">
          {gallery.slice(1, 5).map((image, index) => (
            <div key={`${stay.id}-gallery-${index}`} className="stay-detail-gallery-tile">
              <img src={image} alt={`${stay.name} view ${index + 2}`} />
            </div>
          ))}
        </div>
        <button type="button" className="stay-detail-gallery-action">
          <span className="material-symbols-outlined">grid_view</span>
          Show all photos
        </button>
      </section>

      <div className="stay-detail-layout">
        <section className="stay-detail-main">
          <div className="stay-detail-heading">
            <div className="stay-detail-badge-row">
              <span className="stay-detail-badge">{detailContent.badge}</span>
              <span className="stay-detail-stars">★★★★★</span>
            </div>
            <h1>{stay.name}</h1>
            <div className="stay-detail-location">
              <span className="material-symbols-outlined">location_on</span>
              <span>
                {stay.city}, {stay.country}
              </span>
              <span>•</span>
              <span>{detailContent.departure}</span>
            </div>
          </div>

          <div className="stay-detail-divider"></div>

          <section className="stay-detail-section">
            <h2>{detailContent.aboutTitle}</h2>
            <p>
              {stay.description} This premium booking experience is designed for travelers who
              want a smoother arrival, clearer logistics, and a more polished local base.
            </p>
            <p>
              From curated amenities to better neighborhood access, the stay blends comfort and
              pace well. Use it as a practical home base for sightseeing, dining, and easy daily
              planning without overcomplicating the trip.
            </p>
          </section>

          <section className="stay-detail-section">
            <h2>Tour Schedule & Highlights</h2>
            <div className="stay-detail-accordion">
              {detailContent.highlights.map((item, index) => {
                const isOpen = activeHighlight === index

                return (
                  <div key={item.title} className={`stay-detail-accordion-item ${isOpen ? 'is-open' : ''}`}>
                    <button
                      type="button"
                      className="stay-detail-accordion-trigger"
                      onClick={() => setActiveHighlight(isOpen ? -1 : index)}
                    >
                      <span className="stay-detail-accordion-number">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="stay-detail-accordion-title">{item.title}</span>
                      <span className="material-symbols-outlined">
                        {isOpen ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="stay-detail-accordion-content">
                        <p>{item.description}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          <section className="stay-detail-section">
            <div className="stay-detail-review-head">
              <h2>Guest Reviews</h2>
              <div className="stay-detail-review-score">
                <span>{stay.reviewsCount.toLocaleString()} reviews</span>
                <strong>{stay.reviewScore}</strong>
              </div>
            </div>

            <div className="stay-detail-review-metrics">
              {detailContent.reviewMetrics.map(([label, score]) => (
                <div key={label} className="stay-detail-metric">
                  <div className="stay-detail-metric-top">
                    <span>{label}</span>
                    <strong>{score}</strong>
                  </div>
                  <div className="stay-detail-metric-bar">
                    <span style={{ width: `${(score / 10) * 100}%` }}></span>
                  </div>
                </div>
              ))}
            </div>

            <div className="stay-detail-review-cards">
              {detailContent.guestReviews.map((review) => (
                <article key={review.name} className="stay-detail-review-card">
                  <div className="stay-detail-review-card-head">
                    <div className="stay-detail-reviewer">
                      <span className="stay-detail-reviewer-avatar">{review.initials}</span>
                      <div>
                        <strong>{review.name}</strong>
                        <p>
                          {review.location} • {review.date}
                        </p>
                      </div>
                    </div>
                    <span className="stay-detail-review-chip">{review.score}</span>
                  </div>
                  <p className="stay-detail-review-copy">"{review.copy}"</p>
                </article>
              ))}
            </div>
          </section>
        </section>

        <aside className="stay-detail-sidebar">
          <div className="stay-detail-booking-card">
            <div className="stay-detail-booking-price">
              <div>
                <span>From</span>
                <strong>€{formatPrice(stay.pricePerNight)}</strong>
              </div>
              <small>per person</small>
            </div>

            <div className="stay-detail-booking-field">
              <label htmlFor="detail-date">Select Date</label>
              <div className="stay-detail-booking-input">
                <input
                  id="detail-date"
                  type="date"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                />
                <span className="material-symbols-outlined">calendar_today</span>
              </div>
            </div>

            <div className="stay-detail-booking-field">
              <label>Travelers</label>
              <div className="stay-detail-travelers">
                <button
                  type="button"
                  onClick={() => setTravelerCount((current) => Math.max(1, current - 1))}
                >
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <strong>{travelerCount} adults</strong>
                <button type="button" onClick={() => setTravelerCount((current) => current + 1)}>
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
            </div>

            <div className="stay-detail-price-box">
              <div>
                <span>€{formatPrice(stay.pricePerNight)} × {travelerCount} travelers</span>
                <strong>€{formatPrice(baseTotal)}</strong>
              </div>
              <div>
                <span>Booking Fee</span>
                <strong>{bookingFee === 0 ? 'Free' : `€${formatPrice(bookingFee)}`}</strong>
              </div>
              <div className="stay-detail-price-total">
                <span>Total</span>
                <strong>€{formatPrice(total)}</strong>
              </div>
            </div>

            <Button as={Link} to={`/checkout/${stay.id}`} className="stay-detail-book-now">
              Book Now
            </Button>

            <div className="stay-detail-trust-list">
              <div>
                <span className="material-symbols-outlined is-success">verified</span>
                <span>Free cancellation until 24h before</span>
              </div>
              <div>
                <span className="material-symbols-outlined">schedule</span>
                <span>Duration: {detailContent.duration}</span>
              </div>
              <div>
                <span className="material-symbols-outlined">bolt</span>
                <span>{detailContent.instantLabel}</span>
              </div>
              <div>
                <span className="material-symbols-outlined">translate</span>
                <span>{detailContent.languages}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  )
}

export default HotelDetailsPage
