import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export function Header() {
  const { user, logout } = useAuth()
  const [search, setSearch] = useState('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`)
      setIsDrawerOpen(false)
    }
  }

  const NavLinks = ({ mobile = false }) => (
    <>
      <Link 
        to="/" 
        onClick={() => setIsDrawerOpen(false)}
        className={`${mobile ? 'block py-3 px-4' : 'px-3 py-2'} text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg`}
      >
        Find Tailors
      </Link>
      <Link 
        to="/how-it-works" 
        onClick={() => setIsDrawerOpen(false)}
        className={`${mobile ? 'block py-3 px-4' : 'hidden sm:block px-3 py-2'} text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg`}
      >
        How it Works
      </Link>
      {user?.role === 'customer' && (
        <>
          <Link 
            to="/cart" 
            onClick={() => setIsDrawerOpen(false)}
            className={`${mobile ? 'block py-3 px-4' : 'px-3 py-2'} text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg`}
          >
            Cart
          </Link>
          <Link 
            to="/bookings" 
            onClick={() => setIsDrawerOpen(false)}
            className={`${mobile ? 'block py-3 px-4' : 'px-3 py-2'} text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg`}
          >
            My Bookings
          </Link>
          <Link 
            to="/offers" 
            onClick={() => setIsDrawerOpen(false)}
            className={`${mobile ? 'block py-3 px-4' : 'hidden sm:block px-3 py-2'} text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg`}
          >
            Offers
          </Link>
        </>
      )}
      {user?.role === 'tailor' && (
        <>
          <Link 
            to="/tailor" 
            onClick={() => setIsDrawerOpen(false)}
            className={`${mobile ? 'block py-3 px-4' : 'px-3 py-2'} text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg`}
          >
            Dashboard
          </Link>
          <Link 
            to="/tailor/earnings" 
            onClick={() => setIsDrawerOpen(false)}
            className={`${mobile ? 'block py-3 px-4' : 'px-3 py-2'} text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg`}
          >
            Earnings
          </Link>
          <Link 
            to="/tailor/profile" 
            onClick={() => setIsDrawerOpen(false)}
            className={`${mobile ? 'block py-3 px-4' : 'px-3 py-2'} text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg`}
          >
            Profile
          </Link>
        </>
      )}
    </>
  )

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="lg:hidden p-1 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21l-8-8L12 5l8 8-8 8z" />
            </svg>
            <span className="hidden sm:inline">TailorOnDemand</span>
            <span className="sm:hidden">TOD</span>
          </Link>
        </div>

        <form onSubmit={handleSearch} className="hidden flex-1 max-w-md lg:block">
          <div className="relative">
            <input
              type="search"
              placeholder="Search tailors or services"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-slate-300 bg-slate-50 py-2 pl-4 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </div>
        </form>

        <nav className="flex items-center gap-2 sm:gap-4">
          <div className="hidden lg:flex items-center gap-2">
            <NavLinks />
          </div>

          {!user ? (
            <Link to="/auth" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 whitespace-nowrap">
              Sign In
            </Link>
          ) : (
            <div className="relative group">
              <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-3 text-sm text-slate-700 hover:bg-slate-50">
                <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold shadow-inner">
                  {user.name?.charAt(0) || '?'}
                </span>
                <span className="hidden md:inline font-medium max-w-[100px] truncate">{user.name}</span>
              </button>
              <div className="absolute right-0 top-full mt-1 hidden w-48 rounded-xl border border-slate-200 bg-white py-2 shadow-xl group-hover:block animate-in fade-in slide-in-from-top-2">
                <Link to={user.role === 'customer' ? '/profile/measurements' : '/tailor/profile'} className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50">Profile</Link>
                <button 
                  onClick={() => {
                    logout()
                    setIsDrawerOpen(false)
                  }} 
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div className={`fixed inset-y-0 left-0 z-[70] w-72 bg-white shadow-2xl transition-transform duration-300 transform lg:hidden ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <span className="text-xl font-bold text-blue-600">Menu</span>
            <button onClick={() => setIsDrawerOpen(false)} className="p-1 text-slate-500 hover:bg-slate-100 rounded-lg">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <form onSubmit={handleSearch} className="mb-6">
              <input
                type="search"
                placeholder="Search tailors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-300 py-3 px-4 text-sm"
              />
            </form>
            <NavLinks mobile />
          </div>

          {user && (
            <div className="border-t p-4">
              <button 
                onClick={() => {
                  logout()
                  setIsDrawerOpen(false)
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 font-medium text-red-600 hover:bg-red-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
