const mockExperiences = [
  {
    id: 'paris-eiffel-summit-cruise',
    name: 'Tham Quan Đỉnh Tháp Eiffel & Du Thuyền Sông Seine',
    city: 'Paris',
    country: 'France',
    area: 'Trung Tâm Paris',
    propertyType: 'Du Thuyền',
    reviewScore: 9.2,
    reviewLabel: 'Xuất Sắc',
    reviewsCount: 1245,
    pricePerNight: 74.5,
    duration: '4 giờ',
    tagLabel: 'Hủy Miễn Phí',
    tagTone: 'success',
    description:
      'Bỏ qua hàng dài và thẳng lên đỉnh Tháp Eiffel trước khi thư giãn trên chuyến du thuyền toàn cảnh dọc sông Seine.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBNNKW1GajtsSdbBGrhX7-xONw4Rdf2GnQxQc1uTMNhZq7eVIUx9JyojfDNDGuGca2a-hIzD2MH2Q7vSqdOHWvxzxDuZVgjetmOvVqtq6UiFdfN41MEpkLwfrPM1ksFTId_c7P6AoWANyzhgCuPy0zBIXB3tDlEg_wecYIt02E3WRoGxpMSpC-smrlrlmzG__cEN8daCAzli5KQg1HqthAM0JpKsSEvia0wCnvUDjs6S5QcVwrx5j1S-_XN7g7vfzLpfjQLjrCsZOsZ',
  },
  {
    id: 'paris-louvre-masterpieces-tour',
    name: 'Bảo Tàng Louvre: Tour Đi Bộ Ngắm Kiệt Tác Có Hướng Dẫn',
    city: 'Paris',
    country: 'France',
    area: 'Quận 1',
    propertyType: 'Vào Cửa Bảo Tàng',
    reviewScore: 9.6,
    reviewLabel: 'Tuyệt Hảo',
    reviewsCount: 3892,
    pricePerNight: 52,
    duration: '3 giờ',
    tagLabel: 'Chấp Nhận Phiếu Điện Tử',
    tagTone: 'success',
    description:
      'Khám phá bảo tàng nổi tiếng nhất thế giới cùng hướng dẫn viên chuyên nghiệp. Chiêm ngưỡng Mona Lisa, Nữ Thần Venus và Thắng Lợi Có Cánh mà không bị choáng ngợp.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDgzEThb0an_GOLvy_DyZe1J_lqK1BZ2w5iZwijf8AAAlAFRWS1ngy9lfkO2eG8ogtbSFaFeCWiaipwjWySLapRG5Yq3ii4ybSFVbfB12Z9D7BSaPbuYKuIs_NQp6XRJ8q98V8O1J8gTZazTy5iZGUxk1-2jqQ2Mpw3uf-HzQ5V-X8ts0vtcctrM9PbVDy9ixUkr3XR1VeT34dB_yfLeD0oW7UjWt2dUJQS8VZCx1BexHUYIG0OB_OvBD2c4lVhhlKPtR-qmUnzd9nh',
  },
  {
    id: 'paris-montmartre-food-tour',
    name: 'Tour Đi Bộ Phô Mai, Rượu Vang & Bánh Ngọt Montmartre',
    city: 'Paris',
    country: 'France',
    area: 'Khu Montmartre',
    propertyType: 'Tour Đi Bộ',
    reviewScore: 8.9,
    reviewLabel: 'Rất Tốt',
    reviewsCount: 856,
    pricePerNight: 98,
    duration: '3,5 giờ',
    tagLabel: 'Có Thể Hết Chỗ',
    tagTone: 'warning',
    description:
      'Ăn như người địa phương ở trung tâm bohemian của Paris. Ghé thăm các tiệm bánh thủ công, cửa hàng phô mai được giải thưởng và hầm rượu ẩn.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDt1-rsWqS6pY8d2jy86-seVnRoltF6dXwxYMCIGegXQ8gMNPYCJ0VTY8AMaYtO1vCYcnOg8A0C05QQBm52uwQXQgGZZq9xIAVyLy5HWYvJDFslrIrYoohq6iGiVhD82gBJRSH_bDlkbyaLvNEEVCnozK3nTw7Z4FVGXA4exwb-PIv2De-BG0uMCPxwDKCB-7wtl84ljs3BWu-uT8JsxewPHhSeNwzRazZ24sPHTlGJ0-09fCk9nB56oCwKkl4PcWx5k2_ZdGeNTQ95',
  },
  {
    id: 'paris-versailles-full-day',
    name: 'Versailles: Cung Điện & Vườn Hoa Cả Ngày Không Xếp Hàng',
    city: 'Versailles',
    country: 'France',
    area: 'Thành Phố Versailles',
    propertyType: 'Vào Cửa Bảo Tàng',
    reviewScore: 9.4,
    reviewLabel: 'Xuất Sắc',
    reviewsCount: 2104,
    pricePerNight: 82,
    duration: '8 giờ',
    tagLabel: 'Xác Nhận Ngay',
    tagTone: 'success',
    description:
      'Rời khỏi thành phố và đắm mình trong sự xa hoa của cung điện Vua Mặt Trời. Khám phá Phòng Gương và những khu vườn rộng lớn được chăm sóc kỹ lưỡng.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD2V7nLpH-qIauAniUvDDr4yjpvKwMKcRLGSAvlbUS5lBm2ToLr0uGbHYtCsWo2cGS2mD5C-EFjzk-JsAJm87y4TNEuSaidfHvbDaKA-74NvNq-0qlfdtlRBiDTkXgNsUXgROfniOMgyj69bNNsxhozVA4IMgwN3WxP5RoJdfBQnQKOsOv2NWIPfw403CZCUcFNRB5y2MPp_xXVu5kJlFt0nwwROE0Q3tOQOCAyChURxQIg8kp_TkbTFYqsvSXRJM_ISCxhAB97Loxs',
  },
  {
    id: 'paris-seine-dinner-cruise',
    name: 'Du Thuyền Bữa Tối Buổi Tối Trên Sông Seine Với Nhạc Sống',
    city: 'Paris',
    country: 'France',
    area: 'Port de la Bourdonnais',
    propertyType: 'Du Thuyền',
    reviewScore: 9.1,
    reviewLabel: 'Tuyệt Hảo',
    reviewsCount: 1678,
    pricePerNight: 115,
    duration: '2,5 giờ',
    tagLabel: 'Hủy Miễn Phí',
    tagTone: 'success',
    description:
      'Thưởng thức bữa ăn 3 món cao cấp khi trôi qua các điểm tham quan được chiếu sáng của Paris. Một buổi tối lãng mạn với nhạc sống và cảnh sông huyền ảo.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB3i7aAri6DLdQmI7aCTQQAn3uj5aAwFLWjqNam4YjLw6BNFnddijoWMEHHyYuP_oSiJKcxIzGRPB05aqN-OqCDR0rsox3FueemE6MEv8JDRx1viMSRQM5FqT5_K3WmWgxS33yZIxY_gzjb3bPV6sxQ_agedQODJA30Xhzh7Ta7YGznluFtpAFrdz-n7VSZINtx-9Jr8bIQBcinCbsXKJikiLUw_HTTR_0JtU6Hh7crPaEhZaEElrU',
  },
]

export default mockExperiences
