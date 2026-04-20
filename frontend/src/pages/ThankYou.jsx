import React from 'react'
import SEOHead from '../seo/SEOHead'
import ScrollReveal from '../components/ui/ScrollReveal'
import Button from '../components/ui/Button'
import styles from './ThankYou.module.css'

export default function ThankYou() {
  return (
    <>
      <SEOHead 
        title="Message Received | Webgrat"
        description="Thank you for contacting Webgrat. We have received your message and will be in touch shortly."
      />

      <section className={styles.wrapper}>
        <div className="container">
          <ScrollReveal>
            <div className={styles.content}>
              <div className={styles.icon}>
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h1 className={styles.title}>Message Received</h1>
              <p className={styles.text}>Thank you for reaching out to Webgrat. Our team is reviewing your enquiry and will get back to you within 1 business day.</p>
              <Button variant="secondary" to="/">Return to Homepage</Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
