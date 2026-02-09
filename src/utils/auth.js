import api from './api'

// Demo users for display on login page (no backend needed for demo hint)
export const DEMO_USERS = [
  { email: 'farmer@test.com', password: 'farmer123', role: 'farmer' },
  { email: 'buyer@test.com', password: 'buyer123', role: 'buyer' }
]

export const initializeDemoUsers = () => {
  // No-op when using backend; kept for compatibility with Login page UI
}

export const getUsers = () => DEMO_USERS

export async function login(email, password) {
  const { user, token } = await api('/api/auth/login', {
    method: 'POST',
    body: { email: email.trim(), password }
  })
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
  return user
}

export async function register({ name, email, password, role }) {
  const { user, token } = await api('/api/auth/register', {
    method: 'POST',
    body: { name, email: email.trim(), password, role }
  })
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
  return user
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user'))
  } catch {
    return null
  }
}

export function isAuthenticated() {
  return !!localStorage.getItem('token')
}
