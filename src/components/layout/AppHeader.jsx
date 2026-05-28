import { useEffect, useState } from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink, useLocation } from 'react-router-dom'
import { clearSession, readSession, SESSION_EVENT_NAME } from '../../utils/authSession'

function AppHeader() {
  const [session, setSession] = useState(() => readSession())
  const location = useLocation()
  const activeTab = new URLSearchParams(location.search).get('tab')

  const getNavPillClass = (tabName) => {
    if (tabName === 'stays') {
      return `nav-pill${
        location.pathname === '/' || location.pathname.startsWith('/stays')
          ? ' nav-pill-active'
          : ''
      }`
    }

    if (tabName === 'attractions') {
      return `nav-pill${location.pathname === '/saved' ? ' nav-pill-active' : ''}`
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
  }

  return (
    <header className="booking-header">
      <Navbar expand="lg" className="home-navbar">
        <Container>
          <Navbar.Brand as={NavLink} to="/" className="home-brand">
            Global Explorer
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" className="home-navbar-toggle" />
          <Navbar.Collapse id="main-nav">
            <Nav className="me-auto ms-lg-4 align-items-lg-center gap-lg-1">
              <Nav.Link as={NavLink} to="/" end className={getNavPillClass('stays')}>
                Stays
              </Nav.Link>
              <Nav.Link as={NavLink} to="/search?tab=flights" className={getNavPillClass('flights')}>
                Flights
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/search?tab=car-rentals"
                className={getNavPillClass('car-rentals')}
              >
                Car rentals
              </Nav.Link>
              <Nav.Link as={NavLink} to="/saved" className={getNavPillClass('attractions')}>
                Attractions
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/search?tab=airport-taxis"
                className={getNavPillClass('airport-taxis')}
              >
                Airport taxis
              </Nav.Link>
            </Nav>

            <div className="home-header-tools d-none d-md-flex">
              <button type="button" className="home-icon-button" aria-label="Help">
                <span className="material-symbols-outlined">help_outline</span>
              </button>
              <button type="button" className="home-icon-button" aria-label="Language">
                <span className="material-symbols-outlined">language</span>
              </button>
              <NavLink
                to={session ? '/saved' : '/auth'}
                className="home-icon-button"
                aria-label="Account"
              >
                <span className="material-symbols-outlined">person_outline</span>
              </NavLink>
            </div>

            {session ? (
              <div className="home-header-session mt-3 mt-lg-0">
                <div className="home-session-chip">
                  <span className="material-symbols-outlined">person</span>
                  <span>{session.fullName || session.email}</span>
                </div>
                <button
                  type="button"
                  className="home-header-action home-header-action-secondary"
                  onClick={handleSignOut}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Nav className="home-header-actions mt-3 mt-lg-0">
                <NavLink to="/auth?mode=register" className="home-header-action">
                  Register
                </NavLink>
                <NavLink to="/auth" className="home-header-action">
                  Sign in
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
