import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Container, Form, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteSouvenir,
  fetchSouvenirs,
  selectSouvenirError,
  selectSouvenirMutationStatus,
  selectSouvenirs,
  selectSouvenirsStatus,
} from '../features/souvenirs/souvenirsSlice'
import { formatBasePriceToVndCurrency } from '../utils/currency'

function SouvenirListPage() {
  const dispatch = useDispatch()
  const souvenirs = useSelector(selectSouvenirs)
  const status = useSelector(selectSouvenirsStatus)
  const mutationStatus = useSelector(selectSouvenirMutationStatus)
  const error = useSelector(selectSouvenirError)
  const [query, setQuery] = useState('')
  const [deletingId, setDeletingId] = useState('')

  useEffect(() => {
    dispatch(fetchSouvenirs())
  }, [dispatch])

  const filteredSouvenirs = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return souvenirs

    return souvenirs.filter((souvenir) =>
      [souvenir.name, souvenir.description, souvenir.category, souvenir.origin]
        .join(' ')
        .toLowerCase()
        .includes(keyword),
    )
  }, [souvenirs, query])

  const handleDelete = async (souvenir) => {
    const confirmed = window.confirm(`Xoá "${souvenir.name}"?`)
    if (!confirmed) return

    setDeletingId(souvenir.id)
    try {
      await dispatch(deleteSouvenir(souvenir.id)).unwrap()
      dispatch(fetchSouvenirs())
    } finally {
      setDeletingId('')
    }
  }

  const isLoading = status === 'loading'

  return (
    <Container className="page-section destination-page">
      <div className="destination-toolbar">
        <div>
          <span>Quản lý đồ lưu niệm du lịch</span>
          <h1>Danh sách lưu niệm</h1>
          <p>Quản lý sản phẩm lưu niệm với REST API, Redux Toolkit và đầy đủ thao tác CRUD.</p>
        </div>
        <Button as={Link} to="/manage-souvenirs/new">
          Thêm sản phẩm
        </Button>
      </div>

      <div className="destination-search">
        <Form.Control
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Tìm theo tên, mô tả, loại hoặc xuất xứ"
          aria-label="Tìm kiếm lưu niệm"
        />
        <Button
          type="button"
          variant="outline-primary"
          onClick={() => dispatch(fetchSouvenirs())}
          disabled={isLoading}
        >
          Tải lại
        </Button>
      </div>

      {error && (
        <Alert variant="danger">
          {error}. Hãy chắc chắn API đang chạy với <code>npm run api</code>.
        </Alert>
      )}

      {isLoading ? (
        <div className="destination-state">
          <Spinner animation="border" role="status" />
          <span>Đang tải danh sách lưu niệm...</span>
        </div>
      ) : (
        <div className="destination-grid">
          {filteredSouvenirs.map((souvenir) => (
            <article className="destination-card" key={souvenir.id}>
              <Link to={`/manage-souvenirs/${souvenir.id}`} className="destination-card-image">
                <img src={souvenir.image} alt={souvenir.name} />
              </Link>
              <div className="destination-card-body">
                <div className="destination-card-meta">
                  <span>{souvenir.category}</span>
                  <span>{souvenir.stock > 0 ? `Còn ${souvenir.stock}` : 'Hết hàng'}</span>
                </div>
                <h2>
                  <Link to={`/manage-souvenirs/${souvenir.id}`}>{souvenir.name}</Link>
                </h2>
                <p>{souvenir.description}</p>
                <div className="destination-price">
                  <span>{formatBasePriceToVndCurrency(souvenir.originalPrice)}</span>
                  <strong>{formatBasePriceToVndCurrency(souvenir.currentPrice)}</strong>
                </div>
                <div className="destination-actions">
                  <Button
                    as={Link}
                    to={`/manage-souvenirs/${souvenir.id}`}
                    variant="outline-primary"
                    size="sm"
                  >
                    Chi tiết
                  </Button>
                  <Button
                    as={Link}
                    to={`/manage-souvenirs/${souvenir.id}/edit`}
                    variant="outline-secondary"
                    size="sm"
                  >
                    Sửa
                  </Button>
                  <Button
                    type="button"
                    variant="outline-danger"
                    size="sm"
                    disabled={mutationStatus === 'loading' && deletingId === souvenir.id}
                    onClick={() => handleDelete(souvenir)}
                  >
                    {mutationStatus === 'loading' && deletingId === souvenir.id ? 'Đang xoá' : 'Xoá'}
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {!isLoading && filteredSouvenirs.length === 0 && (
        <div className="destination-state">
          <h2>Không tìm thấy sản phẩm lưu niệm</h2>
          <p>Thêm sản phẩm mới hoặc đổi từ khoá tìm kiếm.</p>
        </div>
      )}
    </Container>
  )
}

export default SouvenirListPage
