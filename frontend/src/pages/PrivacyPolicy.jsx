import React from 'react'
import SEOHead from '../seo/SEOHead'
import ScrollReveal from '../components/ui/ScrollReveal'
import styles from './PrivacyPolicy.module.css'

const policyPoints = [
  'We collect basic personal information such as name, email, phone number, and business details when you contact or use our services.',
  'We collect information only when you voluntarily provide it (e.g., filling forms, contacting us, or requesting services).',
  'The type of data collected depends on how you interact with our website and services.',
  'We use collected data for customer support and responding to inquiries.',
  'We use collected data for improving user experience.',
  'We use collected data for internal analytics and performance tracking.',
  'We may send you marketing or promotional communications, but you can opt out anytime.',
  'We do not collect sensitive personal information.',
  'We do not collect data from third parties.',
  'We may share data only when necessary (e.g., legal requirements or service operations).',
  'You have the right to access, update, or request deletion of your personal data.',
  'You can contact us anytime regarding your privacy concerns.',
  'Users are responsible for providing accurate and up-to-date information.',
  'Our services are not intended for minors, and we do not knowingly collect data from them.',
  'We may update this privacy policy from time to time, and changes will be reflected on this page.',
  'We may contact you regarding updates, service-related information, or important notices.',
  'You can choose not to provide certain information, but it may limit your ability to use some services.',
  'We do not misuse or sell your personal information.',
  'Continued use of our website means you agree to our privacy practices.'
]

export default function PrivacyPolicy() {
  return (
    <>
      <SEOHead
        title="Privacy Policy | Webgrat"
        description="Learn how Webgrat collects, uses, and protects your personal information."
        canonical="https://webgrat.com/privacy-policy"
      />

      <section className={styles.hero}>
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroContent}>
            <ScrollReveal>
              {/* <p className={styles.eyebrow}>Legal</p> */}
              <h1 className={styles.title}>Privacy Policy</h1>
              <p className={styles.subtitle}>
                Your trust matters to us. This page explains how we handle your data with transparency, care, and responsibility.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className="container">
          <ScrollReveal>
            <div className={styles.policyCard}>
              <p className={styles.updatedAt}>Last updated: April 2, 2026</p>
              <ol className={styles.policyList}>
                {policyPoints.map((point) => (
                  <li key={point} className={styles.policyItem}>
                    {point}
                  </li>
                ))}
              </ol>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
