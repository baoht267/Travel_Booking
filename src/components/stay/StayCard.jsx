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
