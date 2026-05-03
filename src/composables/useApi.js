export async function apiFetch(path, options = {}) {
  const res = await fetch('/api' + path, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
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
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    if (!res.ok) throw new Error('Грешка при качване')
    return res.json()
  }
}
