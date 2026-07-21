import { useEffect, useState } from 'react'
import { Alert, Badge, Button, Container, Form, Spinner } from 'react-bootstrap'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchSouvenirById,
  selectSouvenirError,
  selectSouvenirMutationStatus,
  selectSelectedSouvenir,
  selectSelectedSouvenirStatus,
  updateSouvenir,
} from '../features/souvenirs/souvenirsSlice'
import { addBooking } from '../features/bookings/bookingsSlice'
import { useToast } from '../context/toastState'
import { readSession } from '../utils/authSession'
import { convertBasePriceToVnd, formatBasePriceToVndCurrency } from '../utils/currency'

function SouvenirDetailPage() {
  const { souvenirId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const showToast = useToast()
  const souvenir = useSelector(selectSelectedSouvenir)
  const status = useSelector(selectSelectedSouvenirStatus)
  const mutationStatus = useSelector(selectSouvenirMutationStatus)
  const error = useSelector(selectSouvenirError)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    dispatch(fetchSouvenirById(souvenirId))
  }, [souvenirId, dispatch])

  if (status === 'failed' && !souvenir) {
    return <Navigate to="/souvenirs" replace />
  }

  if (status === 'loading' || !souvenir || souvenir.id !== souvenirId) {
    return (
      <Container className="page-section destination-page">
        <div className="destination-state">
          <Spinner animation="border" role="status" />
          <span>Đang tải sản phẩm...</span>
        </div>
      </Container>
    )
  }

  const soldOut = souvenir.stock <= 0
  const isBuying = mutationStatus === 'loading'
  const discount = Math.max(
    0,
    Math.round(((souvenir.originalPrice - souvenir.currentPrice) / souvenir.originalPrice) * 100),
  )

  const handleBuy = async () => {
    if (soldOut || isBuying) return

    // Cần đăng nhập để tạo đơn hàng gắn với tài khoản.
    if (!readSession()) {
      showToast('Vui lòng đăng nhập để mua hàng.', 'info')
      navigate('/auth')
      return
    }

    const amount = Math.min(Math.max(1, quantity), souvenir.stock)
    const unitVnd = convertBasePriceToVnd(souvenir.currentPrice)

    try {
      // 1) Trừ tồn kho: gửi lại toàn bộ sản phẩm với stock đã giảm.
      await dispatch(
        updateSouvenir({
          id: souvenir.id,
          souvenir: {
            name: souvenir.name,
            description: souvenir.description,
            image: souvenir.image,
            category: souvenir.category,
            origin: souvenir.origin,
            originalPrice: souvenir.originalPrice,
            currentPrice: souvenir.currentPrice,
            stock: souvenir.stock - amount,
          },
        }),
      ).unwrap()

      // 2) Tạo đơn hàng trong "Đơn Đặt".
      const action = dispatch(
        addBooking({
          type: 'souvenir',
          title: souvenir.name,
          subtitle: [souvenir.category, souvenir.origin].filter(Boolean).join(' · '),
          image: souvenir.image,
          details: {
            'Số lượng': `${amount} sản phẩm`,
            'Đơn giá': formatBasePriceToVndCurrency(souvenir.currentPrice),
            'Xuất xứ': souvenir.origin || '—',
          },
          total: unitVnd * amount,
          currency: 'VND',
        }),
      )

      setQuantity(1)
      showToast(`Đã đặt mua ${amount} × "${souvenir.name}". Cảm ơn bạn!`, 'success')

      // 3) Chuyển tới trang xác nhận đơn.
      navigate(`/booking-confirmation/${action.payload.id}`)
    } catch (buyError) {
      showToast(buyError.message || 'Mua thất bại, vui lòng thử lại.', 'danger')
    }
  }

  return (
    <Container className="page-section destination-page">
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="destination-detail">
        <div className="destination-detail-image">
          <img src={souvenir.image} alt={souvenir.name} />
        </div>
        <div className="destination-content">
          <Link to="/souvenirs">Quay lại cửa hàng</Link>
          <span>
            {souvenir.category}
            {souvenir.origin ? ` · ${souvenir.origin}` : ''}
          </span>
          <h1>{souvenir.name}</h1>
          <p>{souvenir.description}</p>

          <div className="destination-price">
            <span>{formatBasePriceToVndCurrency(souvenir.originalPrice)}</span>
            <strong>{formatBasePriceToVndCurrency(souvenir.currentPrice)}</strong>
            {discount > 0 && <Badge bg="danger">-{discount}%</Badge>}
          </div>

          <div className="mb-3">
            {soldOut ? (
              <Badge bg="secondary">Hết hàng</Badge>
            ) : (
              <Badge bg="success">Còn {souvenir.stock} sản phẩm</Badge>
            )}
          </div>

          {!soldOut && (
            <Form.Group controlId="souvenir-quantity" className="mb-3" style={{ maxWidth: 160 }}>
              <Form.Label>Số lượng</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max={souvenir.stock}
                value={quantity}
                onChange={(event) => {
                  const next = Number(event.target.value)
                  if (!Number.isFinite(next)) return
                  setQuantity(Math.min(Math.max(1, Math.trunc(next)), souvenir.stock))
                }}
              />
            </Form.Group>
          )}

          <div className="destination-actions">
            <Button type="button" onClick={handleBuy} disabled={soldOut || isBuying}>
              {soldOut ? 'Hết hàng' : isBuying ? 'Đang xử lý...' : 'Mua ngay'}
            </Button>
            <Button as={Link} to="/souvenirs" variant="outline-secondary">
              Tiếp tục mua sắm
            </Button>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default SouvenirDetailPage
