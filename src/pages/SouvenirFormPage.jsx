import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Container, Form, Spinner } from 'react-bootstrap'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  addSouvenir,
  clearSouvenirError,
  fetchSouvenirById,
  selectSouvenirError,
  selectSouvenirMutationStatus,
  selectSelectedSouvenir,
  selectSelectedSouvenirStatus,
  updateSouvenir,
} from '../features/souvenirs/souvenirsSlice'
import { convertBasePriceToVnd, convertVndToBasePrice } from '../utils/currency'

const SOUVENIR_CATEGORIES = [
  'Móc khóa',
  'Áo thun',
  'Nón',
  'Đặc sản',
  'Đồ thủ công',
  'Khác',
]

const emptyForm = {
  name: '',
  description: '',
  image: '',
  category: '',
  origin: '',
  originalPrice: '',
  currentPrice: '',
  stock: '',
}

function toFormValues(souvenir) {
  if (!souvenir) return emptyForm

  return {
    name: souvenir.name || '',
    description: souvenir.description || '',
    image: souvenir.image || '',
    category: souvenir.category || '',
    origin: souvenir.origin || '',
    originalPrice: String(convertBasePriceToVnd(souvenir.originalPrice) || ''),
    currentPrice: String(convertBasePriceToVnd(souvenir.currentPrice) || ''),
    stock: souvenir.stock === undefined || souvenir.stock === null ? '' : String(souvenir.stock),
  }
}

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Vui lòng nhập tên sản phẩm'
  if (!values.description.trim()) errors.description = 'Vui lòng nhập mô tả'
  if (!values.image.trim()) errors.image = 'Vui lòng nhập URL ảnh'
  if (!values.category.trim()) errors.category = 'Vui lòng chọn loại sản phẩm'
  if (Number(values.originalPrice) <= 0) errors.originalPrice = 'Giá gốc phải lớn hơn 0'
  if (Number(values.currentPrice) <= 0) errors.currentPrice = 'Giá bán phải lớn hơn 0'
  if (
    Number(values.currentPrice) > 0 &&
    Number(values.originalPrice) > 0 &&
    Number(values.currentPrice) > Number(values.originalPrice)
  ) {
    errors.currentPrice = 'Giá bán không được lớn hơn giá gốc'
  }
  if (values.stock === '' || Number(values.stock) < 0 || !Number.isInteger(Number(values.stock))) {
    errors.stock = 'Số lượng tồn kho phải là số nguyên từ 0 trở lên'
  }
  return errors
}

function SouvenirEditor({ souvenirId, initialValues, isEdit }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const mutationStatus = useSelector(selectSouvenirMutationStatus)
  const error = useSelector(selectSouvenirError)
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
      name: values.name.trim(),
      description: values.description.trim(),
      image: values.image.trim(),
      category: values.category.trim(),
      origin: values.origin.trim(),
      originalPrice: convertVndToBasePrice(values.originalPrice),
      currentPrice: convertVndToBasePrice(values.currentPrice),
      stock: Number(values.stock),
    }

    if (isEdit) {
      const result = await dispatch(updateSouvenir({ id: souvenirId, souvenir: payload })).unwrap()
      navigate(`/manage-souvenirs/${result.id}`)
      return
    }

    const result = await dispatch(addSouvenir(payload)).unwrap()
    navigate(`/manage-souvenirs/${result.id}`)
  }

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form className="destination-form" onSubmit={handleSubmit} noValidate>
        <div className="destination-form-grid">
          <Form.Group controlId="souvenir-name">
            <Form.Label>Tên sản phẩm</Form.Label>
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

          <Form.Group controlId="souvenir-image">
            <Form.Label>URL ảnh sản phẩm</Form.Label>
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

          <Form.Group controlId="souvenir-category">
            <Form.Label>Loại sản phẩm</Form.Label>
            <Form.Select
              name="category"
              value={values.category}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={showErrors && Boolean(errors.category)}
              required
            >
              <option value="">-- Chọn loại --</option>
              {SOUVENIR_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="souvenir-origin">
            <Form.Label>Xuất xứ</Form.Label>
            <Form.Control
              name="origin"
              value={values.origin}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ví dụ: Hội An, Việt Nam"
            />
          </Form.Group>

          <Form.Group controlId="souvenir-original-price">
            <Form.Label>Giá gốc (VNĐ)</Form.Label>
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

          <Form.Group controlId="souvenir-current-price">
            <Form.Label>Giá bán (VNĐ)</Form.Label>
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

          <Form.Group controlId="souvenir-stock">
            <Form.Label>Số lượng tồn kho</Form.Label>
            <Form.Control
              type="number"
              min="0"
              step="1"
              name="stock"
              value={values.stock}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={showErrors && Boolean(errors.stock)}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.stock}</Form.Control.Feedback>
          </Form.Group>
        </div>

        <Form.Group controlId="souvenir-description">
          <Form.Label>Mô tả</Form.Label>
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
            {isSaving ? 'Đang lưu' : isEdit ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
          </Button>
          <Button as={Link} to="/manage-souvenirs" variant="outline-secondary">
            Huỷ
          </Button>
        </div>
      </Form>
    </>
  )
}

function SouvenirFormPage() {
  const { souvenirId } = useParams()
  const isEdit = Boolean(souvenirId)
  const dispatch = useDispatch()
  const selectedSouvenir = useSelector(selectSelectedSouvenir)
  const selectedStatus = useSelector(selectSelectedSouvenirStatus)

  useEffect(() => {
    dispatch(clearSouvenirError())
    if (isEdit) {
      dispatch(fetchSouvenirById(souvenirId))
    }
  }, [souvenirId, dispatch, isEdit])

  if (isEdit && selectedStatus === 'failed' && !selectedSouvenir) {
    return <Navigate to="/manage-souvenirs" replace />
  }

  if (isEdit && (selectedStatus === 'loading' || selectedSouvenir?.id !== souvenirId)) {
    return (
      <Container className="page-section destination-page">
        <div className="destination-state">
          <Spinner animation="border" role="status" />
          <span>Đang tải biểu mẫu chỉnh sửa...</span>
        </div>
      </Container>
    )
  }

  const initialValues = toFormValues(isEdit ? selectedSouvenir : null)
  const formKey = isEdit ? souvenirId : 'new-souvenir'

  return (
    <Container className="page-section destination-page destination-form-page">
      <div className="destination-content">
        <Link to="/manage-souvenirs">Quay lại danh sách</Link>
        <span>{isEdit ? 'Cập nhật bản ghi' : 'Tạo bản ghi'}</span>
        <h1>{isEdit ? 'Sửa sản phẩm lưu niệm' : 'Thêm sản phẩm lưu niệm'}</h1>
        <p>
          {isEdit
            ? 'Biểu mẫu được điền sẵn thông tin sản phẩm hiện có.'
            : 'Tạo một sản phẩm lưu niệm mới và gửi lên REST API.'}
        </p>
      </div>

      <SouvenirEditor
        key={formKey}
        souvenirId={souvenirId}
        initialValues={initialValues}
        isEdit={isEdit}
      />
    </Container>
  )
}

export default SouvenirFormPage
