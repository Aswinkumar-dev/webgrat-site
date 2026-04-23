import React, { useEffect, useRef } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * Hook that intercepts browser "Back" while the user is on an admin
 * (protected) page. Instead of silently navigating away — which left the
 * app stuck on a "Loading…" ProtectedRoute screen — we prompt with
 * `window.confirm('Do you want to log out?')`:
 *   - Confirm → sign out and send them to the sign-in page.
 *   - Cancel  → stay on the current admin page.
 *
 * The trick is to push an extra history entry on mount so the first
 * popstate lands back on the same URL; we then decide what to do.
 */
function useBackLogoutConfirm(active, onConfirm) {
  const onConfirmRef = useRef(onConfirm)
  useEffect(() => {
    onConfirmRef.current = onConfirm
  }, [onConfirm])

  useEffect(() => {
    if (!active) return

    // Guard entry: one extra history state so the browser's first "Back"
    // fires a popstate without actually leaving the admin shell.
    const marker = { __adminGuard: true, t: Date.now() }
    window.history.pushState(marker, '')

    const handlePopState = () => {
      const ok = window.confirm('Do you want to log out?')
      if (ok) {
        onConfirmRef.current?.()
      } else {
        // Re-arm the guard so the next Back press prompts again.
        window.history.pushState({ __adminGuard: true, t: Date.now() }, '')
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [active])
}

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useBackLogoutConfirm(isAuthenticated && !loading, async () => {
    try {
      await signOut()
    } catch {
      /* ignore — we still want to land on the login screen */
    }
    navigate('/admin/login', { replace: true })
  })

  if (loading) {
    return (
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
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return children
}
