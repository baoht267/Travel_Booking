function normalizeText(value) {
  return value.trim().toLowerCase()
}

export function parseDestinationQuery(value) {
  const parts = value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length === 0) {
    return { country: '', city: '' }
  }

  if (parts.length === 1) {
    return { country: '', city: parts[0] }
  }

  return {
    country: parts[0],
    city: parts.slice(1).join(', '),
  }
}

export function formatDestinationLabel({ country, city }) {
  if (country && city) {
    return `${country}, ${city}`
  }

  return country || city || ''
}

export function matchesDestinationQuery(location, query) {
  const parts = query
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)

  const { country, city } = parseDestinationQuery(query)

  if (parts.length === 0) {
    return true
  }

  const locationCountry = normalizeText(location.country || '')
  const locationCity = normalizeText(location.city || '')
  const locationArea = normalizeText(location.area || '')
  const locationName = normalizeText(location.name || '')

  if (parts.length === 1) {
    const term = normalizeText(parts[0])

    return (
      locationCountry.includes(term) ||
      locationCity.includes(term) ||
      locationArea.includes(term) ||
      locationName.includes(term)
    )
  }

  const matchesCountry = !country || locationCountry.includes(normalizeText(country))
  const matchesCity =
    !city ||
    locationCity.includes(normalizeText(city)) ||
    locationArea.includes(normalizeText(city)) ||
    locationName.includes(normalizeText(city))

  return matchesCountry && matchesCity
}
