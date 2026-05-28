const mockExperiences = [
  {
    id: 'paris-eiffel-summit-cruise',
    name: 'Eiffel Tower Summit Access & Seine River Cruise',
    city: 'Paris',
    country: 'France',
    area: 'Paris City Centre',
    propertyType: 'Boat Cruises',
    reviewScore: 9.2,
    reviewLabel: 'Excellent',
    reviewsCount: 1245,
    pricePerNight: 74.5,
    duration: '4 hours',
    tagLabel: 'Free Cancellation',
    tagTone: 'success',
    description:
      'Skip the long lines and head straight to the summit of the Eiffel Tower before relaxing on a panoramic cruise along the Seine.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBNNKW1GajtsSdbBGrhX7-xONw4Rdf2GnQxQc1uTMNhZq7eVIUx9JyojfDNDGuGca2a-hIzD2MH2Q7vSqdOHWvxzxDuZVgjetmOvVqtq6UiFdfN41MEpkLwfrPM1ksFTId_c7P6AoWANyzhgCuPy0zBIXB3tDlEg_wecYIt02E3WRoGxpMSpC-smrlrlmzG__cEN8daCAzli5KQg1HqthAM0JpKsSEvia0wCnvUDjs6S5QcVwrx5j1S-_XN7g7vfzLpfjQLjrCsZOsZ',
  },
  {
    id: 'paris-louvre-masterpieces-tour',
    name: 'Louvre Museum: Masterpieces Guided Walking Tour',
    city: 'Paris',
    country: 'France',
    area: '1st Arrondissement',
    propertyType: 'Museum Entries',
    reviewScore: 9.6,
    reviewLabel: 'Superb',
    reviewsCount: 3892,
    pricePerNight: 52,
    duration: '3 hours',
    tagLabel: 'Mobile Voucher Accepted',
    tagTone: 'success',
    description:
      "Discover the world's most famous museum with an expert guide. See the Mona Lisa, Venus de Milo, and Winged Victory without getting overwhelmed.",
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDgzEThb0an_GOLvy_DyZe1J_lqK1BZ2w5iZwijf8AAAlAFRWS1ngy9lfkO2eG8ogtbSFaFeCWiaipwjWySLapRG5Yq3ii4ybSFVbfB12Z9D7BSaPbuYKuIs_NQp6XRJ8q98V8O1J8gTZazTy5iZGUxk1-2jqQ2Mpw3uf-HzQ5V-X8ts0vtcctrM9PbVDy9ixUkr3XR1VeT34dB_yfLeD0oW7UjWt2dUJQS8VZCx1BexHUYIG0OB_OvBD2c4lVhhlKPtR-qmUnzd9nh',
  },
  {
    id: 'paris-montmartre-food-tour',
    name: 'Montmartre Cheese, Wine & Pastry Walking Tour',
    city: 'Paris',
    country: 'France',
    area: 'Montmartre District',
    propertyType: 'Walking Tours',
    reviewScore: 8.9,
    reviewLabel: 'Very Good',
    reviewsCount: 856,
    pricePerNight: 98,
    duration: '3.5 hours',
    tagLabel: 'Likely to sell out',
    tagTone: 'warning',
    description:
      'Eat like a local in the bohemian heart of Paris. Visit artisanal boulangeries, award-winning fromageries, and hidden wine cellars.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDt1-rsWqS6pY8d2jy86-seVnRoltF6dXwxYMCIGegXQ8gMNPYCJ0VTY8AMaYtO1vCYcnOg8A0C05QQBm52uwQXQgGZZq9xIAVyLy5HWYvJDFslrIrYoohq6iGiVhD82gBJRSH_bDlkbyaLvNEEVCnozK3nTw7Z4FVGXA4exwb-PIv2De-BG0uMCPxwDKCB-7wtl84ljs3BWu-uT8JsxewPHhSeNwzRazZ24sPHTlGJ0-09fCk9nB56oCwKkl4PcWx5k2_ZdGeNTQ95',
  },
  {
    id: 'paris-versailles-full-day',
    name: 'Versailles: Skip-the-Line Palace & Gardens Full Day',
    city: 'Versailles',
    country: 'France',
    area: 'Versailles City',
    propertyType: 'Museum Entries',
    reviewScore: 9.4,
    reviewLabel: 'Excellent',
    reviewsCount: 2104,
    pricePerNight: 82,
    duration: '8 hours',
    tagLabel: 'Instant Confirmation',
    tagTone: 'success',
    description:
      "Escape the city and immerse yourself in the opulence of the Sun King's palace. Explore the Hall of Mirrors and the vast manicured gardens.",
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD2V7nLpH-qIauAniUvDDr4yjpvKwMKcRLGSAvlbUS5lBm2ToLr0uGbHYtCsWo2cGS2mD5C-EFjzk-JsAJm87y4TNEuSaidfHvbDaKA-74NvNq-0qlfdtlRBiDTkXgNsUXgROfniOMgyj69bNNsxhozVA4IMgwN3WxP5RoJdfBQnQKOsOv2NWIPfw403CZCUcFNRB5y2MPp_xXVu5kJlFt0nwwROE0Q3tOQOCAyChURxQIg8kp_TkbTFYqsvSXRJM_ISCxhAB97Loxs',
  },
  {
    id: 'paris-seine-dinner-cruise',
    name: 'Evening Dinner Cruise on the Seine with Live Music',
    city: 'Paris',
    country: 'France',
    area: 'Port de la Bourdonnais',
    propertyType: 'Boat Cruises',
    reviewScore: 9.1,
    reviewLabel: 'Superb',
    reviewsCount: 1678,
    pricePerNight: 115,
    duration: '2.5 hours',
    tagLabel: 'Free Cancellation',
    tagTone: 'success',
    description:
      'Savor a 3-course gourmet meal as you drift past the illuminated landmarks of Paris. A romantic evening filled with live music and river views.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB3i7aAri6DLdQmI7aCTQQAn3uj5aAwFLWjqNam4YjLw6BNFnddijoWMEHHyYuP_oLF9dnrxhjZY6seGETDPitEQFoSiJKcxIzGRPB05aqN-OqCDR0rsox3FueemE6MEv8JDRx1viMSRQM5FqT5_K3WmWgxS33yZIxY_gzjb3bPV6sxQ_agedQODJA30Xhzh7Ta7YGznluFtpAFrdz-n7VSZINtx-9Jr8bIQBcinCbsXKJikiLUw_HTTR_0JtU6Hh7crPaEhZaEElrU',
  },
]

export default mockExperiences
