const API_BASE = import.meta.env.VITE_API_URL || ''

function getToken() {
  return localStorage.getItem('token')
}

function getHeaders(hasBody = false) {
  const headers = {}
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (hasBody && !(headers['Content-Type'])) headers['Content-Type'] = 'application/json'
  return headers
}

export async function api(endpoint, options = {}) {
  const { method = 'GET', body, formData, ...rest } = options
  const url = `${API_BASE}${endpoint}`
  const config = {
    ...rest,
    method,
    headers: getHeaders(!formData && (body !== undefined))
  }
  if (formData) {
    config.body = formData
    delete config.headers['Content-Type']
  } else if (body !== undefined) {
    config.body = JSON.stringify(body)
  }
  const res = await fetch(url, config)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || res.statusText || 'Request failed')
  }
  return data
}

export default api
