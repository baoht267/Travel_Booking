import { Card, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectAllStays,
  selectCriteria,
  selectFilters,
  togglePropertyType,
  updateCriteria,
  updateFilters,
} from '../../features/stays/staysSlice'

function FilterSidebar() {
  const criteria = useSelector(selectCriteria)
  const filters = useSelector(selectFilters)
  const stays = useSelector(selectAllStays)
  const dispatch = useDispatch()
  const categories = [...new Set(stays.map((stay) => stay.propertyType))]

  return (
    <Card className="search-filter-card">
      <Card.Body className="p-4">
        <h2 className="search-filter-title">Filter by</h2>

        <div className="search-filter-block">
          <label className="search-filter-label" htmlFor="destination-filter">
            Destination (Country, City)
          </label>
          <div className="search-filter-input-wrap">
            <span className="material-symbols-outlined search-filter-icon">search</span>
            <Form.Control
              id="destination-filter"
              value={criteria.destination}
              placeholder="France, Paris"
              className="search-filter-input"
              onChange={(event) =>
                dispatch(updateCriteria({ destination: event.target.value }))
              }
            />
          </div>
        </div>

        <div className="search-filter-block">
          <label className="search-filter-label" htmlFor="price-range">
            Price Range (per night)
          </label>
          <Form.Range
            id="price-range"
            min={0}
            max={1000}
            step={10}
            value={filters.maxPrice}
            className="search-filter-range"
            onChange={(event) =>
              dispatch(updateFilters({ maxPrice: Number(event.target.value) }))
            }
          />
          <div className="search-filter-range-labels">
            <span>EUR0</span>
            <span>EUR1,000+</span>
          </div>
        </div>

        <div className="search-filter-block">
          <div className="search-filter-label">Guest Rating</div>
          <div className="search-filter-options">
            <Form.Check
              id="rating-9"
              type="checkbox"
              label="9+ Superb"
              checked={filters.minReviewScore === 9}
              onChange={(event) =>
                dispatch(updateFilters({ minReviewScore: event.target.checked ? 9 : 0 }))
              }
            />
            <Form.Check
              id="rating-8"
              type="checkbox"
              label="8+ Very Good"
              checked={filters.minReviewScore === 8}
              onChange={(event) =>
                dispatch(updateFilters({ minReviewScore: event.target.checked ? 8 : 0 }))
              }
            />
            <Form.Check
              id="rating-7"
              type="checkbox"
              label="7+ Good"
              checked={filters.minReviewScore === 7}
              onChange={(event) =>
                dispatch(updateFilters({ minReviewScore: event.target.checked ? 7 : 0 }))
              }
            />
          </div>
        </div>

        <div className="search-filter-block mb-0">
          <div className="search-filter-label">Category</div>
          <div className="search-filter-options">
            {categories.map((category) => (
              <Form.Check
                key={category}
                id={category}
                type="checkbox"
                label={category}
                checked={filters.propertyTypes.includes(category)}
                onChange={() => dispatch(togglePropertyType(category))}
              />
            ))}
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

export default FilterSidebar
