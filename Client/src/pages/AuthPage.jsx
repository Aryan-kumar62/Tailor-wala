import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { apiPost } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

// Import the generated image path (it will be passed as a prop or used directly if served from public)
// For now using the absolute path or assuming it will be in public/assets
const TAILOR_IMAGE = "/brain/2da912ba-a3ba-47a5-a538-0f69108e5cec/tailor_at_work_1772962010224.png"

export function AuthPage() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    phone: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser } = useAuth()

  const redirect = location.state?.from || (form.role === 'tailor' ? '/tailor' : '/')

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (mode === 'register' && form.password !== form.confirmPassword) {
      return setError("Passwords do not match")
    }
    
    setLoading(true)
    setError('')
    try {
      const path = mode === 'login' ? '/auth/login' : '/auth/register'
      const payload = mode === 'login' ? { email: form.email, password: form.password } : form
      const data = await apiPost(path, payload)
      localStorage.setItem('token', data.token)
      setUser(data.user)
      if (data.user.role === 'tailor') navigate('/tailor')
      else navigate(redirect)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* --- Left Side: Hero Area --- */}
      <div className={`hidden w-1/2 flex-col justify-between p-12 lg:flex ${mode === 'login' ? 'bg-slate-900' : 'bg-blue-600'} text-white relative overflow-hidden transition-colors duration-500`}>
        {mode === 'login' ? (
          <>
            <div className="absolute inset-0 z-0">
               <img src={TAILOR_IMAGE} alt="Tailor at work" className="h-full w-full object-cover opacity-60" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <span className="text-xl font-bold">T</span>
                </div>
                <span className="text-xl font-bold tracking-tight">TailorOnDemand</span>
              </div>
            </div>
            <div className="relative z-10 mb-20 max-w-md">
              <h1 className="text-5xl font-extrabold leading-tight tracking-tight">Crafting Excellence, One Stitch at a Time.</h1>
              <p className="mt-6 text-lg text-slate-300">Manage your custom tailoring requests and connect with expert artisans worldwide.</p>
            </div>
            <div className="relative z-10 flex gap-8 text-sm text-slate-400">
               <span>© 2024 TailorOnDemand. Handcrafted style delivered.</span>
            </div>
          </>
        ) : (
          <>
            <div className="relative z-10">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <span className="text-xl font-bold">T</span>
                </div>
                <span className="text-xl font-bold tracking-tight">TailorOnDemand</span>
              </div>
            </div>
            <div className="relative z-10 max-w-md">
              <h1 className="text-5xl font-extrabold leading-tight tracking-tight">Experience bespoke tailoring at your doorstep.</h1>
              <p className="mt-6 text-lg text-blue-100">Join thousands of clients who have transformed their wardrobe with our premium on-demand tailoring service.</p>
              
              <div className="mt-12 space-y-8">
                <div className="flex gap-4">
                  <div className="h-12 w-12 shrink-0 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">Home Measurements</h3>
                    <p className="text-sm text-blue-100/80">Our experts visit you for perfect fitting measurements in the comfort of your home.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-12 w-12 shrink-0 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">Expert Tailors</h3>
                    <p className="text-sm text-blue-100/80">Work with the industry's finest artisans dedicated to precision and quality.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative z-10 text-sm text-blue-200">
               <span>© 2024 TailorOnDemand. Handcrafted style delivered.</span>
            </div>
          </>
        )}
      </div>

      {/* --- Right Side: Form Area --- */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden flex items-center gap-2">
            <div className={`h-8 w-8 rounded-lg ${mode === 'login' ? 'bg-slate-900' : 'bg-blue-600'} flex items-center justify-center text-white`}>
              <span className="text-xl font-bold">T</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">TailorOnDemand</span>
          </div>

          <div className="mb-8 flex flex-col items-center lg:items-start">
            <h2 className="text-3xl font-extrabold text-slate-900 text-center lg:text-left">{mode === 'login' ? 'Welcome Back' : 'Create your account'}</h2>
            <p className="mt-2 text-slate-500 text-center lg:text-left">
              {mode === 'login' 
                ? 'Log in to manage your tailoring requests' 
                : 'Join the revolution of custom-made apparel'}
            </p>
          </div>

          <div className="mb-8 flex p-1 bg-slate-100 rounded-xl">
            <button 
              onClick={() => setForm(f => ({ ...f, role: 'customer' }))}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${form.role === 'customer' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Customer
            </button>
            <button 
              onClick={() => setForm(f => ({ ...f, role: 'tailor' }))}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${form.role === 'tailor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Tailor Partner
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Full Name</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" required />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 004.516 4.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </span>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" required />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                  </svg>
                </span>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" required />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-1">
              <div className="relative">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="••••••••" className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-12 text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? (
                       <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              {mode === 'register' && (
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Confirm Password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                       <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                    <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" required />
                  </div>
                </div>
              )}
            </div>

            {mode === 'login' && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-slate-600 group-hover:text-slate-900">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm font-bold text-blue-600 hover:text-blue-700">Forgot Password?</Link>
              </div>
            )}

            {mode === 'register' && (
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" required className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-slate-600 group-hover:text-slate-900">
                  I agree to the <button type="button" className="font-semibold text-slate-900 underline">Terms & Conditions</button> and <button type="button" className="font-semibold text-slate-900 underline">Privacy Policy</button>
                </span>
              </label>
            )}

            {error && <p className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">{error}</p>}

            <button type="submit" disabled={loading} className={`w-full rounded-xl py-4 font-bold text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 ${mode === 'login' ? 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'}`}>
              {loading ? (mode === 'login' ? 'Logging in...' : 'Creating account...') : mode === 'login' ? 'Login →' : 'Create Account'}
            </button>
          </form>

          <div className="relative my-10 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <span className="relative bg-slate-50 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Or continue with</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50">
               <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
               </svg>
               {mode === 'login' ? 'Google' : 'Google'}
            </button>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50">
               <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
               </svg>
               {mode === 'login' ? 'Facebook' : 'Facebook'}
            </button>
          </div>

          <p className="mt-10 text-center text-slate-600">
            {mode === 'login' ? (
              <>New to TailorOnDemand? <button onClick={() => setMode('register')} className="font-bold text-blue-600 hover:underline">Sign Up</button></>
            ) : (
              <>Already have an account? <button onClick={() => setMode('login')} className="font-bold text-blue-600 hover:underline">Log In</button></>
            )}
          </p>

          <div className="mt-12 flex items-center justify-center gap-6 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            <Link to="/privacy" className="hover:text-slate-600">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-600">Terms of Service</Link>
            <Link to="/help" className="hover:text-slate-600">Help Center</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
