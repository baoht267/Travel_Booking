import { useMemo, useState } from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import mockCars from '../data/mockCars'
import { formatBasePriceToVndCurrency } from '../utils/currency'

function getRentalDays(pickupAt, dropoffAt) {
  const pickup = new Date(pickupAt)
  const dropoff = new Date(dropoffAt)
  const milliseconds = dropoff.getTime() - pickup.getTime()
  const days = Math.ceil(milliseconds / (1000 * 60 * 60 * 24))
  return days > 0 ? days : 1
}

function normalizeSearchLabel(value) {
  return value.trim() || 'Tất cả điểm đến'
}

function CarRentalsPage() {
  const [draftSearch, setDraftSearch] = useState({
    location: 'London, United Kingdom',
    pickupAt: '2026-05-22T10:00',
    dropoffAt: '2026-05-25T10:00',
  })
  const [activeSearch, setActiveSearch] = useState({
    location: 'London, United Kingdom',
    pickupAt: '2026-05-22T10:00',
    dropoffAt: '2026-05-25T10:00',
  })
  const [filters, setFilters] = useState({
    carTypes: [],
    transmission: [],
    maxDailyPrice: 250,
    companies: [],
  })
  const [sortBy, setSortBy] = useState('Đề Xuất')

  const rentalDays = useMemo(
    () => getRentalDays(activeSearch.pickupAt, activeSearch.dropoffAt),
    [activeSearch.dropoffAt, activeSearch.pickupAt],
  )

  const filteredCars = useMemo(() => {
    const locationTerm = activeSearch.location.trim().toLowerCase()

    const matches = mockCars
      .filter((car) => {
        const searchableLocation = `${car.city}, ${car.country}`.toLowerCase()
        const matchesLocation =
          !locationTerm ||
          searchableLocation.includes(locationTerm) ||
          car.city.toLowerCase().includes(locationTerm) ||
          car.country.toLowerCase().includes(locationTerm)
        const matchesType =
          filters.carTypes.length === 0 || filters.carTypes.includes(car.carType)
        const matchesTransmission =
          filters.transmission.length === 0 ||
          filters.transmission.includes(car.transmission)
        const matchesPrice = car.dailyPrice <= filters.maxDailyPrice
        const matchesCompany =
          filters.companies.length === 0 || filters.companies.includes(car.vendor)

        return (
          matchesLocation &&
          matchesType &&
          matchesTransmission &&
          matchesPrice &&
          matchesCompany
        )
      })
      .map((car) => ({
        ...car,
        totalPrice: Number((car.dailyPrice * rentalDays).toFixed(2)),
      }))

    const sorted = [...matches]

    if (sortBy === 'Giá: Thấp Nhất Trước') {
      sorted.sort((first, second) => first.totalPrice - second.totalPrice)
    } else if (sortBy === 'Giá: Cao Nhất Trước') {
      sorted.sort((first, second) => second.totalPrice - first.totalPrice)
    } else if (sortBy === 'Đánh Giá Cao Nhất') {
      sorted.sort((first, second) => second.reviewScore - first.reviewScore)
    }

    return sorted
  }, [activeSearch.location, filters, rentalDays, sortBy])

  const toggleFilterValue = (group, value) => {
    setFilters((current) => {
      const hasValue = current[group].includes(value)

      return {
        ...current,
        [group]: hasValue
          ? current[group].filter((item) => item !== value)
          : [...current[group], value],
      }
    })
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    setActiveSearch(draftSearch)
  }

  const locationLabel = normalizeSearchLabel(activeSearch.location)

  return (
    <div className="cars-page">
      <section className="cars-search-band">
        <form className="cars-search-shell" onSubmit={handleSearchSubmit}>
          <div className="cars-search-field">
            <span className="material-symbols-outlined">directions_car</span>
            <input
              value={draftSearch.location}
              onChange={(event) =>
                setDraftSearch((current) => ({ ...current, location: event.target.value }))
              }
              placeholder="Tìm kiếm thành phố hoặc quốc gia"
            />
          </div>
          <div className="cars-search-field">
            <span className="material-symbols-outlined">calendar_month</span>
            <input
              type="datetime-local"
              value={draftSearch.pickupAt}
              onChange={(event) =>
                setDraftSearch((current) => ({ ...current, pickupAt: event.target.value }))
              }
            />
          </div>
          <div className="cars-search-field">
            <span className="material-symbols-outlined">calendar_month</span>
            <input
              type="datetime-local"
              value={draftSearch.dropoffAt}
              onChange={(event) =>
                setDraftSearch((current) => ({ ...current, dropoffAt: event.target.value }))
              }
            />
          </div>
          <Button type="submit" className="cars-search-button">
            Tìm Kiếm
          </Button>
        </form>
      </section>

      <div className="cars-content-wrap">
        <aside className="cars-sidebar">
          <div className="cars-map-card">
            <div className="cars-map-pin pin-a"></div>
            <div className="cars-map-pin pin-b"></div>
            <div className="cars-map-pin pin-c"></div>
            <button type="button">Hiển thị trên bản đồ</button>
          </div>

          <Card className="cars-filter-card">
            <Card.Body>
              <h2>Lọc Theo</h2>

              <div className="cars-filter-block">
                <h3>Loại xe</h3>
                {[
                  ['Kinh Tế', 3],
                  ['SUV', 3],
                  ['Sang Trọng', 3],
                ].map(([label, count]) => (
                  <Form.Check
                    key={label}
                    type="checkbox"
                    id={`car-type-${label}`}
                    label={`${label} (${count})`}
                    checked={filters.carTypes.includes(label)}
                    onChange={() => toggleFilterValue('carTypes', label)}
                  />
                ))}
              </div>

              <div className="cars-filter-block">
                <h3>Hộp Số</h3>
                {['Số Tay', 'Số Tự Động'].map((label) => (
                  <Form.Check
                    key={label}
                    type="checkbox"
                    id={`transmission-${label}`}
                    label={label}
                    checked={filters.transmission.includes(label)}
                    onChange={() => toggleFilterValue('transmission', label)}
                  />
                ))}
              </div>

              <div className="cars-filter-block">
                <h3>Giá mỗi ngày</h3>
                <Form.Range
                  min={20}
                  max={250}
                  step={5}
                  value={filters.maxDailyPrice}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      maxDailyPrice: Number(event.target.value),
                    }))
                  }
                />
                <div className="cars-filter-range">
                  <span>{formatBasePriceToVndCurrency(20)}</span>
                  <span>{formatBasePriceToVndCurrency(filters.maxDailyPrice)}+</span>
                </div>
              </div>

              <div className="cars-filter-block mb-0">
                <h3>Công ty cho thuê</h3>
                {['Hertz', 'Europcar', 'Enterprise'].map((label) => (
                  <Form.Check
                    key={label}
                    type="checkbox"
                    id={`company-${label}`}
                    label={label}
                    checked={filters.companies.includes(label)}
                    onChange={() => toggleFilterValue('companies', label)}
                  />
                ))}
              </div>
            </Card.Body>
          </Card>
        </aside>

        <section className="cars-results">
          <div className="cars-results-toolbar">
            <h1>
              {locationLabel}: {filteredCars.length} xe được tìm thấy
            </h1>
            <div className="cars-sort-wrap">
              <label htmlFor="car-sort">Sắp xếp theo:</label>
              <select
                id="car-sort"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option>Đề Xuất</option>
                <option>Giá: Thấp Nhất Trước</option>
                <option>Giá: Cao Nhất Trước</option>
                <option>Đánh Giá Cao Nhất</option>
              </select>
            </div>
          </div>

          <div className="cars-results-list">
            {filteredCars.map((car) => (
              <article key={car.id} className="car-rental-card">
                <div className="car-rental-media">
                  <img src={car.image} alt={car.name} />
                </div>

                <div className="car-rental-main">
                  <div className="car-rental-head">
                    <div>
                      <h2>
                        {car.name} {car.featured && <span className="car-rental-star">★</span>}
                      </h2>
                      <p>{car.subtitle}</p>
                    </div>

                    <div className="car-rental-score">
                      <div>
                        <strong>{car.reviewLabel}</strong>
                        <span>{car.reviewsCount} đánh giá</span>
                      </div>
                      <b>{car.reviewScore}</b>
                    </div>
                  </div>

                  <div className="car-rental-specs">
                    <div>
                      <span className="material-symbols-outlined">person</span>
                      <span>{car.seats} chỗ ngồi</span>
                    </div>
                    <div>
                      <span className="material-symbols-outlined">settings</span>
                      <span>{car.transmission}</span>
                    </div>
                    <div>
                      <span className="material-symbols-outlined">work</span>
                      <span>{car.bags} túi</span>
                    </div>
                    <div>
                      <span className="material-symbols-outlined">check_circle</span>
                      <span className="is-green">{car.includedLabel}</span>
                    </div>
                  </div>

                  <div className="car-rental-footer">
                    <div className="car-rental-vendor">
                      <div className="car-rental-vendor-logo"></div>
                      <div>
                        <strong>{car.vendor}</strong>
                        <span className={`car-rental-tag tone-${car.featureTone}`}>
                          {car.featureLabel}
                        </span>
                      </div>
                    </div>

                    <div className="car-rental-price">
                      <span>Giá cho {rentalDays} ngày:</span>
                      <strong>{formatBasePriceToVndCurrency(car.totalPrice)}</strong>
                      <small>{formatBasePriceToVndCurrency(car.dailyPrice)} mỗi ngày</small>
                      <Button
                        as={Link}
                        to={`/cars/${car.id}/checkout?tab=car-rentals&location=${encodeURIComponent(activeSearch.location)}&pickupAt=${encodeURIComponent(activeSearch.pickupAt)}&dropoffAt=${encodeURIComponent(activeSearch.dropoffAt)}`}
                        className="car-rental-deal-button"
                      >
                        Xem Ưu Đãi
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {filteredCars.length === 0 && (
              <div className="search-results-empty">
                <h3>Không có xe nào phù hợp với tìm kiếm này</h3>
                <p>Hãy thử thành phố, quốc gia khác, hoặc giảm bộ lọc bên trái.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default CarRentalsPage
