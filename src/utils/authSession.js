export const USERS_STORAGE_KEY = 'travel-booking-users'
export const SESSION_STORAGE_KEY = 'travel-booking-session'
export const SESSION_EVENT_NAME = 'travel-booking-session-change'

export function readUsers() {
  try {
    const rawUsers = localStorage.getItem(USERS_STORAGE_KEY)
    return rawUsers ? JSON.parse(rawUsers) : []
  } catch {
    return []
  }
}

export function writeUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

export function readSession() {
  try {
    const rawSession = localStorage.getItem(SESSION_STORAGE_KEY)
    return rawSession ? JSON.parse(rawSession) : null
  } catch {
    return null
  }
}

export function writeSession(session) {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
  window.dispatchEvent(new Event(SESSION_EVENT_NAME))
}

export function clearSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY)
  window.dispatchEvent(new Event(SESSION_EVENT_NAME))
}
