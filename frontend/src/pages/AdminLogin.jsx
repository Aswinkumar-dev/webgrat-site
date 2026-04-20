import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import SEOHead from '../seo/SEOHead'
import { useAuth } from '../context/AuthContext'
import styles from './AdminLogin.module.css'

const MODES = {
  SIGN_IN: 'signIn',
  SIGN_UP: 'signUp',
}

export default function AdminLogin() {
  const { signIn, signUp, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || '/admin/blogs'

  const [mode, setMode] = useState(MODES.SIGN_IN)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(redirectTo, { replace: true })
    }
  }, [loading, isAuthenticated, navigate, redirectTo])

  const switchMode = (next) => {
    setMode(next)
    setError('')
    setInfo('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')

    if (!email || !password) {
      setError('Email and password are required.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setSubmitting(true)
    try {
      if (mode === MODES.SIGN_UP) {
        const data = await signUp(email, password, fullName.trim() || undefined)
        if (data?.session) {
          navigate(redirectTo, { replace: true })
        } else {
          setInfo(
            'Account created. Please check your email to confirm your address before signing in.'
          )
          setMode(MODES.SIGN_IN)
        }
      } else {
        await signIn(email, password)
        navigate(redirectTo, { replace: true })
      }
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const isSignUp = mode === MODES.SIGN_UP

  return (
    <>
      <SEOHead
        title={`${isSignUp ? 'Create Account' : 'Sign In'} — Webgrat Admin`}
        description="Webgrat admin panel. Sign in to manage blog posts and content."
        canonical="https://webgrat.com/admin/login"
        noindex
      />

      <section className={styles.page}>
        <div className="container">
          <div className={styles.shell}>
            <div className={styles.card}>
              <div className={styles.header}>
                <span className={styles.eyebrow}>Webgrat Admin</span>
                <h1 className={styles.title}>
                  {isSignUp ? 'Create your account' : 'Welcome back'}
                </h1>
                <p className={styles.subtitle}>
                  {isSignUp
                    ? 'Spin up a new admin account to start publishing.'
                    : 'Sign in to manage blog posts and content.'}
                </p>
              </div>

              <div className={styles.tabs} role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={!isSignUp}
                  className={`${styles.tab} ${!isSignUp ? styles.tabActive : ''}`}
                  onClick={() => switchMode(MODES.SIGN_IN)}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={isSignUp}
                  className={`${styles.tab} ${isSignUp ? styles.tabActive : ''}`}
                  onClick={() => switchMode(MODES.SIGN_UP)}
                >
                  Sign Up
                </button>
              </div>

              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                {isSignUp && (
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="fullName">
                      Full Name <span className={styles.optional}>(optional)</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      className={styles.input}
                      placeholder="Jane Doe"
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                )}

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={styles.input}
                    placeholder="you@webgrat.com"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="password">
                    Password
                  </label>
                  <div className={styles.passwordWrap}>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      className={styles.input}
                      placeholder="At least 6 characters"
                      autoComplete={isSignUp ? 'new-password' : 'current-password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {error && <div className={styles.alertError}>{error}</div>}
                {info && <div className={styles.alertInfo}>{info}</div>}

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={submitting}
                >
                  {submitting
                    ? isSignUp
                      ? 'Creating account…'
                      : 'Signing in…'
                    : isSignUp
                      ? 'Create Account'
                      : 'Sign In'}
                </button>

                <div className={styles.switchRow}>
                  {isSignUp ? (
                    <>
                      Already have an account?{' '}
                      <button
                        type="button"
                        className={styles.linkBtn}
                        onClick={() => switchMode(MODES.SIGN_IN)}
                      >
                        Sign in
                      </button>
                    </>
                  ) : (
                    <>
                      New to Webgrat?{' '}
                      <button
                        type="button"
                        className={styles.linkBtn}
                        onClick={() => switchMode(MODES.SIGN_UP)}
                      >
                        Create an account
                      </button>
                    </>
                  )}
                </div>
              </form>

              <div className={styles.footer}>
                <Link to="/" className={styles.backLink}>
                  ← Back to website
                </Link>
              </div>
            </div>

            <aside className={styles.sidePanel} aria-hidden="true">
              <div className={styles.sideGlow} />
              <div className={styles.sideContent}>
                <span className={styles.sideEyebrow}>YOUR GROWTH MULTIPLIER</span>
                <h2 className={styles.sideTitle}>
                  Publish stories that grow your business.
                </h2>
                <p className={styles.sideText}>
                  The Webgrat admin panel lets you draft, edit, and publish blog posts
                  with rich images and tags — all backed by Supabase.
                </p>
                <ul className={styles.sideList}>
                  <li>Secure JWT-backed sessions</li>
                  <li>Image uploads to Supabase Storage</li>
                  <li>Multi-tag categorization</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
