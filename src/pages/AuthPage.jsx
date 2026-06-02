import { useMemo, useState } from 'react'
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { readUsers, writeSession, writeUsers } from '../utils/authSession'
import { useToast } from '../context/ToastContext'

function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const mode = searchParams.get('mode') === 'register' ? 'register' : 'login'

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    remember: false,
  })
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    password: '',
  })
  const [message, setMessage] = useState({ type: '', text: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const showToast = useToast()

  const logoLetters = useMemo(() => 'GE', [])

  const switchMode = (nextMode) => {
    setMessage({ type: '', text: '' })
    setSearchParams(nextMode === 'register' ? { mode: 'register' } : {})
  }

  const updateLoginField = (event) => {
    const { name, value, type, checked } = event.target
    setLoginForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const updateRegisterField = (event) => {
    const { name, value } = event.target
    setRegisterForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleLogin = (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setMessage({ type: '', text: '' })

    window.setTimeout(() => {
      const users = readUsers()
      const matchedUser = users.find((user) => user.email === loginForm.email.trim())

      if (!matchedUser || matchedUser.password !== loginForm.password) {
        setMessage({
          type: 'danger',
          text: 'Email hoặc mật khẩu không hợp lệ. Thử tài khoản đã đăng ký hoặc tạo tài khoản mới.',
        })
        setIsSubmitting(false)
        return
      }

      writeSession({
          email: matchedUser.email,
          fullName: matchedUser.fullName,
          remember: loginForm.remember,
        })

      setMessage({
        type: 'success',
        text: `Chào mừng trở lại, ${matchedUser.fullName}. Đang chuyển hướng về trang chủ...`,
      })
      showToast(`Chào mừng trở lại, ${matchedUser.fullName}!`, 'success')
      setIsSubmitting(false)
      window.setTimeout(() => navigate('/'), 700)
    }, 500)
  }

  const handleRegister = (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setMessage({ type: '', text: '' })

    window.setTimeout(() => {
      const normalizedEmail = registerForm.email.trim().toLowerCase()
      const users = readUsers()
      const emailExists = users.some((user) => user.email === normalizedEmail)

      if (emailExists) {
        setMessage({
          type: 'danger',
          text: 'Email này đã được đăng ký. Đăng nhập hoặc sử dụng địa chỉ khác.',
        })
        setIsSubmitting(false)
        return
      }

      const nextUsers = [
        ...users,
        {
          fullName: registerForm.fullName.trim(),
          email: normalizedEmail,
          password: registerForm.password,
        },
      ]

      writeUsers(nextUsers)
      setLoginForm((current) => ({
        ...current,
        email: normalizedEmail,
        password: '',
      }))
      setRegisterForm({
        fullName: '',
        email: '',
        password: '',
      })
      setMessage({
        type: 'success',
        text: 'Tài khoản đã được tạo. Bạn có thể đăng nhập ngay với thông tin đăng nhập mới.',
      })
      setIsSubmitting(false)
      switchMode('login')
    }, 500)
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-dot-pattern"></div>
      <div className="auth-glow auth-glow-left"></div>
      <div className="auth-glow auth-glow-right"></div>

      <Container className="auth-page-container">
        <Card className="auth-card">
          <div className="auth-header">
            <div className="auth-logo-mark">{logoLetters}</div>
            <h1 className="auth-title">GOCHIP</h1>
            <p className="auth-subtitle">Cổng thông tin đến thế giới của bạn.</p>
          </div>

          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${mode === 'login' ? 'auth-tab-active' : ''}`}
              onClick={() => switchMode('login')}
            >
              Đăng Nhập
            </button>
            <button
              type="button"
              className={`auth-tab ${mode === 'register' ? 'auth-tab-active' : ''}`}
              onClick={() => switchMode('register')}
            >
              Đăng Ký
            </button>
          </div>

          <Card.Body className="auth-card-body">
            {message.text && (
              <Alert variant={message.type} className="mb-4">
                {message.text}
              </Alert>
            )}

            {mode === 'login' ? (
              <Form onSubmit={handleLogin} className="auth-form-stack">
                <Form.Group>
                  <Form.Label className="auth-label">Địa Chỉ Email</Form.Label>
                  <div className="auth-input-shell">
                    <span className="material-symbols-outlined auth-input-icon">mail</span>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="ten@congty.com"
                      className="auth-input"
                      value={loginForm.email}
                      onChange={updateLoginField}
                      required
                    />
                  </div>
                </Form.Group>

                <Form.Group>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Form.Label className="auth-label mb-0">Mật Khẩu</Form.Label>
                    <button type="button" className="auth-link-button">
                      Quên Mật Khẩu?
                    </button>
                  </div>
                  <div className="auth-input-shell">
                    <span className="material-symbols-outlined auth-input-icon">lock</span>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="........"
                      className="auth-input"
                      value={loginForm.password}
                      onChange={updateLoginField}
                      required
                    />
                  </div>
                </Form.Group>

                <Form.Check
                  id="remember"
                  name="remember"
                  type="checkbox"
                  label="Duy trì đăng nhập"
                  className="auth-check"
                  checked={loginForm.remember}
                  onChange={updateLoginField}
                />

                <Button type="submit" className="auth-primary-button" disabled={isSubmitting}>
                  {isSubmitting ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                </Button>
              </Form>
            ) : (
              <Form onSubmit={handleRegister} className="auth-form-stack">
                <Form.Group>
                  <Form.Label className="auth-label">Họ và Tên</Form.Label>
                  <div className="auth-input-shell">
                    <span className="material-symbols-outlined auth-input-icon">person</span>
                    <Form.Control
                      type="text"
                      name="fullName"
                      placeholder="Nguyễn Văn A"
                      className="auth-input"
                      value={registerForm.fullName}
                      onChange={updateRegisterField}
                      required
                    />
                  </div>
                </Form.Group>

                <Form.Group>
                  <Form.Label className="auth-label">Địa Chỉ Email</Form.Label>
                  <div className="auth-input-shell">
                    <span className="material-symbols-outlined auth-input-icon">mail</span>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="ten@congty.com"
                      className="auth-input"
                      value={registerForm.email}
                      onChange={updateRegisterField}
                      required
                    />
                  </div>
                </Form.Group>

                <Form.Group>
                  <Form.Label className="auth-label">Mật Khẩu</Form.Label>
                  <div className="auth-input-shell">
                    <span className="material-symbols-outlined auth-input-icon">lock</span>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Tối thiểu 8 ký tự"
                      className="auth-input"
                      value={registerForm.password}
                      onChange={updateRegisterField}
                      minLength={8}
                      required
                    />
                  </div>
                </Form.Group>

                <p className="auth-policy-copy">
                  Khi đăng ký, bạn đồng ý với{' '}
                  <button type="button" className="auth-link-inline">Điều Khoản Dịch Vụ</button>{' '}
                  và{' '}
                  <button type="button" className="auth-link-inline">Chính Sách Bảo Mật</button>{' '}
                  của chúng tôi.
                </p>

                <Button type="submit" className="auth-primary-button" disabled={isSubmitting}>
                  {isSubmitting ? 'Đang tạo tài khoản...' : 'Tạo Tài Khoản'}
                </Button>
              </Form>
            )}

            <div className="auth-divider">
              <span>Hoặc tiếp tục với</span>
            </div>

            <Row className="g-3">
              <Col xs={6}>
                <button type="button" className="auth-social-button">
                  <span className="auth-social-google">G</span>
                  Google
                </button>
              </Col>
              <Col xs={6}>
                <button type="button" className="auth-social-button">
                  <span className="auth-social-facebook">f</span>
                  Facebook
                </button>
              </Col>
            </Row>
          </Card.Body>

          <div className="auth-footer">
            Cần hỗ trợ? Truy cập <Link to="/" className="auth-footer-link">Trung Tâm Hỗ Trợ</Link> của chúng tôi
          </div>
        </Card>
      </Container>
    </div>
  )
}

export default AuthPage
