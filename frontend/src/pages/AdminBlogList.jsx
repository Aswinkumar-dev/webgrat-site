import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SEOHead from '../seo/SEOHead'
import { endpoints } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import styles from './AdminBlogList.module.css'

const formatDate = (iso) => {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return '—'
  }
}

export default function AdminBlogList() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const loadPosts = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await endpoints.listAllBlogs()
      // Newest first — by published date if set, otherwise creation date.
      const sorted = (Array.isArray(data) ? data : []).slice().sort((a, b) => {
        const aDate = new Date(a.publishedAt || a.createdAt || 0).getTime()
        const bDate = new Date(b.publishedAt || b.createdAt || 0).getTime()
        return bDate - aDate
      })
      setPosts(sorted)
    } catch (err) {
      setError(err?.message || 'Failed to load posts.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return posts
    return posts.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q)
    )
  }, [posts, query])

  const handleDelete = async (post) => {
    const confirmed = window.confirm(
      `Delete “${post.title}”? This cannot be undone.`
    )
    if (!confirmed) return

    setDeletingId(post.id)
    try {
      await endpoints.deleteBlog(post.id)
      setPosts((prev) => prev.filter((p) => p.id !== post.id))
    } catch (err) {
      alert(err?.message || 'Failed to delete post.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <>
      <SEOHead
        title="Manage Blog Posts — Webgrat Admin"
        description="Webgrat admin dashboard for managing blog posts."
        canonical="https://webgrat.com/admin/blogs"
        noindex
      />

      <section className={styles.page}>
        <div className="container">
          <div className={styles.topBar}>
            <div>
              <span className={styles.eyebrow}>Webgrat Admin</span>
              <h1 className={styles.title}>Blog posts</h1>
              <p className={styles.subtitle}>
                Manage every post on the site — edit content, swap covers, or remove
                articles.
              </p>
            </div>
            <div className={styles.userMenu}>
              <Link to="/admin/blog/new" className={styles.primaryBtn}>
                + New post
              </Link>
              {user?.email && <span className={styles.userEmail}>{user.email}</span>}
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={handleSignOut}
              >
                Sign out
              </button>
            </div>
          </div>

          <div className={styles.toolbar}>
            <div className={styles.searchWrap}>
              <input
                type="search"
                className={styles.searchInput}
                placeholder="Search by title, slug, or excerpt…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className={styles.countPill}>
              {loading
                ? 'Loading…'
                : `${filteredPosts.length} of ${posts.length} post${posts.length === 1 ? '' : 's'}`}
            </div>
          </div>

          {error && <div className={styles.alertError}>{error}</div>}

          <div className={styles.tableCard}>
            {loading ? (
              <div className={styles.empty}>Loading posts…</div>
            ) : filteredPosts.length === 0 ? (
              <div className={styles.empty}>
                {posts.length === 0
                  ? 'No posts yet. Create your first one!'
                  : 'No posts match your search.'}
              </div>
            ) : (
              <div className={styles.tableScroll}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Post</th>
                      <th>Status</th>
                      <th>Category</th>
                      <th>Published</th>
                      <th aria-label="Actions"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPosts.map((post) => {
                      const isPublished = !!post.publishedAt
                      return (
                        <tr key={post.id}>
                          <td>
                            <div className={styles.postCell}>
                              {post.coverImageUrl ? (
                                <img
                                  src={post.coverImageUrl}
                                  alt=""
                                  className={styles.thumb}
                                />
                              ) : (
                                <div className={`${styles.thumb} ${styles.thumbPlaceholder}`}>
                                  <span>No image</span>
                                </div>
                              )}
                              <div className={styles.postMeta}>
                                <div className={styles.postTitle}>{post.title}</div>
                                <div className={styles.postSlug}>/blog/{post.slug}</div>
                                {post.excerpt && (
                                  <div className={styles.postExcerpt}>{post.excerpt}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span
                              className={`${styles.statusPill} ${
                                isPublished ? styles.statusPublished : styles.statusDraft
                              }`}
                            >
                              {isPublished ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className={styles.muted}>
                            {post.category?.name || '—'}
                          </td>
                          <td className={styles.muted}>
                            {formatDate(post.publishedAt || post.createdAt)}
                          </td>
                          <td>
                            <div className={styles.rowActions}>
                              {isPublished && (
                                <Link
                                  to={`/blog/${post.slug}`}
                                  className={styles.actionLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View
                                </Link>
                              )}
                              <Link
                                to={`/admin/blog/edit/${post.id}`}
                                className={styles.editBtn}
                              >
                                Edit
                              </Link>
                              <button
                                type="button"
                                className={styles.deleteBtn}
                                onClick={() => handleDelete(post)}
                                disabled={deletingId === post.id}
                              >
                                {deletingId === post.id ? 'Deleting…' : 'Delete'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
