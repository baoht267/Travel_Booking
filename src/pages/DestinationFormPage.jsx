import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Container, Form, Spinner } from 'react-bootstrap'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  addDestination,
  clearDestinationError,
  fetchDestinationById,
  selectDestinationError,
  selectDestinationMutationStatus,
  selectSelectedDestination,
  selectSelectedDestinationStatus,
  updateDestination,
} from '../features/destinations/destinationsSlice'

const emptyForm = {
  name: '',
  description: '',
  image: '',
  country: '',
  city: '',
  originalPrice: '',
  currentPrice: '',
}

function toFormValues(destination) {
  if (!destination) return emptyForm

  return {
    name: destination.name || '',
    description: destination.description || '',
    image: destination.image || '',
    country: destination.country || '',
    city: destination.city || '',
    originalPrice: String(destination.originalPrice || ''),
    currentPrice: String(destination.currentPrice || ''),
  }
}

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Name is required'
  if (!values.description.trim()) errors.description = 'Description is required'
  if (!values.image.trim()) errors.image = 'Image URL is required'
  if (!values.country.trim()) errors.country = 'Country is required'
  if (!values.city.trim()) errors.city = 'City is required'
  if (Number(values.originalPrice) <= 0) errors.originalPrice = 'Original price must be greater than 0'
  if (Number(values.currentPrice) <= 0) errors.currentPrice = 'Current price must be greater than 0'
  if (
    Number(values.currentPrice) > 0 &&
    Number(values.originalPrice) > 0 &&
    Number(values.currentPrice) > Number(values.originalPrice)
  ) {
    errors.currentPrice = 'Current price cannot be greater than original price'
  }
  return errors
}

function DestinationEditor({ destinationId, initialValues, isEdit }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const mutationStatus = useSelector(selectDestinationMutationStatus)
  const error = useSelector(selectDestinationError)
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const errors = useMemo(() => validate(values), [values])
  const showErrors = submitted || Object.keys(touched).length > 0
  const isSaving = mutationStatus === 'loading'

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleBlur = (event) => {
    setTouched((current) => ({
      ...current,
      [event.target.name]: true,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitted(true)

    if (Object.keys(errors).length > 0) return

    const payload = {
      ...values,
      name: values.name.trim(),
      description: values.description.trim(),
      image: values.image.trim(),
      country: values.country.trim(),
      city: values.city.trim(),
      originalPrice: Number(values.originalPrice),
      currentPrice: Number(values.currentPrice),
    }

    if (isEdit) {
      const result = await dispatch(updateDestination({ id: destinationId, destination: payload })).unwrap()
      navigate(`/manage-destinations/${result.id}`)
      return
    }

    const result = await dispatch(addDestination(payload)).unwrap()
    navigate(`/manage-destinations/${result.id}`)
  }

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form className="destination-form" onSubmit={handleSubmit} noValidate>
        <div className="destination-form-grid">
          <Form.Group controlId="destination-name">
            <Form.Label>Destination name</Form.Label>
            <Form.Control
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={showErrors && Boolean(errors.name)}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="destination-image">
            <Form.Label>Destination image URL</Form.Label>
            <Form.Control
              name="image"
              value={values.image}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={showErrors && Boolean(errors.image)}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.image}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="destination-country">
            <Form.Label>Country</Form.Label>
            <Form.Control
              name="country"
              value={values.country}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={showErrors && Boolean(errors.country)}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.country}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="destination-city">
            <Form.Label>City</Form.Label>
            <Form.Control
              name="city"
              value={values.city}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={showErrors && Boolean(errors.city)}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="destination-original-price">
            <Form.Label>Original price</Form.Label>
            <Form.Control
              type="number"
              min="1"
              name="originalPrice"
              value={values.originalPrice}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={showErrors && Boolean(errors.originalPrice)}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.originalPrice}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="destination-current-price">
            <Form.Label>Current price</Form.Label>
            <Form.Control
              type="number"
              min="1"
              name="currentPrice"
              value={values.currentPrice}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={showErrors && Boolean(errors.currentPrice)}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.currentPrice}</Form.Control.Feedback>
          </Form.Group>
        </div>

        <Form.Group controlId="destination-description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            name="description"
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={showErrors && Boolean(errors.description)}
            required
          />
          <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
        </Form.Group>

        <div className="destination-actions">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving' : isEdit ? 'Update Destination' : 'Add Destination'}
          </Button>
          <Button as={Link} to="/manage-destinations" variant="outline-secondary">
            Cancel
          </Button>
        </div>
      </Form>
    </>
  )
}

function DestinationFormPage() {
  const { destinationId } = useParams()
  const isEdit = Boolean(destinationId)
  const dispatch = useDispatch()
  const selectedDestination = useSelector(selectSelectedDestination)
  const selectedStatus = useSelector(selectSelectedDestinationStatus)

  useEffect(() => {
    dispatch(clearDestinationError())
    if (isEdit) {
      dispatch(fetchDestinationById(destinationId))
    }
  }, [destinationId, dispatch, isEdit])

  if (isEdit && selectedStatus === 'failed' && !selectedDestination) {
    return <Navigate to="/manage-destinations" replace />
  }

  if (isEdit && (selectedStatus === 'loading' || selectedDestination?.id !== destinationId)) {
    return (
      <Container className="page-section destination-page">
        <div className="destination-state">
          <Spinner animation="border" role="status" />
          <span>Loading edit form...</span>
        </div>
      </Container>
    )
  }

  const initialValues = toFormValues(isEdit ? selectedDestination : null)
  const formKey = isEdit ? destinationId : 'new-destination'

  return (
    <Container className="page-section destination-page destination-form-page">
      <div className="destination-content">
        <Link to="/manage-destinations">
          Back to list
        </Link>
        <span>{isEdit ? 'Update record' : 'Create record'}</span>
        <h1>{isEdit ? 'Edit Destination' : 'Add Destination'}</h1>
        <p>
          {isEdit
            ? 'The form is pre-populated with existing destination information.'
            : 'Create a new destination record and submit it to the REST API.'}
        </p>
      </div>

      <DestinationEditor
        key={formKey}
        destinationId={destinationId}
        initialValues={initialValues}
        isEdit={isEdit}
      />
    </Container>
  )
}

export default DestinationFormPage
