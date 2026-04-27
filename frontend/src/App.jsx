import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

import Layout from './components/layout/Layout'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Pages
import Home from './pages/Home'
import Services from './pages/Services'
import About from './pages/About'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Contact from './pages/Contact'
import CaseStudies from './pages/CaseStudies'
import CaseStudyDetail from './pages/CaseStudyDetail'
import FAQ from './pages/FAQ'
import ThankYou from './pages/ThankYou'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsAndConditions from './pages/TermsAndConditions'

// Admin pages
import AdminLogin from './pages/AdminLogin'
import AdminBlogNew from './pages/AdminBlogNew'
import AdminBlogList from './pages/AdminBlogList'
import AdminBlogEdit from './pages/AdminBlogEdit'

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
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  )
}
