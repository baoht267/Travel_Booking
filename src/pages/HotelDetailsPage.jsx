import { useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { selectAllStays, selectCriteria, updateCriteria } from '../features/stays/staysSlice'
import { selectHotelBookingsByStay } from '../features/bookings/bookingsSlice'
import { convertBasePriceToVnd, formatBasePriceToVndCurrency } from '../utils/currency'

const galleryByTheme = {
  sea: [
    'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  ],
  city: [
    'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
  ],
  nature: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1464820453369-31d2c0b651af?auto=format&fit=crop&w=1200&q=80',
  ],
  sun: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=1200&q=80',
  ],
}

const detailsByTheme = {
  sea: {
    badge: 'Được Đánh Giá Cao Nhất',
    departure: 'Khởi hành từ bến tàu riêng',
    aboutTitle: 'Về chỗ ở này',
    duration: '8 giờ trải nghiệm được tuyển chọn',
    instantLabel: 'Xác nhận ngay lập tức',
    languages: 'Hướng dẫn trực tiếp: Tiếng Anh, Tiếng Việt',
    highlights: [
      {
        title: 'Hành Trình Dọc Bờ Biển Bình Minh',
        description:
          'Bắt đầu với chuyến đón tàu suôn sẻ từ cảng và hành trình có hướng dẫn qua những điểm nhìn bờ biển đẹp nhất gần chỗ ở.',
      },
      {
        title: 'Thời Gian Thư Giãn Trên Đảo',
        description:
          'Dành thời gian linh hoạt để bơi lội, thư giãn, và sử dụng dịch vụ của khu nghỉ dưỡng cho các điểm dừng đảo tùy chọn.',
      },
      {
        title: 'Bữa Tối Hoàng Hôn & Trở Về',
        description:
          'Kết thúc ngày với gợi ý bữa tối cao cấp ven biển và chuyến đưa tiễn thoải mái trở về chỗ ở.',
      },
    ],
    reviewMetrics: [
      ['Sạch Sẽ', 9.2],
      ['Chuyên Nghiệp', 9.5],
      ['Đáng Giá Tiền', 8.4],
      ['Vị Trí', 9.8],
    ],
    guestReviews: [
      {
        initials: 'JD',
        name: 'Julianne Davies',
        location: 'Vương Quốc Anh',
        date: 'Tháng 5, 2024',
        score: '10',
        copy:
          'Chỗ ở hoàn toàn tuyệt vời. Nhân viên chu đáo và tầm nhìn biển từ phòng rất xứng đáng với từng phút.',
      },
      {
        initials: 'ML',
        name: 'Marco Lombardi',
        location: 'Ý',
        date: 'Tháng 6, 2024',
        score: '9.0',
        copy:
          'Tổ chức xuất sắc và nhân viên tuyệt vời. Bữa sáng ven bờ nước hoàn hảo cho chuyến đi sang trọng thư thái.',
      },
    ],
  },
  city: {
    badge: 'Lựa Chọn Biên Tập',
    departure: 'Gần các mốc quan trọng của thành phố',
    aboutTitle: 'Về chỗ ở này',
    duration: 'Lịch trình linh hoạt cho kỳ nghỉ thành phố',
    instantLabel: 'Xác nhận ngay lập tức',
    languages: 'Hỗ trợ chủ nhà: Tiếng Anh, Tiếng Việt',
    highlights: [
      {
        title: 'Nhận Phòng & Hướng Dẫn Địa Phương',
        description:
          'Đến với quy trình tự nhận phòng dễ dàng, ghi chú về khu phố, và các lựa chọn ăn uống được tuyển chọn xung quanh chỗ ở.',
      },
      {
        title: 'Tiếp Cận Khu Vực Đi Bộ',
        description:
          'Sử dụng vị trí trung tâm cho chợ, quán cà phê, và các tuyến ăn đêm mà không cần di chuyển xa.',
      },
      {
        title: 'Thiết Lập Cho Kỳ Lưu Trú Dài Thoải Mái',
        description:
          'Tận hưởng tiện nghi kiểu căn hộ, góc làm việc yên tĩnh, và bố cục thực tế cho các cặp đôi hoặc nhóm nhỏ.',
      },
    ],
    reviewMetrics: [
      ['Sạch Sẽ', 8.8],
      ['Chuyên Nghiệp', 9.1],
      ['Đáng Giá Tiền', 9.0],
      ['Vị Trí', 9.6],
    ],
    guestReviews: [
      {
        initials: 'AN',
        name: 'Anh Nguyen',
        location: 'Việt Nam',
        date: 'Tháng 4, 2024',
        score: '9.2',
        copy:
          'Vị trí tuyệt vời để khám phá phố cổ. Phòng sạch, nhận phòng thuận lợi, và rất thực tế cho hai du khách.',
      },
      {
        initials: 'PS',
        name: 'Paolo Serra',
        location: 'Ý',
        date: 'Tháng 5, 2024',
        score: '8.9',
        copy:
          'Căn cứ tuyệt vời cho chuyến du lịch thành phố. Quán cà phê, đồ ăn đường phố và các điểm tham quan đều trong tầm đi bộ.',
      },
    ],
  },
  nature: {
    badge: 'Thoát Vào Thiên Nhiên',
    departure: 'Bao gồm quyền tiếp cận núi toàn cảnh',
    aboutTitle: 'Về chỗ ở này',
    duration: 'Hỗ trợ lịch trình thiên nhiên cả ngày',
    instantLabel: 'Xác nhận ngay lập tức',
    languages: 'Hỗ trợ chủ nhà: Tiếng Anh, Hướng dẫn địa phương',
    highlights: [
      {
        title: 'Đến Nơi & Ngắm Nhìn Thung Lũng',
        description:
          'Ổn định trong phòng có cảnh đẹp với ban công và cái nhìn đầu tiên về các đường đỉnh núi phủ sương mù.',
      },
      {
        title: 'Lên Kế Hoạch Trekking Có Hướng Dẫn',
        description:
          'Phối hợp các tuyến ngày, vận chuyển và hỗ trợ hướng dẫn địa phương trực tiếp qua đội ngũ nhà nghỉ.',
      },
      {
        title: 'Trở Về Buổi Tối Thư Thái',
        description:
          'Trở về chỗ ở yên tĩnh hơn với các lựa chọn ăn uống ấm áp và không khí núi trong lành.',
      },
    ],
    reviewMetrics: [
      ['Sạch Sẽ', 9.0],
      ['Chuyên Nghiệp', 8.9],
      ['Đáng Giá Tiền', 8.8],
      ['Vị Trí', 9.7],
    ],
    guestReviews: [
      {
        initials: 'LK',
        name: 'Lena Kovacs',
        location: 'Hungary',
        date: 'Tháng 3, 2024',
        score: '9.1',
        copy:
          'Tầm nhìn bình minh đẹp và môi trường thực sự yên bình. Đội ngũ đã giúp chúng tôi tổ chức trekking rất thuận lợi.',
      },
      {
        initials: 'TR',
        name: 'Thanh R.',
        location: 'Việt Nam',
        date: 'Tháng 4, 2024',
        score: '8.8',
        copy:
          'Lựa chọn tuyệt vời nếu bạn muốn phong cảnh là ưu tiên. Phòng sạch, dịch vụ ấm áp và bầu không khí rất yên bình.',
      },
    ],
  },
  sun: {
    badge: 'Yêu Thích Bãi Biển',
    departure: 'Bao gồm quyền tiếp cận bãi biển riêng',
    aboutTitle: 'Về chỗ ở này',
    duration: 'Quyền tiếp cận cả ngày kiểu khu nghỉ dưỡng',
    instantLabel: 'Xác nhận ngay lập tức',
    languages: 'Hỗ trợ chủ nhà: Tiếng Anh, Tiếng Việt',
    highlights: [
      {
        title: 'Trải Nghiệm Đến Khu Lagoon',
        description:
          'Bắt đầu với sự chào đón của khu nghỉ dưỡng, hỗ trợ hành lý, và quyền tiếp cận trực tiếp vào khu vực ven biển.',
      },
      {
        title: 'Ngày Thư Giãn Bên Nước',
        description:
          'Di chuyển giữa các biệt thự, hồ bơi và bãi biển riêng với các hoạt động thân thiện cho gia đình tùy chọn.',
      },
      {
        title: 'Bữa Ăn Hoàng Hôn Buổi Tối',
        description:
          'Kết thúc với các gợi ý bữa tối hướng hoàng hôn và trở về biệt thự yên tĩnh hơn.',
      },
    ],
    reviewMetrics: [
      ['Sạch Sẽ', 9.4],
      ['Chuyên Nghiệp', 9.2],
      ['Đáng Giá Tiền', 8.9],
      ['Vị Trí', 9.5],
    ],
    guestReviews: [
      {
        initials: 'CM',
        name: 'Claire Martin',
        location: 'Pháp',
        date: 'Tháng 2, 2024',
        score: '9.6',
        copy:
          'Khu nghỉ dưỡng tuyệt vời cho kỳ nghỉ thời tiết ấm áp. Bãi biển riêng và bữa ăn hướng hoàng hôn là những khoảnh khắc nổi bật.',
      },
      {
        initials: 'VT',
        name: 'Vu Tran',
        location: 'Việt Nam',
        date: 'Tháng 5, 2024',
        score: '9.1',
        copy:
          'Rất phù hợp cho du lịch gia đình. Hồ bơi, phòng và đường ra bãi biển đều được lên kế hoạch chu đáo.',
      },
    ],
  },
}

function datesOverlap(a1, a2, b1, b2) {
  return a1 < b2 && a2 > b1
}

function HotelDetailsPage() {
  const { stayId } = useParams()
  const stays = useSelector(selectAllStays)
  const criteria = useSelector(selectCriteria)
  const existingBookings = useSelector(selectHotelBookingsByStay(stayId))
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const stay = stays.find((item) => item.id === stayId)
  const [activeHighlight, setActiveHighlight] = useState(0)
  const [checkIn, setCheckIn] = useState(criteria.checkIn)
  const [checkOut, setCheckOut] = useState(criteria.checkOut)
  const [travelerCount, setTravelerCount] = useState(criteria.guests || 2)

  const todayStr = new Date().toISOString().slice(0, 10)

  const dateError = (() => {
    if (checkIn < todayStr) return 'Ngày nhận phòng không thể là ngày trong quá khứ'
    if (checkOut <= checkIn) return 'Ngày trả phòng phải sau ngày nhận phòng'
    if (existingBookings.some((b) => datesOverlap(checkIn, checkOut, b.checkIn, b.checkOut)))
      return 'Phòng đã được đặt trong khoảng thời gian này, vui lòng chọn ngày khác'
    return null
  })()

  if (!stay) {
    return <Navigate to="/search" replace />
  }

  const detailContent = detailsByTheme[stay.theme] || detailsByTheme.city
  const gallery = [stay.image, ...(galleryByTheme[stay.theme] || galleryByTheme.city)]
  const baseTotal = stay.pricePerNight * travelerCount
  const bookingFee = stay.perks.includes('Thanh toán tại chỗ') ? 0 : stay.taxesAndFees
  const total = baseTotal + bookingFee
  const baseTotalVnd = convertBasePriceToVnd(baseTotal)
  const bookingFeeVnd = convertBasePriceToVnd(bookingFee)
  const totalVnd = convertBasePriceToVnd(total)

  return (
    <Container className="page-section stay-detail-page">
      <section className="stay-detail-gallery">
        <div className="stay-detail-gallery-main">
          <img src={gallery[0]} alt={stay.name} />
        </div>
        <div className="stay-detail-gallery-grid">
          {gallery.slice(1, 5).map((image, index) => (
            <div key={`${stay.id}-gallery-${index}`} className="stay-detail-gallery-tile">
              <img src={image} alt={`${stay.name} góc nhìn ${index + 2}`} />
            </div>
          ))}
        </div>
        <button type="button" className="stay-detail-gallery-action">
          <span className="material-symbols-outlined">grid_view</span>
          Xem tất cả ảnh
        </button>
      </section>

      <div className="stay-detail-layout">
        <section className="stay-detail-main">
          <div className="stay-detail-heading">
            <div className="stay-detail-badge-row">
              <span className="stay-detail-badge">{detailContent.badge}</span>
              <span className="stay-detail-stars">★★★★★</span>
            </div>
            <h1>{stay.name}</h1>
            <div className="stay-detail-location">
              <span className="material-symbols-outlined">location_on</span>
              <span>
                {stay.city}, {stay.country}
              </span>
              <span>•</span>
              <span>{detailContent.departure}</span>
            </div>
          </div>

          <div className="stay-detail-divider"></div>

          <section className="stay-detail-section">
            <h2>{detailContent.aboutTitle}</h2>
            <p>
              {stay.description} Trải nghiệm đặt phòng cao cấp này được thiết kế cho các du khách
              muốn đến nơi thuận lợi hơn, hậu cần rõ ràng hơn, và căn cứ địa phương hoàn chỉnh hơn.
            </p>
            <p>
              Từ các tiện nghi được tuyển chọn đến quyền tiếp cận khu phố tốt hơn, chỗ ở này
              kết hợp sự thoải mái và nhịp độ tốt. Sử dụng như căn cứ thực tế để tham quan,
              ăn uống và lên kế hoạch hàng ngày dễ dàng.
            </p>
          </section>

          <section className="stay-detail-section">
            <h2>Lịch Trình & Điểm Nổi Bật</h2>
            <div className="stay-detail-accordion">
              {detailContent.highlights.map((item, index) => {
                const isOpen = activeHighlight === index

                return (
                  <div key={item.title} className={`stay-detail-accordion-item ${isOpen ? 'is-open' : ''}`}>
                    <button
                      type="button"
                      className="stay-detail-accordion-trigger"
                      onClick={() => setActiveHighlight(isOpen ? -1 : index)}
                    >
                      <span className="stay-detail-accordion-number">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="stay-detail-accordion-title">{item.title}</span>
                      <span className="material-symbols-outlined">
                        {isOpen ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="stay-detail-accordion-content">
                        <p>{item.description}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          <section className="stay-detail-section">
            <div className="stay-detail-review-head">
              <h2>Đánh Giá Của Khách</h2>
              <div className="stay-detail-review-score">
                <span>{stay.reviewsCount.toLocaleString()} đánh giá</span>
                <strong>{stay.reviewScore}</strong>
              </div>
            </div>

            <div className="stay-detail-review-metrics">
              {detailContent.reviewMetrics.map(([label, score]) => (
                <div key={label} className="stay-detail-metric">
                  <div className="stay-detail-metric-top">
                    <span>{label}</span>
                    <strong>{score}</strong>
                  </div>
                  <div className="stay-detail-metric-bar">
                    <span style={{ width: `${(score / 10) * 100}%` }}></span>
                  </div>
                </div>
              ))}
            </div>

            <div className="stay-detail-review-cards">
              {detailContent.guestReviews.map((review) => (
                <article key={review.name} className="stay-detail-review-card">
                  <div className="stay-detail-review-card-head">
                    <div className="stay-detail-reviewer">
                      <span className="stay-detail-reviewer-avatar">{review.initials}</span>
                      <div>
                        <strong>{review.name}</strong>
                        <p>
                          {review.location} • {review.date}
                        </p>
                      </div>
                    </div>
                    <span className="stay-detail-review-chip">{review.score}</span>
                  </div>
                  <p className="stay-detail-review-copy">"{review.copy}"</p>
                </article>
              ))}
            </div>
          </section>
        </section>

        <aside className="stay-detail-sidebar">
          <div className="stay-detail-booking-card">
            <div className="stay-detail-booking-price">
              <div>
                <span>Từ</span>
                <strong>{formatBasePriceToVndCurrency(stay.pricePerNight)}</strong>
              </div>
              <small>mỗi người</small>
            </div>

            <div className="stay-detail-booking-field">
              <label htmlFor="detail-checkin">Nhận Phòng</label>
              <div className="stay-detail-booking-input">
                <input
                  id="detail-checkin"
                  type="date"
                  value={checkIn}
                  min={todayStr}
                  onChange={(e) => {
                    setCheckIn(e.target.value)
                    dispatch(updateCriteria({ checkIn: e.target.value }))
                  }}
                />
                <span className="material-symbols-outlined">calendar_today</span>
              </div>
            </div>

            <div className="stay-detail-booking-field">
              <label htmlFor="detail-checkout">Trả Phòng</label>
              <div className="stay-detail-booking-input">
                <input
                  id="detail-checkout"
                  type="date"
                  value={checkOut}
                  min={checkIn || todayStr}
                  onChange={(e) => {
                    setCheckOut(e.target.value)
                    dispatch(updateCriteria({ checkOut: e.target.value }))
                  }}
                />
                <span className="material-symbols-outlined">calendar_today</span>
              </div>
            </div>

            {dateError && (
              <div className="stay-detail-date-error">
                <span className="material-symbols-outlined">error</span>
                <span>{dateError}</span>
              </div>
            )}

            <div className="stay-detail-booking-field">
              <label>Du Khách</label>
              <div className="stay-detail-travelers">
                <button
                  type="button"
                  onClick={() => setTravelerCount((current) => Math.max(1, current - 1))}
                >
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <strong>{travelerCount} người lớn</strong>
                <button type="button" onClick={() => setTravelerCount((current) => current + 1)}>
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
            </div>

            <div className="stay-detail-price-box">
              <div>
                <span>{formatBasePriceToVndCurrency(stay.pricePerNight)} × {travelerCount} du khách</span>
                <strong>{baseTotalVnd.toLocaleString('vi-VN')}₫</strong>
              </div>
              <div>
                <span>Phí Đặt Chỗ</span>
                <strong>{bookingFee === 0 ? 'Miễn Phí' : `${bookingFeeVnd.toLocaleString('vi-VN')}₫`}</strong>
              </div>
              <div className="stay-detail-price-total">
                <span>Tổng Cộng</span>
                <strong>{totalVnd.toLocaleString('vi-VN')}₫</strong>
              </div>
            </div>

            <Button
              type="button"
              className="stay-detail-book-now"
              disabled={!!dateError}
              onClick={() => !dateError && navigate(`/checkout/${stay.id}`)}
            >
              Đặt Ngay
            </Button>

            <div className="stay-detail-trust-list">
              <div>
                <span className="material-symbols-outlined is-success">verified</span>
                <span>Hủy miễn phí trước 24 giờ</span>
              </div>
              <div>
                <span className="material-symbols-outlined">schedule</span>
                <span>Thời lượng: {detailContent.duration}</span>
              </div>
              <div>
                <span className="material-symbols-outlined">bolt</span>
                <span>{detailContent.instantLabel}</span>
              </div>
              <div>
                <span className="material-symbols-outlined">translate</span>
                <span>{detailContent.languages}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  )
}

export default HotelDetailsPage
