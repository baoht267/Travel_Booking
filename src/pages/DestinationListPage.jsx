import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Container, Form, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteDestination,
  fetchDestinations,
  selectDestinationError,
  selectDestinationMutationStatus,
  selectDestinations,
  selectDestinationsStatus,
} from '../features/destinations/destinationsSlice'

function formatPrice(value) {
  return `$${Number(value || 0).toLocaleString('en-US')}`
}

function DestinationListPage() {
  const dispatch = useDispatch()
  const destinations = useSelector(selectDestinations)
  const status = useSelector(selectDestinationsStatus)
  const mutationStatus = useSelector(selectDestinationMutationStatus)
  const error = useSelector(selectDestinationError)
  const [query, setQuery] = useState('')
  const [deletingId, setDeletingId] = useState('')

  useEffect(() => {
    dispatch(fetchDestinations())
  }, [dispatch])

  const filteredDestinations = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return destinations

    return destinations.filter((destination) =>
      [destination.name, destination.description, destination.city, destination.country]
        .join(' ')
        .toLowerCase()
        .includes(keyword),
    )
  }, [destinations, query])

  const handleDelete = async (destination) => {
    const confirmed = window.confirm(`Delete "${destination.name}"?`)
    if (!confirmed) return

    setDeletingId(destination.id)
    try {
      await dispatch(deleteDestination(destination.id)).unwrap()
      dispatch(fetchDestinations())
    } finally {
      setDeletingId('')
    }
  }

  const isLoading = status === 'loading'

  return (
    <Container className="page-section destination-page">
      <div className="destination-toolbar">
        <div>
          <span>Travel Destination Management</span>
          <h1>Destination List</h1>
          <p>Manage destination records with a REST API, Redux Toolkit, and full CRUD actions.</p>
        </div>
        <Button as={Link} to="/manage-destinations/new">
          Add Destination
        </Button>
      </div>

      <div className="destination-search">
        <Form.Control
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, city, country, or description"
          aria-label="Search destinations"
        />
        <Button
          type="button"
          variant="outline-primary"
          onClick={() => dispatch(fetchDestinations())}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="danger">
          {error}. Make sure the API is running with <code>npm run api</code>.
        </Alert>
      )}

      {isLoading ? (
        <div className="destination-state">
          <Spinner animation="border" role="status" />
          <span>Loading destinations...</span>
        </div>
      ) : (
        <div className="destination-grid">
          {filteredDestinations.map((destination) => (
            <article className="destination-card" key={destination.id}>
              <Link to={`/manage-destinations/${destination.id}`} className="destination-card-image">
                <img src={destination.image} alt={destination.name} />
              </Link>
              <div className="destination-card-body">
                <div className="destination-card-meta">
                  <span>{destination.city}</span>
                  <span>{destination.country}</span>
                </div>
                <h2>
                  <Link to={`/manage-destinations/${destination.id}`}>{destination.name}</Link>
                </h2>
                <p>{destination.description}</p>
                <div className="destination-price">
                  <span>
                    {formatPrice(destination.originalPrice)}
                  </span>
                  <strong>{formatPrice(destination.currentPrice)}</strong>
                </div>
                <div className="destination-actions">
                  <Button
                    as={Link}
                    to={`/manage-destinations/${destination.id}`}
                    variant="outline-primary"
                    size="sm"
                  >
                    Detail
                  </Button>
                  <Button
                    as={Link}
                    to={`/manage-destinations/${destination.id}/edit`}
                    variant="outline-secondary"
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="outline-danger"
                    size="sm"
                    disabled={mutationStatus === 'loading' && deletingId === destination.id}
                    onClick={() => handleDelete(destination)}
                  >
                    {mutationStatus === 'loading' && deletingId === destination.id ? 'Deleting' : 'Delete'}
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {!isLoading && filteredDestinations.length === 0 && (
        <div className="destination-state">
          <h2>No destinations found</h2>
          <p>Add a new destination or change the search keyword.</p>
        </div>
      )}
    </Container>
  )
}

export default DestinationListPage
