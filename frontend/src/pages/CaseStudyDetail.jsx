import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import SEOHead from '../seo/SEOHead'
import ScrollReveal from '../components/ui/ScrollReveal'
import { CASE_STUDIES } from '../data/caseStudiesData'
import styles from './CaseStudyDetail.module.css'

export default function CaseStudyDetail() {
  const { slug } = useParams()
  const caseStudy = CASE_STUDIES.find((item) => item.slug === slug)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!caseStudy) {
    return (
      <section className={styles.notFound}>
        <div className="container">
          <h1>Case study not found</h1>
          <p>The page you are looking for does not exist.</p>
          <Link to="/case-studies" className={styles.backLink}>Back to portfolio</Link>
        </div>
      </section>
    )
  }

  return (
    <>
      <SEOHead
        title={`${caseStudy.title} | Webgrat Portfolio`}
        description={caseStudy.excerpt}
        canonical={`https://webgrat.com/case-studies/${caseStudy.slug}`}
      />

      <article className={styles.wrapper}>
        <div className="container">
          <ScrollReveal>
            <header className={styles.header}>
              <div className={styles.metaRow}>
                <span className={styles.category}>{caseStudy.category}</span>
                <span className={styles.readTime}>{caseStudy.readTime}</span>
              </div>
              <h1 className={styles.title}>{caseStudy.title}</h1>
              <p className={styles.subtitle}>{caseStudy.excerpt}</p>
              <div className={styles.tags}>
                {caseStudy.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </header>

            {caseStudy.image ? (
              <img src={caseStudy.image} alt={caseStudy.imageAlt || caseStudy.title} className={styles.coverImage} />
            ) : (
              <div className={styles.imagePlaceholder}>Upload cover image for this case study</div>
            )}

            <div className={styles.content}>
              <h2>Challenge</h2>
              <p>{caseStudy.challenge}</p>

              <h2>Solution</h2>
              <ul>
                {caseStudy.solution.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <h2>Results</h2>
              <ul>
                {caseStudy.outcomes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className={styles.kpiRow}>
              <div className={styles.kpiCard}>
                <span className={styles.kpiValue}>{caseStudy.bigResult}</span>
                <span className={styles.kpiLabel}>{caseStudy.resultLabel}</span>
              </div>
              <div className={styles.kpiCard}>
                <span className={styles.kpiValue}>{caseStudy.period}</span>
                <span className={styles.kpiLabel}>Timeframe</span>
              </div>
              <div className={styles.kpiCard}>
                <span className={styles.kpiValue}>{caseStudy.clientType}</span>
                <span className={styles.kpiLabel}>Client Type</span>
              </div>
            </div>

              <Link
                to={`/case-studies?category=${encodeURIComponent(caseStudy.category)}`}
                className={styles.backLink}
              >
                View more in {caseStudy.category}
              </Link>
          </ScrollReveal>
        </div>
      </article>
    </>
  )
}
