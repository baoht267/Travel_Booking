import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {
  addRoom,
  fetchRoomById,
  selectRooms,
  selectSelectedRoom,
  updateRoom,
} from '../features/rooms/roomsSlice'
import { useToast } from '../context/toastState'

const EMPTY_FORM = {
  name: '',
  description: '',
  image: '',
  location: '',
  originalPrice: '',
  currentPrice: '',
}

function RoomFormPage() {
  const { roomId } = useParams()
  const isEdit = Boolean(roomId)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const showToast = useToast()
  const rooms = useSelector(selectRooms)
  const selectedRoom = useSelector(selectSelectedRoom)

  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [loadedId, setLoadedId] = useState(null)

  // Activity 3: nếu chưa có sẵn dữ liệu phòng cần sửa thì tải theo id từ API.
  useEffect(() => {
    if (!isEdit) {
      return
    }

    const alreadyLoaded = rooms.some((item) => item.id === roomId)
    if (!alreadyLoaded) {
      dispatch(fetchRoomById(roomId))
        .unwrap()
        .catch((error) => {
          showToast(error.message || 'Không tìm thấy phòng', 'danger')
          navigate('/rooms', { replace: true })
        })
    }
  }, [dispatch, isEdit, navigate, roomId, rooms, showToast])

  // Nạp sẵn form từ dữ liệu phòng (pattern "điều chỉnh state khi id đổi").
  const roomToEdit =
    rooms.find((item) => item.id === roomId) ||
    (selectedRoom?.id === roomId ? selectedRoom : null)

  if (isEdit && roomToEdit && loadedId !== roomId) {
    setLoadedId(roomId)
    setForm({
      name: roomToEdit.name,
      description: roomToEdit.description,
      image: roomToEdit.image,
      location: roomToEdit.location || '',
      originalPrice: String(roomToEdit.originalPrice),
      currentPrice: String(roomToEdit.currentPrice),
    })
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      location: form.location.trim(),
      originalPrice: Number(form.originalPrice),
      currentPrice: Number(form.currentPrice),
    }

    if (!payload.name || !payload.description || !payload.image || !payload.location) {
      showToast('Vui lòng điền tên, mô tả, đường dẫn ảnh và địa chỉ', 'danger')
      return
    }
    if (!(payload.originalPrice > 0) || !(payload.currentPrice > 0)) {
      showToast('Giá gốc và giá hiện tại phải lớn hơn 0', 'danger')
      return
    }
    if (payload.currentPrice > payload.originalPrice) {
      showToast('Giá hiện tại không được lớn hơn giá gốc', 'danger')
      return
    }

    setSubmitting(true)
    try {
      if (isEdit) {
        // Activity 3: gửi PUT để cập nhật rồi quay lại trang chi tiết.
        await dispatch(updateRoom({ id: roomId, room: payload })).unwrap()
        showToast('Đã cập nhật phòng', 'success')
        navigate(`/rooms/${roomId}`, { replace: true })
      } else {
        // Activity 2: gửi POST để thêm phòng mới.
        const created = await dispatch(addRoom(payload)).unwrap()
        showToast('Đã thêm phòng mới', 'success')
        navigate(`/rooms/${created.id}`, { replace: true })
      }
    } catch (error) {
      showToast(error.message || 'Không thể lưu phòng', 'danger')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Container className="page-section room-form-page">
      <div className="room-page-head">
        <h1 className="room-page-title">{isEdit ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'}</h1>
        <button
          type="button"
          className="room-btn room-btn-outline"
          onClick={() => navigate(-1)}
        >
          Quay lại
        </button>
      </div>

      <form className="room-form" onSubmit={handleSubmit}>
        <div className="room-field">
          <label htmlFor="name">Tên phòng</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="vd. Azure Coast Hotel Da Nang"
            required
          />
        </div>

        <div className="room-field">
          <label htmlFor="description">Mô tả</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Mô tả ngắn về phòng"
            required
          />
        </div>

        <div className="room-field">
          <label htmlFor="image">Đường dẫn ảnh</label>
          <input
            id="image"
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="https://..."
            required
          />
        </div>

        <div className="room-field">
          <label htmlFor="location">Địa chỉ</label>
          <input
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="vd. Đà Nẵng, Việt Nam"
            required
          />
        </div>

        <div className="room-field-row">
          <div className="room-field">
            <label htmlFor="originalPrice">Giá gốc</label>
            <input
              id="originalPrice"
              name="originalPrice"
              type="number"
              min="0"
              step="any"
              value={form.originalPrice}
              onChange={handleChange}
              required
            />
          </div>
          <div className="room-field">
            <label htmlFor="currentPrice">Giá hiện tại</label>
            <input
              id="currentPrice"
              name="currentPrice"
              type="number"
              min="0"
              step="any"
              value={form.currentPrice}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {form.image && (
          <div className="room-form-preview">
            <img src={form.image} alt="Xem trước" />
          </div>
        )}

        <div className="room-form-actions">
          <button type="submit" className="room-btn room-btn-primary" disabled={submitting}>
            {submitting ? 'Đang lưu...' : isEdit ? 'Cập nhật phòng' : 'Thêm phòng'}
          </button>
        </div>
      </form>
    </Container>
  )
}

export default RoomFormPage
