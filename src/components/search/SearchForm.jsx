import { useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addRecentSearch, selectCriteria, updateCriteria } from '../../features/stays/staysSlice'

function SearchForm({ compact = false, home = false, showWorkToggle = false }) {
  const criteria = useSelector(selectCriteria)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [travelForWork, setTravelForWork] = useState(false)

  const handleFieldChange = (event) => {
    const { name, value } = event.target

    dispatch(
      updateCriteria({
        [name]: name === 'guests' || name === 'rooms' ? Number(value) : value,
      }),
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(addRecentSearch(criteria))
    navigate('/search')
  }

  if (home) {
    return (
      <div className="home-search-card">
        <div className="search-form-shell search-form-shell-home">
          <Form onSubmit={handleSubmit}>
            <Row className="g-1 g-lg-0 align-items-stretch">
              <Col lg={4}>
                <div className="search-home-field search-home-field-border">
                  <span className="material-symbols-outlined search-home-icon">bed</span>
                  <Form.Control
                    id="destination"
                    name="destination"
                    className="search-home-control"
                    value={criteria.destination}
                    onChange={handleFieldChange}
                    placeholder="Country, then city"
                  />
                </div>
              </Col>
              <Col lg={3}>
                <div className="search-home-field search-home-field-border">
                  <span className="material-symbols-outlined search-home-icon">
                    calendar_month
                  </span>
                  <div className="search-home-date-group">
                    <Form.Control
                      id="checkIn"
                      name="checkIn"
                      type="date"
                      className="search-home-control"
                      value={criteria.checkIn}
                      onChange={handleFieldChange}
                    />
                    <span className="search-home-separator">-</span>
                    <Form.Control
                      id="checkOut"
                      name="checkOut"
                      type="date"
                      className="search-home-control"
                      value={criteria.checkOut}
                      onChange={handleFieldChange}
                    />
                  </div>
                </div>
              </Col>
              <Col lg={3}>
                <div className="search-home-field search-home-field-border">
                  <span className="material-symbols-outlined search-home-icon">person</span>
                  <div className="search-home-guests">
                    <Form.Select
                      id="guests"
                      name="guests"
                      className="search-home-control search-home-select"
                      value={criteria.guests}
                      onChange={handleFieldChange}
                    >
                      {[1, 2, 3, 4, 5, 6].map((count) => (
                        <option key={count} value={count}>
                          {count} adults
                        </option>
                      ))}
                    </Form.Select>
                    <span className="search-home-separator">|</span>
                    <Form.Select
                      id="rooms"
                      name="rooms"
                      className="search-home-control search-home-select"
                      value={criteria.rooms}
                      onChange={handleFieldChange}
                    >
                      {[1, 2, 3, 4].map((count) => (
                        <option key={count} value={count}>
                          {count} room
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                  <span className="material-symbols-outlined search-home-expand">
                    expand_more
                  </span>
                </div>
              </Col>
              <Col lg={2}>
                <Button type="submit" className="search-submit search-submit-home w-100">
                  Search
                </Button>
              </Col>
            </Row>

            {showWorkToggle && (
              <Form.Check
                id="travel-for-work"
                type="checkbox"
                className="home-work-toggle"
                label="I'm traveling for work"
                checked={travelForWork}
                onChange={(event) => setTravelForWork(event.target.checked)}
              />
            )}
          </Form>
        </div>
      </div>
    )
  }

  return (
    <div className={compact ? '' : 'search-card'}>
      <div className="search-form-shell">
        <Form onSubmit={handleSubmit}>
          <Row className="g-3 align-items-stretch">
            <Col lg={4}>
              <div className="search-input-group">
                <label htmlFor="destination-default" className="search-input-label">
                  Destination
                </label>
                <Form.Control
                  id="destination-default"
                  name="destination"
                  className="search-input-control"
                  value={criteria.destination}
                  onChange={handleFieldChange}
                  placeholder="Country, then city"
                />
              </div>
            </Col>
            <Col sm={6} lg={2}>
              <div className="search-input-group">
                <label htmlFor="checkIn-default" className="search-input-label">
                  Check-in
                </label>
                <Form.Control
                  id="checkIn-default"
                  name="checkIn"
                  type="date"
                  className="search-input-control"
                  value={criteria.checkIn}
                  onChange={handleFieldChange}
                />
              </div>
            </Col>
            <Col sm={6} lg={2}>
              <div className="search-input-group">
                <label htmlFor="checkOut-default" className="search-input-label">
                  Check-out
                </label>
                <Form.Control
                  id="checkOut-default"
                  name="checkOut"
                  type="date"
                  className="search-input-control"
                  value={criteria.checkOut}
                  onChange={handleFieldChange}
                />
              </div>
            </Col>
            <Col xs={6} lg={1}>
              <div className="search-input-group">
                <label htmlFor="guests-default" className="search-input-label">
                  Guests
                </label>
                <Form.Select
                  id="guests-default"
                  name="guests"
                  className="search-input-control"
                  value={criteria.guests}
                  onChange={handleFieldChange}
                >
                  {[1, 2, 3, 4, 5, 6].map((count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </Col>
            <Col xs={6} lg={1}>
              <div className="search-input-group">
                <label htmlFor="rooms-default" className="search-input-label">
                  Rooms
                </label>
                <Form.Select
                  id="rooms-default"
                  name="rooms"
                  className="search-input-control"
                  value={criteria.rooms}
                  onChange={handleFieldChange}
                >
                  {[1, 2, 3, 4].map((count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </Col>
            <Col lg={2}>
              <Button type="submit" className="search-submit w-100">
                Search
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  )
}

export default SearchForm
