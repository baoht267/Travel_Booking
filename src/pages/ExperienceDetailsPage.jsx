import { useState } from 'react'
import { Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useParams } from 'react-router-dom'
import { toggleSaved } from '../features/saved/savedSlice'
import mockExperiences from '../data/mockExperiences'

function formatPrice(value) {
  return new Intl.NumberFormat('vi-VN').format(Math.round(value * 25000))
}

const detailsByType = {
  'Du Thuyền': {
    includes: [
      'Vé ưu tiên lên tàu',
      'Hướng dẫn viên thuyết minh',
      'Đồ uống chào mừng',
      'Bản đồ hành trình',
    ],
    excludes: ['Chi phí di chuyển đến cảng', 'Tiền boa tự nguyện'],
    highlights: [
      { icon: 'directions_boat', text: 'Ngắm cảnh từ tàu luxury trên sông' },
      { icon: 'restaurant', text: 'Phục vụ đồ ăn & thức uống trên tàu' },
      { icon: 'music_note', text: 'Nhạc sống và không khí lãng mạn' },
      { icon: 'photo_camera', text: 'Nhiều điểm chụp ảnh đẹp nổi tiếng' },
    ],
    meetingPoint: 'Cảng tàu tại chân Tháp Eiffel, Port de la Bourdonnais, Paris',
    importantInfo: [
      'Đến trước giờ khởi hành ít nhất 15 phút',
      'Mặc đồ phù hợp với thời tiết, mang theo áo khoác',
      'Trẻ em dưới 4 tuổi miễn phí nhưng cần đặt chỗ',
    ],
  },
  'Vào Cửa Bảo Tàng': {
    includes: [
      'Vé vào cửa ưu tiên qua lối đi riêng',
      'Truy cập bộ sưu tập thường trực',
      'Bản đồ bảo tàng',
      'Truy cập Bảo Tàng Eugène Delacroix (cùng ngày)',
    ],
    excludes: ['Hướng dẫn viên trực tiếp', 'Audio guide (thuê thêm)'],
    highlights: [
      { icon: 'skip_next', text: 'Bỏ qua hàng chờ với lối vào ưu tiên' },
      { icon: 'palette', text: 'Hơn 35.000 tác phẩm nghệ thuật thế giới' },
      { icon: 'castle', text: 'Kiến trúc cung điện hoàng gia cổ kính' },
      { icon: 'confirmation_number', text: 'Vé điện tử – nhận ngay qua email' },
    ],
    meetingPoint: 'Cổng chính Kim Tự Tháp Kính (Entrée Pyramide), Rue de Rivoli, 75001 Paris',
    importantInfo: [
      'Tất cả khách tham quan phải đi qua cửa kiểm tra an ninh',
      'Thời gian chờ có thể lâu vào giờ cao điểm',
      'Phải đặt lịch hẹn cụ thể để vào bảo tàng',
      'Vali lớn, gậy selfie, đồ ăn thức uống bị cấm trong phòng trưng bày',
    ],
  },
  'Tour Đi Bộ': {
    includes: [
      'Hướng dẫn viên chuyên nghiệp địa phương',
      'Các mẫu thử đồ ăn & thức uống theo tour',
      'Nước uống miễn phí',
      'Tai nghe audio (nhóm nhỏ)',
    ],
    excludes: ['Bữa ăn chính', 'Di chuyển trước & sau tour', 'Tiền boa'],
    highlights: [
      { icon: 'restaurant', text: 'Thưởng thức đặc sản địa phương chính gốc' },
      { icon: 'group', text: 'Nhóm nhỏ tối đa 12 người' },
      { icon: 'map', text: 'Khám phá những góc phố ẩn không có trong sách' },
      { icon: 'translate', text: 'Hướng dẫn bằng tiếng Việt & tiếng Anh' },
    ],
    meetingPoint: 'Trước Nhà Thờ Sacré-Cœur, Place du Parvis du Sacré-Cœur, Paris',
    importantInfo: [
      'Đi giày thoải mái, sẽ đi bộ khoảng 3–4 km',
      'Tour diễn ra ngoài trời, kiểm tra thời tiết trước',
      'Không phù hợp với người dị ứng thực phẩm nghiêm trọng nếu không thông báo trước',
    ],
  },
}

const galleryByType = {
  'Du Thuyền': [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB3i7aAri6DLdQmI7aCTQQAn3uj5aAwFLWjqNam4YjLw6BNFnddijoWMEHHyYuP_oSiJKcxIzGRPB05aqN-OqCDR0rsox3FueemE6MEv8JDRx1viMSRQM5FqT5_K3WmWgxS33yZIxY_gzjb3bPV6sxQ_agedQODJA30Xhzh7Ta7YGznluFtpAFrdz-n7VSZINtx-9Jr8bIQBcinCbsXKJikiLUw_HTTR_0JtU6Hh7crPaEhZaEElrU',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBNNKW1GajtsSdbBGrhX7-xONw4Rdf2GnQxQc1uTMNhZq7eVIUx9JyojfDNDGuGca2a-hIzD2MH2Q7vSqdOHWvxzxDuZVgjetmOvVqtq6UiFdfN41MEpkLwfrPM1ksFTId_c7P6AoWANyzhgCuPy0zBIXB3tDlEg_wecYIt02E3WRoGxpMSpC-smrlrlmzG__cEN8daCAzli5KQg1HqthAM0JpKsSEvia0wCnvUDjs6S5QcVwrx5j1S-_XN7g7vfzLpfjQLjrCsZOsZ',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDgzEThb0an_GOLvy_DyZe1J_lqK1BZ2w5iZwijf8AAAlAFRWS1ngy9lfkO2eG8ogtbSFaFeCWiaipwjWySLapRG5Yq3ii4ybSFVbfB12Z9D7BSaPbuYKuIs_NQp6XRJ8q98V8O1J8gTZazTy5iZGUxk1-2jqQ2Mpw3uf-HzQ5V-X8ts0vtcctrM9PbVDy9ixUkr3XR1VeT34dB_yfLeD0oW7UjWt2dUJQS8VZCx1BexHUYIG0OB_OvBD2c4lVhhlKPtR-qmUnzd9nh',
  ],
  'Vào Cửa Bảo Tàng': [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBBjpWawjAFO7aOMm9inoF-jf__-0LPDYmeSLJh99CLTm7jigjyPKdcYZ92JRgV4n3laYinJTu_EyFlax0xiSLtvQdUbfqv1Wf-mm0nnz7QFrEd3WxQNG0Qt7Uq1fR_B0HL9d3vRDrFRk6l-8f7mpnlTTZDGHAUhjDrBhjCFsE6GcaN_ijwqSld_fzyOA7VVhLl5Wyk3ZIcQ1FpQegvabhgrInS0-mTx8PQq1Lhniw-GrVJgvGos5GJ-XyT2fhtB2H_3n2I0HjxNx2Q',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDkzyhp0PFQKGjgFW6veCB6CQ201KVuRtp1Drz4AoK038p1Vy9kjRthcRvi901S0eQW4KFYos89pvgUyXkITfKATolHFP5TdQjg3pU2E_X87p_ZMqYB5NfZr77Ypq4q3JZ9oHaBR92KUbRSd-HHVuJ7ykXuHccNQ3RW4vGwAyhVnd6sWjl5E0LYEIYYywqXOSbCBdUKzke2GJ9450AdE6qqFFpJrEd_WeSFoNgD3Lg8HpLle6mcJvJhXbHikppoqDPyxQyr74fW8SwV',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAYlRRpo_BXvrBwYCxKCPvvctmXOSdSlUE20ZzdLyzV8o73en0qrhtVdU0W0UlX9RKkmlw892htkAPYUfo4EMTGXzzomd9d1Hc6SuFs2GTD96ZhtesZWAFuHtmyEf95dkJiAvcUYhw0WanMrLTUiSGxtolmYF0O0A2Eahc0Z7KooPCYwwJsDhUhY2Bf2fmWK-DuTDAVGfPyl_bZ8q4KmjfEoW-yXEnWP9_-myy81akFukwbSGkRmX-_vC8sQ-m36fqQcCc4CWJ8w_hu',
  ],
  'Tour Đi Bộ': [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDt1-rsWqS6pY8d2jy86-seVnRoltF6dXwxYMCIGegXQ8gMNPYCJ0VTY8AMaYtO1vCYcnOg8A0C05QQBm52uwQXQgGZZq9xIAVyLy5HWYvJDFslrIrYoohq6iGiVhD82gBJRSH_bDlkbyaLvNEEVCnozK3nTw7Z4FVGXA4exwb-PIv2De-BG0uMCPxwDKCB-7wtl84ljs3BWu-uT8JsxewPHhSeNwzRazZ24sPHTlGJ0-09fCk9nB56oCwKkl4PcWx5k2_ZdGeNTQ95',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBNNKW1GajtsSdbBGrhX7-xONw4Rdf2GnQxQc1uTMNhZq7eVIUx9JyojfDNDGuGca2a-hIzD2MH2Q7vSqdOHWvxzxDuZVgjetmOvVqtq6UiFdfN41MEpkLwfrPM1ksFTId_c7P6AoWANyzhgCuPy0zBIXB3tDlEg_wecYIt02E3WRoGxpMSpC-smrlrlmzG__cEN8daCAzli5KQg1HqthAM0JpKsSEvia0wCnvUDjs6S5QcVwrx5j1S-_XN7g7vfzLpfjQLjrCsZOsZ',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD2V7nLpH-qIauAniUvDDr4yjpvKwMKcRLGSAvlbUS5lBm2ToLr0uGbHYtCsWo2cGS2mD5C-EFjzk-JsAJm87y4TNEuSaidfHvbDaKA-74NvNq-0qlfdtlRBiDTkXgNsUXgROfniOMgyj69bNNsxhozVA4IMgwN3WxP5RoJdfBQnQKOsOv2NWIPfw403CZCUcFNRB5y2MPp_xXVu5kJlFt0nwwROE0Q3tOQOCAyChURxQIg8kp_TkbTFYqsvSXRJM_ISCxhAB97Loxs',
  ],
}

const mockReviews = [
  {
    initials: 'AN',
    name: 'An Nguyễn',
    date: 'Đã đánh giá vào 15 Th04, 2024',
    stars: 5,
    text: 'Trải nghiệm tuyệt vời. Vé ưu tiên thực sự giúp tiết kiệm rất nhiều thời gian chờ đợi. Hướng dẫn viên nhiệt tình và am hiểu lịch sử rất sâu.',
    color: '#d8e2ff',
    textColor: '#001945',
  },
  {
    initials: 'JM',
    name: 'John Miller',
    date: 'Đã đánh giá vào 02 Th04, 2024',
    stars: 4,
    text: 'Rất đẹp và choáng ngợp. Cần chuẩn bị tinh thần đi bộ nhiều. Vé mua trên ứng dụng dùng rất mượt và nhận vé ngay lập tức.',
    color: '#ffdea4',
    textColor: '#261900',
  },
  {
    initials: 'MH',
    name: 'Minh Hà',
    date: 'Đã đánh giá vào 28 Th03, 2024',
    stars: 5,
    text: 'Đáng đồng tiền bát gạo! Nếu không có vé ưu tiên chắc phải đợi hơn 2 tiếng. Sẽ giới thiệu cho bạn bè.',
    color: '#d8f0e8',
    textColor: '#003520',
  },
]

export default function ExperienceDetailsPage() {
  const { experienceId } = useParams()
  const dispatch = useDispatch()
  const savedIds = useSelector((state) => state.saved.savedIds)
  const isSaved = savedIds.includes(experienceId)

  const experience = mockExperiences.find((e) => e.id === experienceId)
  if (!experience) return <Navigate to="/" replace />

  const details = detailsByType[experience.propertyType] || detailsByType['Vào Cửa Bảo Tàng']
  const gallery = galleryByType[experience.propertyType] || galleryByType['Vào Cửa Bảo Tàng']

  return (
    <div className="exp-detail-page">
      <Container>
        {/* Breadcrumb */}
        <nav className="search-breadcrumb exp-detail-breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span className="material-symbols-outlined">chevron_right</span>
          <Link to="/search">Địa điểm</Link>
          <span className="material-symbols-outlined">chevron_right</span>
          <span>{experience.city}</span>
          <span className="material-symbols-outlined">chevron_right</span>
          <strong>{experience.name}</strong>
        </nav>

        {/* Gallery */}
        <div className="exp-detail-gallery">
          <div className="exp-detail-gallery-main group">
            <img src={experience.image} alt={experience.name} className="exp-detail-gallery-img" />
          </div>
          <div className="exp-detail-gallery-side">
            {gallery.slice(0, 2).map((src, i) => (
              <div key={i} className={`exp-detail-gallery-tile${i === 1 ? ' exp-last-tile' : ''}`}>
                <img src={src} alt={`${experience.name} ${i + 2}`} className="exp-detail-gallery-img" />
                {i === 1 && (
                  <div className="exp-gallery-overlay">
                    <button className="exp-gallery-btn">
                      <span className="material-symbols-outlined">grid_view</span>
                      Xem tất cả ảnh
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Title Row */}
        <div className="exp-detail-title-row">
          <div>
            <h1 className="exp-detail-title">{experience.name}</h1>
            <div className="exp-detail-meta">
              <div className="exp-detail-rating">
                <span className="exp-score-badge">{experience.reviewScore}</span>
                <div className="exp-stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      className="material-symbols-outlined"
                      style={{
                        fontSize: '18px',
                        color: '#febb02',
                        fontVariationSettings:
                          s <= Math.round(experience.reviewScore / 2)
                            ? "'FILL' 1"
                            : "'FILL' 0",
                      }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <span className="exp-review-count">
                  ({experience.reviewsCount.toLocaleString()} đánh giá)
                </span>
              </div>
              <div className="exp-detail-location-chip">
                <span className="material-symbols-outlined">location_on</span>
                {experience.area}, {experience.city}
              </div>
              <div className="exp-detail-location-chip">
                <span className="material-symbols-outlined">schedule</span>
                {experience.duration}
              </div>
            </div>
          </div>
          <div className="exp-detail-actions">
            <button className="exp-action-btn">
              <span className="material-symbols-outlined">share</span>
            </button>
            <button
              className={`exp-action-btn${isSaved ? ' is-saved' : ''}`}
              onClick={() => dispatch(toggleSaved(experience.id))}
              aria-label={isSaved ? 'Xóa khỏi đã lưu' : 'Lưu'}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="exp-detail-layout">
          {/* LEFT */}
          <div className="exp-detail-main">

            {/* Key Info */}
            <div className="exp-detail-card">
              <h2 className="exp-detail-section-title">Về hoạt động này</h2>
              <div className="exp-highlights-grid">
                {details.highlights.map((h) => (
                  <div key={h.text} className="exp-highlight-item">
                    <span className="material-symbols-outlined exp-highlight-icon">{h.icon}</span>
                    <div>
                      <p className="exp-highlight-text">{h.text}</p>
                    </div>
                  </div>
                ))}
                <div className="exp-highlight-item">
                  <span className="material-symbols-outlined exp-highlight-icon">event_available</span>
                  <div>
                    <p className="exp-highlight-label">Hủy miễn phí</p>
                    <p className="exp-highlight-sub">Hủy trước tối đa 24 giờ để được hoàn tiền đầy đủ</p>
                  </div>
                </div>
                <div className="exp-highlight-item">
                  <span className="material-symbols-outlined exp-highlight-icon">bolt</span>
                  <div>
                    <p className="exp-highlight-label">Xác nhận tức thì</p>
                    <p className="exp-highlight-sub">Nhận vé điện tử ngay sau khi đặt</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="exp-detail-card">
              <h2 className="exp-detail-section-title">Mô tả chi tiết</h2>
              <div className="exp-detail-description">
                <p>{experience.description}</p>
                <p>
                  Đây là một trong những trải nghiệm được đánh giá cao nhất tại {experience.city}.
                  Với dịch vụ chuyên nghiệp và hướng dẫn viên am hiểu sâu sắc, chuyến tham quan
                  sẽ mang lại những kỷ niệm đáng nhớ cho bạn và gia đình.
                </p>
                <ul className="exp-detail-list">
                  <li>Trải nghiệm độc quyền với dịch vụ ưu tiên</li>
                  <li>Phù hợp cho mọi lứa tuổi và sở thích</li>
                  <li>Hỗ trợ tiếng Việt trong suốt hành trình</li>
                </ul>
              </div>
            </div>

            {/* Includes / Excludes */}
            <div className="exp-detail-card">
              <h2 className="exp-detail-section-title">Bao gồm & Không bao gồm</h2>
              <div className="exp-includes-grid">
                <ul className="exp-include-list">
                  {details.includes.map((item) => (
                    <li key={item} className="exp-include-item">
                      <span className="material-symbols-outlined exp-check-icon">check_circle</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <ul className="exp-include-list">
                  {details.excludes.map((item) => (
                    <li key={item} className="exp-include-item exp-exclude-item">
                      <span className="material-symbols-outlined exp-cross-icon">cancel</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Important Info */}
            <div className="exp-detail-card">
              <h2 className="exp-detail-section-title">Thông tin quan trọng</h2>
              <div className="exp-info-block">
                <div className="exp-info-row">
                  <span className="material-symbols-outlined exp-info-icon">location_on</span>
                  <div>
                    <p className="exp-info-label">Điểm tập hợp</p>
                    <p className="exp-info-text">{details.meetingPoint}</p>
                  </div>
                </div>
                <div className="exp-info-row">
                  <span className="material-symbols-outlined exp-info-icon exp-warn-icon">info</span>
                  <div>
                    <p className="exp-info-label">Lưu ý khi tham quan</p>
                    <ul className="exp-info-list">
                      {details.importantInfo.map((info) => (
                        <li key={info}>{info}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="exp-detail-card">
              <div className="exp-reviews-head">
                <h2 className="exp-detail-section-title">Đánh giá từ khách hàng</h2>
                <button className="exp-link-btn">Xem tất cả</button>
              </div>
              <div className="exp-reviews-list">
                {mockReviews.map((r) => (
                  <div key={r.name} className="exp-review-item">
                    <div className="exp-review-header">
                      <div className="exp-reviewer">
                        <div
                          className="exp-avatar"
                          style={{ background: r.color, color: r.textColor }}
                        >
                          {r.initials}
                        </div>
                        <div>
                          <p className="exp-reviewer-name">{r.name}</p>
                          <p className="exp-reviewer-date">{r.date}</p>
                        </div>
                      </div>
                      <div className="exp-review-stars">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span
                            key={s}
                            className="material-symbols-outlined"
                            style={{
                              fontSize: '16px',
                              color: s <= r.stars ? '#febb02' : '#c4c6d3',
                              fontVariationSettings: s <= r.stars ? "'FILL' 1" : "'FILL' 0",
                            }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="exp-review-text">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT – Booking Widget */}
          <div className="exp-detail-sidebar">
            <BookingWidget experience={experience} />
          </div>
        </div>
      </Container>
    </div>
  )
}

function BookingWidget({ experience }) {
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [booked, setBooked] = useState(false)

  const price = experience.pricePerNight * 25000
  const total = Math.round(price * adults + price * 0.5 * children)

  function handleBook() {
    setBooked(true)
    setTimeout(() => setBooked(false), 2000)
  }

  return (
    <div className="exp-booking-card">
      {/* Price */}
      <div className="exp-booking-price-row">
        <div>
          <p className="exp-booking-from">Giá chỉ từ</p>
          <p className="exp-booking-price">
            {Math.round(price).toLocaleString('vi-VN')}₫
          </p>
          <p className="exp-booking-per">/người lớn</p>
        </div>
        <div className="exp-booking-score">
          <span className="exp-score-badge">{experience.reviewScore}</span>
        </div>
      </div>

      {/* Date */}
      <div className="exp-booking-field">
        <label className="exp-booking-label">Ngày tham quan</label>
        <div className="exp-booking-input-wrap">
          <span className="material-symbols-outlined exp-booking-icon">calendar_today</span>
          <input
            type="date"
            className="exp-booking-input"
            defaultValue={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      {/* Counter */}
      <div className="exp-booking-field">
        <label className="exp-booking-label">Số lượng khách</label>
        <div className="exp-counter-group">
          <div className="exp-counter-row">
            <div>
              <p className="exp-counter-label">Người lớn</p>
              <p className="exp-counter-sub">Từ 18 tuổi</p>
            </div>
            <div className="exp-counter-ctrl">
              <button
                className="exp-counter-btn"
                onClick={() => setAdults(Math.max(1, adults - 1))}
              >
                <span className="material-symbols-outlined">remove</span>
              </button>
              <span className="exp-counter-val">{adults}</span>
              <button className="exp-counter-btn" onClick={() => setAdults(adults + 1)}>
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>
          <div className="exp-counter-row">
            <div>
              <p className="exp-counter-label">Trẻ em</p>
              <p className="exp-counter-sub">4 – 17 tuổi</p>
            </div>
            <div className="exp-counter-ctrl">
              <button
                className="exp-counter-btn"
                onClick={() => setChildren(Math.max(0, children - 1))}
              >
                <span className="material-symbols-outlined">remove</span>
              </button>
              <span className="exp-counter-val">{children}</span>
              <button className="exp-counter-btn" onClick={() => setChildren(children + 1)}>
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Price Summary */}
      <div className="exp-booking-summary">
        <div className="exp-booking-summary-row">
          <span>
            {adults} người lớn × {Math.round(price).toLocaleString('vi-VN')}₫
          </span>
          <span>{Math.round(price * adults).toLocaleString('vi-VN')}₫</span>
        </div>
        {children > 0 && (
          <div className="exp-booking-summary-row">
            <span>
              {children} trẻ em × {Math.round(price * 0.5).toLocaleString('vi-VN')}₫
            </span>
            <span>{Math.round(price * 0.5 * children).toLocaleString('vi-VN')}₫</span>
          </div>
        )}
        <div className="exp-booking-summary-total">
          <span>Tổng cộng</span>
          <span className="exp-booking-total-amount">
            {total.toLocaleString('vi-VN')}₫
          </span>
        </div>
      </div>

      {/* CTA */}
      <button
        className="exp-booking-cta"
        onClick={handleBook}
        disabled={booked}
      >
        {booked ? 'Đang xử lý...' : 'Đặt ngay'}
      </button>

      {/* Trust */}
      <div className="exp-booking-trust">
        <span className="material-symbols-outlined">verified_user</span>
        <span>Hủy miễn phí trước 24 giờ</span>
      </div>
      <p className="exp-booking-social">
        Đã có 5.200+ người đặt hoạt động này trong tháng qua
      </p>
    </div>
  )
}
