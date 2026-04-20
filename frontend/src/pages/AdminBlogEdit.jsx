import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import SEOHead from '../seo/SEOHead'
import { endpoints } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import AdminBlogForm from '../components/admin/AdminBlogForm'
import styles from './AdminBlogNew.module.css'

export default function AdminBlogEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const [initialPost, setInitialPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    if (!id) return
    let mounted = true

    setLoading(true)
    setLoadError('')

    endpoints
      .getBlogForEdit(id)
      .then((post) => {
        if (!mounted) return
        // Map the API shape (tags = [{id, name, ...}]) into the flat shape
        // the shared form expects (tagIds = [uuid]).
        setInitialPost({
          id: post.id,
          title: post.title || '',
          slug: post.slug || '',
          excerpt: post.excerpt || '',
          content: post.content || '',
          coverImageUrl: post.coverImageUrl || '',
          categoryId: post.category?.id || '',
          tagIds: Array.from(post.tags || []).map((t) => t.id),
          authorId: post.author?.id || null,
        })
      })
      .catch((err) => {
        if (mounted) {
          setLoadError(
            err?.status === 404
              ? 'This blog post no longer exists.'
              : err?.message || 'Failed to load post.'
          )
        }
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [id])

  const handleUpdate = async (payload) => {
    return endpoints.updateBlog(id, {
      ...payload,
      // Preserve the original author. If the post never had one, fall back
      // to the editor so the column isn't left null.
      authorId: initialPost?.authorId || user?.id,
    })
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <>
      <SEOHead
        title="Edit Blog Post — Webgrat Admin"
        description="Edit an existing blog post."
        canonical="https://webgrat.com/admin/blog/edit"
        noindex
      />

      <section className={styles.page}>
        <div className="container">
          <div className={styles.topBar}>
            <div>
              <span className={styles.eyebrow}>Webgrat Admin</span>
              <h1 className={styles.title}>
                {loading ? 'Loading post…' : `Edit: ${initialPost?.title || 'Untitled'}`}
              </h1>
              <p className={styles.subtitle}>
                Update the post and save your changes. Updates go live immediately.
              </p>
            </div>
            <div className={styles.userMenu}>
              <Link to="/admin/blogs" className={styles.signOutBtn}>
                ← All posts
              </Link>
              {user?.email && <span className={styles.userEmail}>{user.email}</span>}
              <button
                type="button"
                className={styles.signOutBtn}
                onClick={handleSignOut}
              >
                Sign out
              </button>
            </div>
          </div>

          {loadError ? (
            <div className={styles.alertError} style={{ marginTop: 24 }}>
              {loadError}
            </div>
          ) : loading || !initialPost ? (
            <p style={{ color: 'var(--color-text-muted)', marginTop: 24 }}>
              Loading post…
            </p>
          ) : (
            <AdminBlogForm
              mode="edit"
              initialPost={initialPost}
              onSubmit={handleUpdate}
              cancelTo="/admin/blogs"
              successMessage={(post) =>
                `Changes to “${post?.title || initialPost.title}” saved.`
              }
              onSuccess={() => navigate('/admin/blogs')}
            />
          )}
        </div>
      </section>
    </>
  )
}
