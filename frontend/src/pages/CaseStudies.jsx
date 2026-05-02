import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SEOHead from '../seo/SEOHead'
import ScrollReveal from '../components/ui/ScrollReveal'
import Button from '../components/ui/Button'
import styles from './CaseStudies.module.css'
import { CASE_STUDIES, FILTERS } from '../data/caseStudiesData'

export default function CaseStudies() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryFromUrl = searchParams.get('category')
  const resolvedFilter =
    categoryFromUrl && FILTERS.includes(categoryFromUrl) ? categoryFromUrl : 'All'

  const [activeFilter, setActiveFilter] = useState(resolvedFilter)

  useEffect(() => {
    setActiveFilter(resolvedFilter)
  }, [resolvedFilter])

  const filteredCaseStudies = useMemo(
    () => CASE_STUDIES.filter((cs) => activeFilter === 'All' || cs.category === activeFilter),
    [activeFilter],
  )

  const clientServiceCounts = useMemo(() => {
    return filteredCaseStudies.reduce((acc, cs) => {
      if (!cs.clientGroup) return acc
      acc[cs.clientGroup] = (acc[cs.clientGroup] || 0) + 1
      return acc
    }, {})
  }, [filteredCaseStudies])

  const handleFilterClick = (filter) => {
    setActiveFilter(filter)
    if (filter === 'All') {
      setSearchParams({})
      return
    }
    setSearchParams({ category: filter })
  }

  return (
    <>
      <SEOHead 
        title="Client Case Studies & Results | Webgrat"
        description="See how Webgrat has helped businesses grow with AI automation, SEO, PPC, and digital marketing. Real clients, real results, real numbers."
        canonical="https://webgrat.com/case-studies"
      />

      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <ScrollReveal className={styles.heroTextBlock}>
              <h1 className={styles.heroH1}>Real Businesses. Real Results.</h1>
              <p className={styles.heroSub}>Numbers don't lie. Here's what we've achieved for businesses like yours.</p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <div className={styles.filterBar}>
            {FILTERS.map(f => (
              <button
                key={f}
                className={`${styles.filterBtn} ${activeFilter === f ? styles.active : ''}`}
                onClick={() => handleFilterClick(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className={styles.grid}>
            {filteredCaseStudies.map((cs, i) => (
                <Link key={cs.slug || i} to={`/case-studies/${cs.slug}`} className={styles.card}>
                  {cs.image ? (
                    <img src={cs.image} alt={cs.imageAlt || cs.title} className={styles.coverImage} loading="lazy" />
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                      <span>Upload cover image</span>
                    </div>
                  )}

                  <div className={styles.cardBody}>
                    <div className={styles.meta}>
                      <span className={styles.category}>{cs.category}</span>
                    </div>

                    <h3 className={styles.title}>{cs.title}</h3>
                    <p className={styles.excerpt}>{cs.excerpt}</p>

                    {(cs.clientName || cs.serviceTrack) && (
                      <div className={styles.serviceMeta}>
                        {cs.clientName && <span>{cs.clientName}</span>}
                        {cs.clientName && cs.serviceTrack && <span className={styles.serviceDot}>•</span>}
                        {cs.serviceTrack && <span>{cs.serviceTrack}</span>}
                      </div>
                    )}

                    {cs.clientGroup && clientServiceCounts[cs.clientGroup] > 1 && (
                      <span className={styles.multiServiceBadge}>
                        {clientServiceCounts[cs.clientGroup]} services available for this client
                      </span>
                    )}

                    <div className={styles.tags}>
                      {cs.tags.map(tag => (
                        <span key={tag} className={styles.tag}>{tag}</span>
                      ))}
                    </div>

                    <div className={styles.resultRow}>
                      <span className={styles.bigResult}>{cs.bigResult}</span>
                      <span className={styles.resultLabel}>{cs.resultLabel}</span>
                    </div>

                    <div className={styles.readMore}>
                      Read case study
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <section style={{ textAlign: 'center', padding: '44px 0', backgroundColor: 'var(--color-surface)' }}>
        <div className="container">
          <ScrollReveal>
            <h2 style={{ marginBottom: '32px' }}>Want results like these?</h2>
            <Button variant="primary" to="/contact">Book Free Consultation</Button>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
