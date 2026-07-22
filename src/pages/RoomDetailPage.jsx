import { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  fetchRoomById,
  selectRoomError,
  selectSelectedRoom,
  selectSelectedRoomStatus,
} from '../features/rooms/roomsSlice'
import { formatBasePriceToVndCurrency } from '../utils/currency'

function RoomDetailPage() {
  const { roomId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const room = useSelector(selectSelectedRoom)
  const status = useSelector(selectSelectedRoomStatus)
  const error = useSelector(selectRoomError)

  // Activity 3: tải chi tiết phòng theo id từ API.
  useEffect(() => {
    dispatch(fetchRoomById(roomId))
  }, [dispatch, roomId])

  const isCurrentRoom = room && room.id === roomId

  return (
    <Container className="page-section room-detail-page">
      <div className="room-page-head">
        <Link to="/rooms" className="room-btn room-btn-outline">
          <span className="material-symbols-outlined">arrow_back</span>
          Danh sách phòng
        </Link>
      </div>

      {status === 'loading' && (
        <div className="room-state room-state-loading">
          <span className="room-spinner" aria-hidden="true" />
          <p>Đang tải thông tin phòng...</p>
        </div>
      )}

      {status === 'failed' && (
        <div className="room-state room-state-error">
          <span className="material-symbols-outlined">error</span>
          <p>{error || 'Không tìm thấy phòng.'}</p>
        </div>
      )}

      {status === 'succeeded' && isCurrentRoom && (
        <div className="room-detail">
          <div className="room-detail-media">
            <img src={room.image} alt={room.name} />
          </div>
          <div className="room-detail-info">
            <h1 className="room-detail-name">{room.name}</h1>
            {room.location && (
              <p className="room-card-location">
                <span className="material-symbols-outlined">location_on</span>
                {room.location}
              </p>
            )}
            <p className="room-detail-desc">{room.description}</p>
            <div className="room-detail-price">
              <span className="room-detail-price-label">Giá gốc</span>
              <span className="room-price-original">
                {formatBasePriceToVndCurrency(room.originalPrice)}
              </span>
            </div>
            <div className="room-detail-price">
              <span className="room-detail-price-label">Giá hiện tại</span>
              <span className="room-price-current">
                {formatBasePriceToVndCurrency(room.currentPrice)}
              </span>
            </div>
            <div className="room-detail-actions">
              <button
                type="button"
                className="room-btn room-btn-primary"
                onClick={() => navigate(`/rooms/${room.id}/edit`)}
              >
                <span className="material-symbols-outlined">edit</span>
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
  )
}

export default RoomDetailPage
