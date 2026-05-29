const mockStays = [
  {
    id: 'da-nang-sea-view',
    name: 'Azure Coast Hotel Da Nang',
    city: 'Da Nang',
    country: 'Vietnam',
    image:
      'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=1200&q=80',
    theme: 'sea',
    propertyType: 'Khách Sạn',
    reviewScore: 9.1,
    reviewLabel: 'Tuyệt Vời',
    reviewsCount: 1284,
    pricePerNight: 72,
    taxesAndFees: 11,
    distanceToCenter: 0.8,
    perks: ['Hủy miễn phí', 'Bao gồm bữa sáng', 'Tầm nhìn ra biển'],
    amenities: ['Hồ bơi', 'Spa', 'Đưa đón sân bay', 'Phòng gia đình', 'WiFi miễn phí'],
    description:
      'Chỗ ở ven biển hiện đại với hồ bơi sân thượng, góc làm việc yên tĩnh và tiếp cận nhanh bãi biển Mỹ Khê.',
  },
  {
    id: 'hanoi-old-quarter-suites',
    name: 'Lantern Old Quarter Suites',
    city: 'Hanoi',
    country: 'Vietnam',
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    theme: 'city',
    propertyType: 'Căn Hộ',
    reviewScore: 8.8,
    reviewLabel: 'Xuất Sắc',
    reviewsCount: 946,
    pricePerNight: 58,
    taxesAndFees: 9,
    distanceToCenter: 0.3,
    perks: ['Thanh toán tại chỗ', 'Bếp nhỏ', 'Vị trí trung tâm'],
    amenities: ['Bếp', 'Giặt ủi', 'WiFi miễn phí', 'Lễ tân 24 giờ'],
    description:
      'Căn hộ dịch vụ ở trung tâm phố cổ, phù hợp cho kỳ lưu trú dài và khám phá ẩm thực.',
  },
  {
    id: 'phu-quoc-palm-retreat',
    name: 'Palm Retreat Phu Quoc',
    city: 'Phu Quoc',
    country: 'Vietnam',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    theme: 'sun',
    propertyType: 'Khu Nghỉ Dưỡng',
    reviewScore: 9.4,
    reviewLabel: 'Xuất Chúng',
    reviewsCount: 1721,
    pricePerNight: 118,
    taxesAndFees: 16,
    distanceToCenter: 3.1,
    perks: ['Bãi biển riêng', 'Bữa sáng miễn phí', 'Đón sân bay'],
    amenities: ['Ven biển', 'Hồ bơi', 'Bar', 'Đỗ xe miễn phí', 'WiFi miễn phí'],
    description:
      'Khu nghỉ dưỡng nhiệt đới thấp tầng với biệt thự hướng hoàng hôn, bữa ăn ven biển và đầm nước yên bình thân thiện gia đình.',
  },
  {
    id: 'sapa-cloud-lodge',
    name: 'Cloudline Lodge Sapa',
    city: 'Sapa',
    country: 'Vietnam',
    image:
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
    theme: 'nature',
    propertyType: 'Biệt Thự',
    reviewScore: 9.0,
    reviewLabel: 'Tuyệt Hảo',
    reviewsCount: 622,
    pricePerNight: 83,
    taxesAndFees: 12,
    distanceToCenter: 1.6,
    perks: ['Tầm nhìn núi', 'Hủy miễn phí', 'Bao gồm bữa sáng'],
    amenities: ['Nhà hàng', 'Vườn', 'Sưởi ấm', 'WiFi miễn phí'],
    description:
      'Nhà nghỉ núi bậc thang với ban công riêng, tầm nhìn bình minh trong sương mù và hỗ trợ trekking được tuyển chọn.',
  },
  {
    id: 'nha-trang-marina-bay',
    name: 'Marina Bay Nha Trang',
    city: 'Nha Trang',
    country: 'Vietnam',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    theme: 'sea',
    propertyType: 'Khách Sạn',
    reviewScore: 8.6,
    reviewLabel: 'Tuyệt Vời',
    reviewsCount: 1308,
    pricePerNight: 67,
    taxesAndFees: 10,
    distanceToCenter: 1.2,
    perks: ['Tầm nhìn ra biển', 'Trả phòng muộn', 'Hủy miễn phí'],
    amenities: ['Hồ bơi', 'Phòng gym', 'Nhà hàng', 'WiFi miễn phí'],
    description:
      'Khách sạn hướng cảng với tiện ích văn phòng sạch sẽ và tiếp cận dễ dàng tới đại lộ ven biển.',
  },
  {
    id: 'ho-chi-minh-sky-residence',
    name: 'Sky Residence Saigon',
    city: 'Ho Chi Minh City',
    country: 'Vietnam',
    image:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    theme: 'city',
    propertyType: 'Căn Hộ',
    reviewScore: 8.9,
    reviewLabel: 'Xuất Sắc',
    reviewsCount: 1142,
    pricePerNight: 76,
    taxesAndFees: 13,
    distanceToCenter: 0.9,
    perks: ['Bếp nhỏ', 'Thanh toán tại chỗ', 'Hồ bơi sân thượng'],
    amenities: ['Hồ bơi', 'Phòng gym', 'Bếp', 'Máy giặt', 'WiFi miễn phí'],
    description:
      'Căn hộ dịch vụ cao tầng được thiết kế cho kỳ nghỉ thành phố, làm việc kết hợp và đưa đón sân bay nhanh chóng.',
  },
  {
    id: 'tokyo-shibuya-sky-hotel',
    name: 'Shibuya Skyline Hotel',
    city: 'Tokyo',
    country: 'Japan',
    image:
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
    theme: 'city',
    propertyType: 'Khách Sạn',
    reviewScore: 9.2,
    reviewLabel: 'Tuyệt Vời',
    reviewsCount: 1548,
    pricePerNight: 142,
    taxesAndFees: 18,
    distanceToCenter: 0.5,
    perks: ['Hủy miễn phí', 'Bao gồm bữa sáng', 'Tầm nhìn thành phố'],
    amenities: ['WiFi miễn phí', 'Nhà hàng', 'Trung tâm thể dục', 'Lễ tân 24 giờ'],
    description:
      'Chỗ ở cao tầng trung tâm Tokyo với tiếp cận tàu điện trực tiếp, ăn đêm gần đó và phòng có tầm nhìn toàn cảnh.',
  },
  {
    id: 'paris-rive-gauche-suites',
    name: 'Rive Gauche Suites',
    city: 'Paris',
    country: 'France',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    theme: 'city',
    propertyType: 'Căn Hộ',
    reviewScore: 8.9,
    reviewLabel: 'Xuất Sắc',
    reviewsCount: 1106,
    pricePerNight: 149,
    taxesAndFees: 19,
    distanceToCenter: 0.7,
    perks: ['Bếp nhỏ', 'Thanh toán tại chỗ', 'Tiếp cận tàu điện ngầm'],
    amenities: ['Bếp', 'WiFi miễn phí', 'Giặt ủi', 'Đưa đón sân bay'],
    description:
      'Căn hộ yên tĩnh Tả Ngạn cho kỳ lưu trú dài, tham quan bảo tàng và kết nối tàu điện dễ dàng khắp Paris.',
  },
  {
    id: 'london-west-end-house',
    name: 'West End Townhouse',
    city: 'London',
    country: 'United Kingdom',
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    theme: 'city',
    propertyType: 'Căn Hộ',
    reviewScore: 8.7,
    reviewLabel: 'Tuyệt Vời',
    reviewsCount: 874,
    pricePerNight: 138,
    taxesAndFees: 17,
    distanceToCenter: 0.6,
    perks: ['Hủy miễn phí', 'Bếp nhỏ', 'Gần khu nhà hát'],
    amenities: ['Bếp', 'Sưởi ấm', 'WiFi miễn phí', 'Máy giặt'],
    description:
      'Căn hộ West End thông minh được thiết lập cho đêm xem kịch đi bộ, chuyến công tác và cuối tuần gia đình.',
  },
  {
    id: 'new-york-hudson-lofts',
    name: 'Hudson Loft Residences',
    city: 'New York',
    country: 'United States',
    image:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    theme: 'city',
    propertyType: 'Căn Hộ',
    reviewScore: 9.0,
    reviewLabel: 'Tuyệt Hảo',
    reviewsCount: 1322,
    pricePerNight: 145,
    taxesAndFees: 21,
    distanceToCenter: 1.1,
    perks: ['Phòng chờ sân thượng', 'Thanh toán tại chỗ', 'Phòng gym'],
    amenities: ['Phòng gym', 'WiFi miễn phí', 'Bếp', 'Bàn làm việc'],
    description:
      'Căn hộ kiểu Manhattan hiện đại với tiếp cận giao thông tốt, thiết lập làm việc linh hoạt và không gian chung hướng thành phố.',
  },
  {
    id: 'dubai-marina-palm-resort',
    name: 'Marina Palm Resort',
    city: 'Dubai',
    country: 'United Arab Emirates',
    image:
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    theme: 'sun',
    propertyType: 'Khu Nghỉ Dưỡng',
    reviewScore: 9.3,
    reviewLabel: 'Xuất Chúng',
    reviewsCount: 1675,
    pricePerNight: 148,
    taxesAndFees: 22,
    distanceToCenter: 2.4,
    perks: ['Bãi biển riêng', 'Bữa sáng miễn phí', 'Đưa đón sân bay'],
    amenities: ['Ven biển', 'Hồ bơi', 'Spa', 'WiFi miễn phí', 'Đỗ xe miễn phí'],
    description:
      'Khu nghỉ dưỡng Dubai ven biển được xây dựng cho kỳ nghỉ nắng nhiều, dịch vụ chỉn chu và tiếp cận nhanh khu marina.',
  },
]

export const cityHighlights = [
  {
    id: 'danang',
    city: 'Da Nang',
    tagline: 'Sáng biển, trung tâm đô thị sạch, dễ đi các điểm lân cận',
    image:
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
    theme: 'sea',
  },
  {
    id: 'hanoi',
    city: 'Hanoi',
    tagline: 'Ngõ hẻm ẩm thực, phố di sản, quán cà phê thâu đêm',
    image:
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    theme: 'city',
  },
  {
    id: 'phuquoc',
    city: 'Phu Quoc',
    tagline: 'Khu nghỉ dưỡng đảo, bar hoàng hôn, kỳ nghỉ gia đình thư giãn',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    theme: 'sun',
  },
  {
    id: 'sapa',
    city: 'Sapa',
    tagline: 'Không khí núi, làng bản địa, thung lũng toàn cảnh',
    image:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    theme: 'nature',
  },
]

export const propertyCategories = [
  {
    id: 'hotels',
    label: 'Khách Sạn',
    copy: 'Chỗ ở thành phố đáng tin cậy và khu nghỉ dưỡng nổi bật.',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'apartments',
    label: 'Căn Hộ',
    copy: 'Không gian rộng hơn, có bếp, phù hợp nhóm lớn.',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'resorts',
    label: 'Khu Nghỉ Dưỡng',
    copy: 'Gói ven biển và tiện nghi ưu tiên gia đình.',
    image:
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'villas',
    label: 'Biệt Thự',
    copy: 'Kỳ nghỉ riêng tư cho những chuyến đi cảnh quan thư thái.',
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  },
]

export default mockStays
