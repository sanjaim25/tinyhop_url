import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/AuthContext'

// Redirect logged-in users away from public-only pages
function PublicOnlyRoute({ children, redirectTo = '/shorten' }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <PageLoader />
  return isAuthenticated ? <Navigate to={redirectTo} replace /> : children
}
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'

// Dynamic Lazy Imports
const Landing = React.lazy(() => import('./pages/Landing'))
const Login = React.lazy(() => import('./pages/Login'))
const Signup = React.lazy(() => import('./pages/Signup'))
const Pricing = React.lazy(() => import('./pages/Pricing'))
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Analytics = React.lazy(() => import('./pages/Analytics'))
const AnalyticsShowcase = React.lazy(() => import('./pages/AnalyticsShowcase'))
const Blog = React.lazy(() => import('./pages/Blog'))
const Developers = React.lazy(() => import('./pages/Developers'))
const Contact = React.lazy(() => import('./pages/Contact'))
const Legal = React.lazy(() => import('./pages/Legal'))
const LinkShortening = React.lazy(() => import('./pages/features/LinkShortening'))
const FeaturesIndex = React.lazy(() => import('./pages/features/FeaturesIndex'))
const CustomAliases = React.lazy(() => import('./pages/features/CustomAliases'))
const QRCodes = React.lazy(() => import('./pages/features/QRCodes'))
const LinkExpiry = React.lazy(() => import('./pages/features/LinkExpiry'))
const SmartRouting = React.lazy(() => import('./pages/features/SmartRouting'))
const Shorten = React.lazy(() => import('./pages/Shorten'))
const Profile = React.lazy(() => import('./pages/Profile'))
const TermsOfService = React.lazy(() => import('./pages/TermsOfService'))
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'))
const About = React.lazy(() => import('./pages/About'))
const HelpDesk = React.lazy(() => import('./pages/HelpDesk'))
const BulkShorten = React.lazy(() => import('./pages/BulkShorten'))

// App-wide suspense loader
export const PageLoader = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a14' }}>
    <div style={{ width: 32, height: 32, border: '3px solid rgba(124,58,237,0.2)', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spinFast .7s linear infinite' }} />
  </div>
)

// Error Boundary to catch chunk loading errors (fixes the black screen issue permanently)
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true }
  }
  componentDidCatch(error, errorInfo) {
    console.error("Caught error:", error, errorInfo)
    if (error.message && error.message.includes('Failed to fetch dynamically imported module')) {
      if (!sessionStorage.getItem('chunk_reloaded')) {
        sessionStorage.setItem('chunk_reloaded', 'true')
        window.location.reload()
      }
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a0a14', color: '#fff', fontFamily: "'Space Grotesk',sans-serif", padding: 24, textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 900, color: '#f4f3ff' }}>Something went wrong.</h1>
          <p style={{ color: '#8d8b94', marginBottom: '2rem', maxWidth: 400 }}>A new version of the site was likely deployed while you were away. Please refresh to get the latest version.</p>
          <button onClick={() => { sessionStorage.removeItem('chunk_reloaded'); window.location.reload() }} style={{ padding: '12px 24px', background: '#7c3aed', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', transition: 'background .2s' }}>Refresh Page</button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <Toaster
          position="top-right"
          gutter={10}
          toastOptions={{
            duration: 3500,
            style: {
              background: '#fff',
              color: '#15141c',
              border: '1px solid rgba(20,20,28,0.12)',
              borderRadius: '10px',
              boxShadow: '0 16px 48px rgba(20,20,28,0.12)',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.875rem',
              fontWeight: 500,
              padding: '10px 14px',
              maxWidth: 360,
            },
            success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <Navbar />
        
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Core */}
              <Route path="/"          element={<PublicOnlyRoute><Landing /></PublicOnlyRoute>} />
              <Route path="/login"     element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
              <Route path="/signup"    element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
              <Route path="/pricing"   element={<Pricing />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/shorten"   element={<ProtectedRoute><Shorten /></ProtectedRoute>} />
              <Route path="/bulk"      element={<ProtectedRoute><BulkShorten /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />

              {/* Info / resource pages */}
              <Route path="/blog"                element={<Blog />} />
              <Route path="/developers"          element={<Developers />} />
              <Route path="/contact"             element={<Contact />} />
              <Route path="/help"                element={<HelpDesk />} />
              <Route path="/legal"               element={<Legal />} />
              <Route path="/terms"               element={<TermsOfService />} />
              <Route path="/privacy"             element={<PrivacyPolicy />} />
              <Route path="/about"               element={<About />} />
              <Route path="/analytics-showcase"  element={<AnalyticsShowcase />} />

              {/* Feature pages */}
              <Route path="/features"                  element={<FeaturesIndex />} />
              <Route path="/features/link-shortening"  element={<LinkShortening />} />
              <Route path="/features/analytics"        element={<Navigate to="/analytics-showcase" replace />} />
              <Route path="/features/custom-aliases"   element={<CustomAliases />} />
              <Route path="/features/qr-codes"         element={<QRCodes />} />
              <Route path="/features/link-expiry"      element={<LinkExpiry />} />
              <Route path="/features/smart-routing"    element={<SmartRouting />} />

              {/* 404 fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  )
}
