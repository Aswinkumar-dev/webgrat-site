import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SEOHead from '../seo/SEOHead'
import ScrollReveal from '../components/ui/ScrollReveal'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import SectionHeader from '../components/ui/SectionHeader'
import ServiceCard from '../components/ui/ServiceCard'
import FAQAccordion from '../components/ui/FAQAccordion'
import ServicesHeroVisual from '../components/services/ServicesHeroVisual'
import styles from './Services.module.css'

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

export default function Services() {
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '')
        const element = document.getElementById(id)
        if (element) {
          const navbar = document.querySelector('nav')
          const navbarHeight = navbar?.offsetHeight ?? 90
          const extraSpacing = 16
          const targetTop = window.scrollY + element.getBoundingClientRect().top - navbarHeight - extraSpacing

          window.scrollTo({
            top: Math.max(targetTop, 0),
            behavior: 'smooth'
          })
        }
      }, 100)
    }
  }, [hash])

  const faqs = [
    {
      q: "How does the free consultation work?",
      a: "It's a 30-minute strategy call where we learn about your business, your goals, and where you're currently struggling. There's zero sales pressure — just an honest conversation about whether and how we can help."
    },
    {
      q: "Do you require long-term contracts?",
      a: "No. We offer month-to-month engagements on most services. We earn your continued business through results, not lock-in clauses."
    },
    {
      q: "How soon can we get started?",
      a: "Once we've aligned on a strategy, most projects begin within 5–7 business days."
    },
    {
      q: "How long before I see results?",
      a: "PPC: days. SEO: 3–6 months. AI automation: immediate. Social media: 2–3 months for meaningful growth."
    },
    {
      q: "Can I change services later?",
      a: "Yes, you can add, remove, or swap services with 30 days' notice."
    }
  ]

  return (
    <>
      <SEOHead
        title="Digital Marketing & AI Automation Services | Webgrat"
        description="Full-service digital solutions: AI automation, SEO, PPC, social media, content marketing, and web development. Webgrat builds custom strategies that deliver measurable ROI."
        canonical="https://webgrat.com/services"
      />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg}></div>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <ScrollReveal delay={0} className={styles.heroBadgeWrap}>
              <Badge>What We Offer</Badge>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h1 className={styles.heroH1}>
              Digital Marketing &amp; AI Solutions That Drive{' '}
                <span className={styles.heroAccent}>Real Growth</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p className={styles.heroSub}>We combine artificial intelligence, performance marketing, and web expertise to build a complete digital growth engine for your business.</p>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <Button variant="primary" to="/contact">Get a Free Strategy Session</Button>
            </ScrollReveal>
          </div>
          <div className={styles.heroVisual}>
            <ServicesHeroVisual />
          </div>
        </div>
      </section>

      {/* Individual Services */}
      <section style={{ backgroundColor: 'var(--color-surface)', paddingTop: '56px', paddingBottom: '20px' }}>
        <div className="container">
          <div className={styles.detailGrid}>

             {/* Content */}
             <ScrollReveal>
              <div id="content" className={styles.detailCard}>
                <div className={styles.detailCardBadge}>Copy &amp; Strategy</div>
                <h3 className={styles.detailCardTitle}>Content &amp; Performance Marketing</h3>
                <h4 className={styles.detailCardSubhead}>What's included:</h4>
                <ul className={styles.includedList}>
                  <li>Holistic content strategy roadmap</li>
                  <li>SEO-optimised blog writing</li>
                  <li>High-converting landing pages</li>
                  <li>Automated email campaigns</li>
                  <li>Valuable lead magnets formulation</li>
                </ul>
                <h4 className={styles.detailCardSubhead}>Our Process:</h4>
                <div className={styles.processFlow}>
                  Research <span className={styles.processArrow}>&rarr;</span>
                  Plan <span className={styles.processArrow}>&rarr;</span>
                  Create <span className={styles.processArrow}>&rarr;</span>
                  Distribute <span className={styles.processArrow}>&rarr;</span>
                  Measure
                </div>
                <div className={styles.detailCardFooter}>
                  <Button variant="secondary" to="/contact">Get content strategy</Button>
                </div>
              </div>
            </ScrollReveal>

            {/* PPC */}
            <ScrollReveal>
              <div id="ppc" className={styles.detailCard}>
                <div className={styles.detailCardBadge}>Paid Media</div>
                <h3 className={styles.detailCardTitle}>Pay-Per-Click Advertising (PPC)</h3>
                <h4 className={styles.detailCardSubhead}>What's included:</h4>
                <ul className={styles.includedList}>
                  <li>Comprehensive campaign strategy</li>
                  <li>Google Ads setup and management</li>
                  <li>Meta Ads (Facebook &amp; Instagram) management</li>
                  <li>Continuous A/B testing logic</li>
                  <li>Full conversion tracking setup</li>
                </ul>
                <h4 className={styles.detailCardSubhead}>Our Process:</h4>
                <div className={styles.processFlow}>
                  Research <span className={styles.processArrow}>&rarr;</span>
                  Build <span className={styles.processArrow}>&rarr;</span>
                  Launch <span className={styles.processArrow}>&rarr;</span>
                  Optimise <span className={styles.processArrow}>&rarr;</span>
                  Scale
                </div>
                <div className={styles.detailCardFooter}>
                  <Button variant="secondary" to="/contact">Start your PPC campaign</Button>
                </div>
              </div>
            </ScrollReveal>

            {/* Social Media */}
            <ScrollReveal delay={100}>
              <div id="social-media" className={styles.detailCard}>
                <div className={styles.detailCardBadge}>Community</div>
                <h3 className={styles.detailCardTitle}>Social Media Marketing</h3>
                <h4 className={styles.detailCardSubhead}>What's included:</h4>
                <ul className={styles.includedList}>
                  <li>High-quality post and video creation</li>
                  <li>Deep-dive analytics reporting</li>
                  <li>Competitor analysis and benchmarking</li>
                  <li>Platform-specific optimization (Instagram, LinkedIn, etc.)</li>
                  <li>Retargeting and remarketing campaigns</li>
                  <li>Conversion-focused campaign planning</li>
                </ul>
                <h4 className={styles.detailCardSubhead}>Our Process:</h4>
                <div className={styles.processFlow}>
                  Audit <span className={styles.processArrow}>&rarr;</span>
                  Strategy <span className={styles.processArrow}>&rarr;</span>
                  Create <span className={styles.processArrow}>&rarr;</span>
                  Publish <span className={styles.processArrow}>&rarr;</span>
                  Analyse
                </div>
                <div className={styles.detailCardFooter}>
                  <Button variant="secondary" to="/contact">Grow your social presence</Button>
                </div>
              </div>
            </ScrollReveal>

            {/* Web */}
            <ScrollReveal delay={100}>
              <div id="web" className={styles.detailCard}>
                <div className={styles.detailCardBadge}>Development</div>
                <h3 className={styles.detailCardTitle}>Web Design &amp; Development</h3>
                <h4 className={styles.detailCardSubhead}>What's included:</h4>
                <ul className={styles.includedList}>
                  <li>User-centric UX/UI design</li>
                 <li>Mobile-first responsive design across all devices</li>
                  <li>Aggressive performance optimisation</li>
                  <li>SEO-ready structural architecture</li>
                  <li>Ongoing technical support</li>
                  <li>Secure, scalable backend with future-ready integrations</li>
                </ul>
                <h4 className={styles.detailCardSubhead}>Our Process:</h4>
                <div className={styles.processFlow}>
                  Discovery <span className={styles.processArrow}>&rarr;</span>
                  Design <span className={styles.processArrow}>&rarr;</span>
                  Develop <span className={styles.processArrow}>&rarr;</span>
                  Test <span className={styles.processArrow}>&rarr;</span>
                  Launch
                </div>
                <div className={styles.detailCardFooter}>
                  <Button variant="secondary" to="/contact">Start your web project</Button>
                </div>
              </div>
            </ScrollReveal>

            {/* Social Media Audit */}
            <ScrollReveal>
              <div id="social-media-audit" className={styles.detailCard}>
                <div className={styles.detailCardBadge}>Audit &amp; Insights</div>
                <h3 className={styles.detailCardTitle}>Social Media Audit</h3>
                <h4 className={styles.detailCardSubhead}>What's included:</h4>
                <ul className={styles.includedList}>
                  <li>Identify what's silently hurting your growth</li>
                  <li>Deep analysis of content, engagement, and audience behavior</li>
                  <li>Profile optimization to improve first impressions</li>
                  <li>Competitor insights to uncover missed opportunities</li>
                  <li>Actionable strategy to boost reach, leads, and conversions</li>
                </ul>
                <h4 className={styles.detailCardSubhead}>Our Process:</h4>
                <div className={styles.processFlow}>
                  Analyse <span className={styles.processArrow}>&rarr;</span>
                  Audit <span className={styles.processArrow}>&rarr;</span>
                  Improve <span className={styles.processArrow}>&rarr;</span>
                  Plan <span className={styles.processArrow}>&rarr;</span>
                  Execute
                </div>
                <div className={styles.detailCardFooter}>
                  <Button variant="secondary" to="/contact">Analyse My Social Media</Button>
                </div>
              </div>
            </ScrollReveal>

            {/* Ad Shoot */}
            <ScrollReveal delay={100}>
              <div id="ad-shoot" className={styles.detailCard}>
                <div className={styles.detailCardBadge}>Creative Production</div>
                <h3 className={styles.detailCardTitle}>Ad Shoot</h3>
                <h4 className={styles.detailCardSubhead}>What's included:</h4>
                <ul className={styles.includedList}>
                  <li>High-quality drone shots that instantly grab attention</li>
                  <li>Scroll-stopping poster designs that elevate your brand</li>
                  <li>Professional video editing for ads that actually convert</li>
                  <li>Consistent brand style across all creatives</li>
                  <li>End-to-end creative production tailored for your campaigns</li>
                </ul>
                <h4 className={styles.detailCardSubhead}>Our Process:</h4>
                <div className={styles.processFlow}>
                  Ideate <span className={styles.processArrow}>&rarr;</span>
                  Shoot <span className={styles.processArrow}>&rarr;</span>
                  Design <span className={styles.processArrow}>&rarr;</span>
                  Edit <span className={styles.processArrow}>&rarr;</span>
                  Publish
                </div>
                <div className={styles.detailCardFooter}>
                  <Button variant="secondary" to="/contact">Shoot High-Converting Ads</Button>
                </div>
              </div>
            </ScrollReveal>

             {/* AI Automation */}
            <ScrollReveal>
              <div id="ai-automation" className={styles.detailCard}>
                <div className={styles.detailCardBadge}>AI &amp; Automation</div>
                <h3 className={styles.detailCardTitle}>AI Automation &amp; Workflow Solutions</h3>
                <h4 className={styles.detailCardSubhead}>What's included:</h4>
                <ul className={styles.includedList}>
                  <li>Business process audit and consultation</li>
                  <li>Workflow mapping and optimization</li>
                  <li>Automation build (n8n, Zapier, or custom scripts)</li>
                  <li>Testing and continuous deployment</li>
                  <li>Ongoing maintenance and support</li>
                </ul>
                <h4 className={styles.detailCardSubhead}>Our Process:</h4>
                <div className={styles.processFlow}>
                  Discover <span className={styles.processArrow}>&rarr;</span>
                  Map <span className={styles.processArrow}>&rarr;</span>
                  Build <span className={styles.processArrow}>&rarr;</span>
                  Test <span className={styles.processArrow}>&rarr;</span>
                  Launch <span className={styles.processArrow}>&rarr;</span>
                  Optimise
                </div>
                <div className={styles.detailCardFooter}>
                  <Button variant="secondary" to="/contact">Book automation consultation</Button>
                </div>
              </div>
            </ScrollReveal>

            {/* SEO */}
            <ScrollReveal delay={100}>
              <div id="seo" className={styles.detailCard}>
                <div className={styles.detailCardBadge}>Organic Growth</div>
                <h3 className={styles.detailCardTitle}>Search Engine Optimisation (SEO)</h3>
                <h4 className={styles.detailCardSubhead}>What's included:</h4>
                <ul className={styles.includedList}>
                  <li>Comprehensive technical SEO audit</li>
                  <li>In-depth keyword research and mapping</li>
                  <li>On-page website optimisation</li>
                  <li>Strategic content planning</li>
                  <li>Authority link building campaigns</li>
                  <li>Monthly performance reporting</li>
                </ul>
                <h4 className={styles.detailCardSubhead}>Our Process:</h4>
                <div className={styles.processFlow}>
                  Audit <span className={styles.processArrow}>&rarr;</span>
                  Strategy <span className={styles.processArrow}>&rarr;</span>
                  Implement <span className={styles.processArrow}>&rarr;</span>
                  Monitor <span className={styles.processArrow}>&rarr;</span>
                  Report
                </div>
                <div className={styles.detailCardFooter}>
                  <Button variant="secondary" to="/contact">Get free SEO audit</Button>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className={styles.approach}>
        <div className="container">
          <ScrollReveal>
            <SectionHeader title="Technology Meets Strategy" className={styles.approachHeader} />
            <p>At Webgrat, we believe that the best results come from combining cutting-edge technology with proven marketing principles. Artificial intelligence gives us speed and scale, but human strategy gives us direction and resonance.</p>
            <p>Every tool we use, every workflow we automate, and every campaign we launch is designed to solve a specific business problem. We don't deploy technology for the sake of it; we deploy it to make you more money, save you more time, and build a stronger online presence.</p>
            {/* <p>Whether you're an ambitious startup or an established enterprise, our approach remains the same: radical transparency, data-driven decisions, and a relentless focus on ROI.</p> */}
          </ScrollReveal>
        </div>
      </section>

      {/* Industries */}
      <section style={{ padding: '32px 0' }}>
        <div className="container">
          <ScrollReveal>
            <div className={styles.industriesHeader}>
              <Badge className={styles.industriesBadge}>Expertise</Badge>
              <h2 className={styles.industriesTitle}>Where We Create Results</h2>
            </div>
            <div className={styles.industryPills}>
              <div className={styles.industryPill}>Real Estate</div>    
              <div className={styles.industryPill}>Healthcare</div>  
              <div className={styles.industryPill}>Astrology</div>
              <div className={styles.industryPill}>Education</div>
              <div className={styles.industryPill}>Manufacturing</div>
              <div className={styles.industryPill}>E-commerce</div>
              <div className={styles.industryPill}>SaaS & Tech</div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
