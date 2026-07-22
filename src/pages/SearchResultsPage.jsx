import { useEffect, useMemo } from 'react'
import { Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  fetchRooms,
  selectRoomError,
  selectRooms,
  selectRoomsStatus,
} from '../features/rooms/roomsSlice'
import { selectCriteria } from '../features/stays/staysSlice'
import { toggleSaved } from '../features/saved/savedSlice'
import { useToast } from '../context/toastState'
import { toBookableStay } from '../utils/bookableRoom'
import { formatBasePriceToVndCurrency } from '../utils/currency'

function SearchResultsPage() {
  const dispatch = useDispatch()
  const showToast = useToast()
  const rooms = useSelector(selectRooms)
  const status = useSelector(selectRoomsStatus)
  const error = useSelector(selectRoomError)
  const criteria = useSelector(selectCriteria)
  const savedIds = useSelector((state) => state.saved.savedIds)

  // Booking dùng chung dữ liệu phòng với trang Quản Lý Phòng (từ REST API),
  // nên phòng do admin thêm/sửa/xóa sẽ tự phản ánh ở đây.
  useEffect(() => {
    dispatch(fetchRooms())
  }, [dispatch])

  const keyword = (criteria.destination || '').trim().toLowerCase()

  const visibleRooms = useMemo(() => {
    const bookable = rooms.map(toBookableStay)
    if (!keyword) {
      return bookable
    }
    return bookable.filter((room) =>
      `${room.name} ${room.description} ${room.location}`
        .toLowerCase()
        .includes(keyword),
    )
  }, [rooms, keyword])

  const handleToggleSaved = (room) => {
    const isSaved = savedIds.includes(room.id)
    dispatch(toggleSaved(room.id))
    showToast(
      isSaved ? `Đã bỏ lưu "${room.name}"` : `Đã lưu "${room.name}"`,
      isSaved ? 'info' : 'success',
    )
  }

  return (
    <Container className="page-section room-page">
      <div className="room-page-head">
        <div>
          <h1 className="room-page-title">Tìm phòng để đặt</h1>
          <p className="room-page-subtitle">
            {keyword
              ? `Kết quả cho "${criteria.destination}" — ${visibleRooms.length} phòng`
              : `Có ${visibleRooms.length} phòng đang mở đặt.`}
          </p>
        </div>
      </div>

      {status === 'loading' && (
        <div className="room-state room-state-loading">
          <span className="room-spinner" aria-hidden="true" />
          <p>Đang tải danh sách phòng...</p>
        </div>
      )}

      {status === 'failed' && (
        <div className="room-state room-state-error">
          <span className="material-symbols-outlined">error</span>
          <p>{error || 'Đã xảy ra lỗi khi tải dữ liệu.'}</p>
          <button
            type="button"
            className="room-btn room-btn-outline"
            onClick={() => dispatch(fetchRooms())}
          >
            Thử lại
          </button>
        </div>
      )}

      {status === 'succeeded' && visibleRooms.length === 0 && (
        <div className="room-state">
          <p>Không tìm thấy phòng phù hợp.</p>
        </div>
      )}

      {status === 'succeeded' && visibleRooms.length > 0 && (
        <div className="room-grid">
          {visibleRooms.map((room) => {
            const isSaved = savedIds.includes(room.id)
            return (
              <article key={room.id} className="room-card">
                <div className="room-card-media">
                  <Link to={`/stays/${room.id}`}>
                    <img src={room.image} alt={room.name} loading="lazy" />
                  </Link>
                  <button
                    type="button"
                    className={`room-save-btn${isSaved ? ' is-saved' : ''}`}
                    onClick={() => handleToggleSaved(room)}
                    aria-label={isSaved ? 'Bỏ lưu' : 'Lưu'}
                  >
                    <span className="material-symbols-outlined">
                      {isSaved ? 'favorite' : 'favorite_border'}
                    </span>
                  </button>
                </div>
                <div className="room-card-body">
                  <h3 className="room-card-name">
                    <Link to={`/stays/${room.id}`}>{room.name}</Link>
                  </h3>
                  {room.location && (
                    <p className="room-card-location">
                      <span className="material-symbols-outlined">location_on</span>
                      {room.location}
                    </p>
                  )}
                  <p className="room-card-desc">{room.description}</p>
                  <div className="room-card-price">
                    {room.originalPrice > room.currentPrice && (
                      <span className="room-price-original">
                        {formatBasePriceToVndCurrency(room.originalPrice)}
                      </span>
                    )}
                    <span className="room-price-current">
                      {formatBasePriceToVndCurrency(room.currentPrice)}
                    </span>
                    <span className="room-price-unit">/ đêm</span>
                  </div>
                  <div className="room-card-actions">
                    <Link to={`/stays/${room.id}`} className="room-btn room-btn-outline">
                      Chi tiết
                    </Link>
                    <Link to={`/stays/${room.id}`} className="room-btn room-btn-primary">
                      Đặt ngay
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </Container>
  )
}

export default SearchResultsPage
