import React from 'react'
import SEOHead from '../seo/SEOHead'
import ScrollReveal from '../components/ui/ScrollReveal'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import SectionHeader from '../components/ui/SectionHeader'
import ServiceCard from '../components/ui/ServiceCard'
import StatCounter from '../components/ui/StatCounter'
import StepCard from '../components/ui/StepCard'
import TestimonialCard from '../components/ui/TestimonialCard'
import BlogCard from '../components/ui/BlogCard'
import HeroGrowthVisual from '../components/home/HeroGrowthVisual'
import styles from './Home.module.css'

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

const Icons = {
  Circuit: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M12 2v7"></path><path d="M12 15v7"></path>
      <path d="M22 12h-7"></path><path d="M9 12H2"></path>
    </svg>
  ),
  Search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
  Click: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path>
      <path d="M13 13l6 6"></path>
    </svg>
  ),
  Social: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"></circle>
      <circle cx="6" cy="12" r="3"></circle>
      <circle cx="18" cy="19" r="3"></circle>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
    </svg>
  ),
  Document: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  ),
  Code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  )
}

export default function Home() {
  return (
    <>
      <SEOHead
        title="Webgrat - AI-Powered Digital Marketing Agency"
        description="Webgrat is a modern AI-powered digital solutions company. We combine artificial intelligence, automation, and performance marketing to help businesses grow faster and smarter. Book a free consultation."
        canonical="https://webgrat.com/"
      />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.blob1}></div>
          <div className={styles.blob2}></div>
        </div>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <ScrollReveal delay={0} className={styles.heroBadgeWrap}>
              <Badge>AI-Powered &middot; Performance-Driven &middot; Results-Obsessed</Badge>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h1 className={styles.heroH1}>
                We Build, Market &amp;{' '}
                <span className={styles.heroAccent}>Scale</span>
                {' '}Your Digital Business
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p className={styles.heroSub}>Webgrat combines Artificial Intelligence, automation, and digital marketing to eliminate manual effort and accelerate your business growth.</p>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <div className={styles.heroCtas}>
                <Button variant="primary" to="/contact">Book Free Consultation</Button>
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

      {/* Services Section */}
      <section className={styles.servicesSection}>
        <div className="container">
          <SectionHeader
            badge="Our Services"
            title="Everything You Need to Grow Online"
            subtitle="From AI automation to performance marketing — we cover the full digital growth stack."
          />
          <ScrollReveal>
            <div className={styles.servicesGrid}>
            <ServiceCard
                icon={Icons.Social}
                title="Social Media Marketing"
                description="Build brand authority, grow your following, and engage your audience across all major social platforms."
                linkTo="/services#social-media"
              />
               <ServiceCard
                icon={Icons.Document}
                title="Content & Performance Marketing"
                description="Strategic content that ranks on Google, converts visitors, and positions your brand as the market leader."
                linkTo="/services#content"
              />
              <ServiceCard
                icon={Icons.Code}
                title="Web Design & Development"
                description="High-performance, visually compelling websites built for speed, UX, and measurable business results."
                linkTo="/services#web"
              />
              <ServiceCard
                icon={Icons.Click}
                title="PPC Advertising"
                description="Maximise your ad spend with precision-targeted Google and Meta campaigns engineered for maximum ROI."
                linkTo="/services#ppc"
              />
              <ServiceCard
                icon={Icons.Search}
                title="Search Engine Optimisation"
                description="Rank higher on Google and drive consistent organic traffic that converts into real customers and revenue."
                linkTo="/services#seo"
              />
              <ServiceCard
                icon={Icons.Circuit}
                title="AI Automation & Workflows"
                description="Eliminate repetitive tasks and streamline operations with intelligent automation workflows built for your business."
                linkTo="/services#ai-automation"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Why Webgrat */}
      <section className={styles.testimonialsSection} style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container">
          <SectionHeader
            badge="Why Webgrat"
            title="We Don't Just Run Campaigns. We Engineer Growth."
            align="center"
            className={styles.whyWebgratHeader}
          />
          <ScrollReveal>
            <div className={styles.whyGrid}>
              <div className={styles.whyBlock}>
                <h3 className={styles.whyTitle}>1. AI-First Methodology</h3>
                <p className={styles.whyDesc}>We integrate artificial intelligence into every strategy — from automation to analytics — so your business stays ahead of the competition.</p>
              </div>
              <div className={styles.whyBlock}>
                <h3 className={styles.whyTitle}>2. Data-Driven Decisions</h3>
                <p className={styles.whyDesc}>Every campaign, every recommendation, and every optimisation is backed by real data. No guesswork. No wasted budget. Just results.</p>
              </div>
              <div className={styles.whyBlock}>
                <h3 className={styles.whyTitle}>3. Full-Stack Expertise</h3>
                <p className={styles.whyDesc}>From web development to paid ads to SEO — we handle the complete digital stack so you don't need five different agencies.</p>
              </div>
              <div className={styles.whyBlock}>
                <h3 className={styles.whyTitle}>4. Radical Transparency</h3>
                <p className={styles.whyDesc}>You always know exactly what we're doing and why. Clear dashboards, regular reports, and direct access to your team.</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats Bar */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            <div>
              <div className={styles.statNumber}><StatCounter target={20} suffix="+" /></div>
              <div className={styles.statLabel}>Businesses Helped</div>
            </div>
            <div>
              <div className={styles.statNumber}><StatCounter target={970} suffix="%" /></div>
              <div className={styles.statLabel}>Average ROI Delivered</div>
            </div>
            <div>
              <div className={styles.statNumber}><StatCounter target={7} /></div>
              <div className={styles.statLabel}>Core Service Areas</div>
            </div>
            <div>
              <div className={styles.statNumber}><StatCounter target={100} suffix="%" /></div>
              <div className={styles.statLabel}>Transparent Reporting</div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className={styles.processSection}>
        <div className="container">
          <SectionHeader
            badge="Our Process"
            title="Simple Process. Powerful Results."
            className={styles.processHeader}
          />
          <ScrollReveal>
            <div className={styles.processGrid}>
              <StepCard
                number="01"
                title="Audit & Strategy"
                description="We deep-dive into your business, competitors, and digital presence. Then we build a custom growth strategy aligned to your goals and budget."
              />
              <StepCard
                number="02"
                title="Execute & Optimise"
                description="Our team executes with precision — launching campaigns, building automations, and continuously optimising based on live performance data."
              />
              <StepCard
                isLast
                number="03"
                title="Report & Scale"
                description="You get clear, regular reports. We analyse what's working, eliminate what isn't, and systematically scale the results month over month."
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.clientResultsSection} style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container">
          <SectionHeader
            badge="Client Results"
            title="What Our Clients Say"
          />
          <ScrollReveal>
            <div className={styles.grid3}>
              <TestimonialCard
                quote="I have been working with Naresh and team since a few months and I am very impressed with the quality of their work. The team is professional, they are qualified, and they deliver! Very rare these days… It's an absolute pleasure to work with them."
                name="Kuhaneshwary"
                company="Kalai House of Lenin"
                resultBadge="Social Media Marketing and Branding"
              />
              <TestimonialCard
                quote="I am very impressed with the quality of their work. The team is professional, they are qualified, and they deliver! Very rare these days... It's an absolute pleasure to work with them."
                name="Vikram Devatha"
                company="All Things Vedic"
                resultBadge="Strategy and Growth"
              />
              <TestimonialCard
                quote="The team responds quickly and understands requirements clearly. The website development process was smooth, and the final outcome was clean, professional, and exactly what we needed."
                name="Bharath"
                company="Bharath Paints"
                resultBadge="Web Development"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className={styles.finalCta}>
        <div className="container">
          <ScrollReveal>
            <h2 className={styles.finalCtaH2}>Ready to Grow Your Business?</h2>
            <p className={styles.finalCtaSub}>Let's build your growth strategy together. Book a free consultation and discover exactly how Webgrat can help you scale.</p>
            <Button to="/contact" className={styles.finalCtaButton}>
              Book Free Consultation
            </Button>
            {/* <div className={styles.finalCtaNote}>No commitment. No sales pressure. Just a strategy conversation.</div> */}
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
