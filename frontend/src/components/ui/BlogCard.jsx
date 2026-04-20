import React from 'react'
import { Link } from 'react-router-dom'
import styles from './BlogCard.module.css'

const formatDate = (iso) => {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}

export default function BlogCard({
  category,
  title,
  excerpt,
  readTime,
  slug,
  coverImageUrl,
  publishedAt,
}) {
  const dateLabel = formatDate(publishedAt)

  return (
    <Link to={`/blog/${slug}`} className={styles.card}>
      {coverImageUrl ? (
        <img
          src={coverImageUrl}
          alt={title}
          loading="lazy"
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            display: 'block',
            borderBottom: '1px solid var(--color-border)',
          }}
        />
      ) : (
        <div className={styles.imagePlaceholder}>
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </div>
      )}
      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.category}>{category}</span>
          <span className={styles.readTime}>{readTime}</span>
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.excerpt}>{excerpt}</p>
        <div className={styles.footer}>
          {dateLabel && <span className={styles.date}>{dateLabel}</span>}
          <span className={styles.readMore}>
            Read article
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}
