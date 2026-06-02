import { useMemo, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { Link, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  readSession,
  readUsers,
  writeSession,
  writeUsers,
} from '../utils/authSession'
import { selectBookings } from '../features/bookings/bookingsSlice'
import { useToast } from '../context/toastState'

function getInitialForm(session) {
  return {
    fullName: session?.fullName || '',
    email: session?.email || '',
    phone: session?.phone || '',
    birthday: session?.birthday || '',
    nationality: session?.nationality || 'Việt Nam',
    address: session?.address || '',
  }
}

function ProfilePage() {
  const initialSession = useMemo(() => readSession(), [])
  const today = new Date().toISOString().slice(0, 10)
  const [session, setSession] = useState(initialSession)
  const [formValues, setFormValues] = useState(() => getInitialForm(initialSession))
  const [message, setMessage] = useState({ type: '', text: '' })
  const bookings = useSelector(selectBookings)
  const savedIds = useSelector((state) => state.saved.savedIds)
  const showToast = useToast()

  if (!session) {
    return <Navigate to="/auth" replace />
  }

  const upcomingBookings = bookings.filter((booking) => booking.status === 'upcoming')
  const initials = (formValues.fullName || formValues.email)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  const handleFieldChange = (event) => {
    const { name, value } = event.target
    setFormValues((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const normalizedEmail = formValues.email.trim().toLowerCase()
    const normalizedName = formValues.fullName.trim()

    if (!normalizedName || !normalizedEmail) {
      setMessage({ type: 'danger', text: 'Vui lòng nhập đầy đủ họ tên và email.' })
      return
    }

    if (formValues.birthday && formValues.birthday > today) {
      setMessage({ type: 'danger', text: 'Ngày sinh không được là ngày trong tương lai.' })
      return
    }

    const users = readUsers()
    const emailTaken = users.some(
      (user) => user.email === normalizedEmail && user.email !== session.email,
    )

    if (emailTaken) {
      setMessage({ type: 'danger', text: 'Email này đã được dùng cho tài khoản khác.' })
      return
    }

    const nextProfile = {
      fullName: normalizedName,
      email: normalizedEmail,
      phone: formValues.phone.trim(),
      birthday: formValues.birthday,
      nationality: formValues.nationality.trim(),
      address: formValues.address.trim(),
    }

    const hasExistingUser = users.some((user) => user.email === session.email)
    const nextUsers = hasExistingUser
      ? users.map((user) =>
          user.email === session.email ? { ...user, ...nextProfile } : user,
        )
      : [...users, { ...nextProfile, password: '' }]

    const nextSession = { ...session, ...nextProfile }
    writeUsers(nextUsers)
    writeSession(nextSession)
    setSession(nextSession)
    setFormValues(getInitialForm(nextSession))
    setMessage({ type: 'success', text: 'Thông tin cá nhân đã được cập nhật.' })
    showToast('Đã cập nhật hồ sơ cá nhân', 'success')
  }

  return (
    <Container className="page-section profile-page">
      <section className="profile-hero">
        <div className="profile-avatar">{initials || 'U'}</div>
        <div className="profile-hero-copy">
          <span className="profile-kicker">Hồ Sơ Cá Nhân</span>
          <h1>{session.fullName || session.email}</h1>
          <p>Quản lý thông tin tài khoản, liên hệ và các hoạt động đặt chỗ của bạn.</p>
        </div>
      </section>

      <div className="profile-layout">
        <aside className="profile-sidebar">
          <div className="profile-summary-card">
            <div className="profile-summary-row">
              <span className="material-symbols-outlined">mail</span>
              <div>
                <small>Email</small>
                <strong>{session.email}</strong>
              </div>
            </div>
            <div className="profile-summary-row">
              <span className="material-symbols-outlined">phone</span>
              <div>
                <small>Số điện thoại</small>
                <strong>{session.phone || 'Chưa cập nhật'}</strong>
              </div>
            </div>
            <div className="profile-summary-row">
              <span className="material-symbols-outlined">location_on</span>
              <div>
                <small>Địa chỉ</small>
                <strong>{session.address || 'Chưa cập nhật'}</strong>
              </div>
            </div>
          </div>

          <div className="profile-stats-grid">
            <Link to="/my-bookings" className="profile-stat-card">
              <span>{bookings.length}</span>
              <small>Tổng đơn đặt</small>
            </Link>
            <Link to="/my-bookings" className="profile-stat-card">
              <span>{upcomingBookings.length}</span>
              <small>Sắp tới</small>
            </Link>
            <Link to="/saved" className="profile-stat-card">
              <span>{savedIds.length}</span>
              <small>Đã lưu</small>
            </Link>
          </div>
        </aside>

        <section className="profile-panel">
          <div className="profile-panel-head">
            <div>
              <h2>Thông Tin Tài Khoản</h2>
              
            </div>
            <Link to="/my-bookings" className="profile-secondary-link">
              Xem đơn đặt
            </Link>
          </div>

          {message.text && (
            <div className={`profile-message profile-message-${message.type}`}>
              {message.text}
            </div>
          )}

          <Form onSubmit={handleSubmit} className="profile-form">
            <div className="profile-form-grid">
              <Form.Group className="profile-field">
                <Form.Label>Họ và tên</Form.Label>
                <Form.Control
                  name="fullName"
                  value={formValues.fullName}
                  onChange={handleFieldChange}
                  placeholder="Nguyễn Văn A"
                  required
                />
              </Form.Group>

              <Form.Group className="profile-field">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  value={formValues.email}
                  onChange={handleFieldChange}
                  placeholder="ten@email.com"
                  required
                />
              </Form.Group>

              <Form.Group className="profile-field">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  name="phone"
                  value={formValues.phone}
                  onChange={handleFieldChange}
                  placeholder="+84 090 000 0000"
                />
              </Form.Group>

              <Form.Group className="profile-field">
                <Form.Label>Ngày sinh</Form.Label>
                <Form.Control
                  name="birthday"
                  type="date"
                  value={formValues.birthday}
                  max={today}
                  onChange={handleFieldChange}
                />
              </Form.Group>

              <Form.Group className="profile-field">
                <Form.Label>Quốc tịch</Form.Label>
                <Form.Control
                  name="nationality"
                  value={formValues.nationality}
                  onChange={handleFieldChange}
                  placeholder="Việt Nam"
                />
              </Form.Group>

              <Form.Group className="profile-field profile-field-full">
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control
                  name="address"
                  value={formValues.address}
                  onChange={handleFieldChange}
                  placeholder="Quận/Huyện, Thành phố"
                />
              </Form.Group>
            </div>

            <div className="profile-actions">
              <Button type="submit" className="profile-save-button">
                Lưu Thay Đổi
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                className="profile-reset-button"
                onClick={() => {
                  setFormValues(getInitialForm(session))
                  setMessage({ type: '', text: '' })
                }}
              >
                Hoàn Tác
              </Button>
            </div>
          </Form>
        </section>
      </div>
    </Container>
  )
}

export default ProfilePage
