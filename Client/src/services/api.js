import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to inject the token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to format errors
apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'Request failed'
    return Promise.reject(new Error(message))
  }
)

export const apiGet = (path, config = {}) => {
  return apiClient.get(path, config)
}

export const apiPost = (path, data, config = {}) => {
  return apiClient.post(path, data, config)
}

export const apiPut = (path, data, config = {}) => {
  return apiClient.put(path, data, config)
}

export const apiPatch = (path, data, config = {}) => {
  return apiClient.patch(path, data, config)
}
