import { useEffect, useMemo, useState } from 'react'
import { Alert, Badge, Button, Container, Form, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchSouvenirs,
  selectSouvenirError,
  selectSouvenirs,
  selectSouvenirsStatus,
} from '../features/souvenirs/souvenirsSlice'
import { formatBasePriceToVndCurrency } from '../utils/currency'

function SouvenirShopPage() {
  const dispatch = useDispatch()
  const souvenirs = useSelector(selectSouvenirs)
  const status = useSelector(selectSouvenirsStatus)
  const error = useSelector(selectSouvenirError)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  useEffect(() => {
    dispatch(fetchSouvenirs())
  }, [dispatch])

  const categories = useMemo(() => {
    const unique = new Set(souvenirs.map((souvenir) => souvenir.category).filter(Boolean))
    return ['all', ...unique]
  }, [souvenirs])

  const filteredSouvenirs = useMemo(() => {
    const keyword = query.trim().toLowerCase()

    return souvenirs.filter((souvenir) => {
      const matchesCategory = category === 'all' || souvenir.category === category
      const matchesKeyword =
        !keyword ||
        [souvenir.name, souvenir.description, souvenir.origin]
          .join(' ')
          .toLowerCase()
          .includes(keyword)
      return matchesCategory && matchesKeyword
    })
  }, [souvenirs, query, category])

  const isLoading = status === 'loading'

  return (
    <Container className="page-section destination-page">
      <div className="destination-toolbar">
        <div>
          <span>GOCHIP Souvenir Shop</span>
          <h1>Đồ lưu niệm du lịch</h1>
          <p>Mang một chút Việt Nam về nhà — quà lưu niệm thủ công, đặc sản và nhiều hơn nữa.</p>
        </div>
      </div>

      <div className="destination-search">
        <Form.Control
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Tìm theo tên, mô tả hoặc xuất xứ"
          aria-label="Tìm kiếm lưu niệm"
        />
        <Form.Select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Lọc theo loại"
          style={{ maxWidth: 220 }}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item === 'all' ? 'Tất cả loại' : item}
            </option>
          ))}
        </Form.Select>
      </div>

      {error && (
        <Alert variant="danger">
          {error}. Hãy chắc chắn API đang chạy với <code>npm run api</code>.
        </Alert>
      )}

      {isLoading ? (
        <div className="destination-state">
          <Spinner animation="border" role="status" />
          <span>Đang tải sản phẩm lưu niệm...</span>
        </div>
      ) : (
        <div className="destination-grid">
          {filteredSouvenirs.map((souvenir) => {
            const soldOut = souvenir.stock <= 0
            return (
              <article className="destination-card" key={souvenir.id}>
                <Link to={`/souvenirs/${souvenir.id}`} className="destination-card-image">
                  <img src={souvenir.image} alt={souvenir.name} />
                </Link>
                <div className="destination-card-body">
                  <div className="destination-card-meta">
                    <span>{souvenir.category}</span>
                    <span>
                      {soldOut ? (
                        <Badge bg="secondary">Hết hàng</Badge>
                      ) : (
                        <Badge bg="success">Còn {souvenir.stock}</Badge>
                      )}
                    </span>
                  </div>
                  <h2>
                    <Link to={`/souvenirs/${souvenir.id}`}>{souvenir.name}</Link>
                  </h2>
                  <p>{souvenir.description}</p>
                  <div className="destination-price">
                    <span>{formatBasePriceToVndCurrency(souvenir.originalPrice)}</span>
                    <strong>{formatBasePriceToVndCurrency(souvenir.currentPrice)}</strong>
                  </div>
                  <div className="destination-actions">
                    <Button
                      as={Link}
                      to={`/souvenirs/${souvenir.id}`}
                      variant="primary"
                      size="sm"
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {!isLoading && filteredSouvenirs.length === 0 && (
        <div className="destination-state">
          <h2>Không tìm thấy sản phẩm phù hợp</h2>
          <p>Thử đổi từ khoá hoặc chọn loại khác.</p>
        </div>
      )}
    </Container>
  )
}

export default SouvenirShopPage
