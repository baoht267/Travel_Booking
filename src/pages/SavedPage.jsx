import { useState } from 'react'
import { Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate } from 'react-router-dom'
import { toggleSaved } from '../features/saved/savedSlice'
import { selectAllStays } from '../features/stays/staysSlice'
import mockExperiences from '../data/mockExperiences'
import { readSession } from '../utils/authSession'
import { formatBasePriceToVndCurrency } from '../utils/currency'

function SavedPage() {
  const stays = useSelector(selectAllStays)
  const savedIds = useSelector((state) => state.saved.savedIds)
  const dispatch = useDispatch()

  if (!readSession()) return <Navigate to="/auth" replace />

  const allItems = [...stays, ...mockExperiences]
  const savedItems = allItems.filter((item) => savedIds.includes(item.id))

  const [activeFilter, setActiveFilter] = useState('all')
  const [viewMode, setViewMode] = useState('list')

  const hotels = savedItems.filter((item) => !item.duration)
  const experiences = savedItems.filter((item) => Boolean(item.duration))

  const displayed =
    activeFilter === 'hotels'
      ? hotels
      : activeFilter === 'experiences'
        ? experiences
        : savedItems

  return (
    <div className="saved-page">
      {/* Page Header */}
      <div className="saved-header">
        <Container>
          <div className="saved-header-inner">
            <div>
              <span className="saved-kicker">Danh Sách Yêu Thích</span>
              <h1 className="saved-title">Chỗ ở đã lưu trên thiết bị này</h1>
              <p className="saved-subtitle">
              
              </p>
            </div>
            {savedItems.length > 0 && (
              <div className="saved-header-badge">
                <span className="material-symbols-outlined">favorite</span>
                <span>{savedItems.length} mục đã lưu</span>
              </div>
            )}
          </div>
        </Container>
      </div>

      <Container className="saved-content">
        {savedItems.length > 0 ? (
          <>
            {/* Toolbar */}
            <div className="saved-toolbar">
              <div className="saved-filter-tabs">
                <button
                  className={`saved-filter-tab${activeFilter === 'all' ? ' is-active' : ''}`}
                  onClick={() => setActiveFilter('all')}
                >
                  Tất cả
                  <span className="saved-tab-count">{savedItems.length}</span>
                </button>
                {hotels.length > 0 && (
                  <button
                    className={`saved-filter-tab${activeFilter === 'hotels' ? ' is-active' : ''}`}
                    onClick={() => setActiveFilter('hotels')}
                  >
                    <span className="material-symbols-outlined">hotel</span>
                    Chỗ ở
                    <span className="saved-tab-count">{hotels.length}</span>
                  </button>
                )}
                {experiences.length > 0 && (
                  <button
                    className={`saved-filter-tab${activeFilter === 'experiences' ? ' is-active' : ''}`}
                    onClick={() => setActiveFilter('experiences')}
                  >
                    <span className="material-symbols-outlined">explore</span>
                    Trải nghiệm
                    <span className="saved-tab-count">{experiences.length}</span>
                  </button>
                )}
              </div>

              <div className="saved-view-toggle">
                <button
                  className={`saved-view-btn${viewMode === 'list' ? ' is-active' : ''}`}
                  onClick={() => setViewMode('list')}
                  aria-label="Dạng danh sách"
                >
                  <span className="material-symbols-outlined">view_list</span>
                </button>
                <button
                  className={`saved-view-btn${viewMode === 'grid' ? ' is-active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Dạng lưới"
                >
                  <span className="material-symbols-outlined">grid_view</span>
                </button>
              </div>
            </div>

            {/* Results count */}
            <p className="saved-results-label">
              Hiển thị <strong>{displayed.length}</strong> mục
            </p>

            {/* Cards */}
            <div className={viewMode === 'grid' ? 'saved-grid' : 'saved-list'}>
              {displayed.map((item) => {
                const isExp = Boolean(item.duration)
                return isExp ? (
                  <SavedExperienceCard
                    key={item.id}
                    item={item}
                    viewMode={viewMode}
                    onRemove={() => dispatch(toggleSaved(item.id))}
                  />
                ) : (
                  <SavedHotelCard
                    key={item.id}
                    item={item}
                    viewMode={viewMode}
                    onRemove={() => dispatch(toggleSaved(item.id))}
                  />
                )
              })}
            </div>

            {/* Bottom CTA */}
            <div className="saved-bottom-cta">
              <p className="saved-bottom-text">Muốn khám phá thêm?</p>
              <Link to="/search" className="saved-browse-link">
                <span className="material-symbols-outlined">search</span>
                Tìm kiếm thêm chỗ ở
              </Link>
            </div>
          </>
        ) : (
          <SavedEmptyState />
        )}
      </Container>
    </div>
  )
}

function SavedHotelCard({ item, viewMode, onRemove }) {
  const isGrid = viewMode === 'grid'
  return (
    <div className={`saved-card${isGrid ? ' saved-card-grid' : ''}`}>
      <div className="saved-card-media">
        <img src={item.image} alt={item.name} className="saved-card-image" />
        <button className="saved-card-remove" onClick={onRemove} aria-label="Xóa khỏi đã lưu">
          <span className="material-symbols-outlined">favorite</span>
        </button>
        <span className="saved-card-type-badge">
          <span className="material-symbols-outlined">hotel</span>
          {item.propertyType}
        </span>
      </div>

      <div className="saved-card-body">
        <div className="saved-card-main">
          <div className="saved-card-info">
            <div className="saved-card-title-row">
              <h3 className="saved-card-title">
                <Link to={`/stays/${item.id}`}>{item.name}</Link>
              </h3>
              <div className="saved-card-score">
                <span className="saved-score-box">{item.reviewScore}</span>
                <div className="saved-score-copy">
                  <span className="saved-score-label">{item.reviewLabel}</span>
                  <span className="saved-score-reviews">{item.reviewsCount.toLocaleString()} đánh giá</span>
                </div>
              </div>
            </div>

            <p className="saved-card-location">
              <span className="material-symbols-outlined">location_on</span>
              {item.city}, {item.country}
              <span className="saved-location-sep">·</span>
              {item.distanceToCenter} km từ trung tâm
            </p>

            {!isGrid && (
              <p className="saved-card-description">{item.description}</p>
            )}

            <div className="saved-card-perks">
              {item.perks?.slice(0, isGrid ? 2 : 3).map((perk) => (
                <span key={perk} className="saved-perk-tag">
                  <span className="material-symbols-outlined">check_circle</span>
                  {perk}
                </span>
              ))}
            </div>
          </div>

          <div className="saved-card-footer">
            <div className="saved-card-price-block">
              <span className="saved-price-from">Từ</span>
              <span className="saved-price">{formatBasePriceToVndCurrency(item.pricePerNight)}</span>
              <span className="saved-price-note">mỗi đêm, đã gồm thuế</span>
            </div>
            <div className="saved-card-actions">
              <button className="saved-remove-btn" onClick={onRemove}>
                <span className="material-symbols-outlined">delete_outline</span>
                {!isGrid && 'Xóa'}
              </button>
              <Link to={`/stays/${item.id}`} className="saved-view-btn-link">
                Xem chi tiết
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SavedExperienceCard({ item, viewMode, onRemove }) {
  const isGrid = viewMode === 'grid'
  const tagToneClass = item.tagTone === 'warning' ? 'experience-tag-warning' : 'experience-tag-success'
  return (
    <div className={`saved-card${isGrid ? ' saved-card-grid' : ''}`}>
      <div className="saved-card-media">
        <img src={item.image} alt={item.name} className="saved-card-image" />
        <button className="saved-card-remove" onClick={onRemove} aria-label="Xóa khỏi đã lưu">
          <span className="material-symbols-outlined">favorite</span>
        </button>
        <span className="saved-card-type-badge saved-card-type-exp">
          <span className="material-symbols-outlined">explore</span>
          Trải nghiệm
        </span>
      </div>

      <div className="saved-card-body">
        <div className="saved-card-main">
          <div className="saved-card-info">
            <div className="saved-card-title-row">
              <h3 className="saved-card-title">{item.name}</h3>
              <div className="saved-card-score">
                <span className="saved-score-box">{item.reviewScore}</span>
                <div className="saved-score-copy">
                  <span className="saved-score-label">{item.reviewLabel}</span>
                  <span className="saved-score-reviews">{item.reviewsCount.toLocaleString()} đánh giá</span>
                </div>
              </div>
            </div>

            <p className="saved-card-location">
              <span className="material-symbols-outlined">location_on</span>
              {item.area}
              {item.duration && (
                <>
                  <span className="saved-location-sep">·</span>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>schedule</span>
                  {item.duration}
                </>
              )}
            </p>

            {!isGrid && (
              <p className="saved-card-description">{item.description}</p>
            )}

            <div className="saved-card-perks">
              <span className={`experience-tag ${tagToneClass}`}>{item.tagLabel}</span>
            </div>
          </div>

          <div className="saved-card-footer">
            <div className="saved-card-price-block">
              <span className="saved-price-from">Từ</span>
              <span className="saved-price">{formatBasePriceToVndCurrency(item.pricePerNight)}</span>
            </div>
            <div className="saved-card-actions">
              <button className="saved-remove-btn" onClick={onRemove}>
                <span className="material-symbols-outlined">delete_outline</span>
                {!isGrid && 'Xóa'}
              </button>
              <Link to={`/experiences/${item.id}`} className="saved-view-btn-link">
                Xem chi tiết
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SavedEmptyState() {
  return (
    <div className="saved-empty">
      <div className="saved-empty-icon">
        <span className="material-symbols-outlined">favorite_border</span>
      </div>
      <h2 className="saved-empty-title">Chưa có mục nào được lưu</h2>
      <p className="saved-empty-text">
        Lưu chỗ ở và trải nghiệm yêu thích từ trang kết quả tìm kiếm để tạo danh sách cá nhân của bạn.
      </p>
      <div className="saved-empty-actions">
        <Link to="/" className="saved-empty-btn-primary">
          <span className="material-symbols-outlined">hotel</span>
          Duyệt Chỗ Ở
        </Link>
        <Link to="/search" className="saved-empty-btn-secondary">
          <span className="material-symbols-outlined">explore</span>
          Khám phá trải nghiệm
        </Link>
      </div>
      <div className="saved-empty-suggestions">
        <p className="saved-empty-suggestions-label">Có thể bạn sẽ thích</p>
        <div className="saved-empty-suggestions-grid">
          {[
            { icon: 'beach_access', label: 'Biển & Đảo' },
            { icon: 'castle', label: 'Di tích lịch sử' },
            { icon: 'restaurant', label: 'Ẩm thực địa phương' },
            { icon: 'hiking', label: 'Thiên nhiên' },
          ].map((s) => (
            <Link key={s.label} to="/search" className="saved-suggestion-chip">
              <span className="material-symbols-outlined">{s.icon}</span>
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SavedPage
