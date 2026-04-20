import React from 'react'
import SEOHead from '../seo/SEOHead'
import ScrollReveal from '../components/ui/ScrollReveal'
import styles from './TermsAndConditions.module.css'

const termsSections = [
  {
    title: 'Use of Services',
    content:
      'You agree to use our services only for lawful purposes and not misuse or disrupt our platform.'
  },
  {
    title: 'Services Offered',
    content:
      'Webgrat provides digital solutions including website development, AI automation, and digital marketing services.'
  },
  {
    title: 'Payments',
    content:
      'All payments for services must be made as agreed. Failure to pay may result in service suspension.'
  },
  {
    title: 'Intellectual Property',
    content:
      'All content, designs, and materials provided by Webgrat are our property unless otherwise agreed.'
  },
  {
    title: 'Limitation of Liability',
    content:
      'We are not responsible for any indirect or consequential damages arising from the use of our services.'
  },
  {
    title: 'Changes to Terms',
    content:
      'We may update these terms at any time. Continued use of our services means you accept the updated terms.'
  }
]

export default function TermsAndConditions() {
  return (
    <>
      <SEOHead
        title="Terms & Conditions | Webgrat"
        description="Read Webgrat's terms and conditions for using our website and services."
        canonical="https://webgrat.com/terms-and-conditions"
      />

      <section className={styles.hero}>
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroContent}>
            <ScrollReveal>
              {/* <p className={styles.eyebrow}>Legal</p> */}
              <h1 className={styles.title}>Terms &amp; Conditions</h1>
              <p className={styles.subtitle}>
                By using our website and services, you agree to the following terms.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className="container">
          <ScrollReveal>
            <div className={styles.termsCard}>
              <p className={styles.updatedAt}>Last updated: April 2026</p>

              <div className={styles.sectionList}>
                {termsSections.map((section) => (
                  <div key={section.title} className={styles.sectionItem}>
                    <h2 className={styles.sectionTitle}>{section.title}</h2>
                    <p className={styles.sectionText}>{section.content}</p>
                  </div>
                ))}

                <div className={styles.sectionItem}>
                  <h2 className={styles.sectionTitle}>Contact</h2>
                  <p className={styles.sectionText}>
                    For any questions, contact us at:{' '}
                    <a href="mailto:webgrat.com@gmail.com" className={styles.contactLink}>
                      webgrat.com@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
