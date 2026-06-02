import { useEffect, useState } from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { clearSession, readSession, SESSION_EVENT_NAME } from '../../utils/authSession'

function AppHeader() {
  const [session, setSession] = useState(() => readSession())
  const location = useLocation()
  const navigate = useNavigate()
  const activeTab = new URLSearchParams(location.search).get('tab')

  const getNavPillClass = (tabName) => {
    if (tabName === 'stays') {
      const isStaysActive =
        (location.pathname === '/search' && !activeTab) ||
        location.pathname.startsWith('/stays') ||
        location.pathname === '/'
      return `nav-pill${isStaysActive ? ' nav-pill-active' : ''}`
    }

    if (tabName === 'attractions') {
      return `nav-pill${
        location.pathname === '/attractions' || location.pathname.startsWith('/experiences')
          ? ' nav-pill-active'
          : ''
      }`
    }

    if (tabName === 'car-rentals') {
      return `nav-pill${
        (location.pathname === '/search' && activeTab === 'car-rentals') ||
        location.pathname.startsWith('/cars/')
          ? ' nav-pill-active'
          : ''
      }`
    }

    return `nav-pill${
      location.pathname === '/search' && activeTab === tabName ? ' nav-pill-active' : ''
    }`
  }

  useEffect(() => {
    const syncSession = () => setSession(readSession())

    window.addEventListener(SESSION_EVENT_NAME, syncSession)
    window.addEventListener('storage', syncSession)

    return () => {
      window.removeEventListener(SESSION_EVENT_NAME, syncSession)
      window.removeEventListener('storage', syncSession)
    }
  }, [])

  const handleSignOut = () => {
    clearSession()
    navigate('/')
  }

  return (
    <header className="booking-header">
      <Navbar expand="lg" className="home-navbar">
        <Container>
          <Navbar.Brand as={NavLink} to="/" className="home-brand">
            GOCHIP
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" className="home-navbar-toggle" />
          <Navbar.Collapse id="main-nav">
            <Nav className="me-auto ms-lg-4 align-items-lg-center gap-lg-1">
              <Nav.Link as={NavLink} to="/search" className={getNavPillClass('stays')}>
                Chỗ Ở
              </Nav.Link>
              <Nav.Link as={NavLink} to="/search?tab=flights" className={getNavPillClass('flights')}>
                Chuyến Bay
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/search?tab=car-rentals"
                className={getNavPillClass('car-rentals')}
              >
                Thuê Xe
              </Nav.Link>
              <Nav.Link as={NavLink} to="/attractions" className={getNavPillClass('attractions')}>
                Địa Điểm
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/search?tab=airport-taxis"
                className={getNavPillClass('airport-taxis')}
              >
                Taxi Sân Bay
              </Nav.Link>
            </Nav>

            <div className="home-header-tools d-none d-md-flex">
              <button type="button" className="home-icon-button" aria-label="Trợ Giúp">
                <span className="material-symbols-outlined">help_outline</span>
              </button>
              <button type="button" className="home-icon-button" aria-label="Ngôn Ngữ">
                <span className="material-symbols-outlined">language</span>
              </button>
              <NavLink
                to={session ? '/profile' : '/auth'}
                className="home-icon-button"
                aria-label="Tài Khoản"
              >
                <span className="material-symbols-outlined">person_outline</span>
              </NavLink>
            </div>

            {session ? (
              <div className="home-header-session mt-3 mt-lg-0">
                <NavLink to="/profile" className="home-session-chip">
                  <span className="material-symbols-outlined">person</span>
                  <span>{session.fullName || session.email}</span>
                </NavLink>
                <NavLink
                  to="/my-bookings"
                  className="home-header-action home-header-action-secondary"
                >
                  Đơn Đặt
                </NavLink>
                <button
                  type="button"
                  className="home-header-action home-header-action-secondary"
                  onClick={handleSignOut}
                >
                  Đăng Xuất
                </button>
              </div>
            ) : (
              <Nav className="home-header-actions mt-3 mt-lg-0">
                <NavLink to="/auth?mode=register" className="home-header-action">
                  Đăng Ký
                </NavLink>
                <NavLink to="/auth" className="home-header-action">
                  Đăng Nhập
                </NavLink>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default AppHeader
