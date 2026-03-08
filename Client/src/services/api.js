const API_BASE_URL = 'http://localhost:5000/api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {}
}

export const apiGet = async (path, options = {}) => {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  })
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}))
    throw new Error(errorBody.message || 'Request failed')
  }
  return res.json()
}

export const apiPost = async (path, body, options = {}) => {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}))
    throw new Error(errorBody.message || 'Request failed')
  }
  return res.json()
}

export const apiPatch = async (path, body, options = {}) => {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PATCH',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}))
    throw new Error(errorBody.message || 'Request failed')
  }
  return res.json()
}

