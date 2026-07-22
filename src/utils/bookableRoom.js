import mockStays from '../data/mockStays'

// Dữ liệu mock chỉ dùng để "làm giàu" thêm cho trang chi tiết (chủ đề, tiện ích,
// đánh giá, vị trí...) đối với các phòng có sẵn từ đầu. Phòng do admin thêm mới
// sẽ không có trong map này và dùng giá trị mặc định.
const mockStayById = new Map(mockStays.map((stay) => [stay.id, stay]))

// Chuyển một "room" lấy từ REST API (name, description, image, originalPrice,
// currentPrice) thành object dạng "stay" mà luồng đặt phòng đang sử dụng.
// Giá mỗi đêm = currentPrice.
export function toBookableStay(room) {
  if (!room) {
    return null
  }

  const enrich = mockStayById.get(room.id) || {}
  const location =
    room.location || [enrich.city, enrich.country].filter(Boolean).join(', ')

  return {
    id: room.id,
    name: room.name,
    description: room.description,
    image: room.image,
    location,
    originalPrice: room.originalPrice,
    currentPrice: room.currentPrice,
    pricePerNight: room.currentPrice,
    taxesAndFees: enrich.taxesAndFees ?? 0,
    city: enrich.city || '',
    country: enrich.country || '',
    theme: enrich.theme || 'city',
    propertyType: enrich.propertyType || 'Phòng',
    reviewScore: enrich.reviewScore ?? 9,
    reviewLabel: enrich.reviewLabel || 'Rất tốt',
    reviewsCount: enrich.reviewsCount ?? 0,
    distanceToCenter: enrich.distanceToCenter ?? 0,
    perks: enrich.perks || [],
    amenities: enrich.amenities || [],
  }
}
