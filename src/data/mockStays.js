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

  // ── Hội An ──────────────────────────────────────────────────────
  {
    id: 'hoi-an-lantern-boutique',
    name: 'Lantern Boutique Hội An',
    city: 'Hội An',
    country: 'Vietnam',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80',
    theme: 'city',
    propertyType: 'Khách Sạn',
    reviewScore: 9.3,
    reviewLabel: 'Xuất Chúng',
    reviewsCount: 1045,
    pricePerNight: 55,
    taxesAndFees: 8,
    distanceToCenter: 0.4,
    perks: ['Hủy miễn phí', 'Bao gồm bữa sáng', 'Xe đạp miễn phí'],
    amenities: ['Hồ bơi', 'Nhà hàng', 'Cho thuê xe đạp', 'WiFi miễn phí'],
    description:
      'Boutique hotel phố cổ với kiến trúc truyền thống Hội An, hồ bơi sân trong và vị trí đi bộ đến phố đèn lồng.',
  },
  {
    id: 'hoi-an-river-villa',
    name: 'Thu Bồn River Villa',
    city: 'Hội An',
    country: 'Vietnam',
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    theme: 'nature',
    propertyType: 'Biệt Thự',
    reviewScore: 9.5,
    reviewLabel: 'Xuất Chúng',
    reviewsCount: 412,
    pricePerNight: 98,
    taxesAndFees: 14,
    distanceToCenter: 2.2,
    perks: ['Hủy miễn phí', 'Hồ bơi riêng', 'Bữa sáng miễn phí'],
    amenities: ['Hồ bơi riêng', 'Vườn', 'Bếp', 'Kayak', 'WiFi miễn phí'],
    description:
      'Biệt thự bờ sông Thu Bồn yên tĩnh với hồ bơi riêng, vườn rau hữu cơ và tầm nhìn ra cánh đồng lúa.',
  },

  // ── Huế ─────────────────────────────────────────────────────────
  {
    id: 'hue-imperial-citadel-hotel',
    name: 'Imperial Citadel Hotel Huế',
    city: 'Huế',
    country: 'Vietnam',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    theme: 'city',
    propertyType: 'Khách Sạn',
    reviewScore: 8.7,
    reviewLabel: 'Tuyệt Vời',
    reviewsCount: 783,
    pricePerNight: 44,
    taxesAndFees: 7,
    distanceToCenter: 0.6,
    perks: ['Hủy miễn phí', 'Bao gồm bữa sáng', 'Gần Đại Nội'],
    amenities: ['Nhà hàng', 'Spa', 'Xe đạp miễn phí', 'WiFi miễn phí'],
    description:
      'Khách sạn boutique gần Đại Nội Huế, phục vụ ẩm thực cung đình và tour thành phố định kỳ hàng ngày.',
  },

  // ── Vũng Tàu ────────────────────────────────────────────────────
  {
    id: 'vung-tau-oceanview-resort',
    name: 'Oceanview Resort Vũng Tàu',
    city: 'Vũng Tàu',
    country: 'Vietnam',
    image:
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
    theme: 'sea',
    propertyType: 'Khu Nghỉ Dưỡng',
    reviewScore: 8.5,
    reviewLabel: 'Tuyệt Vời',
    reviewsCount: 921,
    pricePerNight: 62,
    taxesAndFees: 9,
    distanceToCenter: 1.8,
    perks: ['Tầm nhìn biển', 'Hủy miễn phí', 'Hồ bơi vô cực'],
    amenities: ['Hồ bơi', 'Bãi biển riêng', 'Nhà hàng', 'Bar', 'WiFi miễn phí'],
    description:
      'Khu nghỉ dưỡng ven biển Vũng Tàu với hồ bơi vô cực nhìn ra Biển Đông, lý tưởng cho cuối tuần từ TP.HCM.',
  },

  // ── Bangkok ──────────────────────────────────────────────────────
  {
    id: 'bangkok-silom-skyview',
    name: 'Silom SkyView Hotel',
    city: 'Bangkok',
    country: 'Thailand',
    image:
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
    theme: 'city',
    propertyType: 'Khách Sạn',
    reviewScore: 9.0,
    reviewLabel: 'Tuyệt Hảo',
    reviewsCount: 1388,
    pricePerNight: 95,
    taxesAndFees: 14,
    distanceToCenter: 0.7,
    perks: ['Hủy miễn phí', 'Bao gồm bữa sáng', 'Hồ bơi sân thượng'],
    amenities: ['Hồ bơi sân thượng', 'Phòng gym', 'Nhà hàng', 'Bar', 'WiFi miễn phí'],
    description:
      'Khách sạn cao tầng trung tâm Bangkok với hồ bơi skypool, tầm nhìn toàn cảnh thành phố và tiếp cận BTS thuận tiện.',
  },
  {
    id: 'bangkok-riverside-suites',
    name: 'Chao Phraya Riverside Suites',
    city: 'Bangkok',
    country: 'Thailand',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    theme: 'sun',
    propertyType: 'Khu Nghỉ Dưỡng',
    reviewScore: 9.4,
    reviewLabel: 'Xuất Chúng',
    reviewsCount: 1892,
    pricePerNight: 142,
    taxesAndFees: 20,
    distanceToCenter: 1.5,
    perks: ['Tầm nhìn sông', 'Dịch vụ thuyền riêng', 'Bữa sáng miễn phí'],
    amenities: ['Ven sông', 'Hồ bơi', 'Spa', 'Nhà hàng', 'Dịch vụ thuyền'],
    description:
      'Khu nghỉ dưỡng sang trọng bên sông Chao Phraya với dịch vụ thuyền riêng đến Grand Palace và Wat Pho.',
  },

  // ── Singapore ────────────────────────────────────────────────────
  {
    id: 'singapore-marina-bay-suites',
    name: 'Marina Bay Garden Suites',
    city: 'Singapore',
    country: 'Singapore',
    image:
      'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=1200&q=80',
    theme: 'city',
    propertyType: 'Căn Hộ',
    reviewScore: 9.5,
    reviewLabel: 'Xuất Chúng',
    reviewsCount: 2104,
    pricePerNight: 198,
    taxesAndFees: 28,
    distanceToCenter: 0.5,
    perks: ['Tầm nhìn Gardens by the Bay', 'Hủy miễn phí', 'Bếp đầy đủ'],
    amenities: ['Hồ bơi', 'Phòng gym', 'Bếp', 'Máy giặt', 'WiFi miễn phí'],
    description:
      'Căn hộ cao cấp nhìn ra Marina Bay Sands và Gardens by the Bay, đi bộ đến MRT Bayfront.',
  },

  // ── Bali ────────────────────────────────────────────────────────
  {
    id: 'bali-ubud-jungle-villa',
    name: 'Ubud Jungle Villa',
    city: 'Ubud',
    country: 'Indonesia',
    image:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    theme: 'nature',
    propertyType: 'Biệt Thự',
    reviewScore: 9.6,
    reviewLabel: 'Xuất Chúng',
    reviewsCount: 876,
    pricePerNight: 125,
    taxesAndFees: 18,
    distanceToCenter: 2.5,
    perks: ['Hồ bơi riêng', 'Bữa sáng miễn phí', 'Hủy miễn phí'],
    amenities: ['Hồ bơi riêng', 'Vườn', 'Spa', 'Yoga', 'WiFi miễn phí'],
    description:
      'Biệt thự giữa rừng Ubud với hồ bơi vô cực nhìn ra thung lũng, lớp yoga sáng sớm và spa trị liệu Ayurvedic.',
  },
  {
    id: 'bali-seminyak-beach-club',
    name: 'Seminyak Beach Club Resort',
    city: 'Seminyak',
    country: 'Indonesia',
    image:
      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1200&q=80',
    theme: 'sun',
    propertyType: 'Khu Nghỉ Dưỡng',
    reviewScore: 9.1,
    reviewLabel: 'Tuyệt Hảo',
    reviewsCount: 1340,
    pricePerNight: 110,
    taxesAndFees: 16,
    distanceToCenter: 0.8,
    perks: ['Bãi biển riêng', 'Bữa sáng miễn phí', 'Beach club access'],
    amenities: ['Bãi biển riêng', 'Hồ bơi', 'Bar', 'Nhà hàng', 'Spa'],
    description:
      'Khu nghỉ dưỡng mặt biển Seminyak với beach club nổi tiếng, bar hoàng hôn và lớp yoga trên bờ biển.',
  },

  // ── Seoul ────────────────────────────────────────────────────────
  {
    id: 'seoul-gangnam-tower',
    name: 'Gangnam Tower Hotel',
    city: 'Seoul',
    country: 'South Korea',
    image:
      'https://images.unsplash.com/photo-1562790351-d273a961e0e9?auto=format&fit=crop&w=1200&q=80',
    theme: 'city',
    propertyType: 'Khách Sạn',
    reviewScore: 9.1,
    reviewLabel: 'Tuyệt Hảo',
    reviewsCount: 1532,
    pricePerNight: 128,
    taxesAndFees: 18,
    distanceToCenter: 0.6,
    perks: ['Hủy miễn phí', 'Bao gồm bữa sáng', 'Tầm nhìn N Seoul Tower'],
    amenities: ['Spa', 'Phòng gym', 'Nhà hàng', 'Quầy bar', 'WiFi miễn phí'],
    description:
      'Khách sạn hiện đại trung tâm Gangnam với dịch vụ đẳng cấp, spa cao cấp và tiếp cận dễ dàng tàu điện ngầm Seoul.',
  },

  // ── Sydney ───────────────────────────────────────────────────────
  {
    id: 'sydney-harbor-views',
    name: 'Circular Quay Harbor Views',
    city: 'Sydney',
    country: 'Australia',
    image:
      'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80',
    theme: 'sea',
    propertyType: 'Căn Hộ',
    reviewScore: 9.3,
    reviewLabel: 'Xuất Chúng',
    reviewsCount: 945,
    pricePerNight: 188,
    taxesAndFees: 26,
    distanceToCenter: 0.4,
    perks: ['Tầm nhìn Opera House', 'Hủy miễn phí', 'Bếp đầy đủ'],
    amenities: ['Hồ bơi', 'Phòng gym', 'Bếp', 'Bãi đỗ xe', 'WiFi miễn phí'],
    description:
      'Căn hộ cao cấp nhìn thẳng ra Opera House và Cầu Cảng Sydney, đi bộ đến các điểm du lịch chính.',
  },

  // ── Rome ─────────────────────────────────────────────────────────
  {
    id: 'rome-colosseum-boutique',
    name: 'Colosseum View Boutique',
    city: 'Rome',
    country: 'Italy',
    image:
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    theme: 'city',
    propertyType: 'Khách Sạn',
    reviewScore: 9.0,
    reviewLabel: 'Tuyệt Hảo',
    reviewsCount: 1124,
    pricePerNight: 136,
    taxesAndFees: 19,
    distanceToCenter: 0.8,
    perks: ['Tầm nhìn Colosseum', 'Hủy miễn phí', 'Bao gồm bữa sáng kiểu Ý'],
    amenities: ['Nhà hàng', 'Bar trên sân thượng', 'Sảnh nghệ thuật', 'WiFi miễn phí'],
    description:
      'Boutique hotel Roman với ban công nhìn trực tiếp vào Đấu Trường La Mã, phục vụ bữa sáng kiểu Ý và tour riêng.',
  },

  // ── Amsterdam ────────────────────────────────────────────────────
  {
    id: 'amsterdam-canal-suites',
    name: 'Prinsengracht Canal Suites',
    city: 'Amsterdam',
    country: 'Netherlands',
    image:
      'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1200&q=80',
    theme: 'city',
    propertyType: 'Căn Hộ',
    reviewScore: 9.2,
    reviewLabel: 'Tuyệt Vời',
    reviewsCount: 788,
    pricePerNight: 152,
    taxesAndFees: 21,
    distanceToCenter: 0.5,
    perks: ['Tầm nhìn kênh đào', 'Xe đạp miễn phí', 'Hủy miễn phí'],
    amenities: ['Xe đạp', 'Bếp', 'WiFi miễn phí', 'Máy giặt'],
    description:
      'Căn hộ trong ngôi nhà lịch sử bên kênh đào Prinsengracht, với xe đạp miễn phí để khám phá Amsterdam.',
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
  {
    id: 'hoian',
    city: 'Hội An',
    tagline: 'Phố đèn lồng, ẩm thực nổi tiếng, kiến trúc cổ kính',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80',
    theme: 'city',
  },
  {
    id: 'bangkok',
    city: 'Bangkok',
    tagline: 'Chùa vàng, ẩm thực đường phố, cuộc sống về đêm sôi động',
    image:
      'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=1200&q=80',
    theme: 'city',
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
