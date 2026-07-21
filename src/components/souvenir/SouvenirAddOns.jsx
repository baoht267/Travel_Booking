import { useSelector } from 'react-redux'
import { selectSouvenirs } from '../../features/souvenirs/souvenirsSlice'
import { formatBasePriceToVndCurrency } from '../../utils/currency'

// Mục "bán kèm" đồ lưu niệm dùng chung cho các luồng đặt phòng / đặt vé.
// selections: { [souvenirId]: quantity } — do component cha giữ.
// onChange(id, quantity): cập nhật số lượng.
function SouvenirAddOns({ selections, onChange, title = 'Thêm đồ lưu niệm (tuỳ chọn)' }) {
  const souvenirs = useSelector(selectSouvenirs)
  const available = souvenirs.filter((souvenir) => souvenir.stock > 0)

  if (available.length === 0) {
    return null
  }

  return (
    <div className="souvenir-addons">
      <div className="souvenir-addons-head">
        <span className="material-symbols-outlined">shopping_bag</span>
        <div>
          <h3 className="souvenir-addons-title">{title}</h3>
          <p className="souvenir-addons-sub">Mang một chút kỷ niệm chuyến đi về nhà</p>
        </div>
      </div>

      <div className="souvenir-addons-list">
        {available.map((souvenir) => {
          const quantity = Math.min(Math.max(0, selections[souvenir.id] || 0), souvenir.stock)
          return (
            <div className="souvenir-addon-item" key={souvenir.id}>
              <img className="souvenir-addon-image" src={souvenir.image} alt={souvenir.name} />
              <div className="souvenir-addon-info">
                <p className="souvenir-addon-name">{souvenir.name}</p>
                <p className="souvenir-addon-meta">
                  {souvenir.category} · {formatBasePriceToVndCurrency(souvenir.currentPrice)}
                </p>
                <p className="souvenir-addon-stock">Còn {souvenir.stock}</p>
              </div>
              <div className="souvenir-addon-counter">
                <button
                  type="button"
                  className="souvenir-addon-btn"
                  aria-label={`Giảm ${souvenir.name}`}
                  disabled={quantity <= 0}
                  onClick={() => onChange(souvenir.id, quantity - 1)}
                >
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <span className="souvenir-addon-qty">{quantity}</span>
                <button
                  type="button"
                  className="souvenir-addon-btn"
                  aria-label={`Tăng ${souvenir.name}`}
                  disabled={quantity >= souvenir.stock}
                  onClick={() => onChange(souvenir.id, quantity + 1)}
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SouvenirAddOns
