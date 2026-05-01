import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Footer.module.css'
import Button from '../ui/Button'
import logoSrc from '../../assets/Logo.png'
import fbIcon from '../../assets/facebook.png'
import igIcon from '../../assets/insta.png'
import inIcon from '../../assets/linkedin.png'
import thIcon from '../../assets/threads.png'
import xIcon from '../../assets/X.png'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          {/* Column 1 - Brand */}
          <div className={styles.column}>
            <Link to="/" className={styles.brand}>
              <span className={styles.logoText}>Webgrat</span>
            </Link>
            <p className={styles.tagline}>Work smarter. Grow faster. Scale efficiently.</p>
            <div className={styles.social}>
              <a href="https://www.linkedin.com/company/webgrat" aria-label="LinkedIn" target="_blank">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="https://www.instagram.com/webgrat_/" aria-label="Instagram" target="_blank">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="https://www.facebook.com/webgratpage" aria-label="Facebook" target="_blank">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.49 0-1.956.93-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" />
                </svg>
              </a>
              <a href="https://x.com/webgrat" aria-label="X" target="_blank">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.733-8.835L2.063 2.25h6.988l4.254 5.622 4.939-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
                </svg>
              </a>
              <a href="https://www.threads.com/@webgrat" aria-label="Threads" target="_blank">
                <img
                  src={thIcon}
                  alt="Threads"
                  width="24"
                  height="24"
                  style={{ filter: 'brightness(0) saturate(100%) invert(79%) sepia(57%) saturate(500%) hue-rotate(95deg) brightness(101%) contrast(101%)', display: 'block' }}
                />
              </a>
            </div>
          </div>

          {/* Column 2 - Services */}
          <div className={styles.column}>
            <h4 className={styles.label}>Services</h4>
            <div className={styles.linkList}>
              <Link to="/services#social-media" className={styles.link}>Social Media Marketing</Link>
              <Link to="/services#content" className={styles.link}>Content Marketing</Link>
              <Link to="/services#web" className={styles.link}>Web Design</Link>
              <Link to="/services#ppc" className={styles.link}>PPC Advertising</Link>
              <Link to="/services#seo" className={styles.link}>SEO</Link>
              <Link to="/services#ai-automation" className={styles.link}>AI Automation</Link>
            </div>
          </div>

          {/* Column 3 - Company */}
          <div className={styles.column}>
            <h4 className={styles.label}>Company</h4>
            <div className={styles.linkList}>
              <Link to="/about" className={styles.link}>About Us</Link>
              <Link to="/case-studies" className={styles.link}>Portfolio</Link>
              <Link to="/blog" className={styles.link}>Blog</Link>
              <Link to="/contact" className={styles.link}>Contact</Link>
              <Link to="/faq" className={styles.link}>FAQ</Link>
            </div>
          </div>

          {/* Column 4 - Get In Touch */}
          <div className={styles.column}>
            <h4 className={styles.label}>Get In Touch</h4>
            <div className={styles.linkList}>
              <a href="mailto:webgrat.com@gmail.com" className={styles.contactText}>webgrat.com@gmail.com</a>
              {/* <p className={styles.contactText} style={{ opacity: 0.7 }}>We reply within 24 hours</p> */}
              {/* <div style={{ marginTop: '8px' }}>
                <Button variant="primary" size="small" to="/contact">Book Free Consultation</Button>
              </div> */}
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <div>&copy; 2023 Webgrat. All rights reserved.</div>
          <div className={styles.legalLinks}>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
