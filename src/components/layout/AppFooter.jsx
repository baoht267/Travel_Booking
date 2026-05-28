import { Col, Container, Row } from 'react-bootstrap'

function AppFooter() {
  return (
    <footer className="footer-shell">
      <Container className="py-5">
        <Row className="g-4">
          <Col lg={5}>
            <h3 className="footer-brand">Global Explorer</h3>
            <p className="footer-copy">
              (c) 2024 Global Explorer. All rights reserved. Built for travelers seeking
              authentic experiences across the globe.
            </p>
            <div className="footer-icon-row">
              <span className="material-symbols-outlined">military_tech</span>
              <span className="material-symbols-outlined">public</span>
              <span className="material-symbols-outlined">share</span>
            </div>
          </Col>
          <Col sm={4} lg={2}>
            <h4 className="footer-heading">Company</h4>
            <div className="footer-links">
              <a href="#top-deals">About Us</a>
              <a href="#top-deals">Careers</a>
              <a href="#top-deals">Terms & Conditions</a>
            </div>
          </Col>
          <Col sm={4} lg={2}>
            <h4 className="footer-heading">Support</h4>
            <div className="footer-links">
              <a href="#top-deals">Customer Service</a>
              <a href="#top-deals">Partner Help</a>
              <a href="#top-deals">Privacy Policy</a>
            </div>
          </Col>
          <Col sm={4} lg={3}>
            <h4 className="footer-heading">Newsletter</h4>
            <p className="footer-copy footer-newsletter-copy">
              Get travel inspiration delivered to your inbox.
            </p>
            <div className="footer-newsletter-form">
              <input type="email" placeholder="Email address" className="footer-newsletter-input" />
              <button type="button" className="footer-newsletter-button">
                Join
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default AppFooter
