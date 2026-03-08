import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { Header } from './components/Header.jsx'
import { Footer } from './components/Footer.jsx'
import { Home } from './pages/Home.jsx'
import { HowItWorks } from './pages/HowItWorks.jsx'
import { TailorSearch } from './pages/TailorSearch.jsx'
import { TailorDetailPage } from './pages/TailorProfile.jsx'
import { Cart } from './pages/Cart.jsx'
import { Checkout } from './pages/Checkout.jsx'
import { PaymentSuccess } from './pages/PaymentSuccess.jsx'
import { MyBookings } from './pages/MyBookings.jsx'
import { BookingDetail } from './pages/BookingDetail.jsx'
import { RateExperience } from './pages/RateExperience.jsx'
import { MeasurementProfile } from './pages/MeasurementProfile.jsx'
import { Offers } from './pages/Offers.jsx'
import { AuthPage } from './pages/AuthPage.jsx'
import { TailorDashboard } from './pages/TailorDashboard.jsx'
import { TailorProfilePage } from './pages/TailorProfilePage.jsx'
import { TailorEarnings } from './pages/TailorEarnings.jsx'
import { TailorOnboarding } from './pages/TailorOnboarding.jsx'

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-500">
        Loading...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: window.location.pathname }} replace />
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex min-h-screen flex-col bg-white text-slate-900">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/search" element={<TailorSearch />} />
                <Route path="/tailor/:id" element={<TailorDetailPage />} />
                <Route path="/auth" element={<AuthPage />} />

                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/payment-success/:id" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />

                <Route path="/bookings" element={<ProtectedRoute role="customer"><MyBookings /></ProtectedRoute>} />
                <Route path="/bookings/:id" element={<ProtectedRoute role="customer"><BookingDetail /></ProtectedRoute>} />
                <Route path="/rate/:id" element={<ProtectedRoute role="customer"><RateExperience /></ProtectedRoute>} />
                <Route path="/profile/measurements" element={<ProtectedRoute role="customer"><MeasurementProfile /></ProtectedRoute>} />

                <Route path="/offers" element={<Offers />} />

                <Route path="/tailor" element={<ProtectedRoute role="tailor"><TailorDashboard /></ProtectedRoute>} />
                <Route path="/tailor/profile" element={<ProtectedRoute role="tailor"><TailorProfilePage /></ProtectedRoute>} />
                <Route path="/tailor/earnings" element={<ProtectedRoute role="tailor"><TailorEarnings /></ProtectedRoute>} />
                <Route path="/tailor/onboarding" element={<ProtectedRoute role="tailor"><TailorOnboarding /></ProtectedRoute>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
