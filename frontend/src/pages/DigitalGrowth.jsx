import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SEOHead from '../seo/SEOHead'
import ScrollReveal from '../components/ui/ScrollReveal'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import HeroGrowthVisual from '../components/home/HeroGrowthVisual'
import WhatsAppButton from '../components/ui/WhatsAppButton'
import { endpoints } from '../lib/api'
import styles from './DigitalGrowth.module.css'

import allThingsVedicBanner from '../assets/all things vedic banner.webp'
import astroNaveenBanner from '../assets/astro naveen banner.webp'
import bharatLogoBanner from '../assets/bharat logo banner.webp'
import boomiPropertyBanner from '../assets/boomi property banner.webp'
import glanceifyLogoBanner from '../assets/glanceify logo banner.webp'
import kalaiLeninBanner from '../assets/kalai lenin banner.webp'
import littleStepzBanner from '../assets/little stepz banner.webp'
import majuGroupsBanner from '../assets/maju groups banner.webp'
import nannilaNamBanner from '../assets/nannilam logo banner.webp'
import raasiEngineeringBanner from '../assets/raasi engineering banner.webp'
import rainbowTailersBanner from '../assets/rainbow tailers banner.webp'
import sunwinLogoBanner from '../assets/sunwin logo banner.webp'

const bannerImages = [
  { src: allThingsVedicBanner, alt: 'All Things Vedic' },
  { src: astroNaveenBanner, alt: 'Astro Naveen' },
  { src: bharatLogoBanner, alt: 'Bharat Paints' },
  { src: boomiPropertyBanner, alt: 'Boomi Property' },
  { src: glanceifyLogoBanner, alt: 'Glanceify' },
  { src: kalaiLeninBanner, alt: 'Kalai Lenin' },
  { src: littleStepzBanner, alt: 'Little Stepz Kids Clinic' },
  { src: majuGroupsBanner, alt: 'Maju Groups' },
  { src: nannilaNamBanner, alt: 'Nannilam Nammidam' },
  { src: raasiEngineeringBanner, alt: 'Raasi Engineering' },
  { src: rainbowTailersBanner, alt: 'Rainbow Tailers' },
  { src: sunwinLogoBanner, alt: 'Sunwin' },
]

const EMAIL_PATTERN = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$'

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  company: '',
  service: '',
  message: '',
}

const MetricIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
)

const MockupIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
)

const MobileIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
    <line x1="12" y1="18" x2="12.01" y2="18"></line>
  </svg>
)

export default function DigitalGrowth() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState(null)

  const handleEmailInvalid = (e) => {
    e.target.setCustomValidity('Please enter a valid email address (for example: name@example.com).')
  }
  const clearEmailValidity = (e) => {
    e.target.setCustomValidity('')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return

    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity()
      return
    }

    setStatus(null)
    setSubmitting(true)

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        company: form.company.trim(),
        service: form.service,
        message: form.message.trim() || 'Enquiry from Digital Growth landing page',
      }

      const response = await endpoints.submitDigitalGrowthContact(payload)

      if (response?.success === false) {
        setStatus({ type: 'error', message: response.message || 'Something went wrong. Please try again.' })
        return
      }

      setForm(INITIAL_FORM)
      navigate('/thank-you')
    } catch (error) {
      const message =
        error?.data?.fieldErrors
          ? Object.values(error.data.fieldErrors).join(' ')
          : error?.message || 'Failed to send message. Please try again later.'
      setStatus({ type: 'error', message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <SEOHead
        title="Digital Growth Partner for Businesses | Webgrat"
        description="Get more customers and real growth online with Webgrat's AI-powered digital marketing — performance marketing, social media, and website development for Tamil Nadu businesses."
        canonical="https://webgrat.com/digital-growth"
      />

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.blob1}></div>
          <div className={styles.blob2}></div>
        </div>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <ScrollReveal delay={0} className={styles.heroBadgeWrap}>
              <Badge>Digital Growth Partner for Businesses</Badge>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h1 className={styles.heroH1}>
                We Build, Market &amp;{' '}
                <span className={styles.heroAccent}>Scale</span>
                {' '}Your Digital Business
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p className={styles.heroSub}>
                From high-converting websites to result-driven marketing — everything your business needs to grow.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={250}>
              <ul className={styles.heroBullets}>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Performance Marketing
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Social Media Marketing
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Website Development
                </li>
              </ul>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <div className={styles.heroCtas}>
                <a href="#contact-form" className={styles.ctaPrimary}>Book Free Consultation</a>
                <Button variant="ghost" to="/case-studies">View Our Work</Button>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={400}>
              <div className={styles.heroSocial}>Trusted by 20+ growing businesses</div>
            </ScrollReveal>
          </div>
          <div className={styles.heroVisual}>
            <HeroGrowthVisual />
          </div>
        </div>
      </section>

      {/* ── TRUSTED BY BANNER ───────────────────────────────── */}
      <div className={styles.logosStrip}>
        <div className={styles.logosLabel}>Trusted by</div>
        <div className={styles.logosTrack}>
          {[...bannerImages, ...bannerImages].map((img, idx) => (
            <div key={idx} className={styles.logoItem}>
              <img src={img.src} alt={img.alt} className={styles.logoImg} loading="lazy" />
            </div>
          ))}
        </div>
      </div>

      {/* ── WHAT WE OFFER ───────────────────────────────────── */}
      <section className={styles.offerSection}>
        <div className="container">
          <ScrollReveal>
            <div className={styles.offerHeader}>
              <div className={styles.offerBadge}>WHAT WE OFFER</div>
              <h2 className={styles.offerH2}>Everything You Need to Grow Online</h2>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className={styles.offerGrid}>

              {/* Card 1 — Social Media */}
              <div className={styles.offerCard}>
                <div className={styles.offerCardIcon} style={{ background: 'rgba(46,247,142,0.12)', color: 'var(--color-primary)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                </div>
                <h3 className={styles.offerCardTitle}>Social Media Marketing</h3>
                <div className={styles.offerCardIncluded}>WHAT'S INCLUDED:</div>
                <ul className={styles.offerList}>
                  <li>Social Media Page Setup &amp; Management</li>
                  <li>Content &amp; Creative Strategy</li>
                  <li>Reels, Posts &amp; Story Designs</li>
                  <li>Audience Growth &amp; Engagement</li>
                  <li>Meta Ads &amp; Campaign Management</li>
                  <li>Conversion-Focused Social Media Growth</li>
                </ul>
              </div>

              {/* Card 2 — Performance Marketing */}
              <div className={styles.offerCard}>
                <div className={styles.offerCardIcon} style={{ background: 'rgba(46,247,142,0.12)', color: 'var(--color-primary)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
                <h3 className={styles.offerCardTitle}>Performance Marketing &amp; Paid Ads</h3>
                <div className={styles.offerCardIncluded}>WHAT'S INCLUDED:</div>
                <ul className={styles.offerList}>
                  <li>Page Setup &amp; Management</li>
                  <li>Content &amp; Creative Strategy</li>
                  <li>Reels, Posts &amp; Story Designs</li>
                  <li>Audience Growth &amp; Engagement</li>
                  <li>Meta Ads Campaigns</li>
                  <li>More Leads &amp; Brand Growth</li>
                </ul>
              </div>

              {/* Card 3 — Web Development */}
              <div className={styles.offerCard}>
                <div className={styles.offerCardIcon} style={{ background: 'rgba(46,247,142,0.12)', color: 'var(--color-primary)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                  </svg>
                </div>
                <h3 className={styles.offerCardTitle}>Web Design &amp; Development</h3>
                <div className={styles.offerCardIncluded}>WHAT'S INCLUDED:</div>
                <ul className={styles.offerList}>
                  <li>User-centric UX/UI design</li>
                  <li>Mobile-first responsive design across all devices</li>
                  <li>Better performance optimisation</li>
                  <li>Ongoing technical support</li>
                  <li>Secure, scalable backend with future-ready integrations</li>
                </ul>
              </div>

              {/* Card 4 — AI Automation */}
              <div className={styles.offerCard}>
                <div className={styles.offerCardIcon} style={{ background: 'rgba(46,247,142,0.12)', color: 'var(--color-primary)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/><path d="M12 2v7"/><path d="M12 15v7"/>
                    <path d="M22 12h-7"/><path d="M9 12H2"/>
                  </svg>
                </div>
                <h3 className={styles.offerCardTitle}>AI Automation &amp; Workflow Solutions</h3>
                <div className={styles.offerCardIncluded}>WHAT'S INCLUDED:</div>
                <ul className={styles.offerList}>
                  <li>Business process audit and consultation</li>
                  <li>Workflow mapping and optimization</li>
                  <li>Automation build (n8n, Zapier, or custom scripts)</li>
                  <li>Testing and continuous deployment</li>
                  <li>Ongoing maintenance and support</li>
                </ul>
              </div>

            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── RESULTS SECTION ──────────────────────────────────── */}
      <section className={styles.resultsSection}>
        <div className="container">

          {/* Header */}
          <ScrollReveal>
            <div className={styles.resultsBadge}>WHAT WE ACHIEVED</div>
            <h2 className={styles.resultsH2}>
              {/* Real Results. Real Growth. */}
              Performance That Moves Businesses Forward.
            </h2>
            <p className={styles.resultsSub}>
              Data-driven strategies. Measurable results. Business growth that speaks for itself.
            </p>
          </ScrollReveal>

          {/* ── 01 Meta Ads ── */}
          <ScrollReveal delay={80}>
            <div className={styles.resultBlock}>
              <div className={styles.resultBlockHeader}>
                <span className={styles.resultNum}>01</span>
                <div>
                  <div className={styles.resultBlockTitle}>Meta Ads Results</div>
                  <div className={styles.resultBlockSub}>Higher ROI. Lower CPL. More Conversions.</div>
                </div>
              </div>
              <div className={styles.metaAdsGrid}>
                {/* 3 meta ads screenshots */}
                {[1, 2, 3].map((n) => (
                  <div key={n} className={styles.metaAdCard}>
                    <div className={styles.imgPlaceholder}>
                      <MetricIcon />
                      <span>Meta Ads Screenshot {n}</span>
                      <span className={styles.imgNote}>Image coming soon</span>
                    </div>
                    <div className={styles.roiBadge}>900x ROI Generated</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* ── 02 Instagram Growth ── */}
          <ScrollReveal delay={80}>
            <div className={styles.resultBlock}>
              <div className={styles.resultBlockHeader}>
                <span className={styles.resultNum}>02</span>
                <div>
                  <div className={styles.resultBlockTitle}>Instagram Growth Results</div>
                  <div className={styles.resultBlockSub}>From Low Reach to High Impact.</div>
                </div>
              </div>
              <div className={styles.instaGrid}>
                {/* 4 mobile screenshots: Before / After / Before / After */}
                {[
                  { label: 'Before', reach: '2,341', change: '-18.6%', changeType: 'neg' },
                  { label: 'After',  reach: '156K',  change: '+312%',  changeType: 'pos' },
                  { label: 'Before', reach: '1,890', change: '-22.4%', changeType: 'neg' },
                  { label: 'After',  reach: '205K',  change: '+289%',  changeType: 'pos' },
                ].map((item, i) => (
                  <div key={i} className={styles.instaCard}>
                    <span className={`${styles.beforeAfterBadge} ${item.label === 'After' ? styles.afterBadge : styles.beforeBadge}`}>
                      {item.label}
                    </span>
                    <div className={styles.mobileImgPlaceholder}>
                      <MobileIcon />
                      <span>Instagram Profile</span>
                      <span className={styles.imgNote}>Image coming soon</span>
                    </div>
                    <div className={styles.instaStats}>
                      <div className={styles.instaReachLabel}>Reach</div>
                      <div className={styles.instaReachValue}>{item.reach}</div>
                      <div className={`${styles.instaChange} ${item.changeType === 'pos' ? styles.instaChangePos : styles.instaChangeNeg}`}>
                        {item.change}
                      </div>
                      <div className={styles.instaAccountsLabel}>Accounts reached</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* ── 03 Website Development ── */}
          <ScrollReveal delay={80}>
            <div className={styles.resultBlock}>
              <div className={styles.resultBlockHeader}>
                <span className={styles.resultNum}>03</span>
                <div>
                  <div className={styles.resultBlockTitle}>Website Development Results</div>
                  <div className={styles.resultBlockSub}>Modern Design. Seamless Experience. Better Conversions.</div>
                </div>
              </div>
              <div className={styles.websiteGrid}>
                {/* Set 1 */}
                <div className={styles.websiteSet}>
                  <div className={styles.websiteCard}>
                    <span className={`${styles.beforeAfterBadge} ${styles.beforeBadge}`}>Before</span>
                    <div className={styles.desktopImgPlaceholder}>
                      <MockupIcon />
                      <span>Website Mockup</span>
                      <span className={styles.imgNote}>Image coming soon</span>
                    </div>
                  </div>
                  <div className={styles.websiteArrow}>→</div>
                  <div className={styles.websiteCard}>
                    <span className={`${styles.beforeAfterBadge} ${styles.afterBadge}`}>After</span>
                    <div className={styles.desktopImgPlaceholder}>
                      <MockupIcon />
                      <span>Website Mockup</span>
                      <span className={styles.imgNote}>Image coming soon</span>
                    </div>
                  </div>
                </div>
                {/* Set 2 */}
                <div className={styles.websiteSet}>
                  <div className={styles.websiteCard}>
                    <span className={`${styles.beforeAfterBadge} ${styles.beforeBadge}`}>Before</span>
                    <div className={styles.desktopImgPlaceholder}>
                      <MockupIcon />
                      <span>Website Mockup</span>
                      <span className={styles.imgNote}>Image coming soon</span>
                    </div>
                  </div>
                  <div className={styles.websiteArrow}>→</div>
                  <div className={styles.websiteCard}>
                    <span className={`${styles.beforeAfterBadge} ${styles.afterBadge}`}>After</span>
                    <div className={styles.desktopImgPlaceholder}>
                      <MockupIcon />
                      <span>Website Mockup</span>
                      <span className={styles.imgNote}>Image coming soon</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ── CONTACT FORM (DARK BG) ───────────────────────────── */}
      <section className={styles.formSection} id="contact-form">
        <div className={styles.formBg}>
          <div className={styles.formBlob1}></div>
          <div className={styles.formBlob2}></div>
        </div>
        <div className="container">
          <ScrollReveal>
            <div className={styles.formHeader}>
              <div className={styles.formBadge}>READY TO GROW YOUR BUSINESS?</div>
              <h2 className={styles.formH2}>Let’s Engineer Your Next Phase of Growth</h2>
              <p className={styles.formSub}>
                Get a free audit and consultation. Let's discuss how we can help your business grow online.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className={styles.formCard}>
              <form onSubmit={handleSubmit} noValidate={false}>
                <div className={styles.formGrid}>
                  <div>
                    <label className={styles.label} htmlFor="dg-name">Full Name *</label>
                    <input
                      type="text"
                      id="dg-name"
                      name="name"
                      className={styles.input}
                      placeholder="Your full name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label className={styles.label} htmlFor="dg-email">Email Address *</label>
                    <input
                      type="email"
                      id="dg-email"
                      name="email"
                      className={styles.input}
                      placeholder="name@example.com"
                      required
                      pattern={EMAIL_PATTERN}
                      title="Please enter a valid email address (for example: name@example.com)."
                      onInvalid={handleEmailInvalid}
                      onInput={clearEmailValidity}
                      value={form.email}
                      onChange={handleChange}
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label className={styles.label} htmlFor="dg-phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="dg-phone"
                      name="phone"
                      className={styles.input}
                      placeholder="10-digit mobile number"
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      required
                      title="Please enter exactly 10 digits"
                      value={form.phone}
                      onChange={handleChange}
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label className={styles.label} htmlFor="dg-company">Business Name</label>
                    <input
                      type="text"
                      id="dg-company"
                      name="company"
                      className={styles.input}
                      placeholder="Your business name"
                      value={form.company}
                      onChange={handleChange}
                      disabled={submitting}
                    />
                  </div>
                  <div className={styles.fullWidth}>
                    <label className={styles.label} htmlFor="dg-service">What are you looking for? *</label>
                    <select
                      id="dg-service"
                      name="service"
                      className={styles.select}
                      required
                      value={form.service}
                      onChange={handleChange}
                      disabled={submitting}
                    >
                      <option value="">Select a service...</option>
                      <option value="Social Media Marketing">Social Media Marketing</option>
                      <option value="PPC Advertising">PPC Advertising</option>
                      <option value="Web Design & Development">Web Development</option>
                      <option value="Content Marketing">Content & Performance Marketing</option>
                      <option value="Social Media Audit">Social Media Audit</option>
                      <option value="Ad shoot">Ad Shoot</option>
                      <option value="SEO">SEO</option>
                      <option value="AI Automation">AI Automation</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className={styles.fullWidth}>
                    <label className={styles.label} htmlFor="dg-message">Tell us about your goals</label>
                    <textarea
                      id="dg-message"
                      name="message"
                      className={styles.textarea}
                      placeholder="What do you want to achieve? (optional)"
                      value={form.message}
                      onChange={handleChange}
                      disabled={submitting}
                    />
                  </div>
                </div>

                {status && (
                  <div
                    className={`${styles.formStatus} ${status.type === 'error' ? styles.formStatusError : styles.formStatusSuccess}`}
                    role="status"
                    aria-live="polite"
                  >
                    {status.message}
                  </div>
                )}

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={submitting}
                >
                  {submitting ? 'Sending…' : 'Book Free Consultation →'}
                </button>

                <p className={styles.formDisclaimer}>
                  No commitment. No sales pressure. We reply within 1 business day.
                </p>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Floating WhatsApp */}
      <WhatsAppButton />
    </>
  )
}
