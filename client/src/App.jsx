import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
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
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
    <div className="w-8 h-8 border-4 border-[#0052ff] border-t-transparent rounded-full animate-spin"></div>
  </div>
)

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
        
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Core */}
            <Route path="/"          element={<Landing />} />
            <Route path="/login"     element={<Login />} />
            <Route path="/signup"    element={<Signup />} />
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
      </BrowserRouter>
    </AuthProvider>
  )
}
