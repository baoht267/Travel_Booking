export function formatLocalDate(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function addDays(dateValue, days) {
  const date = dateValue ? new Date(`${dateValue}T12:00:00`) : new Date()
  date.setDate(date.getDate() + days)
  return formatLocalDate(date)
}

export function getTomorrowDate() {
  return addDays(formatLocalDate(), 1)
}

export function isFutureDate(value) {
  return Boolean(value) && value > formatLocalDate()
}
