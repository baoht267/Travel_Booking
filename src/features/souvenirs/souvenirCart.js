import { convertBasePriceToVnd } from '../../utils/currency'
import { updateSouvenir } from './souvenirsSlice'

// Từ danh sách souvenirs + số lượng chọn ({id: qty}), dựng ra các dòng đã chọn,
// tổng tiền (VNĐ) và một chuỗi tóm tắt để hiển thị trong đơn.
export function buildSouvenirSelection(souvenirs, selections) {
  const items = []
  let totalVnd = 0

  souvenirs.forEach((souvenir) => {
    const quantity = Math.min(Math.max(0, selections[souvenir.id] || 0), souvenir.stock)
    if (quantity > 0) {
      const lineVnd = convertBasePriceToVnd(souvenir.currentPrice) * quantity
      items.push({ id: souvenir.id, name: souvenir.name, quantity, lineVnd, souvenir })
      totalVnd += lineVnd
    }
  })

  const summaryText = items.map((item) => `${item.quantity}× ${item.name}`).join(', ')

  return { items, totalVnd, summaryText }
}

// Trừ tồn kho cho các sản phẩm đã chọn (gửi lại toàn bộ sản phẩm với stock mới).
export async function deductSouvenirStock(dispatch, items) {
  for (const item of items) {
    const souvenir = item.souvenir
    await dispatch(
      updateSouvenir({
        id: souvenir.id,
        souvenir: {
          name: souvenir.name,
          description: souvenir.description,
          image: souvenir.image,
          category: souvenir.category,
          origin: souvenir.origin,
          originalPrice: souvenir.originalPrice,
          currentPrice: souvenir.currentPrice,
          stock: souvenir.stock - item.quantity,
        },
      }),
    ).unwrap()
  }
}
