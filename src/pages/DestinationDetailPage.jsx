import { useEffect } from 'react'
import { Alert, Button, Container, Spinner } from 'react-bootstrap'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteDestination,
  fetchDestinationById,
  selectDestinationError,
  selectDestinationMutationStatus,
  selectSelectedDestination,
  selectSelectedDestinationStatus,
} from '../features/destinations/destinationsSlice'

function formatPrice(value) {
  return `$${Number(value || 0).toLocaleString('en-US')}`
}

function DestinationDetailPage() {
  const { destinationId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const destination = useSelector(selectSelectedDestination)
  const status = useSelector(selectSelectedDestinationStatus)
  const mutationStatus = useSelector(selectDestinationMutationStatus)
  const error = useSelector(selectDestinationError)

  useEffect(() => {
    dispatch(fetchDestinationById(destinationId))
  }, [destinationId, dispatch])

  const handleDelete = async () => {
    if (!destination) return
    const confirmed = window.confirm(`Delete "${destination.name}"?`)
    if (!confirmed) return

    await dispatch(deleteDestination(destination.id)).unwrap()
    navigate('/manage-destinations', { replace: true })
  }

  if (status === 'failed' && !destination) {
    return <Navigate to="/manage-destinations" replace />
  }

  if (status === 'loading' || !destination || destination.id !== destinationId) {
    return (
      <Container className="page-section text-dark">
        <div className="destination-state">
          <Spinner animation="border" role="status" />
          <span>Loading destination detail...</span>
        </div>
      </Container>
    )
  }

  return (
    <Container className="page-section text-dark">
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="destination-detail">
        <div className="destination-detail-image">
          <img src={destination.image} alt={destination.name} />
        </div>
        <div>
          <Link to="/manage-destinations" className="d-inline-flex mb-3 fw-bold text-decoration-none">
            Back to list
          </Link>
          <span className="d-block small fw-bold text-primary text-uppercase">
            {destination.city}, {destination.country}
          </span>
          <h1 className="my-2 fw-bold">{destination.name}</h1>
          <p className="mb-0 text-secondary lh-lg">{destination.description}</p>

          <dl className="destination-detail-list">
            <div>
              <dt>Original price</dt>
              <dd>{formatPrice(destination.originalPrice)}</dd>
            </div>
            <div>
              <dt>Current price</dt>
              <dd>{formatPrice(destination.currentPrice)}</dd>
            </div>
            <div>
              <dt>Discount</dt>
              <dd>
                {Math.max(
                  0,
                  Math.round(
                    ((destination.originalPrice - destination.currentPrice) /
                      destination.originalPrice) *
                      100,
                  ),
                )}
                %
              </dd>
            </div>
          </dl>

          <div className="d-flex flex-wrap gap-2 mt-3">
            <Button as={Link} to={`/manage-destinations/${destination.id}/edit`}>
              Edit Destination
            </Button>
            <Button
              type="button"
              variant="outline-danger"
              disabled={mutationStatus === 'loading'}
              onClick={handleDelete}
            >
              {mutationStatus === 'loading' ? 'Deleting' : 'Delete'}
            </Button>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default DestinationDetailPage
