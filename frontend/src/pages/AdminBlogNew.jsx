import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SEOHead from '../seo/SEOHead'
import { endpoints } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import AdminBlogForm from '../components/admin/AdminBlogForm'
import styles from './AdminBlogNew.module.css'

export default function AdminBlogNew() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const handleCreate = async (payload) => {
    return endpoints.createBlog({
      ...payload,
      // Stamp the current admin user as the author when creating a fresh post.
      authorId: user?.id,
    })
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <>
      <SEOHead
        title="New Blog Post — Webgrat Admin"
        description="Publish a new blog post."
        canonical="https://webgrat.com/admin/blog/new"
        noindex
      />

      <section className={styles.page}>
        <div className="container">
          <div className={styles.topBar}>
            <div>
              <span className={styles.eyebrow}>Webgrat Admin</span>
              <h1 className={styles.title}>Create a new blog post</h1>
              <p className={styles.subtitle}>
                Add an image, write your content, and tag it. The post will go live
                instantly when published.
              </p>
            </div>
            <div className={styles.userMenu}>
              <Link to="/admin/blogs" className={styles.signOutBtn}>
                Manage posts
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

          <AdminBlogForm
            mode="create"
            onSubmit={handleCreate}
            cancelTo="/admin/blogs"
            successMessage={(post) =>
              `Blog “${post?.title || 'post'}” saved successfully.`
            }
            onSuccess={() => navigate('/admin/blogs')}
          />
        </div>
      </section>
    </>
  )
}
