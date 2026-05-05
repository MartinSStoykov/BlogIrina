const API_BASE = import.meta.env.VITE_API_URL || ''

export const apiBase = API_BASE

export function imageUrl(src) {
  if (!src) return ''
  if (/^https?:\/\//i.test(src)) return src
  if (src.startsWith('/uploads/')) return API_BASE + src
  return src
}

// ── JWT Token helpers ──
function getToken() {
  return localStorage.getItem('auth_token')
}
function setToken(token) {
  localStorage.setItem('auth_token', token)
}
function removeToken() {
  localStorage.removeItem('auth_token')
}

export async function apiFetch(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(API_BASE + '/api' + path, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Грешка' }))
    throw new Error(err.error || 'Грешка')
  }
  return res.json()
}

export const api = {
  // Posts
  getPosts: (category) => apiFetch('/posts' + (category ? `?category=${encodeURIComponent(category)}` : '')),
  getPost: (id) => apiFetch(`/posts/${id}`),
  createPost: (data) => apiFetch('/posts', { method: 'POST', body: data }),
  updatePost: (id, data) => apiFetch(`/posts/${id}`, { method: 'PUT', body: data }),
  deletePost: (id) => apiFetch(`/posts/${id}`, { method: 'DELETE' }),

  // Categories
  getCategories: () => apiFetch('/categories'),
  createCategory: (name) => apiFetch('/categories', { method: 'POST', body: { name } }),
  deleteCategory: (name) => apiFetch(`/categories/${encodeURIComponent(name)}`, { method: 'DELETE' }),

  // Settings
  getSettings: () => apiFetch('/settings'),
  updateSettings: (data) => apiFetch('/settings', { method: 'PUT', body: data }),

  // Auth
  me: async () => {
    const token = getToken()
    if (!token) return { loggedIn: false }
    try {
      const data = await apiFetch('/me')
      return data
    } catch {
      removeToken()
      return { loggedIn: false }
    }
  },
  login: async (username, password) => {
    const data = await apiFetch('/login', { method: 'POST', body: { username, password } })
    if (data.token) setToken(data.token)
    return data
  },
  logout: () => {
    removeToken()
    return Promise.resolve({ ok: true })
  },
  changeCredentials: (data) => apiFetch('/change-credentials', { method: 'POST', body: data }),

  // Upload
  uploadImage: async (file) => {
    const token = getToken()
    const fd = new FormData()
    fd.append('image', file)
    const res = await fetch(API_BASE + '/api/upload', {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: fd
    })
    if (!res.ok) throw new Error('Грешка при качване')
    return res.json()
  }
}
