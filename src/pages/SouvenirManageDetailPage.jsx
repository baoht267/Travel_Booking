import { useEffect } from 'react'
import { Alert, Button, Container, Spinner } from 'react-bootstrap'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteSouvenir,
  fetchSouvenirById,
  selectSouvenirError,
  selectSouvenirMutationStatus,
  selectSelectedSouvenir,
  selectSelectedSouvenirStatus,
} from '../features/souvenirs/souvenirsSlice'
import { formatBasePriceToVndCurrency } from '../utils/currency'

function SouvenirManageDetailPage() {
  const { souvenirId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const souvenir = useSelector(selectSelectedSouvenir)
  const status = useSelector(selectSelectedSouvenirStatus)
  const mutationStatus = useSelector(selectSouvenirMutationStatus)
  const error = useSelector(selectSouvenirError)

  useEffect(() => {
    dispatch(fetchSouvenirById(souvenirId))
  }, [souvenirId, dispatch])

  const handleDelete = async () => {
    if (!souvenir) return
    const confirmed = window.confirm(`Xoá "${souvenir.name}"?`)
    if (!confirmed) return

    await dispatch(deleteSouvenir(souvenir.id)).unwrap()
    navigate('/manage-souvenirs', { replace: true })
  }

  if (status === 'failed' && !souvenir) {
    return <Navigate to="/manage-souvenirs" replace />
  }

  if (status === 'loading' || !souvenir || souvenir.id !== souvenirId) {
    return (
      <Container className="page-section destination-page">
        <div className="destination-state">
          <Spinner animation="border" role="status" />
          <span>Đang tải chi tiết sản phẩm...</span>
        </div>
      </Container>
    )
  }

  const discount = Math.max(
    0,
    Math.round(((souvenir.originalPrice - souvenir.currentPrice) / souvenir.originalPrice) * 100),
  )

  return (
    <Container className="page-section destination-page">
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="destination-detail">
        <div className="destination-detail-image">
          <img src={souvenir.image} alt={souvenir.name} />
        </div>
        <div className="destination-content">
          <Link to="/manage-souvenirs">Quay lại danh sách</Link>
          <span>
            {souvenir.category}
            {souvenir.origin ? ` · ${souvenir.origin}` : ''}
          </span>
          <h1>{souvenir.name}</h1>
          <p>{souvenir.description}</p>

          <dl className="destination-detail-list">
            <div>
              <dt>Giá gốc</dt>
              <dd>{formatBasePriceToVndCurrency(souvenir.originalPrice)}</dd>
            </div>
            <div>
              <dt>Giá bán</dt>
              <dd>{formatBasePriceToVndCurrency(souvenir.currentPrice)}</dd>
            </div>
            <div>
              <dt>Giảm giá</dt>
              <dd>{discount}%</dd>
            </div>
            <div>
              <dt>Tồn kho</dt>
              <dd>{souvenir.stock > 0 ? `${souvenir.stock} sản phẩm` : 'Hết hàng'}</dd>
            </div>
          </dl>

          <div className="destination-actions">
            <Button as={Link} to={`/manage-souvenirs/${souvenir.id}/edit`}>
              Sửa sản phẩm
            </Button>
            <Button
              type="button"
              variant="outline-danger"
              disabled={mutationStatus === 'loading'}
              onClick={handleDelete}
            >
              {mutationStatus === 'loading' ? 'Đang xoá' : 'Xoá'}
            </Button>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default SouvenirManageDetailPage
