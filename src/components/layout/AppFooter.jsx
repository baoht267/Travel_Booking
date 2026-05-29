import { Col, Container, Row } from 'react-bootstrap'

function AppFooter() {
  return (
    <footer className="footer-shell">
      <Container className="py-5">
        <Row className="g-4">
          <Col lg={5}>
            <h3 className="footer-brand">GOCHIP</h3>
            <p className="footer-copy">
              (c) 2024 GOCHIP. Bảo lưu mọi quyền. Được xây dựng cho những nhà du lịch
              tìm kiếm trải nghiệm chân thực khắp nơi trên thế giới.
            </p>
            <div className="footer-icon-row">
              <span className="material-symbols-outlined">military_tech</span>
              <span className="material-symbols-outlined">public</span>
              <span className="material-symbols-outlined">share</span>
            </div>
          </Col>
          <Col sm={4} lg={2}>
            <h4 className="footer-heading">Công Ty</h4>
            <div className="footer-links">
              <a href="#top-deals">Về Chúng Tôi</a>
              <a href="#top-deals">Tuyển Dụng</a>
              <a href="#top-deals">Điều Khoản & Điều Kiện</a>
            </div>
          </Col>
          <Col sm={4} lg={2}>
            <h4 className="footer-heading">Hỗ Trợ</h4>
            <div className="footer-links">
              <a href="#top-deals">Dịch Vụ Khách Hàng</a>
              <a href="#top-deals">Hỗ Trợ Đối Tác</a>
              <a href="#top-deals">Chính Sách Bảo Mật</a>
            </div>
          </Col>
          <Col sm={4} lg={3}>
            <h4 className="footer-heading">Bản Tin</h4>
            <p className="footer-copy footer-newsletter-copy">
              Nhận cảm hứng du lịch ngay vào hộp thư của bạn.
            </p>
            <div className="footer-newsletter-form">
              <input type="email" placeholder="Địa chỉ email" className="footer-newsletter-input" />
              <button type="button" className="footer-newsletter-button">
                Tham Gia
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default AppFooter
