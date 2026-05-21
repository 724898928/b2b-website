import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000 // 5秒超时
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    // 静默处理网络错误，避免阻塞页面显示
    if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
      console.warn('API request timeout or network error, using fallback data')
      // 返回一个空的成功响应，让前端可以使用默认数据
      return Promise.resolve({ data: { success: true, data: [] } })
    }
    
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('admin_token')
      window.location.href = '/admin'
    }
    return Promise.reject(error)
  }
)

export default apiClient
