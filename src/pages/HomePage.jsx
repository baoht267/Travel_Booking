import { useRef } from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import SearchForm from '../components/search/SearchForm'
import {
  selectRecentSearches,
  updateCriteria,
} from '../features/stays/staysSlice'

const heroImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAEaX7BYrbtMiJw9VM_FHU3k2oOl6JYXlXsFlenG-leP24eJWDQMp2hHt8rHetzJECtH_yHcka5vjUQuvTMVAsP9Di3tqYeEHBp7Zmd3_k0ZOS_RMHSsPCCExULTcxaaO10LWMCY3ADCLl69VtDPAtZQxRxSnRQlifvZzyu-JPpvt99UjX0rdHML2JFISMcT6Ua5czTAWbpW32N-USVmPgTYw-YmROJtBY2ZKawkorO5Hm3m85ychhzbfeJtWVqDIWvfHf1_XcicY8J'

const promoImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ3xOGwJbFTAx90HNnER0jv5vqK6pRvMOjMZ5ABFfcuOmNoUCsul0RN98pvzccf9t-cZW4clZc2g3A7P_9YJ4iNoN1L7YdbF-7mluC9DkosT_VXg5-H9TSvgrTSc93GTekr_RggzlNRWaZQe4AkaVOlPFGQSfzZ9ned_4yROoUxhVlqGXtE93B1957myifdVdJoyUMLvZYU4OyphJu-YRnrQOSrYPNE_cXLFR-o_AeWlcM0gvhxXNa05xg0eTc7BTRKb-t1dnO3SUA'

const trendingDestinations = [
  {
    id: 'tokyo',
    city: 'Tokyo',
    country: 'Japan',
    flag: 'JP',
    properties: '4.521 chỗ ở',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBf-y5eC-0VxFZCLFJAkENex_rrMNFaz4aFyiTsSOM5cfZCwSxlSRrmmD8uAfBZ5UxR4pM1WwCAbGqkCkM6U9IEEIwjvBH7Msk84Ii0Pnyb21pAPRrYr8BcbZNBiWmUU3nyXlDi6Aw0bMqxhFv-vZTJ-WxAofXiLGyUxQhssR8zVIvxjqeOrD4g6iKoELGSJoQQx4jQsjDQfx03beBfq2NYys8OFnLjrfit09TmwBOcPGMSFo1u4RxXvyf0KHXJfI2RuHsbnovPjs_X',
    layout: 'large',
  },
  {
    id: 'paris',
    city: 'Paris',
    country: 'France',
    flag: 'FR',
    properties: '3.890 chỗ ở',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDLLqYZ0fRIwOzVwlh_NN7Jgz11vYa6--513Fimvjh3cdUugOZOO-ZgeocOf66tXVwNN33poVGs1AtKBgcK6E8Ivgz_VE2NhNft2dG8v_eZwXbHShMUh87iz9l9Y4Y79CHmQzavLxqV_hfadnpYYUKjXSqQsttuZgTRtu_oDEmjmbTAiX1DbGTVbQe4aeb6FFB2aJOIeNXrqIT5Zw8baPe_6J4jqZCSqlRCb7VsEfp1SvGSfESRuXCd5YhthKWbwZkBfmr0rIOG0sCA',
    layout: 'large',
  },
  {
    id: 'london',
    city: 'London',
    country: 'United Kingdom',
    flag: 'UK',
    properties: '5.102 chỗ ở',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBzjPTKeBQFVnh9xgQrFk-ru18fAD-v6pykkzbn-7kaFNYcVW7jNyww7M-sDtREFPd8hp8Yf7IwUWZM2reAVboDUJsjmryTJJN7ziJ2XZNz50KJdjVbdbthHFueFeesAEH91YeBxevh8kvbpmRsnCNR248H04ksx1vRSYyEUtliV11GpAW3WbJLv8JQk5eroDgCOGmS18jKqHrtK2if49mYgPepNB3XWG_Rc_wp2YPsSASmzR5GlTOjvKN73daGWG3Q_PPPm1s48nqA',
    layout: 'small',
  },
  {
    id: 'new-york',
    city: 'New York',
    country: 'United States',
    flag: 'US',
    properties: '2.445 chỗ ở',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDjiFJCFNouqj_6ukVqMSc-R4Zn3VLzXvHm0S5uYlpg0izN9u0aUoRaJr6C7nxetJiUpSp62B0wWs2nrc8zCXdWOPtb9bM9Sg6jDVxZ4akvhXN4N6qTq5Gla8Z5kQ1OysvA_rR-tb2QClFVr87DvCLMXw4xIOz6k2fMUzl0_J0Mw3MEL1HRs1DicG7_V9-sXPp9jgYgCm-BhtnjRhSo4YGR7C53eFuo0KAaAO1z7SYNwtj7UJkSXsqYJXz-2Xzj7WECyMUFd82FeDPa',
    layout: 'small',
  },
  {
    id: 'dubai',
    city: 'Dubai',
    country: 'United Arab Emirates',
    flag: 'AE',
    properties: '1.980 chỗ ở',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAF9Odxz-IVMPpDJE6lD7-bn44PzAsLSnA1eUg-PvtGKvOgcxtKwHceUxLje3gEoi5KQOOYmhPApIRXkg0SEbYCZ0ixe_0s1nGQ6WBdvhqAKNZN_RFUJwzq1beD59l2dhjVpO3_9fk2vEYjBwxrBV-s_D1FDPqxe__TWLVnP9jKQ20AGEi6zqAdcHZUP3SP_ekXvn62r_PHbFpdoqzF8oV8kEMq-FXebzjrTh-BVv60KIAax94rh3waxHy3y4Ap_FllB-XurR4nWv4W',
    layout: 'small',
  },
]

const unforgettableTours = [
  {
    id: 'inca',
    country: 'Peru',
    title: 'Hành Trình Inca Trail Cổ Điển',
    rating: '4.9',
    label: 'Xuất Sắc',
    reviews: '1.240 đánh giá',
    price: '$1.299',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBHb6pd9TWdR7-mIyVaKwBNG7_8z5NnLCVFt0OAygUuuoThCYquuixeSDe1_3CtXx-G7bOeQzfF7vTH39CjzQKlOuhBP6oP1m6cgMO-olR4pnsjSIsv0-zX1S8V0KuF2UOCnwdr4-BmUyQOsvGYBAqiuCFMGYuJTj0nR2WI4wWeFwajKGfaN78F3sZPU-I7ms3CKTOTCpZS94icJW8_WrvbqVQvk9BYx5y3sS0kBIDrO1J35PRmpy915Hixf0JWGRPoWwrFcsdaEMTx',
  },
  {
    id: 'island-hopping',
    country: 'Thailand',
    title: 'Khám Phá Các Hòn Đảo',
    rating: '4.7',
    label: 'Tuyệt Vời',
    reviews: '856 đánh giá',
    price: '$850',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBEjeFDGW4QHD1QwbM4FRs3foWdwPfjOVlw5rGKhjpbXoZ5ell0GlEo8ORqBa9RtLkzQ2NLg8MEm4K9vhkM8acKtqY_jIhf2GJWVW-OhqhArh_Oxjpw_f5atsLcYSDbL4SQX6zYzcMvpfwHInczUi5nXzAq-POqYE8rIhVVNJV83_E2zVnCyVGvX8nX1M5ep6a3ry4BIREmsnmqG4Jpgmc7R0wNbylCqB5Xp5RQd5h-NBN3djYNHqEXIWpBXbrVc1LkgCf9raJzM1Wy',
  },
  {
    id: 'northern-lights',
    country: 'Iceland',
    title: 'Ngắm Cực Quang',
    rating: '4.8',
    label: 'Xuất Sắc',
    reviews: '2.105 đánh giá',
    price: '$540',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCKUoSmCO4-h9FvQzZibAFbMXHtamUM-UlnSdm1jKMM0SOqxrf-ByCianA56YJ2Y2_AUrc0pJQCLEEvqKGhylikQbf_63mQGFT88yLiJeXhQmNWLH73KqRUkOC7X8dPaMMTQqTmI5rFKf4Ru1Kd3bcEerpq2vON0avENooiM8C3lamwpTejyq91QnT_OyO_s7lciSqy9fJHGSCx0WPJVw2I9CIrLvVRgFh11aRh7547tst6-eNIad6_XXjzCByep7he7S5QyNHVP4lS',
  },
  {
    id: 'grand-canyon',
    country: 'USA',
    title: 'Tour Trực Thăng Grand Canyon',
    rating: '4.9',
    label: 'Xuất Sắc',
    reviews: '4.320 đánh giá',
    price: '$299',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCwZCP_vE5w8SL3zkxw5y7an2UkGvzfDfhGWHq5D6j47IB8QTRApBgrgehLtAeGLfihJNyaRWdrqq6BvP38s7i2_FKRsmjFXKmrNrvDvXnzulPl0QWZrjS0FxYrP80oAqJFxMGP9oaG7Ouqu4dm3s6Jo0i7a0E9K1PEKqZrfb_ridP5FGf3FmK9y1wGKEUEdSKS8pms2eo0ibSc-nPX06auP5R8vA6tsG9GczAAtHgcEAS9wPJMTgYX6jDgZV6DzpanHNtiyfwAhQo6',
  },
]

function HomePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const recentSearches = useSelector(selectRecentSearches)
  const tourRailRef = useRef(null)

  const scrollTours = (direction) => {
    if (!tourRailRef.current) {
      return
    }

    tourRailRef.current.scrollBy({
      left: direction * 320,
      behavior: 'smooth',
    })
  }

  const handleTrendingDestinationClick = (event, destination) => {
    event.preventDefault()
    dispatch(
      updateCriteria({
        destination: `${destination.country}, ${destination.city}`,
      }),
    )
    navigate('/search')
  }

  return (
    <>
      <section className="home-hero">
        <div className="home-hero-media">
          <img src={heroImage} alt="Bờ biển Amalfi" className="home-hero-image" />
          <div className="home-hero-scrim"></div>
        </div>
        <Container className="home-hero-container">
          <div className="home-hero-copy">
            <h1 className="home-hero-title">Cuộc phiêu lưu tiếp theo của bạn bắt đầu từ đây</h1>
            <p className="home-hero-text">
              Tìm giá tốt cho khách sạn, nhà ở và nhiều hơn nữa...
            </p>
          </div>
        </Container>
      </section>

      <Container className="home-search-wrap">
        <SearchForm home showWorkToggle />
      </Container>

      <Container className="page-section home-section" id="popular-destinations">
        <div className="home-section-head">
          <h2 className="home-section-title">Điểm đến thịnh hành</h2>
          <p className="home-section-text">
            Lựa chọn phổ biến nhất của du khách từ khắp nơi trên thế giới
          </p>
        </div>

        <div className="destination-mosaic">
          {trendingDestinations.map((destination) => (
            <Link
              key={destination.id}
              to="/search"
              className={`destination-tile destination-tile-${destination.layout}`}
              onClick={(event) => handleTrendingDestinationClick(event, destination)}
            >
              <img
                src={destination.image}
                alt={destination.city}
                className="destination-tile-image"
              />
              <div className="destination-tile-overlay"></div>
              <div className="destination-tile-content">
                <h3>
                  {destination.city} <span>{destination.flag}</span>
                </h3>
                <p>{destination.properties}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>

      <section className="home-tours-band" id="top-experiences">
        <Container className="page-section home-section home-tours-section">
          <div className="home-section-head home-section-head-row">
            <div>
              <h2 className="home-section-title">Chuyến tham quan đáng nhớ</h2>
              <p className="home-section-text">
                Trải nghiệm được đánh giá cao nhất được đề xuất bởi các du khách
              </p>
            </div>
            <div className="home-section-actions">
              <button
                type="button"
                className="home-circle-button"
                onClick={() => scrollTours(-1)}
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                type="button"
                className="home-circle-button"
                onClick={() => scrollTours(1)}
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>

          <div ref={tourRailRef} className="tour-rail custom-scrollbar">
            {unforgettableTours.map((tour) => (
              <Card key={tour.id} className="tour-card">
                <img src={tour.image} alt={tour.title} className="tour-card-image" />
                <Card.Body className="tour-card-body">
                  <div className="tour-card-country">{tour.country}</div>
                  <h3 className="tour-card-title">{tour.title}</h3>
                  <div className="tour-card-meta">
                    <span className="tour-card-score">{tour.rating}</span>
                    <span>{tour.label}</span>
                    <span className="tour-card-reviews">| {tour.reviews}</span>
                  </div>
                  <div className="tour-card-footer">
                    <div>
                      <div className="tour-card-label">Bắt đầu từ</div>
                      <div className="tour-card-price">{tour.price}</div>
                    </div>
                    <Button
                      as={Link}
                      to="/search"
                      variant="outline-primary"
                      className="tour-card-button"
                    >
                      Xem Ưu Đãi
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <Container className="page-section home-section" id="top-deals">
        <div className="promo-banner">
          <Row className="g-0 align-items-stretch">
            <Col lg={7}>
              <div className="promo-copy">
                <h2>Nhận ưu đãi ngay lập tức</h2>
                <p>
                  Chỉ cần đăng nhập vào tài khoản GOCHIP của bạn và tìm logo Genius
                  màu xanh để tiết kiệm 10% hoặc hơn tại các cơ sở tham gia.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <Button as={Link} to="/saved" variant="primary" className="px-4 fw-bold">
                    Đăng nhập hoặc đăng ký
                  </Button>
                  <Button as={Link} to="/search" variant="outline-light" className="px-4 fw-bold">
                    Tìm hiểu thêm
                  </Button>
                </div>
              </div>
            </Col>
            <Col lg={5} className="d-none d-lg-block">
              <div className="promo-visual">
                <img src={promoImage} alt="Sảnh khách sạn sang trọng" className="promo-visual-image" />
                <div className="promo-visual-glow"></div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>

      {recentSearches.length > 0 && (
        <Container className="page-section home-section">
          <div className="home-section-head">
            <h2 className="home-section-title">Tìm kiếm gần đây</h2>
            <p className="home-section-text"></p>
          </div>
          <Row className="g-3">
            {recentSearches.map((item) => (
              <Col key={item.key} md={6} xl={3}>
                <div className="quick-stat home-recent-card">
                  <div className="fw-bold">{item.destination}</div>
                  <div className="muted-label">
                    {item.checkIn} đến {item.checkOut}
                  </div>
                  <div className="muted-label">
                    {item.guests} khách | {item.rooms} phòng
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      )}
    </>
  )
}

export default HomePage
