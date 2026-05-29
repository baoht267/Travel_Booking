import { useMemo, useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toggleSaved } from '../features/saved/savedSlice'
import mockExperiences from '../data/mockExperiences'

function formatPrice(value) {
  return new Intl.NumberFormat('vi-VN').format(Math.round(value * 25000))
}

const CATEGORY_ALL = 'Tất cả'

function AttractionsPage() {
  const dispatch = useDispatch()
  const savedIds = useSelector((state) => state.saved.savedIds)

  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(CATEGORY_ALL)
  const [sortBy, setSortBy] = useState('Đề Xuất')

  const categories = useMemo(() => {
    const types = [...new Set(mockExperiences.map((e) => e.propertyType))]
    return [CATEGORY_ALL, ...types]
  }, [])

  const filtered = useMemo(() => {
    let list = [...mockExperiences]

    if (search.trim()) {
      const term = search.trim().toLowerCase()
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(term) ||
          e.city.toLowerCase().includes(term) ||
          e.area.toLowerCase().includes(term) ||
          e.description.toLowerCase().includes(term),
      )
    }

    if (activeCategory !== CATEGORY_ALL) {
      list = list.filter((e) => e.propertyType === activeCategory)
    }

    if (sortBy === 'Đánh Giá Cao Nhất') {
      list.sort((a, b) => b.reviewScore - a.reviewScore)
    } else if (sortBy === 'Giá: Thấp Nhất') {
      list.sort((a, b) => a.pricePerNight - b.pricePerNight)
    } else if (sortBy === 'Giá: Cao Nhất') {
      list.sort((a, b) => b.pricePerNight - a.pricePerNight)
    }

    return list
  }, [search, activeCategory, sortBy])

  return (
    <div className="attractions-page">
      {/* Hero */}
      <div className="attractions-hero">
        <div className="attractions-hero-overlay" />
        <Container className="attractions-hero-content">
          <h1 className="attractions-hero-title">Khám Phá Địa Điểm Nổi Tiếng</h1>
          <p className="attractions-hero-subtitle">
            Bảo tàng, du thuyền, tour đi bộ và nhiều trải nghiệm độc đáo khắp thế giới
          </p>

          {/* Search bar */}
          <div className="attractions-search-bar">
            <span className="material-symbols-outlined attractions-search-icon">search</span>
            <input
              className="attractions-search-input"
              placeholder="Tìm theo tên, thành phố, khu vực..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="attractions-search-clear"
                onClick={() => setSearch('')}
                aria-label="Xóa tìm kiếm"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>
        </Container>
      </div>

      <Container className="attractions-body">
        {/* Toolbar */}
        <div className="attractions-toolbar">
          <div className="attractions-category-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`attractions-cat-tab${activeCategory === cat ? ' is-active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat === 'Du Thuyền' && (
                  <span className="material-symbols-outlined">directions_boat</span>
                )}
                {cat === 'Vào Cửa Bảo Tàng' && (
                  <span className="material-symbols-outlined">museum</span>
                )}
                {cat === 'Tour Đi Bộ' && (
                  <span className="material-symbols-outlined">directions_walk</span>
                )}
                {cat === CATEGORY_ALL && (
                  <span className="material-symbols-outlined">explore</span>
                )}
                {cat}
              </button>
            ))}
          </div>

          <div className="attractions-sort-wrap">
            <label htmlFor="attractions-sort">Sắp xếp:</label>
            <select
              id="attractions-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Đề Xuất</option>
              <option>Đánh Giá Cao Nhất</option>
              <option>Giá: Thấp Nhất</option>
              <option>Giá: Cao Nhất</option>
            </select>
          </div>
        </div>

        {/* Count */}
        <p className="attractions-count">
          Tìm thấy <strong>{filtered.length}</strong> địa điểm
          {activeCategory !== CATEGORY_ALL && ` trong mục "${activeCategory}"`}
        </p>

        {/* Cards */}
        {filtered.length > 0 ? (
          <div className="attractions-grid">
            {filtered.map((exp) => {
              const isSaved = savedIds.includes(exp.id)
              return (
                <article key={exp.id} className="attraction-card">
                  <div className="attraction-card-media">
                    <img src={exp.image} alt={exp.name} className="attraction-card-image" />
                    <button
                      className={`attraction-save-btn${isSaved ? ' is-saved' : ''}`}
                      onClick={() => dispatch(toggleSaved(exp.id))}
                      aria-label={isSaved ? 'Xóa khỏi đã lưu' : 'Lưu địa điểm'}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        favorite
                      </span>
                    </button>
                    <span
                      className={`attraction-tag ${
                        exp.tagTone === 'warning' ? 'experience-tag-warning' : 'experience-tag-success'
                      }`}
                    >
                      {exp.tagLabel}
                    </span>
                  </div>

                  <div className="attraction-card-body">
                    <div className="attraction-card-type">
                      <span className="material-symbols-outlined">
                        {exp.propertyType === 'Du Thuyền'
                          ? 'directions_boat'
                          : exp.propertyType === 'Vào Cửa Bảo Tàng'
                          ? 'museum'
                          : 'directions_walk'}
                      </span>
                      {exp.propertyType}
                    </div>

                    <h3 className="attraction-card-title">
                      <Link to={`/experiences/${exp.id}`}>{exp.name}</Link>
                    </h3>

                    <div className="attraction-card-location">
                      <span className="material-symbols-outlined">location_on</span>
                      {exp.area}, {exp.city}
                    </div>

                    <p className="attraction-card-desc">{exp.description}</p>

                    <div className="attraction-card-footer">
                      <div className="attraction-card-meta">
                        <div className="attraction-score">
                          <span className="attraction-score-badge">{exp.reviewScore}</span>
                          <div>
                            <span className="attraction-score-label">{exp.reviewLabel}</span>
                            <span className="attraction-score-reviews">
                              {exp.reviewsCount.toLocaleString()} đánh giá
                            </span>
                          </div>
                        </div>
                        <span className="attraction-duration">
                          <span className="material-symbols-outlined">schedule</span>
                          {exp.duration}
                        </span>
                      </div>

                      <div className="attraction-card-price-row">
                        <div>
                          <span className="attraction-price-from">Từ</span>
                          <span className="attraction-price">
                            {formatPrice(exp.pricePerNight)}₫
                          </span>
                          <span className="attraction-price-per">/người</span>
                        </div>
                        <Button
                          as={Link}
                          to={`/experiences/${exp.id}`}
                          className="attraction-detail-btn"
                        >
                          Xem Chi Tiết
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="attractions-empty">
            <span className="material-symbols-outlined">search_off</span>
            <h3>Không tìm thấy địa điểm nào</h3>
            <p>Thử từ khóa khác hoặc chọn danh mục khác.</p>
            <button
              className="btn btn-outline-primary mt-3"
              onClick={() => { setSearch(''); setActiveCategory(CATEGORY_ALL) }}
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </Container>
    </div>
  )
}

export default AttractionsPage
