import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import SEOHead from '../seo/SEOHead'
import ScrollReveal from '../components/ui/ScrollReveal'
import { endpoints } from '../lib/api'
import styles from './BlogPost.module.css'

const wordsOf = (text) => (text || '').split(/\s+/).filter(Boolean).length

const formatDate = (iso) => {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
    let mounted = true

    setLoading(true)
    setError('')
    endpoints
      .getBlogBySlug(slug)
      .then((data) => {
        if (mounted) setPost(data)
      })
      .catch((err) => {
        if (mounted) {
          setError(
            err?.status === 404
              ? 'This article was not found.'
              : err?.message || 'Failed to load article.'
          )
        }
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [slug])

  const title = post?.title || ''
  const description =
    post?.metaDescription || post?.excerpt || 'Read the full article on Webgrat Insights.'

  const readTime =
    post?.readTimeMinutes
      ? `${post.readTimeMinutes} min read`
      : `${Math.max(1, Math.ceil(wordsOf(post?.content) / 200))} min read`

  const categoryLabel =
    post?.category?.name ||
    (post?.tags && post.tags.length > 0 ? post.tags[0].name : 'Article')

  const publishedDate = formatDate(post?.publishedAt || post?.createdAt)

  return (
    <>
      <SEOHead
        title={title ? `${title} | Webgrat Insights` : 'Webgrat Insights'}
        description={description}
      />

      <article className={styles.wrapper}>
        <div className="container">
          <ScrollReveal>
            {loading ? (
              <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                Loading article…
              </p>
            ) : error ? (
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'salmon', marginBottom: 24 }}>{error}</p>
                <Link to="/blog" className={styles.backLink}>
                  ← Back to all articles
                </Link>
              </div>
            ) : (
              post && (
                <>
                  <div className={styles.header}>
                    <div className={styles.meta}>
                      <span className={styles.category}>{categoryLabel}</span>
                      <span>•</span>
                      <span className={styles.readTime}>{readTime}</span>
                    </div>
                    <h1 className={styles.title}>{post.title}</h1>
                    <div className={styles.author}>
                      {post.author?.avatarUrl ? (
                        <img
                          src={post.author.avatarUrl}
                          alt={post.author.fullName || 'Author'}
                          className={styles.authorImg}
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div className={styles.authorImg}></div>
                      )}
                      <div className={styles.authorInfo}>
                        <div className={styles.authorName}>
                          {post.author?.fullName || 'Webgrat Team'}
                        </div>
                        <div className={styles.authorDate}>
                          {publishedDate ? `Published ${publishedDate}` : ''}
                        </div>
                      </div>
                    </div>
                  </div>

                  {post.coverImageUrl ? (
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      className={styles.heroImage}
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className={styles.heroImage}>[Featured Image Placeholder]</div>
                  )}

                  <div
                    className={styles.content}
                    dangerouslySetInnerHTML={{ __html: post.content || '' }}
                  />

                  {post.tags && post.tags.length > 0 && (
                    <div
                      className={styles.content}
                      style={{ marginTop: 32, display: 'flex', gap: 8, flexWrap: 'wrap' }}
                    >
                      {post.tags.map((t) => (
                        <span
                          key={t.id}
                          style={{
                            border: '1px solid var(--color-border)',
                            padding: '4px 10px',
                            borderRadius: 999,
                            fontSize: 13,
                            color: 'var(--color-text-muted)',
                          }}
                        >
                          #{t.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ maxWidth: 800, margin: '0 auto' }}>
                    <Link to="/blog" className={styles.backLink}>
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                      </svg>
                      Back to all articles
                    </Link>
                  </div>
                </>
              )
            )}
          </ScrollReveal>
        </div>
      </article>
    </>
  )
}
