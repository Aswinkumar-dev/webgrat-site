import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { supabase } from '../lib/supabase'
import { endpoints } from '../lib/api'

const AuthContext = createContext(null)

// Thrown by signIn when Supabase authenticates the user but the profile
// row's role is still 'pending'. AdminLogin catches it and shows the
// "not an authenticated user" message right on the sign-in page instead
// of letting the app route forward.
export class PendingApprovalError extends Error {
  constructor(message = 'You are not an authenticated user.') {
    super(message)
    this.name = 'PendingApprovalError'
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  // Two stages of loading:
  //   sessionLoading: Supabase has not yet told us whether a session exists.
  //   profileLoading: a session exists but we haven't finished fetching /me.
  // isAuthenticated only flips true once both are done AND the profile is
  // approved, so no consumer of the context can see a half-authenticated
  // state and navigate into an admin route.
  const [sessionLoading, setSessionLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)

  // Guards state updates from stale fetches: incremented every time the
  // session changes or another loadProfile call starts. Old responses
  // still return their own result to whoever awaited them — only the
  // setState side-effects are skipped when a newer fetch has overtaken.
  const fetchGen = useRef(0)

  // Tracks the currently-loaded user id so we can distinguish real
  // identity changes (sign-in / sign-out / different user) from
  // Supabase's noisy tab-focus events (TOKEN_REFRESHED, INITIAL_SESSION,
  // and even SIGNED_IN fired on every tab-refocus in supabase-js v2).
  // Without this guard, coming back to the tab would kick off another
  // /me fetch → profileLoading → ProtectedRoute "Loading…" flash, and
  // any transient null-session would sign the user out entirely.
  const currentUserIdRef = useRef(null)

  const loadProfile = useCallback(async () => {
    const gen = ++fetchGen.current
    setProfileLoading(true)
    try {
      // Guard against a silently-hanging backend: if /me takes more than
      // 10s we treat it as a failure instead of leaving signIn pending
      // forever (which is what bricks the "Signing in…" button).
      const me = await Promise.race([
        endpoints.me(),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(Object.assign(new Error('Profile lookup timed out'), { status: 0 })),
            10_000
          )
        ),
      ])
      if (gen === fetchGen.current) {
        setProfile(me ?? null)
      }
      return me ?? null
    } catch (err) {
      if (gen === fetchGen.current) {
        setProfile(null)
      }
      // Surface 4xx/5xx to the caller so signIn can treat a 404/500 as
      // "account is not active" instead of silently letting the user in.
      throw err
    } finally {
      if (gen === fetchGen.current) setProfileLoading(false)
    }
  }, [])

  const clearProfile = useCallback(() => {
    ++fetchGen.current
    setProfile(null)
    setProfileLoading(false)
  }, [])

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return
      const s = data.session ?? null
      setSession(s)
      if (s) {
        currentUserIdRef.current = s.user?.id ?? null
        // Prime the profile so ProtectedRoute doesn't briefly let a
        // restored pending session through.
        try {
          await loadProfile()
        } catch {
          /* handled inside loadProfile */
        }
      }
      setSessionLoading(false)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        const newUserId = newSession?.user?.id ?? null
        const prevUserId = currentUserIdRef.current

        // Hard sign-out: only act on explicit SIGNED_OUT. A transient
        // null-session during a token refresh must NOT log the user
        // out, which is what was happening on tab switch.
        if (event === 'SIGNED_OUT') {
          currentUserIdRef.current = null
          setSession(null)
          clearProfile()
          return
        }

        // Ignore noisy events that don't represent an identity change.
        // supabase-js v2 fires SIGNED_IN / TOKEN_REFRESHED / INITIAL_SESSION
        // on every tab-refocus; if the user id didn't change, there's
        // nothing to do — keep the existing profile and don't flip
        // `profileLoading` (which would flash ProtectedRoute's loader).
        if (newUserId && newUserId === prevUserId) {
          // Still refresh the session object so the access token stays
          // current for future API calls.
          setSession(newSession)
          return
        }

        // Real identity change (initial sign-in, user swap, etc.).
        currentUserIdRef.current = newUserId
        setSession(newSession ?? null)
        if (newSession) {
          try {
            await loadProfile()
          } catch {
            /* handled inside loadProfile */
          }
        } else {
          clearProfile()
        }
      }
    )

    return () => {
      mounted = false
      subscription?.subscription?.unsubscribe?.()
    }
  }, [loadProfile, clearProfile])

  const signIn = useCallback(
    async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      // profiles.role is the source of truth for access. Resolve it
      // before returning so callers can decide whether to navigate.
      let me = null
      try {
        me = await loadProfile()
      } catch {
        // Any lookup failure (missing row, server error, network, timeout)
        // → treat as "account is not active" rather than letting them
        // through. Sign the Supabase session out so onAuthStateChange
        // clears the stale state.
        try {
          await supabase.auth.signOut()
        } catch {
          /* ignore */
        }
        throw new PendingApprovalError()
      }

      if (!me || me.role === 'pending') {
        try {
          await supabase.auth.signOut()
        } catch {
          /* ignore */
        }
        throw new PendingApprovalError()
      }

      return data
    },
    [loadProfile]
  )

  const signUp = useCallback(async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: fullName ? { full_name: fullName } : undefined,
      },
    })
    if (error) throw error

    // A brand new account is 'pending' in the DB and can do nothing
    // useful. If Supabase returned a session (email confirmation off),
    // sign the user out so the UI stays on the sign-in screen until the
    // super admin promotes the profile to 'admin' directly in the DB.
    if (data?.session) {
      await supabase.auth.signOut()
    }
    return data
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }, [])

  const value = useMemo(() => {
    const approved = !!profile && profile.role !== 'pending'
    return {
      session,
      user: session?.user ?? null,
      profile,
      loading: sessionLoading || (!!session && profileLoading),
      // Only "authenticated" when the profile has been resolved AND the
      // user is not pending. This prevents the brief flash where
      // ProtectedRoute would otherwise let a just-signed-in pending user
      // through while /me is still loading.
      isAuthenticated: !!session?.user && approved,
      signIn,
      signUp,
      signOut,
    }
  }, [session, profile, sessionLoading, profileLoading, signIn, signUp, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return ctx
}
