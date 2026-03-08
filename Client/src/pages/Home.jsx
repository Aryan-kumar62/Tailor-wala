import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiGet } from '../services/api.js'
import { ClothCard } from '../components/ClothCard.jsx'

export function Home() {
  const [city, setCity] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [featured, setFeatured] = useState([])
  const [cloths, setCloths] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    apiGet('/tailors')
      .then((data) => setFeatured(data.slice(0, 6)))
      .catch(() => {})
      
    apiGet('/cloths')
      .then((data) => setCloths(data))
      .catch(() => {})
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (city) params.set('city', city)
    if (specialty) params.set('specialization', specialty)
    navigate(`/search?${params.toString()}`)
  }

  return (
    <>
      <section className="relative overflow-hidden rounded-b-3xl bg-slate-900 px-4 pb-12 pt-10 text-white md:pb-24 md:pt-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl px-2">Bespoke Tailoring, <span className="text-blue-400">Delivered</span> to You.</h1>
          <p className="mt-4 max-w-2xl mx-auto text-slate-300 text-base md:text-lg px-4">
            Experience the luxury of perfectly fitted clothes without leaving your home. Professional measurements, artisan stitching, and doorstep delivery.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 px-6">
            <Link to="/search" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Book a Fitting
            </Link>
            <Link to="/search" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur hover:bg-white/20 transition-all active:scale-95">
              View Portfolios
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-10 max-w-5xl px-4 relative z-10">
        <form onSubmit={handleSearch} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-2xl backdrop-blur-md lg:flex-row lg:items-end">
          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Location</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </span>
              <input
                type="text"
                placeholder="Enter your city or area"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-10 pr-4 text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Specialty</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
              <input
                type="text"
                placeholder="Suits, Lehengas, Alterations"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-10 pr-4 text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
          </div>
          <button type="submit" className="w-full lg:w-auto rounded-xl bg-slate-900 px-8 py-3.5 font-bold text-white shadow-lg hover:bg-slate-800 transition-all active:scale-95">
            Search Tailors
          </button>
        </form>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
              Luxury Fabrics
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Premium Materials</h2>
            <p className="mt-3 text-slate-600 text-lg">Choose from our curated collection of high-quality materials for your next custom fit.</p>
          </div>
          <Link to="/search" className="group text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2">
            View All Materials 
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {cloths.length > 0 ? (
            cloths.map((cloth) => <ClothCard key={cloth._id} cloth={cloth} />)
          ) : (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[400px] animate-pulse rounded-2xl bg-slate-50 border border-slate-100" />
            ))
          )}
        </div>
      </section>

      <section className="bg-slate-50 py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
              Expert Craftsmen
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Featured Master Tailors</h2>
            <p className="mt-4 max-w-2xl mx-auto text-slate-600 text-lg">Work with the top-rated masters in your city, vetted for quality and professional service.</p>
          </div>
          
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((t) => (
              <Link key={t._id} to={`/tailor/${t._id}`} className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-xl hover:-translate-y-1">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    <span className="text-5xl font-black text-slate-200/50">{t.user?.name?.charAt(0) || 'T'}</span>
                  </div>
                  <div className="absolute top-4 right-4 z-10">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-3 py-1.5 text-sm font-bold text-slate-900 shadow-sm">
                      <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      {t.ratingAverage?.toFixed(1) || 'New'}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{t.user?.name}</h3>
                    <p className="mt-1 text-sm font-medium text-slate-500 flex items-center gap-1.5">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {t.city || 'Available Online'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Starts At</p>
                    <p className="text-lg font-black text-slate-900">₹{t.basePrice || 0}</p>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center gap-2 overflow-hidden">
                  {t.specializations?.slice(0, 3).map((s) => (
                    <span key={s} className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 whitespace-nowrap">{s}</span>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-blue-600">View Portfolio</span>
                  <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link to="/search" className="inline-flex items-center gap-3 rounded-2xl border-2 border-slate-900 bg-white px-10 py-4 font-black text-slate-900 transition-all hover:bg-slate-900 hover:text-white active:scale-95 shadow-xl shadow-slate-900/10">
              Explore All Professionals
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:py-16">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 px-8 py-16 md:px-20 md:py-24 text-center lg:text-left">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">Ready for a <span className="text-blue-400 underline decoration-blue-400/30 underline-offset-8">Perfect Fit?</span></h2>
              <p className="mt-8 text-xl text-slate-300 leading-relaxed">Join thousands of happy customers who trust TailorOnDemand for their custom clothing needs. Experience master craftsmanship delivered to your doorstep.</p>
              <div className="mt-10 flex flex-col sm:flex-row items-center gap-6">
                <Link to="/auth" className="w-full sm:w-auto inline-block rounded-2xl bg-blue-600 px-10 py-5 font-black text-white shadow-2xl shadow-blue-600/40 hover:bg-blue-700 transition-all active:scale-95 text-center">
                  Book Your Tailor Now
                </Link>
                <div className="flex -space-x-3 overflow-hidden">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="inline-block h-12 w-12 rounded-full ring-4 ring-slate-900 bg-slate-700 border-2 border-slate-800" />
                  ))}
                  <div className="flex h-12 items-center px-4 text-sm font-bold text-slate-400">
                    +2.4k happy clients
                  </div>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:grid grid-cols-2 gap-4 max-w-sm rotate-3">
               {[1,2,3,4].map(i => (
                 <div key={i} className="aspect-square w-32 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm" />
               ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
