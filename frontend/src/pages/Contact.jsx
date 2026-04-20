import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SEOHead from '../seo/SEOHead'
import ScrollReveal from '../components/ui/ScrollReveal'
import Button from '../components/ui/Button'
import { endpoints } from '../lib/api'
import styles from './Contact.module.css'

const EMAIL_PATTERN = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$'

const INITIAL_CONTACT_FORM = {
  name: '',
  email: '',
  phone: '',
  company: '',
  service: '',
  message: '',
}

export default function Contact() {
  const navigate = useNavigate()

  const [contactForm, setContactForm] = useState(INITIAL_CONTACT_FORM)
  const [contactSubmitting, setContactSubmitting] = useState(false)
  const [contactStatus, setContactStatus] = useState(null) // { type: 'success'|'error', message }

  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false)
  const [newsletterStatus, setNewsletterStatus] = useState(null)

  const handleEmailInvalid = (e) => {
    e.target.setCustomValidity('Please enter a valid email address (for example: name@example.com).')
  }

  const clearEmailValidity = (e) => {
    e.target.setCustomValidity('')
  }

  const handleContactChange = (e) => {
    const { name, value } = e.target
    setContactForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (contactSubmitting) return

    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity()
      return
    }

    setContactStatus(null)
    setContactSubmitting(true)

    try {
      const payload = {
        name: contactForm.name.trim(),
        email: contactForm.email.trim(),
        phone: contactForm.phone.trim(),
        company: contactForm.company.trim(),
        service: contactForm.service,
        message: contactForm.message.trim(),
      }

      const response = await endpoints.submitContact(payload)

      if (response?.success === false) {
        setContactStatus({ type: 'error', message: response.message || 'Something went wrong. Please try again.' })
        return
      }

      setContactForm(INITIAL_CONTACT_FORM)
      navigate('/thank-you')
    } catch (error) {
      const message =
        error?.data?.fieldErrors
          ? Object.values(error.data.fieldErrors).join(' ')
          : error?.message || 'Failed to send message. Please try again later.'
      setContactStatus({ type: 'error', message })
    } finally {
      setContactSubmitting(false)
    }
  }

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    if (newsletterSubmitting) return

    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity()
      return
    }

    setNewsletterStatus(null)
    setNewsletterSubmitting(true)

    try {
      const response = await endpoints.subscribeNewsletter(newsletterEmail.trim())

      setNewsletterStatus({
        type: response?.success ? 'success' : 'info',
        message:
          response?.message ||
          (response?.success
            ? 'Subscribed! Check your inbox for a welcome email.'
            : "You're already on our list."),
      })

      if (response?.success) {
        setNewsletterEmail('')
      }
    } catch (error) {
      const message =
        error?.data?.fieldErrors
          ? Object.values(error.data.fieldErrors).join(' ')
          : error?.message || 'Subscription failed. Please try again later.'
      setNewsletterStatus({ type: 'error', message })
    } finally {
      setNewsletterSubmitting(false)
    }
  }

  return (
    <>
      <SEOHead
        title="Contact Webgrat — Book a Free Consultation"
        description="Ready to grow your business with AI and digital marketing? Contact Webgrat for a free strategy consultation. We respond within 24 hours."
        canonical="https://webgrat.com/contact"
      />

      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <ScrollReveal>
              <h1 className={styles.heroH1}>Let’s Engineer Your Next Phase of Growth</h1>
              <p className={styles.heroSub}>Tell us about your business and goals. We'll reply within 1 business day with a personalised assessment — completely free.</p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className={styles.contactSection}>
        <div className="container">
          <ScrollReveal>
            <div className={styles.contactLayout}>
              {/* Form Grid */}
              <div className={styles.formColumn}>
                <form onSubmit={handleSubmit} noValidate={false}>
                  <div className={styles.formGrid}>
                    <div>
                      <label className={styles.label} htmlFor="name">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className={styles.input}
                        required
                        value={contactForm.name}
                        onChange={handleContactChange}
                        disabled={contactSubmitting}
                      />
                    </div>
                    <div>
                      <label className={styles.label} htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className={styles.input}
                        required
                        pattern={EMAIL_PATTERN}
                        title="Please enter a valid email address (for example: name@example.com)."
                        onInvalid={handleEmailInvalid}
                        onInput={clearEmailValidity}
                        value={contactForm.email}
                        onChange={handleContactChange}
                        disabled={contactSubmitting}
                      />
                    </div>
                    <div>
                      <label className={styles.label} htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className={styles.input}
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        maxLength={10}
                        title="Please enter exactly 10 digits"
                        value={contactForm.phone}
                        onChange={handleContactChange}
                        disabled={contactSubmitting}
                      />
                    </div>
                    <div>
                      <label className={styles.label} htmlFor="company">Company Name</label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        className={styles.input}
                        value={contactForm.company}
                        onChange={handleContactChange}
                        disabled={contactSubmitting}
                      />
                    </div>
                    <div className={styles.fullWidth}>
                      <label className={styles.label} htmlFor="service">What are you looking for?</label>
                      <select
                        id="service"
                        name="service"
                        className={styles.select}
                        required
                        value={contactForm.service}
                        onChange={handleContactChange}
                        disabled={contactSubmitting}
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
                      <label className={styles.label} htmlFor="message">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        className={styles.textarea}
                        required
                        value={contactForm.message}
                        onChange={handleContactChange}
                        disabled={contactSubmitting}
                      />
                    </div>
                  </div>

                  {contactStatus && (
                    <div
                      className={`${styles.formStatus} ${
                        contactStatus.type === 'success' ? styles.formStatusSuccess : styles.formStatusError
                      }`}
                      role="status"
                      aria-live="polite"
                    >
                      {contactStatus.message}
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    style={{ width: '100%' }}
                    disabled={contactSubmitting}
                  >
                    {contactSubmitting ? 'Sending…' : 'Send Message'}
                  </Button>
                </form>
              </div>

              {/* Info Column */}
              <div className={styles.infoColumn}>
                <div className={styles.infoCard}>
                  <h3 className={styles.infoTitle}>Contact Details</h3>

                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Email</div>
                    <div className={styles.infoText}>
                      <a href="mailto:webgrat.com@gmail.com" style={{ color: 'inherit' }}>webgrat.com@gmail.com</a>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Phone</div>
                    <div className={styles.infoText}>+91 94988 63084</div>
                    <div className={styles.infoText}>+91 93601 61453</div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Hours</div>
                    <div className={styles.infoText}>Monday–Saturday, 9am–9pm</div>
                  </div>

                  <div className={styles.infoItem} style={{ marginTop: '32px' }}>
                    <div className={styles.infoLabel}>The Webgrat Promise</div>
                    <div className={styles.infoText} style={{ color: 'var(--color-primary)', fontWeight: '500' }}>"We reply to every enquiry within 1 business day"</div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className={styles.newsletterSection}>
        <div className="container">
          <ScrollReveal>
            <div className={styles.newsletter}>
              <h3 className={styles.newsletterH3}>Get weekly digital marketing tips in your inbox</h3>
              <p className={styles.newsletterSub}>
                Practical SEO, ads, automation, and growth insights from the Webgrat team.
              </p>
              <form className={styles.newsletterForm} onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  id="newsletterEmail"
                  name="newsletterEmail"
                  placeholder="Enter your email address"
                  className={styles.newsletterInput}
                  required
                  pattern={EMAIL_PATTERN}
                  title="Please enter a valid email address (for example: name@example.com)."
                  onInvalid={handleEmailInvalid}
                  onInput={clearEmailValidity}
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  disabled={newsletterSubmitting}
                />
                <Button type="submit" variant="primary" disabled={newsletterSubmitting}>
                  {newsletterSubmitting ? 'Subscribing…' : 'Subscribe'}
                </Button>
              </form>
              {newsletterStatus && (
                <div
                  className={`${styles.newsletterStatus} ${
                    newsletterStatus.type === 'success'
                      ? styles.newsletterStatusSuccess
                      : newsletterStatus.type === 'error'
                      ? styles.newsletterStatusError
                      : styles.newsletterStatusInfo
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  {newsletterStatus.message}
                </div>
              )}
              <div className={styles.newsletterNote}>No spam. Unsubscribe anytime.</div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
