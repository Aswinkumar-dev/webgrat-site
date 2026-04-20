import React, { useEffect, useMemo, useState } from 'react'
import SEOHead from '../seo/SEOHead'
import ScrollReveal from '../components/ui/ScrollReveal'
import BlogCard from '../components/ui/BlogCard'
import { endpoints } from '../lib/api'
import styles from './Blog.module.css'

const ALL_TAB = { id: 'all', name: 'All' }

const wordsOf = (text) => (text || '').split(/\s+/).filter(Boolean).length

const computeReadTime = (post) => {
  if (post.readTimeMinutes) return `${post.readTimeMinutes} min read`
  const minutes = Math.max(1, Math.ceil(wordsOf(post.content) / 200))
  return `${minutes} min read`
}

const labelFor = (post) =>
  post.category?.name ||
  (post.tags && post.tags.length > 0 ? post.tags[0].name : 'Article')

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [tags, setTags] = useState([])
  const [activeTagId, setActiveTagId] = useState(ALL_TAB.id)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    const loadAll = async () => {
      setLoading(true)
      setError('')
      try {
        const [publishedPosts, allTags] = await Promise.all([
          endpoints.listPublishedBlogs(),
          endpoints.listTags().catch(() => []),
        ])
        if (!mounted) return
        setPosts(Array.isArray(publishedPosts) ? publishedPosts : [])
        setTags(Array.isArray(allTags) ? allTags : [])
      } catch (err) {
        if (mounted) setError(err?.message || 'Failed to load blog posts.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadAll()
    return () => {
      mounted = false
    }
  }, [])

  const handleTagClick = async (tagId) => {
    setActiveTagId(tagId)
    setError('')
    setLoading(true)
    try {
      const result =
        tagId === ALL_TAB.id
          ? await endpoints.listPublishedBlogs()
          : await endpoints.getBlogsByTag(tagId)
      setPosts(Array.isArray(result) ? result : [])
    } catch (err) {
      setError(err?.message || 'Failed to filter posts.')
    } finally {
      setLoading(false)
    }
  }

  // Only show tags that are actually in use somewhere, plus "All".
  const tabList = useMemo(() => [ALL_TAB, ...tags], [tags])

  return (
    <>
      <SEOHead
        title="Digital Marketing & AI Blog — Webgrat Insights"
        description="Free digital marketing guides, AI automation tips, SEO strategies, and PPC insights from the Webgrat team. New articles every week."
        canonical="https://webgrat.com/blog"
      />

      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <ScrollReveal>
              <h1 className={styles.heroH1}>Digital Marketing & AI Insights</h1>
              <p className={styles.heroSub}>
                Actionable strategies, industry news, and expert commentary from the
                Webgrat team.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <ScrollReveal>
            {tabList.length > 1 && (
              <div className={styles.categoryTabs}>
                {tabList.map((tag) => (
                  <button
                    key={tag.id}
                    className={`${styles.tabBtn} ${
                      activeTagId === tag.id ? styles.active : ''
                    }`}
                    onClick={() => handleTagClick(tag.id)}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}

            {error && (
              <p style={{ textAlign: 'center', color: 'salmon' }}>{error}</p>
            )}

            {loading ? (
              <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                Loading posts…
              </p>
            ) : posts.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                No posts published yet.
              </p>
            ) : (
              <div className={styles.grid}>
                {posts.map((post) => (
                  <BlogCard
                    key={post.id}
                    category={labelFor(post)}
                    title={post.title}
                    excerpt={post.excerpt || ''}
                    readTime={computeReadTime(post)}
                    slug={post.slug}
                    coverImageUrl={post.coverImageUrl}
                    publishedAt={post.publishedAt || post.createdAt}
                  />
                ))}
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
