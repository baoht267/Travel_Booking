export const USERS_STORAGE_KEY = 'travel-booking-users'
export const SESSION_STORAGE_KEY = 'travel-booking-session'
export const SESSION_EVENT_NAME = 'travel-booking-session-change'
export const ADMIN_EMAIL = 'admin@gochip.vn'

const DEFAULT_ADMIN = {
  fullName: 'GOCHIP Admin',
  email: ADMIN_EMAIL,
  password: 'Admin@123',
  role: 'admin',
}

function normalizeUser(user) {
  const email = String(user?.email || '').trim().toLowerCase()
  return {
    ...user,
    email,
    role: email === ADMIN_EMAIL ? 'admin' : 'user',
  }
}

export function readUsers() {
  try {
    const rawUsers = localStorage.getItem(USERS_STORAGE_KEY)
    const storedUsers = rawUsers ? JSON.parse(rawUsers) : []
    const users = Array.isArray(storedUsers) ? storedUsers.map(normalizeUser) : []
    const hasAdmin = users.some((user) => user.email === ADMIN_EMAIL)
    return hasAdmin ? users : [DEFAULT_ADMIN, ...users]
  } catch {
    return [DEFAULT_ADMIN]
  }
}

export function writeUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users.map(normalizeUser)))
}

export function readSession() {
  try {
    const rawSession = localStorage.getItem(SESSION_STORAGE_KEY)
    return rawSession ? normalizeUser(JSON.parse(rawSession)) : null
  } catch {
    return null
  }
}

export function writeSession(session) {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(normalizeUser(session)))
  window.dispatchEvent(new Event(SESSION_EVENT_NAME))
}

export function clearSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY)
  window.dispatchEvent(new Event(SESSION_EVENT_NAME))
}
