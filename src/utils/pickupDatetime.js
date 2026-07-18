function toLocalDatetimeValue(date) {
  const pad = (value) => String(value).padStart(2, '0')

  return [
    date.getFullYear(),
    '-',
    pad(date.getMonth() + 1),
    '-',
    pad(date.getDate()),
    'T',
    pad(date.getHours()),
    ':',
    pad(date.getMinutes()),
  ].join('')
}

export function getMinimumPickupDatetime() {
  return toLocalDatetimeValue(new Date())
}

export function getDefaultPickupDatetime() {
  const pickup = new Date(Date.now() + 60 * 60 * 1000)
  pickup.setMinutes(Math.ceil(pickup.getMinutes() / 15) * 15, 0, 0)
  return toLocalDatetimeValue(pickup)
}

export function ensureFuturePickupDatetime(value) {
  const timestamp = value ? new Date(value).getTime() : Number.NaN
  return Number.isFinite(timestamp) && timestamp > Date.now()
    ? value
    : getDefaultPickupDatetime()
}

export function addDaysToPickupDatetime(value, days) {
  const date = new Date(value)
  date.setDate(date.getDate() + days)
  return toLocalDatetimeValue(date)
}
