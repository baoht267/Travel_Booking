import { Button, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toggleSaved } from '../../features/saved/savedSlice'

function formatPrice(value) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function StayCard({ stay }) {
  const savedIds = useSelector((state) => state.saved.savedIds)
  const isSaved = savedIds.includes(stay.id)
  const dispatch = useDispatch()

  const isExperienceCard = Boolean(stay.image && stay.area && stay.duration)
  const tagToneClass =
    stay.tagTone === 'warning' ? 'experience-tag-warning' : 'experience-tag-success'

  if (isExperienceCard) {
    return (
      <Card className="experience-card">
        <div className="experience-card-media">
          <img src={stay.image} alt={stay.name} className="experience-card-image" />
          <button
            type="button"
            className={`experience-save-button ${isSaved ? 'is-saved' : ''}`}
            onClick={() => dispatch(toggleSaved(stay.id))}
            aria-label={isSaved ? 'Xóa khỏi đã lưu' : 'Lưu trải nghiệm'}
          >
            <span className="material-symbols-outlined">
              {isSaved ? 'favorite' : 'favorite_outline'}
            </span>
          </button>
        </div>

        <Card.Body className="experience-card-body">
          <div className="experience-card-main">
            <div>
              <div className="experience-card-header">
                <h3 className="experience-card-title">{stay.name}</h3>
                <div className="experience-card-score-wrap">
                  <div className="experience-card-score-copy">
                    <span className="experience-card-score-label">{stay.reviewLabel}</span>
                    <span className="experience-card-score-reviews">
                      {stay.reviewsCount.toLocaleString()} đánh giá
                    </span>
                  </div>
                  <span className="experience-card-score-box">{stay.reviewScore}</span>
                </div>
              </div>

              <div className="experience-card-location">
                <span className="material-symbols-outlined">location_on</span>
                <span>{stay.area}</span>
              </div>

              <p className="experience-card-description">{stay.description}</p>
            </div>

            <div className="experience-card-footer">
              <div className="experience-card-meta">
                <span className={`experience-tag ${tagToneClass}`}>{stay.tagLabel}</span>
                <span className="experience-duration">Thời lượng: {stay.duration}</span>
              </div>

              <div className="experience-card-price-block">
                <span className="experience-price-prefix">Từ</span>
                <span className="experience-price">EUR{formatPrice(stay.pricePerNight)}</span>
                <Button as={Link} to={`/experiences/${stay.id}`} type="button" className="experience-availability-button">
                  Xem Chi Tiết
                </Button>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    )
  }

  return (
    <Card className="hotel-card hotel-search-card surface-card">
      <div className="hotel-search-media">
        <img src={stay.image} alt={stay.name} className="hotel-search-image" />
      </div>

      <Card.Body className="hotel-search-body">
        <div className="hotel-search-main">
          <div className="hotel-search-copy">
            <div className="hotel-search-heading">
              <div>
                <h3 className="hotel-search-title">
                  <Link to={`/stays/${stay.id}`}>{stay.name}</Link>
                </h3>
                <div className="hotel-search-location">
                  {stay.city}, {stay.country} | {stay.distanceToCenter} km từ trung tâm
                </div>
              </div>

              <div className="hotel-search-rating">
                <div className="experience-card-score-copy">
                  <span className="experience-card-score-label">{stay.reviewLabel}</span>
                  <span className="experience-card-score-reviews">
                    {stay.reviewsCount.toLocaleString()} đánh giá
                  </span>
                </div>
                <div className="experience-card-score-box">{stay.reviewScore}</div>
              </div>
            </div>

            <p className="hotel-search-description">{stay.description}</p>

            <div className="hotel-search-tags">
              {stay.perks.map((perk) => (
                <span key={perk} className="experience-tag experience-tag-success">
                  {perk}
                </span>
              ))}
            </div>
          </div>

          <div className="hotel-search-footer">
            <div className="experience-card-meta">
              <span className="experience-duration">{stay.propertyType}</span>
            </div>
            <div className="experience-card-price-block">
              <span className="experience-price-prefix">Từ</span>
              <span className="experience-price">EUR{formatPrice(stay.pricePerNight)}</span>
              <div className="hotel-search-actions">
                <Button
                  variant={isSaved ? 'warning' : 'outline-secondary'}
                  className="save-toggle"
                  onClick={() => dispatch(toggleSaved(stay.id))}
                >
                  {isSaved ? 'Đã Lưu' : 'Lưu'}
                </Button>
                <Button
                  as={Link}
                  to={`/stays/${stay.id}`}
                  variant="primary"
                  className="experience-availability-button"
                >
                  Xem Lịch Trống
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

export default StayCard
