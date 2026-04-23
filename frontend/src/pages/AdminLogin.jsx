import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import SEOHead from '../seo/SEOHead'
import { useAuth, PendingApprovalError } from '../context/AuthContext'
import styles from './AdminLogin.module.css'

const MODES = {
  SIGN_IN: 'signIn',
  SIGN_UP: 'signUp',
}

const PASSWORD_MIN = 8
const PASSWORD_MAX = 20
const SPECIAL_CHAR_RE = /[^A-Za-z0-9]/
const UPPERCASE_RE = /[A-Z]/
const DIGIT_RE = /[0-9]/g

// Applied on sign-up: at least one special char, one uppercase letter,
// at least two digits, length between 8 and 20.
function validateSignUpPassword(pw) {
  if (pw.length < PASSWORD_MIN) {
    return `Password must be at least ${PASSWORD_MIN} characters.`
  }
  if (pw.length > PASSWORD_MAX) {
    return `Password must be at most ${PASSWORD_MAX} characters.`
  }
  if (!UPPERCASE_RE.test(pw)) {
    return 'Password must contain at least one uppercase letter.'
  }
  if (!SPECIAL_CHAR_RE.test(pw)) {
    return 'Password must contain at least one special character.'
  }
  const digitCount = (pw.match(DIGIT_RE) || []).length
  if (digitCount < 2) {
    return 'Password must contain at least 2 numbers.'
  }
  return null
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

  // If Supabase is still restoring a persisted session (or resolving the
  // profile for one), don't render the form yet — otherwise the user
  // sees an empty sign-in form, starts typing, and then gets yanked
  // away to /admin/blogs the moment profile resolution finishes.
  //
  // But skip the loader while `submitting` is true: during a live
  // sign-in the profile briefly re-loads (flipping global `loading` on)
  // and we don't want to replace the form / "Signing in…" button with
  // a loader screen mid-submit.
  if (!submitting && (loading || isAuthenticated)) {
    return (
      <section className={styles.page}>
        <div className="container">
          <div
            style={{
              minHeight: '60vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-secondary)',
            }}
          >
            Loading…
          </div>
        </div>
      </section>
    )
  }

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

    if (mode === MODES.SIGN_UP) {
      if (!fullName.trim()) {
        setError('Username is required.')
        return
      }
      const pwError = validateSignUpPassword(password)
      if (pwError) {
        setError(pwError)
        return
      }
    }

    setSubmitting(true)
    try {
      if (mode === MODES.SIGN_UP) {
        await signUp(email, password, fullName.trim())
        // New accounts are always created with role = 'pending' in the
        // profiles table. The super admin has to promote the row to
        // 'admin' in the DB before the user can actually sign in, so we
        // always send them back to the Sign In tab with an explainer.
        setInfo(
          "Account created. Your access is pending super admin approval — you'll be able to sign in once your account is activated."
        )
        setMode(MODES.SIGN_IN)
        setPassword('')
      } else {
        await signIn(email, password)
        navigate(redirectTo, { replace: true })
      }
    } catch (err) {
      if (err instanceof PendingApprovalError) {
        setError(err.message)
      } else {
        setError(err?.message || 'Something went wrong. Please try again.')
      }
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
                      Username
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      className={styles.input}
                      placeholder="Username"
                      autoComplete="name"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                )}

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={styles.input}
                    placeholder="Email"
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
                      placeholder="At least 8 characters"
                      autoComplete={isSignUp ? 'new-password' : 'current-password'}
                      required
                      minLength={isSignUp ? PASSWORD_MIN : 1}
                      maxLength={isSignUp ? PASSWORD_MAX : undefined}
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
                  {isSignUp && (
                    <p className={styles.hint}>
                      8–20 characters, must include an uppercase letter, a special character, and at least 2 numbers.
                    </p>
                  )}
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
                  <li>Image uploads to a Bucket Storage</li>
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
