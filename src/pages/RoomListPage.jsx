import { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  deleteRoom,
  fetchRooms,
  selectRoomError,
  selectRooms,
  selectRoomsStatus,
} from '../features/rooms/roomsSlice'
import { useToast } from '../context/toastState'
import { formatBasePriceToVndCurrency } from '../utils/currency'

function RoomListPage() {
  const dispatch = useDispatch()
  const showToast = useToast()
  const rooms = useSelector(selectRooms)
  const status = useSelector(selectRoomsStatus)
  const error = useSelector(selectRoomError)

  // Activity 1: tải danh sách phòng từ REST API khi vào trang.
  useEffect(() => {
    dispatch(fetchRooms())
  }, [dispatch])

  const handleDelete = async (room) => {
    if (!window.confirm(`Xóa phòng "${room.name}"?`)) {
      return
    }
    try {
      await dispatch(deleteRoom(room.id)).unwrap()
      showToast(`Đã xóa phòng "${room.name}"`, 'success')
    } catch (deleteError) {
      showToast(deleteError.message || 'Không thể xóa phòng', 'danger')
    }
  }

  return (
    <Container className="page-section room-page">
      <div className="room-page-head">
        <div>
          <h1 className="room-page-title">Quản Lý Phòng</h1>
          <p className="room-page-subtitle">
            Danh sách phòng được tải trực tiếp từ REST API.
          </p>
        </div>
        <Link to="/rooms/new" className="room-btn room-btn-primary">
          <span className="material-symbols-outlined">add</span>
          Thêm phòng
        </Link>
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

      {status === 'succeeded' && rooms.length === 0 && (
        <div className="room-state">
          <p>Chưa có phòng nào. Hãy thêm phòng mới.</p>
        </div>
      )}

      {status === 'succeeded' && rooms.length > 0 && (
        <div className="room-grid">
          {rooms.map((room) => (
            <article key={room.id} className="room-card">
              <Link to={`/rooms/${room.id}`} className="room-card-media">
                <img src={room.image} alt={room.name} loading="lazy" />
              </Link>
              <div className="room-card-body">
                <h3 className="room-card-name">
                  <Link to={`/rooms/${room.id}`}>{room.name}</Link>
                </h3>
                {room.location && (
                  <p className="room-card-location">
                    <span className="material-symbols-outlined">location_on</span>
                    {room.location}
                  </p>
                )}
                <p className="room-card-desc">{room.description}</p>
                <div className="room-card-price">
                  <span className="room-price-original">
                    {formatBasePriceToVndCurrency(room.originalPrice)}
                  </span>
                  <span className="room-price-current">
                    {formatBasePriceToVndCurrency(room.currentPrice)}
                  </span>
                </div>
                <div className="room-card-actions">
                  <Link to={`/rooms/${room.id}`} className="room-btn room-btn-outline">
                    Chi tiết
                  </Link>
                  <Link to={`/rooms/${room.id}/edit`} className="room-btn room-btn-outline">
                    Sửa
                  </Link>
                  <button
                    type="button"
                    className="room-btn room-btn-danger"
                    onClick={() => handleDelete(room)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </Container>
  )
}

export default RoomListPage
