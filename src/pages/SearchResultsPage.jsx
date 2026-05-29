import { useMemo, useState } from 'react'
import { Container } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Link, useSearchParams } from 'react-router-dom'
import FilterSidebar from '../components/search/FilterSidebar'
import StayCard from '../components/stay/StayCard'
import { selectCriteria, selectFilteredStays } from '../features/stays/staysSlice'
import { formatDestinationLabel, parseDestinationQuery } from '../utils/locationSearch'
import AirportTaxisPage from './AirportTaxisPage'
import CarRentalsPage from './CarRentalsPage'
import FlightsPage from './FlightsPage'

function StaysSearchResultsContent() {
  const criteria = useSelector(selectCriteria)
  const filteredStays = useSelector(selectFilteredStays)
  const [sortBy, setSortBy] = useState('Lựa Chọn Hàng Đầu')

  const sortedStays = useMemo(() => {
    const sorted = [...filteredStays]

    if (sortBy === 'Giá (Thấp đến Cao)') {
      sorted.sort((first, second) => first.pricePerNight - second.pricePerNight)
    } else if (sortBy === 'Giá (Cao đến Thấp)') {
      sorted.sort((first, second) => second.pricePerNight - first.pricePerNight)
    } else if (sortBy === 'Đánh Giá Cao Nhất') {
      sorted.sort((first, second) => second.reviewScore - first.reviewScore)
    }

    return sorted
  }, [filteredStays, sortBy])

  const parsedDestination = parseDestinationQuery(criteria.destination)
  const hasCountry = Boolean(parsedDestination.country)
  const hasCity = Boolean(parsedDestination.city)
  const hasDestination = hasCountry || hasCity
  const resultsLabel = formatDestinationLabel(parsedDestination) || 'Tất cả điểm đến'
  const pageTitle = hasCity ? `Kết quả tìm kiếm cho ${parsedDestination.city}` : 'Kết quả tìm kiếm'
  const pageSubtitle = hasDestination
    ? 'Khám phá những chỗ ở tốt nhất cho điểm đến bạn chọn.'
    : 'Duyệt qua các chỗ ở có sẵn trên tất cả điểm đến.'
  const resultsCountLabel = `${sortedStays.length} chỗ ở được tìm thấy`

  return (
    <Container className="page-section search-results-page">
      <nav className="search-breadcrumb">
        <Link to="/">Trang Chủ</Link>
        {hasCountry && (
          <>
            <span className="material-symbols-outlined">chevron_right</span>
            <span>{parsedDestination.country}</span>
          </>
        )}
        {hasCity && (
          <>
            <span className="material-symbols-outlined">chevron_right</span>
            <strong>{parsedDestination.city}</strong>
          </>
        )}
      </nav>

      <div className="search-results-heading">
        <h1>{pageTitle}</h1>
        <p>{pageSubtitle}</p>
      </div>

      <div className="search-results-layout">
        <aside className="search-results-sidebar">
          <FilterSidebar />
        </aside>

        <section className="search-results-content">
          <div className="search-results-toolbar">
            <span className="search-results-count">
              {resultsLabel}: {resultsCountLabel}
            </span>
            <div className="search-results-sort">
              <label htmlFor="search-sort">Sắp xếp theo:</label>
              <select
                id="search-sort"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option>Lựa Chọn Hàng Đầu</option>
                <option>Giá (Thấp đến Cao)</option>
                <option>Giá (Cao đến Thấp)</option>
                <option>Đánh Giá Cao Nhất</option>
              </select>
            </div>
          </div>

          <div className="search-results-list">
            {sortedStays.length > 0 ? (
              sortedStays.map((stay) => (
                <StayCard key={stay.id} stay={stay} />
              ))
            ) : (
              <div className="search-results-empty">
                <h3>Không có chỗ ở nào phù hợp với bộ lọc này</h3>
                <p>Hãy thử điểm đến rộng hơn, đánh giá thấp hơn, hoặc ngân sách đêm cao hơn.</p>
              </div>
            )}
          </div>

          {sortedStays.length > 0 && (
            <nav className="search-pagination">
              <button type="button" className="search-pagination-arrow">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button type="button" className="search-pagination-page is-active">
                1
              </button>
              <button type="button" className="search-pagination-arrow">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </nav>
          )}
        </section>
      </div>
    </Container>
  )
}

function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const activeTab = searchParams.get('tab')

  if (activeTab === 'flights') {
    return <FlightsPage />
  }

  if (activeTab === 'airport-taxis') {
    return <AirportTaxisPage />
  }

  if (activeTab === 'car-rentals') {
    return <CarRentalsPage />
  }

  return <StaysSearchResultsContent />
}

export default SearchResultsPage
