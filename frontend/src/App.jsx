import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

import Layout from './components/layout/Layout'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'

// ── Eagerly loaded: all pages reachable from the navbar (instant navigation) ──
import Home         from './pages/Home'
import Services     from './pages/Services'
import About        from './pages/About'
import Blog         from './pages/Blog'
import Contact      from './pages/Contact'
import CaseStudies  from './pages/CaseStudies'
import FAQ          from './pages/FAQ'
import PrivacyPolicy     from './pages/PrivacyPolicy'
import TermsAndConditions from './pages/TermsAndConditions'
import ThankYou     from './pages/ThankYou'

// ── Lazy-loaded: detail pages and admin (rarely visited, keep bundle lean) ────
const BlogPost        = lazy(() => import('./pages/BlogPost'))
const CaseStudyDetail = lazy(() => import('./pages/CaseStudyDetail'))
const AdminLogin      = lazy(() => import('./pages/AdminLogin'))
const AdminBlogNew    = lazy(() => import('./pages/AdminBlogNew'))
const AdminBlogList   = lazy(() => import('./pages/AdminBlogList'))
const AdminBlogEdit   = lazy(() => import('./pages/AdminBlogEdit'))

const PageLoader = () => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: 32, height: 32, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#2ef78e', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
)

// Note: Ensure your Hostinger environment routes all requests to index.html for correct SPA routing.

const PublicLayout = ({ children }) => <Layout>{children}</Layout>

function MetaPixelPageTracker() {
  const location = useLocation()

  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.fbq !== 'function') return

    const currentPath = `${location.pathname}${location.search}${location.hash}`
    if (window.__lastMetaPixelPath === currentPath) return

    window.__lastMetaPixelPath = currentPath
    window.fbq('track', 'PageView')
  }, [location.pathname, location.search, location.hash])

  return null
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <MetaPixelPageTracker />
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* ── Admin routes (no public navbar/footer) ─────── */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/blogs"
                element={
                  <ProtectedRoute>
                    <AdminBlogList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/blog/new"
                element={
                  <ProtectedRoute>
                    <AdminBlogNew />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/blog/edit/:id"
                element={
                  <ProtectedRoute>
                    <AdminBlogEdit />
                  </ProtectedRoute>
                }
              />

              {/* ── Public site (wrapped in Layout) ────────────── */}
              <Route
                path="/*"
                element={
                  <PublicLayout>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:slug" element={<BlogPost />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/case-studies" element={<CaseStudies />} />
                      <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/thank-you" element={<ThankYou />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                      <Route
                        path="*"
                        element={
                          <div
                            style={{
                              textAlign: 'center',
                              padding: '100px 20px',
                              minHeight: '60vh',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                            }}
                          >
                            <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>404</h1>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '18px' }}>
                              Page not found.
                            </p>
                          </div>
                        }
                      />
                    </Routes>
                  </PublicLayout>
                }
              />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  )
}
