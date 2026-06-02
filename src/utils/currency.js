const BASE_TO_VND_RATE = 25000

export function convertBasePriceToVnd(value) {
  return Math.round(Number(value || 0) * BASE_TO_VND_RATE)
}

export function formatVnd(value) {
  return new Intl.NumberFormat('vi-VN').format(Math.round(Number(value || 0)))
}

export function formatVndCurrency(value) {
  return `${formatVnd(value)}₫`
}

export function formatBasePriceToVnd(value) {
  return formatVnd(convertBasePriceToVnd(value))
}

export function formatBasePriceToVndCurrency(value) {
  return `${formatBasePriceToVnd(value)}₫`
}

export { BASE_TO_VND_RATE }
