import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL ?? '').trim()
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim()

const PLACEHOLDER_VALUES = new Set([
  '',
  'replace-with-your-supabase-anon-key',
  'your-anon-key',
])

if (!supabaseUrl || PLACEHOLDER_VALUES.has(supabaseAnonKey)) {
  // eslint-disable-next-line no-console
  console.error(
    '[Supabase] Missing or placeholder VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.\n' +
    '  1. Open frontend/.env\n' +
    '  2. Paste the "anon / public" key from Supabase → Project Settings → API\n' +
    '  3. Restart `npm run dev` (Vite only reads .env at startup)'
  )
}

// Best-effort sanity check: decode the JWT payload and warn if the wrong
// key type was pasted (service_role in the browser is a security risk and
// also produces "Invalid API key" on auth endpoints).
try {
  if (supabaseAnonKey && !PLACEHOLDER_VALUES.has(supabaseAnonKey)) {
    const payload = JSON.parse(atob(supabaseAnonKey.split('.')[1]))
    if (payload.role && payload.role !== 'anon') {
      // eslint-disable-next-line no-console
      console.error(
        `[Supabase] VITE_SUPABASE_ANON_KEY has role="${payload.role}". ` +
        'The frontend needs the "anon" key, not the service_role key.'
      )
    }
    if (payload.ref && !supabaseUrl.includes(payload.ref)) {
      // eslint-disable-next-line no-console
      console.error(
        `[Supabase] Key/URL mismatch: key belongs to project "${payload.ref}" ` +
        `but VITE_SUPABASE_URL points to "${supabaseUrl}".`
      )
    }
  }
} catch {
  // Non-JWT value — the real request will surface a clear error anyway.
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'webgrat.auth',
  },
})
