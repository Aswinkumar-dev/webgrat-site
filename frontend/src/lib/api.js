import { supabase } from './supabase'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:8080'

/**
 * Pulls the current Supabase access token (JWT) so we can attach it to
 * every request as `Authorization: Bearer <token>`. The Spring Boot
 * SupabaseJwtFilter validates it on the server.
 */
async function getAuthToken() {
  const { data } = await supabase.auth.getSession()
  return data?.session?.access_token ?? null
}

async function request(path, { method = 'GET', body, headers = {}, isForm = false } = {}) {
  const token = await getAuthToken()

  const finalHeaders = {
    ...(isForm ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  })

  const text = await res.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      (typeof data === 'string' && data) ||
      `Request failed with status ${res.status}`
    const error = new Error(message)
    error.status = res.status
    error.data = data
    throw error
  }

  return data
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  del: (path, body) => request(path, { method: 'DELETE', body }),
  upload: (path, formData) =>
    request(path, { method: 'POST', body: formData, isForm: true }),
}

export const endpoints = {
  me: () => api.get('/api/auth/me'),

  uploadThumbnail: (file) => {
    const fd = new FormData()
    fd.append('file', file)
    return api.upload('/api/upload/thumbnail', fd)
  },
  deleteThumbnail: (publicUrl) => api.del('/api/upload/thumbnail', { publicUrl }),

  listTags: () => api.get('/api/tags'),
  createTag: (payload) => api.post('/api/tags', payload),

  listCategories: () => api.get('/api/categories'),
  createCategory: (payload) => api.post('/api/categories', payload),

  listPublishedBlogs: () => api.get('/api/blogs/published'),
  getBlogBySlug: (slug) => api.get(`/api/blogs/slug/${encodeURIComponent(slug)}`),
  getBlogsByTag: (tagId) => api.get(`/api/blogs/tag/${tagId}`),
  getBlogsByCategory: (categoryId) => api.get(`/api/blogs/category/${categoryId}`),

  createBlog: (payload) => api.post('/api/blogs', payload),

  // ── Admin-only blog endpoints ─────────────────────────
  // These hit protected routes on the backend and require a valid Supabase
  // JWT (attached automatically via getAuthToken).
  listAllBlogs: () => api.get('/api/blogs'),
  getBlogForEdit: (id) => api.get(`/api/blogs/${id}/edit`),
  updateBlog: (id, payload) => api.put(`/api/blogs/${id}`, payload),
  deleteBlog: (id) => api.del(`/api/blogs/${id}`),

  submitContact: (payload) => api.post('/api/contact', payload),
  submitDigitalGrowthContact: (payload) => api.post('/api/digital-growth-contact', payload),
  subscribeNewsletter: (email) => api.post('/api/subscribe', { email }),
}
