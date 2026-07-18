import { useMemo, useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import mockFlights from '../data/mockFlights'
import { addDays, getTomorrowDate } from '../utils/travelDates'

function formatPrice(value) {
  return new Intl.NumberFormat('vi-VN').format(value)
}

const popularRoutes = [
  { from: 'Hà Nội', fromCode: 'HAN', to: 'TP. Hồ Chí Minh', toCode: 'SGN' },
  { from: 'Hà Nội', fromCode: 'HAN', to: 'Đà Nẵng', toCode: 'DAD' },
  { from: 'TP. Hồ Chí Minh', fromCode: 'SGN', to: 'Phú Quốc', toCode: 'PQC' },
  { from: 'Hà Nội', fromCode: 'HAN', to: 'Tokyo', toCode: 'NRT' },
]

function FlightsPage() {
  const minimumDate = getTomorrowDate()
  const navigate = useNavigate()

  const [search, setSearch] = useState({
    from: '',
    to: '',
    departDate: minimumDate,
    returnDate: '',
    passengers: 1,
    tripType: 'one-way',
  })
  const [submitted, setSubmitted] = useState(false)
  const [sortBy, setSortBy] = useState('Giá Thấp Nhất')

  const handleFieldChange = (e) => {
    const { name, value } = e.target
    setSearch((prev) => ({ ...prev, [name]: value }))
  }

  const handleQuickRoute = (route) => {
    setSearch((prev) => ({ ...prev, from: route.from, to: route.to }))
    setSubmitted(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const filteredFlights = useMemo(() => {
    let list = [...mockFlights]

    if (search.from.trim()) {
      const term = search.from.trim().toLowerCase()
      list = list.filter(
        (f) =>
          f.from.toLowerCase().includes(term) ||
          f.fromCode.toLowerCase().includes(term),
      )
    }

    if (search.to.trim()) {
      const term = search.to.trim().toLowerCase()
      list = list.filter(
        (f) =>
          f.to.toLowerCase().includes(term) ||
          f.toCode.toLowerCase().includes(term),
      )
    }

    if (sortBy === 'Giá Thấp Nhất') {
      list.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'Giá Cao Nhất') {
      list.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'Khởi Hành Sớm Nhất') {
      list.sort((a, b) => a.departTime.localeCompare(b.departTime))
    } else if (sortBy === 'Thời Gian Bay Ngắn Nhất') {
      list.sort((a, b) => a.duration.localeCompare(b.duration))
    }

    return list
  }, [search.from, search.to, sortBy])

  return (
    <div className="flights-page">
      {/* Search Band */}
      <div className="flights-search-band">
        <Container>
          <h1 className="flights-search-title">Tìm Chuyến Bay</h1>

          {/* Trip type toggle */}
          <div className="flights-trip-toggle">
            {['one-way', 'round-trip'].map((type) => (
              <button
                key={type}
                type="button"
                className={`flights-trip-btn${search.tripType === type ? ' is-active' : ''}`}
                onClick={() => setSearch((p) => ({ ...p, tripType: type }))}
              >
                {type === 'one-way' ? 'Một chiều' : 'Khứ hồi'}
              </button>
            ))}
          </div>

          <form className="flights-search-form" onSubmit={handleSubmit}>
            <div className="flights-search-fields">
              <div className="flights-field">
                <label>Từ</label>
                <div className="flights-input-wrap">
                  <span className="material-symbols-outlined">flight_takeoff</span>
                  <input
                    name="from"
                    value={search.from}
                    onChange={handleFieldChange}
                    placeholder="Thành phố hoặc sân bay"
                  />
                </div>
              </div>

              <button
                type="button"
                className="flights-swap-btn"
                onClick={() =>
                  setSearch((p) => ({ ...p, from: p.to, to: p.from }))
                }
                aria-label="Đổi chiều"
              >
                <span className="material-symbols-outlined">swap_horiz</span>
              </button>

              <div className="flights-field">
                <label>Đến</label>
                <div className="flights-input-wrap">
                  <span className="material-symbols-outlined">flight_land</span>
                  <input
                    name="to"
                    value={search.to}
                    onChange={handleFieldChange}
                    placeholder="Thành phố hoặc sân bay"
                  />
                </div>
              </div>

              <div className="flights-field">
                <label>Ngày đi</label>
                <div className="flights-input-wrap">
                  <span className="material-symbols-outlined">calendar_today</span>
                  <input
                    type="date"
                    name="departDate"
                    value={search.departDate}
                    min={minimumDate}
                    onChange={handleFieldChange}
                    required
                  />
                </div>
              </div>

              {search.tripType === 'round-trip' && (
                <div className="flights-field">
                  <label>Ngày về</label>
                  <div className="flights-input-wrap">
                    <span className="material-symbols-outlined">calendar_today</span>
                    <input
                      type="date"
                      name="returnDate"
                      value={search.returnDate}
                      min={addDays(search.departDate || minimumDate, 1)}
                      onChange={handleFieldChange}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="flights-field flights-field-sm">
                <label>Hành khách</label>
                <div className="flights-input-wrap">
                  <span className="material-symbols-outlined">person</span>
                  <select
                    name="passengers"
                    value={search.passengers}
                    onChange={handleFieldChange}
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} người
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button type="submit" className="flights-search-btn">
                <span className="material-symbols-outlined">search</span>
                Tìm Chuyến
              </Button>
            </div>
          </form>
        </Container>
      </div>

      <Container className="flights-body">
        {/* Popular routes (shown before first search) */}
        {!submitted && (
          <div className="flights-popular">
            <h2 className="flights-section-title">Tuyến Bay Phổ Biến</h2>
            <div className="flights-routes-grid">
              {popularRoutes.map((route) => (
                <button
                  key={`${route.fromCode}-${route.toCode}`}
                  className="flights-route-card"
                  onClick={() => handleQuickRoute(route)}
                >
                  <div className="flights-route-airports">
                    <span className="flights-route-code">{route.fromCode}</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                    <span className="flights-route-code">{route.toCode}</span>
                  </div>
                  <div className="flights-route-label">
                    {route.from} → {route.to}
                  </div>
                  <div className="flights-route-price">
                    Từ{' '}
                    <strong>
                      {formatPrice(
                        mockFlights.find(
                          (f) => f.fromCode === route.fromCode && f.toCode === route.toCode,
                        )?.price || 0,
                      )}
                      ₫
                    </strong>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {submitted && (
          <div className="flights-results">
            <div className="flights-results-toolbar">
              <span className="flights-results-count">
                <strong>{filteredFlights.length}</strong> chuyến bay được tìm thấy
              </span>
              <div className="flights-sort-wrap">
                <label htmlFor="flights-sort">Sắp xếp:</label>
                <select
                  id="flights-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option>Giá Thấp Nhất</option>
                  <option>Giá Cao Nhất</option>
                  <option>Khởi Hành Sớm Nhất</option>
                  <option>Thời Gian Bay Ngắn Nhất</option>
                </select>
              </div>
            </div>

            {filteredFlights.length > 0 ? (
              <div className="flights-list">
                {filteredFlights.map((flight) => (
                  <article key={flight.id} className="flight-card">
                    <div className="flight-card-airline">
                      <div className="flight-airline-logo">{flight.logo}</div>
                      <div>
                        <p className="flight-airline-name">{flight.airline}</p>
                        <p className="flight-airline-code">{flight.airlineCode}</p>
                      </div>
                    </div>

                    <div className="flight-card-route">
                      <div className="flight-endpoint">
                        <span className="flight-time">{flight.departTime}</span>
                        <span className="flight-city-code">{flight.fromCode}</span>
                        <span className="flight-city-name">{flight.from}</span>
                      </div>

                      <div className="flight-route-middle">
                        <span className="flight-duration">{flight.duration}</span>
                        <div className="flight-route-line">
                          <span className="material-symbols-outlined">flight</span>
                        </div>
                        <span className="flight-stops">
                          {flight.stops === 0 ? 'Bay thẳng' : `${flight.stops} điểm dừng`}
                        </span>
                      </div>

                      <div className="flight-endpoint flight-endpoint-right">
                        <span className="flight-time">{flight.arriveTime}</span>
                        <span className="flight-city-code">{flight.toCode}</span>
                        <span className="flight-city-name">{flight.to}</span>
                      </div>
                    </div>

                    <div className="flight-card-info">
                      <div className="flight-info-tags">
                        <span className="flight-info-tag">
                          <span className="material-symbols-outlined">work</span>
                          {flight.baggage}
                        </span>
                        <span className="flight-info-tag">
                          <span className="material-symbols-outlined">airline_seat_recline_normal</span>
                          {flight.class}
                        </span>
                        {flight.seatsLeft <= 5 && (
                          <span className="flight-info-tag flight-seats-warn">
                            Còn {flight.seatsLeft} chỗ
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flight-card-price">
                      <div>
                        <span className="flight-price-label">Từ / người</span>
                        <div className="flight-price">
                          {formatPrice(flight.price)}₫
                        </div>
                        {flight.businessPrice && (
                          <span className="flight-price-business">
                            Thương gia: {formatPrice(flight.businessPrice)}₫
                          </span>
                        )}
                      </div>
                      <div className="flight-book-actions">
                        <Button
                          className="flight-book-btn"
                          onClick={() =>
                            navigate(
                              `/flights/${flight.id}/checkout?passengers=${search.passengers}&departDate=${search.departDate}&class=economy`,
                            )
                          }
                        >
                          Phổ Thông
                        </Button>
                        {flight.businessPrice && (
                          <Button
                            className="flight-book-btn flight-book-btn-biz"
                            onClick={() =>
                              navigate(
                                `/flights/${flight.id}/checkout?passengers=${search.passengers}&departDate=${search.departDate}&class=business`,
                              )
                            }
                          >
                            Thương Gia
                          </Button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="flights-empty">
                <span className="material-symbols-outlined">flight_off</span>
                <h3>Không tìm thấy chuyến bay nào</h3>
                <p>Thử thay đổi điểm xuất phát hoặc điểm đến.</p>
                <button
                  className="btn btn-outline-primary mt-3"
                  onClick={() => setSearch((p) => ({ ...p, from: '', to: '' }))}
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  )
}

export default FlightsPage
