import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'
import Button from '../ui/Button'
import logoSrc from '../../assets/logo withoutbg.webp'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Services', to: '/services' },
    { label: 'About', to: '/about' },
    { label: 'Blog', to: '/blog' },
    { label: 'Contact', to: '/contact' }
  ]

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <nav className={`${styles.navbar} ${scrolled && !menuOpen ? styles.scrolled : ''} ${menuOpen ? styles.menuActive : ''}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <img src={logoSrc} alt="Webgrat" className={styles.logoImg} />
          <div className={styles.logoBrand}>
            <span className={styles.logoText}>Webgrat</span>
            <span className={styles.logoSlogan}>YOUR GROWTH MULTIPLIER</span>
          </div>
        </Link>

        <div className={styles.navLinks}>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`${styles.navLink} ${isActive(link.to) ? styles.navLinkActive : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className={styles.navRight}>
          <Button variant="primary" size="small" to="/contact" className={styles.ctaBtn}>Book Free Consultation</Button>
        </div>

        <button
          className={`${styles.mobileMenuBtn} ${menuOpen ? styles.menuOpen : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>
      </div>

      {menuOpen && (
        <div
          className={styles.mobileBackdrop}
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className={`${styles.mobileDrawer} ${menuOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.mobileNavLinks}>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`${styles.mobileNavLink} ${isActive(link.to) ? styles.mobileNavLinkActive : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <Button variant="primary" to="/contact" style={{ width: '100%' }}>Book Free Consultation</Button>
      </div>
    </nav>
  )
}
