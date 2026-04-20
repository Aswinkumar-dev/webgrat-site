import React from 'react'
import SEOHead from '../seo/SEOHead'
import ScrollReveal from '../components/ui/ScrollReveal'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import SectionHeader from '../components/ui/SectionHeader'
import styles from './About.module.css'

const HERO_METRICS = [
  { value: '3+', label: 'Years of experience', suffix: 'Building growth systems' },
  { value: '7+', label: 'Industries worked across', suffix: 'Local to Global Brands' },
  { value: '1Cr+', label: 'Revenue generated', suffix: 'Driven for client campaigns' },
  { value: '20+', label: 'Clients served', suffix: 'With tailored digital strategies' }
]

export default function About() {
  return (
    <>
      <SEOHead 
        title="About Webgrat — AI-Powered Digital Solutions Company"
        description="Learn about Webgrat — a modern digital solutions company combining AI, automation, and performance marketing to help businesses grow. Meet the team behind the results."
        canonical="https://webgrat.com/about"
      />

      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <ScrollReveal>
                <Badge className={styles.heroBadge}>Our Story</Badge>
                <h1 className={styles.heroH1}>
                  We&apos;re Webgrat — Built to Help Businesses{' '}
                  <span className={styles.heroAccent}>Grow Smarter</span>
                </h1>
                <p className={styles.heroSub}>In today's fast-paced digital landscape, traditional approaches are no longer enough. We built Webgrat to change that — combining AI, automation, and marketing intelligence to help businesses work smarter, move faster, and scale with confidence.</p>
              </ScrollReveal>
            </div>

            <div className={styles.heroVisual}>
              <ScrollReveal delay={120}>
                <div className={styles.metricsScene}>
                  <div className={styles.metricsGlow} aria-hidden="true"></div>
                  <div className={styles.metricsPanel}>
                    {/* <div className={styles.metricsEyebrow}>Webgrat impact</div> */}
                    <div className={styles.metricsCore}>
                      <div className={styles.metricsCoreRing}></div>
                      <div className={styles.metricsCoreValue}>Growth</div>
                      <div className={styles.metricsCoreLabel}>AI + Marketing + Execution</div>
                    </div>
                  </div>

                  {HERO_METRICS.map((metric, index) => (
                    <div
                      key={metric.label}
                      className={`${styles.metricCard} ${styles[`metricCard${index + 1}`]}`}
                    >
                      <div className={styles.metricValue}>{metric.value}</div>
                      <div className={styles.metricLabel}>{metric.label}</div>
                      <div className={styles.metricHint}>{metric.suffix}</div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className={styles.missionSection}>
        <div className="container">
          <ScrollReveal>
            <div className={styles.missionVision}>
              <div className={styles.mvCard}>
                <div className={styles.mvLabel}>Our Mission</div>
                <div className={styles.mvText}>To empower businesses with AI-powered digital solutions that eliminate inefficiency, accelerate growth, and deliver consistently measurable results.</div>
              </div>
              <div className={styles.mvCard}>
                <div className={styles.mvLabel}>Our Vision</div>
                <div className={styles.mvText}>A world where every business — regardless of size — has access to enterprise-grade digital intelligence, automation, and marketing expertise.</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Team */}
      <section className={styles.teamSection}>
        <div className="container">
          <SectionHeader title="The People Behind Webgrat" className={styles.teamHeader} />
          <ScrollReveal>
            <div className={styles.teamGrid}>
              {[
                { name: 'Naresh kanna', role: 'Founder & Head of Strategy', initials: 'NR', bio: 'Naresh Kanna leads Webgrat’s strategy, aligning client goals with growth-focused solutions.'},
                { name: 'Aswinkumar', role: 'Co-Founder & Growth Systems Lead', initials: 'AK', bio: 'Aswinkumar leads campaign ideation, web development, and AI automation to build scalable solutions.'},
                { name: 'Deepa', role: 'Content & Performance Lead', initials: 'DM', bio: 'Deepa leads content and campaigns, driving high-performing ads that generate qualified leads.'},
                { name: 'Praveen', role: 'Creative Strategist & Video Editor', initials: 'PS', bio: 'Pradeep crafts persuasive ad scripts that drive engagement and conversions..'}
              ].map((member, i) => (
                <div key={i} className={styles.teamCard}>
                  {/* Note: team photos to be replaced with real images */}
                  <div className={styles.teamPhoto}>{member.initials}</div>
                  <div className={styles.teamName}>{member.name}</div>
                  <div className={styles.teamRole}>{member.role}</div>
                  <div className={styles.teamBio}>{member.bio}</div>
                  <div className={styles.teamSocial}>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Core Values */}
      <section className={styles.valuesSection}>
        <div className="container">
          <SectionHeader badge="Principles" title="Our Core Values" className={styles.valuesHeader} />
          <ScrollReveal>
            <div className={styles.valuesGrid}>
              <div className={styles.valueBlock}>
                <h3 className={styles.valueTitle}>Intelligence First</h3>
                <p className={styles.valueDesc}>Every decision we make is backed by data, analytics, and AI-driven insight — never gut feel alone.</p>
              </div>
              <div className={styles.valueBlock}>
                <h3 className={styles.valueTitle}>Radical Transparency</h3>
                <p className={styles.valueDesc}>Our clients always know exactly what's happening, what it cost, and what results it produced.</p>
              </div>
              <div className={styles.valueBlock}>
                <h3 className={styles.valueTitle}>Continuous Improvement</h3>
                <p className={styles.valueDesc}>We treat every campaign, every client, and every process as an opportunity to learn and improve.</p>
              </div>
              <div className={styles.valueBlock}>
                <h3 className={styles.valueTitle}>Genuine Partnership</h3>
                <p className={styles.valueDesc}>We succeed when our clients succeed. We think long-term, not transactionally.</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Certifications Strip */}
      {/* <div className={styles.certsStrip}>
        <div className="container">
          <div className={styles.certsTrack}>
            <span className={styles.certBadge}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google Partner
            </span>
            <span className={styles.certBadge}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Meta Blueprint
            </span>
            <span className={styles.certBadge}>
              HubSpot Certified
            </span>
            <span className={styles.certBadge}>
              Google Analytics 4
            </span>
          </div>
        </div>
      </div> */}

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className="container">
          <ScrollReveal className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Scale?</h2>
            <Button variant="primary" to="/contact">Work with the Webgrat team</Button>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
