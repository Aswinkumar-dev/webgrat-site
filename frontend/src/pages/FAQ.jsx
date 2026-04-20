import React, { useState } from 'react'
import SEOHead from '../seo/SEOHead'
import ScrollReveal from '../components/ui/ScrollReveal'
import Button from '../components/ui/Button'
import FAQAccordion from '../components/ui/FAQAccordion'
import styles from './FAQ.module.css'

const FAQ_DATA = {
  'General': [
    { q: "What is digital marketing?", a: "Digital marketing covers all online channels businesses use to reach customers: SEO, paid ads, social media, email, content, and more. At Webgrat, we combine all of these with AI to maximise impact." },
    { q: "How much should a business spend on digital marketing?", a: "As a guide, businesses typically allocate 7–15% of revenue to marketing. We'll help you allocate it where it gets the highest return." },
    { q: "How long before I see results?", a: "PPC: days. SEO: 3–6 months. AI automation: immediate. Social media: 2–3 months for meaningful growth." },
    { q: "What makes Webgrat different?", a: "Our AI-first approach. We integrate automation and data intelligence into everything, not as an add-on but as a foundation." },
    { q: "Do you work with small businesses?", a: "Absolutely. Many of our best results have come from working with small businesses who needed to punch above their weight." }
  ],
  'SEO': [
    { q: "How long does SEO take?", a: "Typically 3–6 months for meaningful movement on competitive terms. Less competitive niches can move faster." },
    { q: "What is on-page vs off-page SEO?", a: "On-page: optimising what's on your website (content, structure, speed). Off-page: building authority through backlinks and mentions." },
    { q: "Do you guarantee Page 1 rankings?", a: "No agency can ethically guarantee rankings. We guarantee a transparent strategy, proven execution, and measurable progress." },
    { q: "Do I need SEO if I'm already running paid ads?", a: "Yes. Paid ads stop working the moment you stop paying. SEO builds compounding, long-term traffic you own." },
    { q: "What SEO tools do you use?", a: "We use Ahrefs, SEMrush, Google Search Console, Screaming Frog, and several AI-powered analysis tools." }
  ],
  'PPC & Ads': [
    { q: "What is a good ROAS for Google Ads?", a: "It depends on your margins, but 3–5x is a healthy benchmark for most e-commerce businesses. We optimise toward your specific target." },
    { q: "What is the minimum PPC budget?", a: "We recommend a minimum of £500–£1,000/month in ad spend to generate enough data for meaningful optimisation." },
    { q: "Do you manage Facebook/Meta ads?", a: "Yes, we manage Google Ads, Meta Ads (Facebook + Instagram), and LinkedIn Ads." },
    { q: "How do you track conversions?", a: "We set up Google Tag Manager, GA4, and platform-native pixels to track every meaningful action from click to purchase." },
    { q: "How long before my PPC campaign is optimised?", a: "The first 4–6 weeks are a learning phase. Meaningful optimisation typically happens in months 2–3." }
  ],
  'AI & Automation': [
    { q: "What kinds of tasks can be automated?", a: "Lead capture and nurturing, email sequences, appointment booking, reporting, social posting, invoice processing, CRM updates, and much more." },
    { q: "Do I need technical knowledge?", a: "No. We handle the entire setup. We explain what we're building and why, but you don't need to know how to code." },
    { q: "What tools do you use for automation?", a: "We primarily work with Make (Integromat), Zapier, n8n, and custom-built workflows depending on complexity." },
    { q: "How long does it take to set up?", a: "Simple workflows: 1–2 weeks. Complex multi-step automations: 4–6 weeks." },
    { q: "Will automation replace my staff?", a: "No. It removes the repetitive, low-value tasks so your team can focus on creative, strategic, and relationship work." }
  ],
  'Working With Us': [
    { q: "How do I get started?", a: "Book a free consultation at /contact. We'll discuss your goals, current situation, and what makes sense." },
    { q: "Do you require contracts?", a: "No long-term contracts. Month-to-month on all standard plans." },
    { q: "How will I be kept informed?", a: "Regular reports (weekly or monthly depending on your plan), shared dashboards, and direct Slack or email access to your account manager." },
    { q: "Can I change services later?", a: "Yes, you can add, remove, or swap services with 30 days' notice." },
    { q: "What does onboarding look like?", a: "Week 1: strategy call + audit. Week 2: plan presented. Week 3: execution begins." }
  ]
}

const CATEGORIES = ['General', 'SEO', 'PPC & Ads', 'AI & Automation', 'Working With Us']

export default function FAQ() {
  const [activeTab, setActiveTab] = useState('General')

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": Object.values(FAQ_DATA).flat().map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  }

  return (
    <>
      <SEOHead 
        title="Digital Marketing FAQs | Webgrat"
        description="Get answers to common questions about digital marketing, SEO, PPC, AI automation, and working with Webgrat."
        canonical="https://webgrat.com/faq"
        schema={schema}
      />

      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <ScrollReveal>
              <h1 className={styles.heroH1}>Frequently Asked Questions</h1>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <ScrollReveal>
            <div className={styles.categoryTabs}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`${styles.tabBtn} ${activeTab === cat ? styles.active : ''}`}
                  onClick={() => setActiveTab(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className={styles.faqContainer}>
              <FAQAccordion questions={FAQ_DATA[activeTab]} />
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ marginBottom: '24px' }}>Still have a question?</h3>
              <Button variant="primary" to="/contact">Contact our team</Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
