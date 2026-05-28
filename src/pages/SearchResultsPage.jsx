import { useMemo, useState } from 'react'
import { Container } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import FilterSidebar from '../components/search/FilterSidebar'
import StayCard from '../components/stay/StayCard'
import { selectCriteria, selectFilteredStays } from '../features/stays/staysSlice'
import { formatDestinationLabel, parseDestinationQuery } from '../utils/locationSearch'

function SearchResultsPage() {
  const criteria = useSelector(selectCriteria)
  const filteredStays = useSelector(selectFilteredStays)
  const [sortBy, setSortBy] = useState('Top Picks')

  const sortedStays = useMemo(() => {
    const sorted = [...filteredStays]

    if (sortBy === 'Price (Low to High)') {
      sorted.sort((first, second) => first.pricePerNight - second.pricePerNight)
    } else if (sortBy === 'Price (High to Low)') {
      sorted.sort((first, second) => second.pricePerNight - first.pricePerNight)
    } else if (sortBy === 'Highest Rated') {
      sorted.sort((first, second) => second.reviewScore - first.reviewScore)
    }

    return sorted
  }, [filteredStays, sortBy])

  const parsedDestination = parseDestinationQuery(criteria.destination)
  const hasCountry = Boolean(parsedDestination.country)
  const hasCity = Boolean(parsedDestination.city)
  const hasDestination = hasCountry || hasCity
  const resultsLabel = formatDestinationLabel(parsedDestination) || 'All destinations'
  const pageTitle = hasCity ? `Search results for ${parsedDestination.city}` : 'Search results'
  const pageSubtitle = hasDestination
    ? 'Discover the best stays for your selected destination.'
    : 'Browse available stays across all destinations.'
  const resultsCountLabel = `${sortedStays.length} stay${
    sortedStays.length === 1 ? '' : 's'
  } found`

  return (
    <Container className="page-section search-results-page">
      <nav className="search-breadcrumb">
        <Link to="/">Home</Link>
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
              <label htmlFor="search-sort">Sort by:</label>
              <select
                id="search-sort"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option>Top Picks</option>
                <option>Price (Low to High)</option>
                <option>Price (High to Low)</option>
                <option>Highest Rated</option>
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
                <h3>No stays match these filters</h3>
                <p>Try a broader destination, lower rating, or a higher nightly budget.</p>
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

export default SearchResultsPage
