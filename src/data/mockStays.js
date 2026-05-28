const mockStays = [
  {
    id: 'da-nang-sea-view',
    name: 'Azure Coast Hotel Da Nang',
    city: 'Da Nang',
    country: 'Vietnam',
    image:
      'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=1200&q=80',
    theme: 'sea',
    propertyType: 'Hotel',
    reviewScore: 9.1,
    reviewLabel: 'Wonderful',
    reviewsCount: 1284,
    pricePerNight: 72,
    taxesAndFees: 11,
    distanceToCenter: 0.8,
    perks: ['Free cancellation', 'Breakfast included', 'Ocean view'],
    amenities: ['Pool', 'Spa', 'Airport shuttle', 'Family rooms', 'Free WiFi'],
    description:
      'Modern beachfront stay with a rooftop pool, quiet work corners, and fast access to My Khe beach.',
  },
  {
    id: 'hanoi-old-quarter-suites',
    name: 'Lantern Old Quarter Suites',
    city: 'Hanoi',
    country: 'Vietnam',
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    theme: 'city',
    propertyType: 'Apartment',
    reviewScore: 8.8,
    reviewLabel: 'Excellent',
    reviewsCount: 946,
    pricePerNight: 58,
    taxesAndFees: 9,
    distanceToCenter: 0.3,
    perks: ['Pay at property', 'Kitchenette', 'Central location'],
    amenities: ['Kitchen', 'Laundry', 'Free WiFi', '24-hour front desk'],
    description:
      'Apartment-style suites in the heart of the Old Quarter, built for longer city stays and food walks.',
  },
  {
    id: 'phu-quoc-palm-retreat',
    name: 'Palm Retreat Phu Quoc',
    city: 'Phu Quoc',
    country: 'Vietnam',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    theme: 'sun',
    propertyType: 'Resort',
    reviewScore: 9.4,
    reviewLabel: 'Exceptional',
    reviewsCount: 1721,
    pricePerNight: 118,
    taxesAndFees: 16,
    distanceToCenter: 3.1,
    perks: ['Private beach', 'Free breakfast', 'Airport pickup'],
    amenities: ['Beachfront', 'Pool', 'Bar', 'Free parking', 'Free WiFi'],
    description:
      'Low-rise tropical resort with sunset-facing villas, beach dining, and a calm family-friendly lagoon.',
  },
  {
    id: 'sapa-cloud-lodge',
    name: 'Cloudline Lodge Sapa',
    city: 'Sapa',
    country: 'Vietnam',
    image:
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
    theme: 'nature',
    propertyType: 'Villa',
    reviewScore: 9.0,
    reviewLabel: 'Superb',
    reviewsCount: 622,
    pricePerNight: 83,
    taxesAndFees: 12,
    distanceToCenter: 1.6,
    perks: ['Mountain view', 'Free cancellation', 'Breakfast included'],
    amenities: ['Restaurant', 'Garden', 'Heating', 'Free WiFi'],
    description:
      'Terraced mountain lodge with private balconies, misty sunrise views, and curated trekking support.',
  },
  {
    id: 'nha-trang-marina-bay',
    name: 'Marina Bay Nha Trang',
    city: 'Nha Trang',
    country: 'Vietnam',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    theme: 'sea',
    propertyType: 'Hotel',
    reviewScore: 8.6,
    reviewLabel: 'Fabulous',
    reviewsCount: 1308,
    pricePerNight: 67,
    taxesAndFees: 10,
    distanceToCenter: 1.2,
    perks: ['Ocean view', 'Late checkout', 'Free cancellation'],
    amenities: ['Pool', 'Gym', 'Restaurant', 'Free WiFi'],
    description:
      'Harbor-facing hotel with clean business facilities and easy access to the promenade.',
  },
  {
    id: 'ho-chi-minh-sky-residence',
    name: 'Sky Residence Saigon',
    city: 'Ho Chi Minh City',
    country: 'Vietnam',
    image:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    theme: 'city',
    propertyType: 'Apartment',
    reviewScore: 8.9,
    reviewLabel: 'Excellent',
    reviewsCount: 1142,
    pricePerNight: 76,
    taxesAndFees: 13,
    distanceToCenter: 0.9,
    perks: ['Kitchenette', 'Pay at property', 'Rooftop pool'],
    amenities: ['Pool', 'Gym', 'Kitchen', 'Washer', 'Free WiFi'],
    description:
      'High-rise serviced apartments designed for city breaks, hybrid work, and fast airport transfers.',
  },
]

export const cityHighlights = [
  {
    id: 'danang',
    city: 'Da Nang',
    tagline: 'Beach mornings, clean urban core, easy day trips',
    image:
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
    theme: 'sea',
  },
  {
    id: 'hanoi',
    city: 'Hanoi',
    tagline: 'Food alleys, heritage streets, late-night cafes',
    image:
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    theme: 'city',
  },
  {
    id: 'phuquoc',
    city: 'Phu Quoc',
    tagline: 'Island resorts, sunset bars, relaxed family stays',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    theme: 'sun',
  },
  {
    id: 'sapa',
    city: 'Sapa',
    tagline: 'Mountain air, local villages, panoramic valleys',
    image:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    theme: 'nature',
  },
]

export const propertyCategories = [
  {
    id: 'hotels',
    label: 'Hotels',
    copy: 'Reliable city stays and resort picks.',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'apartments',
    label: 'Apartments',
    copy: 'More space, kitchen access, better for groups.',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'resorts',
    label: 'Resorts',
    copy: 'Beachfront packages and family-first amenities.',
    image:
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'villas',
    label: 'Villas',
    copy: 'Private escapes for scenic, slower trips.',
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  },
]

export default mockStays
