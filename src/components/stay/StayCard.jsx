import { Button, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toggleSaved } from '../../features/saved/savedSlice'
import { useToast } from '../../context/toastState'
import { formatBasePriceToVndCurrency } from '../../utils/currency'

function StayCard({ stay }) {
  const savedIds = useSelector((state) => state.saved.savedIds)
  const isSaved = savedIds.includes(stay.id)
  const dispatch = useDispatch()
  const showToast = useToast()

  const handleToggleSaved = () => {
    dispatch(toggleSaved(stay.id))
    showToast(
      isSaved ? `Đã xóa "${stay.name}" khỏi danh sách lưu` : `Đã lưu "${stay.name}"`,
      isSaved ? 'info' : 'success',
    )
  }

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
            onClick={handleToggleSaved}
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
                <span className="experience-price">{formatBasePriceToVndCurrency(stay.pricePerNight)}</span>
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
    <div className="hsc-card">
      <Link to={`/stays/${stay.id}`} className="hsc-image-wrap">
        <img src={stay.image} alt={stay.name} className="hsc-image" />
      </Link>

      <div className="hsc-body">
        {/* Top: title + rating */}
        <div className="hsc-header">
          <div className="hsc-title-block">
            <h3 className="hsc-title">
              <Link to={`/stays/${stay.id}`}>{stay.name}</Link>
            </h3>
            <div className="hsc-location">
              <span className="material-symbols-outlined">location_on</span>
              {stay.city}, {stay.country}
              <span className="hsc-distance">{stay.distanceToCenter} km từ trung tâm</span>
            </div>
          </div>

          <div className="hsc-rating">
            <div className="hsc-rating-text">
              <span className="hsc-rating-label">{stay.reviewLabel}</span>
              <span className="hsc-rating-count">{stay.reviewsCount.toLocaleString()} đánh giá</span>
            </div>
            <div className="hsc-score">{stay.reviewScore}</div>
          </div>
        </div>

        {/* Description */}
        <p className="hsc-description">{stay.description}</p>

        {/* Perks */}
        <div className="hsc-perks">
          {stay.perks.map((perk) => (
            <span key={perk} className="hsc-perk">{perk}</span>
          ))}
        </div>

        {/* Footer: type + price + actions */}
        <div className="hsc-footer">
          <span className="hsc-type">{stay.propertyType}</span>

          <div className="hsc-price-block">
            <div className="hsc-price-info">
              <span className="hsc-price-from">Từ</span>
              <span className="hsc-price">{formatBasePriceToVndCurrency(stay.pricePerNight)}</span>
              <span className="hsc-price-note">mỗi đêm</span>
            </div>
            <div className="hsc-actions">
              <button
                type="button"
                className={`hsc-save-btn${isSaved ? ' is-saved' : ''}`}
                onClick={handleToggleSaved}
                aria-label={isSaved ? 'Bỏ lưu' : 'Lưu'}
              >
                <span className="material-symbols-outlined">
                  {isSaved ? 'favorite' : 'favorite_border'}
                </span>
                {isSaved ? 'Đã lưu' : 'Lưu'}
              </button>
              <Link to={`/stays/${stay.id}`} className="hsc-book-btn">
                Xem lịch trống
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StayCard
