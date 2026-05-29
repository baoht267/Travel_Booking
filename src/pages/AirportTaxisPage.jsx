import { useMemo, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import mockTaxis, { airports, popularRoutes } from '../data/mockTaxis'

function formatPrice(value) {
  return new Intl.NumberFormat('vi-VN').format(value)
}

const typeOrder = ['Sedan', 'Minivan 7 chỗ', 'VIP Sedan', 'Minibus 16 chỗ']

export default function AirportTaxisPage() {
  const navigate = useNavigate()
  const today = new Date().toISOString().slice(0, 16)

  const [form, setForm] = useState({
    direction: 'arrival',   // arrival | departure
    airportCode: 'HAN',
    destination: '',
    datetime: today,
    passengers: 2,
    luggage: 2,
  })
  const [searched, setSearched] = useState(false)
  const [sortBy, setSortBy] = useState('Đề Xuất')
  const [typeFilter, setTypeFilter] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  const handleQuickRoute = (route) => {
    setForm((p) => ({ ...p, airportCode: route.airportCode, destination: route.destination }))
    setSearched(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSearched(true)
  }

  const results = useMemo(() => {
    let list = mockTaxis.filter((t) => t.airportCode === form.airportCode)

    if (typeFilter.length > 0) {
      list = list.filter((t) => typeFilter.includes(t.type))
    }

    if (sortBy === 'Giá Thấp Nhất') list.sort((a, b) => a.price - b.price)
    else if (sortBy === 'Giá Cao Nhất') list.sort((a, b) => b.price - a.price)
    else if (sortBy === 'Đánh Giá Cao Nhất') list.sort((a, b) => b.rating - a.rating)
    else list.sort((a, b) => typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type))

    return list
  }, [form.airportCode, typeFilter, sortBy])

  const selectedAirport = airports.find((a) => a.code === form.airportCode)

  const allTypes = [...new Set(mockTaxis.map((t) => t.type))]

  const toggleType = (type) => {
    setTypeFilter((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    )
  }

  const toCheckout = (taxi) => {
    const params = new URLSearchParams({
      direction: form.direction,
      destination: form.destination || taxi.destination,
      datetime: form.datetime,
      passengers: form.passengers,
      luggage: form.luggage,
    })
    navigate(`/taxis/${taxi.id}/checkout?${params}`)
  }

  return (
    <div className="taxi-page">
      {/* ── Hero / Search ── */}
      <div className="taxi-hero">
        <div className="taxi-hero-overlay" />
        <div className="taxi-hero-content">
          <div className="taxi-hero-badge">
            <span className="material-symbols-outlined">local_taxi</span>
            Đưa đón Sân Bay
          </div>
          <h1 className="taxi-hero-title">Đặt Taxi Sân Bay</h1>
          <p className="taxi-hero-sub">Xe riêng, đón tận cửa ra, không lo chờ đợi</p>

          <form className="taxi-search-card" onSubmit={handleSubmit}>
            {/* Direction toggle */}
            <div className="taxi-direction-row">
              {[
                { value: 'arrival', label: 'Từ sân bay', icon: 'flight_land' },
                { value: 'departure', label: 'Đến sân bay', icon: 'flight_takeoff' },
              ].map((d) => (
                <button
                  key={d.value}
                  type="button"
                  className={`taxi-dir-btn${form.direction === d.value ? ' is-active' : ''}`}
                  onClick={() => setForm((p) => ({ ...p, direction: d.value }))}
                >
                  <span className="material-symbols-outlined">{d.icon}</span>
                  {d.label}
                </button>
              ))}
            </div>

            <div className="taxi-search-fields">
              {/* Airport */}
              <div className="taxi-field taxi-field-lg">
                <label>
                  <span className="material-symbols-outlined">flight</span>
                  {form.direction === 'arrival' ? 'Sân bay đến' : 'Sân bay đi'}
                </label>
                <select name="airportCode" value={form.airportCode} onChange={handleChange}>
                  {airports.map((a) => (
                    <option key={a.code} value={a.code}>
                      {a.name} ({a.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination */}
              <div className="taxi-field taxi-field-lg">
                <label>
                  <span className="material-symbols-outlined">location_on</span>
                  {form.direction === 'arrival' ? 'Điểm đến' : 'Điểm đón'}
                </label>
                <input
                  name="destination"
                  value={form.destination}
                  onChange={handleChange}
                  placeholder="Khách sạn, địa chỉ, khu vực..."
                />
              </div>

              {/* Date/time */}
              <div className="taxi-field">
                <label>
                  <span className="material-symbols-outlined">schedule</span>
                  {form.direction === 'arrival' ? 'Giờ hạ cánh' : 'Giờ cần có xe'}
                </label>
                <input
                  type="datetime-local"
                  name="datetime"
                  value={form.datetime}
                  onChange={handleChange}
                />
              </div>

              {/* Passengers */}
              <div className="taxi-field taxi-field-sm">
                <label>
                  <span className="material-symbols-outlined">group</span>
                  Khách
                </label>
                <select name="passengers" value={form.passengers} onChange={handleChange}>
                  {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map((n) => (
                    <option key={n} value={n}>{n} khách</option>
                  ))}
                </select>
              </div>

              {/* Luggage */}
              <div className="taxi-field taxi-field-sm">
                <label>
                  <span className="material-symbols-outlined">work</span>
                  Hành lý
                </label>
                <select name="luggage" value={form.luggage} onChange={handleChange}>
                  {[0,1,2,3,4,5,6,7,8,9,10].map((n) => (
                    <option key={n} value={n}>{n} kiện</option>
                  ))}
                </select>
              </div>

              <Button type="submit" className="taxi-search-btn">
                <span className="material-symbols-outlined">search</span>
                Tìm Xe
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="taxi-body">
        {/* Popular routes (pre-search) */}
        {!searched && (
          <div className="taxi-popular">
            <h2 className="taxi-section-title">Tuyến Đường Phổ Biến</h2>
            <div className="taxi-routes-grid">
              {popularRoutes.map((r) => (
                <button
                  key={r.airportCode}
                  className="taxi-route-card"
                  onClick={() => handleQuickRoute(r)}
                >
                  <div className="taxi-route-top">
                    <span className="taxi-route-icon">
                      <span className="material-symbols-outlined">local_taxi</span>
                    </span>
                    <span className="taxi-route-code">{r.airportCode}</span>
                  </div>
                  <p className="taxi-route-airports">{r.airportName}</p>
                  <p className="taxi-route-dest">
                    <span className="material-symbols-outlined">arrow_forward</span>
                    {r.destination}
                  </p>
                  <div className="taxi-route-meta">
                    <span>
                      <span className="material-symbols-outlined">schedule</span>
                      {r.time}
                    </span>
                    <span>
                      <span className="material-symbols-outlined">straighten</span>
                      {r.distance}
                    </span>
                  </div>
                  <div className="taxi-route-price">
                    Từ <strong>{formatPrice(r.fromPrice)}₫</strong>
                  </div>
                </button>
              ))}
            </div>

            {/* Trust badges */}
            <div className="taxi-trust-band">
              {[
                { icon: 'verified_user', text: 'Lái xe được xác minh' },
                { icon: 'schedule', text: 'Đúng giờ đảm bảo' },
                { icon: 'support_agent', text: 'Hỗ trợ 24/7' },
                { icon: 'payments', text: 'Thanh toán an toàn' },
              ].map((b) => (
                <div key={b.text} className="taxi-trust-item">
                  <span className="material-symbols-outlined">{b.icon}</span>
                  <span>{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {searched && (
          <div className="taxi-results-wrap">
            {/* Sidebar filter */}
            <aside className="taxi-filter-panel">
              <h3 className="taxi-filter-title">Lọc kết quả</h3>

              <div className="taxi-filter-block">
                <p className="taxi-filter-label">Loại xe</p>
                {allTypes.map((type) => (
                  <label key={type} className="taxi-filter-check">
                    <input
                      type="checkbox"
                      checked={typeFilter.includes(type)}
                      onChange={() => toggleType(type)}
                    />
                    {type}
                  </label>
                ))}
              </div>

              <div className="taxi-filter-block">
                <p className="taxi-filter-label">Sắp xếp theo</p>
                {['Đề Xuất', 'Giá Thấp Nhất', 'Giá Cao Nhất', 'Đánh Giá Cao Nhất'].map((s) => (
                  <label key={s} className="taxi-filter-check">
                    <input
                      type="radio"
                      name="taxi-sort"
                      checked={sortBy === s}
                      onChange={() => setSortBy(s)}
                    />
                    {s}
                  </label>
                ))}
              </div>
            </aside>

            {/* Cards */}
            <section className="taxi-results">
              <div className="taxi-results-header">
                <div>
                  <h2 className="taxi-results-title">
                    {selectedAirport?.name}
                    <span className="taxi-results-arrow">→</span>
                    {form.destination || 'Tất cả điểm đến'}
                  </h2>
                  <p className="taxi-results-count">
                    <strong>{results.length}</strong> loại xe có sẵn
                  </p>
                </div>
              </div>

              {results.length > 0 ? (
                <div className="taxi-cards">
                  {results.map((taxi) => (
                    <article key={taxi.id} className="taxi-card">
                      {/* Highlight badge */}
                      {taxi.highlight && (
                        <div className="taxi-highlight-badge">{taxi.highlight}</div>
                      )}

                      <div className="taxi-card-media">
                        <img src={taxi.image} alt={taxi.carModel} className="taxi-card-img" />
                      </div>

                      <div className="taxi-card-body">
                        <div className="taxi-card-top">
                          <div>
                            <div className="taxi-type-row">
                              <span className="material-symbols-outlined taxi-type-icon">
                                {taxi.typeIcon}
                              </span>
                              <span className="taxi-type-label">{taxi.type}</span>
                            </div>
                            <h3 className="taxi-car-model">{taxi.carModel}</h3>
                            <p className="taxi-provider">{taxi.provider}</p>
                          </div>

                          <div className="taxi-rating">
                            <span className="taxi-score">{taxi.rating}</span>
                            <div>
                              <p className="taxi-score-label">{taxi.reviewLabel}</p>
                              <p className="taxi-score-reviews">{taxi.reviewsCount.toLocaleString()} đánh giá</p>
                            </div>
                          </div>
                        </div>

                        {/* Capacity */}
                        <div className="taxi-capacity">
                          <span>
                            <span className="material-symbols-outlined">group</span>
                            Tối đa {taxi.capacity} khách
                          </span>
                          <span>
                            <span className="material-symbols-outlined">work</span>
                            {taxi.luggage} kiện hành lý
                          </span>
                          <span>
                            <span className="material-symbols-outlined">schedule</span>
                            ~{taxi.estimatedTime}
                          </span>
                          <span>
                            <span className="material-symbols-outlined">straighten</span>
                            {taxi.distance}
                          </span>
                        </div>

                        {/* Features */}
                        <ul className="taxi-features">
                          {taxi.features.map((f) => (
                            <li key={f}>
                              <span className="material-symbols-outlined">check_circle</span>
                              {f}
                            </li>
                          ))}
                        </ul>

                        {/* Meeting point */}
                        <div className="taxi-meeting">
                          <span className="material-symbols-outlined">where_to_vote</span>
                          <span>{taxi.meetingPoint}</span>
                        </div>

                        <div className="taxi-card-footer">
                          <div>
                            <p className="taxi-cancel">{taxi.cancelPolicy}</p>
                            <div className="taxi-price">
                              <span className="taxi-price-from">Giá cố định</span>
                              <strong>{formatPrice(taxi.price)}₫</strong>
                              <span className="taxi-price-note">/xe</span>
                            </div>
                          </div>
                          <Button className="taxi-book-btn" onClick={() => toCheckout(taxi)}>
                            Đặt Ngay
                          </Button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="taxi-empty">
                  <span className="material-symbols-outlined">local_taxi</span>
                  <h3>Không có xe phù hợp</h3>
                  <p>Thử chọn sân bay khác hoặc xóa bộ lọc loại xe.</p>
                  <button
                    className="btn btn-outline-primary mt-3"
                    onClick={() => setTypeFilter([])}
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
