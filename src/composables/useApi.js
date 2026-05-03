// Базов адрес на бекенда. В development е празен (Vite proxy се грижи за /api).
// В production се задава чрез .env файл: VITE_API_URL=https://your-api.onrender.com
const API_BASE = import.meta.env.VITE_API_URL || ''

export const apiBase = API_BASE

// За картинки - ако пътят е относителен (/uploads/xxx), допълни го с API_BASE
export function imageUrl(src) {
  if (!src) return ''
  if (/^https?:\/\//i.test(src)) return src
  if (src.startsWith('/uploads/')) return API_BASE + src
  return src
}

export async function apiFetch(path, options = {}) {
  const res = await fetch(API_BASE + '/api' + path, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    credentials: 'include',
    ...options,
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
  me: () => apiFetch('/me'),
  login: (username, password) => apiFetch('/login', { method: 'POST', body: { username, password } }),
  logout: () => apiFetch('/logout', { method: 'POST' }),
  changeCredentials: (data) => apiFetch('/change-credentials', { method: 'POST', body: data }),

  // Upload
  uploadImage: async (file) => {
    const fd = new FormData()
    fd.append('image', file)
    const res = await fetch(API_BASE + '/api/upload', {
      method: 'POST',
      credentials: 'include',
      body: fd
    })
    if (!res.ok) throw new Error('Грешка при качване')
    return res.json()
  }
}
